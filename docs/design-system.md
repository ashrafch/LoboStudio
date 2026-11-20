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
Reveal discreto quando utile, 150–300 ms indicativamente; no scroll-jacking, no cursori custom che compromettono accessibilità, no sezioni nascoste senza JS. Rispettare `prefers-reduced-motion`.

## Layout
Max width desktop ~1440px, editorial content width 1100–1280px, body text max ~70 caratteri, gutter mobile 20–24px. Le immagini sono `object-fit: cover` solo quando crop è autorizzato e progettato. Verificare 360, 390, 768, 1024, 1440, 1920px.

## Logo
La schermata Weebly mostra monogramma verticale LO sopra BO (con seconda riga ruotata o ribaltata). **Usare il file ufficiale fornito nell'asset folder** come sorgente di verità; non estrarre/ricalcare dallo screenshot se c'è l'originale. Valutare lockup con dicitura completa dello studio in un header di dimensioni adeguate.
