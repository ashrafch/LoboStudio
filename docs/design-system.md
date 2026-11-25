# Design system — LOBO v0.1

## Direzione
Editoriale architettonico, geometria, tipografia contemporanea, ritmo, asimmetrie controllate. Deve percepirsi l'ingegneria dietro ogni spazio. Le immagini sono prova del lavoro, non wallpaper di repertorio.

## Token iniziali — da verificare con contrast checker
| Ruolo | Valore | Nota |
|---|---|---|
| Background | `#F7F6F2` | Avorio chiaro |
| Surface | `#FFFFFF` | Cards/sezioni luminose |
| Foreground | `#191C1D` | Testi principali |
| Muted | `#667073` | Didascalie, verificare contrasto |
| Divider | `#D8DAD7` | Bordo discreto |
| Accent | `#946A55` | Terracotta/terra, CTA solo con contrasto verificato |
| Dark panel | `#252A2A` | Sezioni strategiche |

Font suggeriti: **Manrope** per headline e **DM Sans** per body (open-source da verificare nel setup e self-host con `next/font`). Aumentare dimensioni e spaziature senza sacrificare densità informativa. Prediligere font weights 400, 500, 600 e 700. Non spezzare termini tecnici nei titoli per ornamento.

## Componenti
- Header con logo, link, dropdown/multi-level accessibile e pulsante menu touch.
- Hero progetto con immagine ad ampia scala e CTA chiara; variante split, full bleed e 16:9 secondo il contenuto.
- Filtri categoria con URL sincronizzato, risultati annunziati agli assistive tech e reset.
- Project tiles su griglia editoriale con ratio definito e hover che non nasconde dati fondamentali.
- Gallery/lightbox con tasti escape/frecce, focus trap, alternative testuali e chiusura visibile.
- Button, Link, Breadcrumb, Section heading, Press card, Client logo list, Contact block, Footer.

## Motion

Il sito usa Motion per React sui componenti esistenti. `MotionSettings` carica il set `domAnimation` con `LazyMotion` e applica `MotionConfig` alla radice. I componenti interattivi usano `motion/react-m`. [LazyMotion](https://motion.dev/docs/react-lazy-motion) · [MotionConfig](https://motion.dev/docs/react-motion-config)

| Componente | Comportamento |
|---|---|
| `HeroReveal`, in `components/motion/reveal.tsx` | Esegue una sola entrata all’arrivo della hero nel viewport. Gli elementi con `data-hero-line` si muovono di 15 px con transizioni di 540 ms, sfalsate di 70 ms. |
| `FilmIntro` | Aumenta l’opacità del video quando il primo fotogramma è disponibile. Con movimento ridotto lascia il video in pausa fino al comando dell’utente. |
| `ScrollReveal` e `ProjectCard`, in `components/motion/` | La scheda entra una volta con uno spostamento di 14 px. Hover e focus ingrandiscono solo la foto. Su touch il tap dà un riscontro breve. |
| `Navigation` | Il pannello mobile entra con una transizione di 200 ms. Il dropdown sfuma all’apertura e la freccia indica lo stato. Escape chiude il livello aperto e restituisce il focus al relativo pulsante. |
| `transitions.ts` e `MotionSettings` | Raccolgono le curve condivise e rilevano le modifiche a `prefers-reduced-motion` con una sottoscrizione per pagina. In questa modalità le entrate e lo zoom sono disattivati. |

I contenuti della hero e delle schede sono già visibili nell’HTML iniziale. Per estendere le animazioni di portfolio usa `ScrollReveal` intorno a un elemento già presente nel flusso. Lo stato della navigazione continua a usare `aria-expanded`, `hidden` e i controlli nativi. [useAnimate](https://motion.dev/docs/react-use-animate) · [useInView](https://motion.dev/docs/react-use-in-view) · [Hover](https://motion.dev/docs/react-hover-animation)

## Layout
Max width desktop ~1440px, editorial content width 1100–1280px, body text max ~70 caratteri, gutter mobile 20–24px. Le immagini sono `object-fit: cover` solo quando crop è autorizzato e progettato. Verificare 360, 390, 768, 1024, 1440, 1920px.

La scheda progetto usa la stessa impaginazione sul sito e nell’anteprima CMS. La descrizione ha una misura massima di 56 caratteri tipografici (`56ch`). La scheda tecnica affianca località e periodo e dedica una riga al ruolo dello studio. Con meno spazio la scheda tecnica scende sotto il testo. I campi vuoti vengono omessi.

## Logo
La schermata Weebly mostra monogramma verticale LO sopra BO (con seconda riga ruotata o ribaltata). **Usare il file ufficiale fornito nell'asset folder** come sorgente di verità; non estrarre/ricalcare dallo screenshot se c'è l'originale. Valutare lockup con dicitura completa dello studio in un header di dimensioni adeguate.

## Servizi

L’indice affianca l’introduzione su desktop e porta al titolo di ciascuna competenza. Le schede passano da due colonne a una su schermi stretti. Home, Servizi e pannello usano la stessa cornice fotografica, con rapporto 3:2 su desktop e 4:3 su mobile. L’immagine mantiene le proporzioni originali e resta interamente visibile nella cornice.

## Implementazione MVP

L’accento operativo è `#7C503D` e il testo secondario è `#565F60`. Manrope Variable e DM Sans Variable sono serviti dal progetto. Durante il caricamento, il sito usa Arial con metriche adeguate alle due famiglie per limitare gli spostamenti di testo. Il menu passa alla modalità mobile fino a 800 px. Con movimento ridotto il carosello parte in pausa e si può navigare con i controlli. I test controllano l’overflow della Home a 360, 390, 768, 1024, 1440 e 1920 px.
