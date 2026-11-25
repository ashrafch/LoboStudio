"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useReducedPreference } from "./motion/settings";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import {
  gestureTransition,
  instant,
  menuTransition,
} from "./motion/transitions";

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
  const reduced = useReducedPreference();
  const menuButton = useRef<HTMLButtonElement>(null);
  const categoryButton = useRef<HTMLButtonElement>(null);
  const open = expanded || hover;
  const close = () => {
    setMobile(false);
    setExpanded(false);
    setHover(false);
  };
  useEffect(() => {
    const breakpoint = window.matchMedia("(max-width: 800px)");
    breakpoint.addEventListener("change", close);
    return () => breakpoint.removeEventListener("change", close);
  }, []);
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
          aria-label="LOBO, home"
        >
          {mark}
          {!mark && <span>LOBO</span>}
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
          <m.span
            key={mobile ? "close" : "open"}
            className="navigation-icon"
            aria-hidden="true"
            initial={reduced ? false : { rotate: -15 }}
            animate={{ rotate: 0 }}
            transition={reduced ? instant : gestureTransition}
          >
            {mobile ? <X /> : <Menu />}
          </m.span>
        </button>
        <m.nav
          aria-label="Principale"
          id="navigation"
          className={mobile ? "navigation mobile-open" : "navigation"}
          initial={false}
          animate={
            mobile && reduced === false
              ? { y: [-6, 0], opacity: [0.84, 1] }
              : { y: 0, opacity: 1 }
          }
          transition={reduced ? instant : menuTransition}
        >
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={close}
          >
            Home
          </Link>
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
                <m.span
                  className="navigation-icon"
                  aria-hidden="true"
                  initial={false}
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={reduced ? instant : gestureTransition}
                >
                  <ChevronDown size={16} />
                </m.span>
              </button>
            </div>
            <m.ul
              className="drop-panel"
              id="project-menu"
              hidden={!open}
              initial={false}
              animate={{ opacity: open && reduced === false ? [0.72, 1] : 1 }}
              transition={reduced ? instant : menuTransition}
            >
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
            </m.ul>
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
        </m.nav>
      </div>
    </header>
  );
}
