# LoboStudio Visual Experience 3.0

## Direzione visiva

- **Prodotto**. Portfolio di architettura e ingegneria per chi sta valutando un intervento o una collaborazione.
- **Carattere**. Misurato, preciso e concreto.
- **Riferimenti visivi**. Carta, grafite e linee sottili del disegno tecnico.
- **Fotografie**. Tre scale di osservazione, dalla facciata al cortile e al cantiere.
- **Dettaglio ricorrente**. L’accento bordeaux indica il capitolo o la fase raggiunta.

## Interventi

| Esperienza | Comportamento | Sorgenti |
|---|---|---|
| Progetti in fotografia | Dopo il Momentum Rail si susseguono Via Emilia Levante 98, Via Enriques 3 e Cantieri e dettagli strutturali. Su desktop la cornice resta in vista mentre scorre il testo. Motion collega avanzamento, profondità, scala e parallasse allo scroll e rivela ogni foto con una maschera. Su mobile e con movimento ridotto le foto seguono l’ordine dei capitoli. | `app/page.tsx`, `components/architectural-showcase.tsx`, `components/architectural-showcase.module.css` |
| Studio | Analisi, Progetto e Realizzazione si attivano lungo un tracciato orizzontale che diventa verticale su mobile. Con movimento ridotto il tracciato è già completo. | `app/studio/page.tsx`, `components/studio-roadmap.tsx`, `components/studio-roadmap.module.css` |
| Anteprima fotografica | La finestra mostra fino a cinque fotografie della scheda. Supporta trascinamento con inerzia, swipe, frecce, Escape e ripristino del focus. Dalla finestra si può aprire la scheda completa. | `components/project-photo-preview.tsx`, `components/project-photo-preview.module.css` |

Sono stati riutilizzati Momentum Rail, Topo Background e Scroll Index. Ho valutato Throw Deck e scelto l’apertura fotografica per approfondire un singolo progetto dal racconto della Home. I testi e gli asset originali dei progetti restano nel catalogo esistente.

Riferimenti. [Motion per React e scroll](https://motion.dev/docs/react-scroll-animations) · [Kokonut UI Throw Deck](https://kokonutui.com/docs/cards/card-stack)

## Verifica

Build Docker standalone, TypeScript, lint mirato, 6 test unitari e 14 test Playwright. Sul gateway della demo sono state verificate 57 schede, 4 categorie, 56 derivati WebP e la risposta parziale dei 2 video. Browser provato a 1920, 1440, 768 e 375 px e a 667 × 320 in landscape. La suite include navigazione da tastiera, prefers-reduced-motion e galleria Torri Spadini. Il gesto touch dell’anteprima è stato riprodotto in Chromium.

Nelle misure iniziali il layout rientrava nei viewport provati. Il CLS al caricamento era compreso tra 0 e 0,0016 in Home e tra 0,0023 e 0,0772 in Studio. In Studio era visibile un riassestamento dovuto al caricamento dei font.

Il 24 novembre 2026 sono state adeguate le metriche del font di riserva per entrambe le famiglie. Su Studio a 768 × 900 con WOFF2 serviti dopo il primo rendering, il CLS è sceso da 0,0395 a 0,0170. La soglia della prova Playwright è 0,025. Il riquadro fotografico conserva il posizionamento richiesto dalle immagini anche nel layout statico. I controlli su Showcase, roadmap e dialog fanno parte delle 15 prove Chromium superate sul gateway Docker.

I confronti prima/dopo a 1440 e 375 px e la registrazione del Showcase sono nella directory locale `%TEMP%\lobostudio-visual-3`. Aprire [Home](http://127.0.0.1:3082/#progetti-in-fotografia) o [Studio](http://127.0.0.1:3082/studio#metodo).

Commit locali `98be189` (Showcase), `f9cd3a5` (roadmap), `b8f1464` (anteprima fotografica) e `3c0b70c` (test e rifiniture). Per annullare l’intervento usare `git revert` nell’ordine inverso in un worktree pulito. La procedura per aggiornare o fermare la demo è descritta nella [guida alla preview](client-preview.md).
