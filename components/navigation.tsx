"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useRef, useState } from "react";

const links = [
  ["/studio", "Studio"],
  ["/servizi", "Servizi"],
  ["/rassegna-stampa", "Stampa"],
  ["/clienti", "Clienti"],
  ["/contatti", "Contatti"],
];

export function Navigation({
  mark,
  categories,
}: {
  mark?: React.ReactNode;
  categories: readonly { slug: string; label: string }[];
}) {
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const categoryButton = useRef<HTMLButtonElement>(null);
  const open = expanded || hover;
  const close = () => {
    setMobile(false);
    setExpanded(false);
    setHover(false);
  };
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        if (open) {
          setExpanded(false);
          setHover(false);
          categoryButton.current?.focus();
        } else if (mobile) {
          setMobile(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="frame header-inner">
        <Link
          className="brand"
          href="/"
          onClick={close}
          aria-label="LoboStudio, home"
        >
          {mark}
          <span>
            LOBO<span className="brand-sub">STUDIO</span>
          </span>
        </Link>
        <button
          className="mobile-control icon"
          type="button"
          ref={menuButton}
          aria-expanded={mobile}
          aria-controls="navigation"
          onClick={() => (mobile ? close() : setMobile(true))}
          aria-label={mobile ? "Chiudi navigazione" : "Apri navigazione"}
        >
          {mobile ? <X /> : <Menu />}
        </button>
        <nav
          aria-label="Principale"
          id="navigation"
          className={mobile ? "navigation mobile-open" : "navigation"}
        >
          <div
            className="drop"
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse" && !mobile) setHover(true);
            }}
            onPointerLeave={() => setHover(false)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setExpanded(false);
                setHover(false);
              }
            }}
          >
            <div className="drop-trigger">
              <Link
                href="/progetti"
                aria-current={pathname === "/progetti" ? "page" : undefined}
                onClick={close}
              >
                Progetti
              </Link>
              <button
                ref={categoryButton}
                className="icon category-control"
                type="button"
                aria-expanded={open}
                aria-controls="project-menu"
                aria-label="Categorie progetti"
                onClick={() => {
                  setExpanded(!expanded);
                  if (expanded) setHover(false);
                }}
              >
                <ChevronDown size={16} />
              </button>
            </div>
            <ul className="drop-panel" id="project-menu" hidden={!open}>
              {categories.map(({ slug, label }) => (
                <li key={slug}>
                  <Link href={"/progetti/categoria/" + slug} onClick={close}>
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/competenze/sisma-emilia-2012" onClick={close}>
                  Contributi sisma Emilia 2012
                </Link>
              </li>
            </ul>
          </div>
          {links.map(([href, label]) => (
            <Link
              key={href}
              className={href === "/contatti" ? "nav-contact" : undefined}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={close}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
