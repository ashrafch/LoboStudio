"use client";

import { BookOpen, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const seenKey = "lobostudio.admin.tour.v1";
const routes = {
  home: "/admin?tab=page&key=home",
  project: "/admin?tab=project",
  media: "/admin?tab=media",
  backup: "/admin?tab=backup",
} as const;
type Destination = keyof typeof routes;
type Step = {
  title: string;
  target: string;
  destination?: Destination;
  fallback?: string;
  text: string;
};

const steps: readonly Step[] = [
  {
    title: "Orientati nel pannello",
    target: "navigation",
    text: "Da qui entri nelle pagine, nei progetti, nella libreria immagini e nei backup. Puoi seguire il percorso con Avanti oppure chiuderlo e riaprirlo da Guida.",
  },
  {
    title: "Modifica una pagina",
    target: "editor",
    destination: "home",
    fallback: "preview",
    text: "In Pagine scegli la pagina. Clicca un elemento nell’editor visivo per cambiarlo dal riquadro di modifica. Il bordo bordeaux mostra la sezione selezionata. Puoi aggiungere blocchi e cambiarne l’ordine.",
  },
  {
    title: "Scegli i progetti per la Home",
    target: "showcase",
    destination: "home",
    fallback: "editor",
    text: "In Progetti in fotografia puoi scegliere fino a quattro schede, cambiarne l’ordine o nascondere la sezione. Per riordinare il carosello di apertura usa Ordine dei progetti in Home.",
  },
  {
    title: "Apri o crea un progetto",
    target: "new-project",
    destination: "project",
    text: "Cerca una scheda per titolo o località oppure scegli Nuovo progetto. In Foto del progetto carica o scegli le immagini, inserisci descrizione e credito e sposta per prima quella da usare come copertina.",
  },
  {
    title: "Carica le immagini",
    target: "media-upload",
    destination: "media",
    text: "Nella Libreria media seleziona un file e indica il credito. Dopo il caricamento puoi scegliere la foto da una scheda o da una pagina. Per le immagini delle attività apri Pagine, poi Servizi e Foto delle attività.",
  },
  {
    title: "Controlla la composizione",
    target: "preview",
    destination: "home",
    text: "Usa Anteprima per leggere la pagina senza i controlli di modifica. Le icone del monitor e del telefono ti fanno passare tra le due viste. Poi torna su Modifica se devi correggere qualcosa.",
  },
  {
    title: "Salva la bozza",
    target: "save",
    destination: "home",
    text: "Premi Salva bozza prima di lasciare la pagina. Le modifiche si conservano nell’editor e il sito continua a mostrare la versione pubblicata.",
  },
  {
    title: "Pubblica quando sei pronto",
    target: "publish",
    destination: "home",
    fallback: "save",
    text: "Dopo il primo salvataggio appare Pubblica la bozza salvata. Una volta pubblicata, usa Vai al sito per controllare il risultato. Dalla Cronologia pubblicazioni puoi recuperare una versione precedente della singola scheda come bozza.",
  },
  {
    title: "Conserva uno stato approvato",
    target: "backup",
    destination: "backup",
    text: "Crea una copia con un nome riconoscibile. Per ripristinare il sito scegli una copia e conferma. Il pannello salva anche lo stato precedente, così puoi annullare il ripristino.",
  },
];

type Placement = { card: CSSProperties; spotlight?: CSSProperties };

function place(target: HTMLElement | null, cardHeight: number): Placement {
  const gap = 12;
  const { clientWidth: width, clientHeight: height } = document.documentElement;
  const cardWidth = Math.min(416, width - gap * 2);
  const rect = target?.getBoundingClientRect();
  if (!rect || rect.bottom <= 0 || rect.top >= height) {
    return {
      card: {
        left: (width - cardWidth) / 2,
        bottom: gap,
        width: cardWidth,
        maxHeight: height - gap * 2,
      },
    };
  }
  const left = Math.max(4, rect.left - 5);
  const top = Math.max(4, rect.top - 5);
  const right = Math.min(width - 4, rect.right + 5);
  const bottom = Math.min(height - 4, rect.bottom + 5);
  const spotlight = { left, top, width: right - left, height: bottom - top };
  const card = { width: cardWidth };
  const side =
    right + gap + cardWidth <= width - gap
      ? right + gap
      : left - gap - cardWidth >= gap
        ? left - gap - cardWidth
        : undefined;
  if (side !== undefined) {
    return {
      spotlight,
      card: {
        ...card,
        top: Math.max(gap, Math.min(top - 20, height - cardHeight - gap)),
        left: side,
        maxHeight: height - gap * 2,
      },
    };
  }

  const above = top - gap * 2;
  const below = height - bottom - gap * 2;
  const alignedLeft = Math.min(Math.max(gap, left), width - cardWidth - gap);
  return {
    spotlight,
    card:
      above > below
        ? {
            ...card,
            left: alignedLeft,
            bottom: height - top + gap,
            maxHeight: above,
          }
        : { ...card, left: alignedLeft, top: bottom + gap, maxHeight: below },
  };
}

export function AdminGuide() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const opened = useRef(false);
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [placement, setPlacement] = useState<Placement>();
  const params = useSearchParams();
  const tab = params.get("tab") ?? "page";
  const key = params.get("key") ?? "home";
  const step = steps[index];
  const last = index === steps.length - 1;

  const start = useCallback(() => {
    if (dialog.current?.open) return;
    opened.current = true;
    try {
      window.localStorage.setItem(seenKey, "1");
    } catch {
      // The guide can still run when storage is disabled.
    }
    setIndex(0);
    setActive(true);
    dialog.current?.showModal();
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (opened.current) return;
      try {
        if (window.localStorage.getItem(seenKey)) return;
      } catch {
        // Open once for this mount when browser storage is unavailable.
      }
      start();
    });
    return () => cancelAnimationFrame(frame);
  }, [start]);

  const onDestination = (destination?: Destination) =>
    !destination ||
    (destination === "home"
      ? tab === "page" && key === "home"
      : tab === destination);
  const destinationReady = onDestination(step.destination);

  useEffect(() => {
    if (!active) return;
    if (
      document.activeElement === dialog.current ||
      !dialog.current?.contains(document.activeElement)
    ) {
      stepHeading.current?.focus({ preventScroll: true });
    }
    let frame = 0;
    let tracked: HTMLElement | null = null;
    function find(name: string) {
      return document.querySelector<HTMLElement>(
        `[data-admin-guide="${name}"]`,
      );
    }
    function update() {
      const target =
        (destinationReady &&
          (find(step.target) ??
            (step.fallback ? find(step.fallback) : null))) ||
        find("navigation");
      if (target && tracked !== target) {
        const rect = target.getBoundingClientRect();
        const headerBottom =
          document.querySelector("header.site-header")?.getBoundingClientRect()
            .bottom ?? 0;
        if (
          rect.top < headerBottom + 8 ||
          rect.bottom > document.documentElement.clientHeight * 0.74
        )
          target.scrollIntoView({ block: "center", behavior: "instant" });
      }
      tracked = target;
      setPlacement(place(target, card.current?.scrollHeight ?? 0));
    }
    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    const observer = new MutationObserver(schedule);
    const admin = document.querySelector("main .admin");
    if (admin) observer.observe(admin, { subtree: true, childList: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
    };
  }, [active, destinationReady, step, tab, key]);

  function move(offset: number, text: string, className?: string) {
    const next = index + offset;
    const destination = steps[next]?.destination;
    if (destination && !onDestination(destination)) {
      return (
        <Link
          href={routes[destination]}
          className={className}
          prefetch={false}
          scroll={false}
          onNavigate={() => setIndex(next)}
        >
          {text}
        </Link>
      );
    }
    return (
      <button
        type="button"
        className={className}
        disabled={!steps[next]}
        onClick={() => setIndex(next)}
      >
        {text}
      </button>
    );
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="admin-guide-trigger"
        aria-haspopup="dialog"
        onClick={start}
      >
        <BookOpen size={17} aria-hidden="true" /> Guida
      </button>
      <dialog
        ref={dialog}
        className="admin-tour"
        aria-labelledby="guide-heading"
        onClose={() => {
          setActive(false);
          requestAnimationFrame(() => trigger.current?.focus());
        }}
      >
        {active && (
          <>
            <div
              className={
                placement?.spotlight ? "admin-tour-spotlight" : "admin-tour-dim"
              }
              style={placement?.spotlight}
              aria-hidden="true"
            />
            <div ref={card} className="admin-tour-card" style={placement?.card}>
              <div className="admin-dialog-inner">
                <header className="admin-dialog-head">
                  <h2 id="guide-heading">Guida al pannello</h2>
                  <button
                    type="button"
                    aria-label="Chiudi guida"
                    autoFocus
                    onClick={() => dialog.current?.close()}
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </header>
                <div className="admin-guide-step" aria-live="polite">
                  <p className="admin-step-count">
                    Passaggio {index + 1} di {steps.length}
                  </p>
                  <h3 ref={stepHeading} tabIndex={-1}>
                    {step.title}
                  </h3>
                  <p>{step.text}</p>
                </div>
                <div className="admin-actions admin-guide-controls">
                  {move(-1, "Indietro")}
                  {last ? (
                    <button
                      type="button"
                      className="button"
                      onClick={() => dialog.current?.close()}
                    >
                      Fine
                    </button>
                  ) : (
                    move(1, "Avanti", "button")
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
