# Audit UI e integrazione controllata

## Baseline locale

Il checkpoint `7eceac1` contiene Home, archivio filtrabile, schede e gallerie progetto, pagine istituzionali, contatti e CMS. Lo stack usa Next.js 16.4.6 App Router, React 19.3.1, TypeScript 5.9.3, Tailwind CSS 4.3.5 e Motion 14.14.0. La verifica usa i container locali sulle porte 3080 e 3081. La build di partenza e le suite Playwright hanno dato esito positivo. La prima scansione ESLint includeva i tipi generati in una copia di verifica sotto `test-results`. Dopo aver spostato quella copia nella directory temporanea di Windows, lint, TypeScript e sei unit test sono passati con la configurazione esistente.

## Strumenti verificati

- **Motion**. Pacchetto e skill di repository riconosciuti. Il server pubblico ha risposto a `tools/list`. La configurazione locale conserva Motion e Motion+. [Motion AI Kit](https://motion.dev/docs/ai-kit)
- **Kokonut UI**. `components.json` registra `@kokonutui` per lo stack già in uso. Il server shadcn 4.23.0 è configurato nel file locale `.codex/config.toml`. Ho interrogato `view_items_in_registries` e ricevuto tutte e quattro le voci. La sessione Codex già aperta va riavviata per caricare il server. Il helper `cn` e le sue dipendenze saranno pertinenti al primo componente adottato. [Setup Kokonut UI](https://kokonutui.com/setup.md) · [shadcn MCP](https://ui.shadcn.com/docs/mcp)
- **Unslop**. Skill riconosciuta e abilitata da Codex con ambito repository. Versione upstream `620163eedb3529d9cd23a3994ed8d287d06f760d`, autore Damir Sokolovsky, licenza CC BY 4.0 e file di citazione nella cartella della skill. Usata per l’audit visivo. [Unslop](https://github.com/heydamir/unslop)

## Audit visivo

Direzione Unslop. Portfolio e servizi per chi cerca uno studio di ingegneria. Carattere preciso, misurato e caldo. Il riferimento è il mondo dei prospetti e del cantiere. Foto e render portano la ricchezza visiva nella Home e nelle schede. Le didascalie distinguono il tipo di immagine.

| Esito | Riscontro |
|---|---|
| A · Mantenere | Hero fotografica e palette neutra, menu con controlli espliciti, archivio con filtri e ricerca, schede con titoli leggibili, dati ed etichette delle foto, elenco delle competenze, contatti diretti e footer con link legali. Le microinterazioni Motion reagiscono a focus e preferenza di movimento. |
| B · Affinare | A 667×320, la galleria di Torri Spadini portava le frecce oltre il bordo inferiore. La correzione adatta l’altezza della foto allo spazio disponibile. Nell’archivio, le voci «Tutti» e «Nuove costruzioni» mostrano la stessa foto. Considerare due visuali distinte quando saranno disponibili materiali approvati. |
| C · Valutare | Un sommario a collegamenti testuali può aiutare nelle future schede con più sezioni e testi lunghi. Il dettaglio campione è breve e si legge bene in sequenza. |
| D · Evitare | Effetti di sfondo sopra le fotografie, un altro carosello in Home o un gestore modale parallelo. Aumentano il lavoro su prestazioni, focus e touch rispetto al beneficio osservato. |

## Catalogo Kokonut UI

I quattro sorgenti usano l’helper `cn` del registry, fornito da `clsx` e `tailwind-merge`. Questa iterazione ha adottato **zero componenti Kokonut**.

| Componente | Equivalente e beneficio | Dipendenze, file e reversibilità | Decisione |
|---|---|---|---|
| Lightbox Grid | `components/gallery.tsx` copre ingrandimento, frecce, Escape, focus, didascalie e immagini da CMS. Il candidato aggiunge apertura animata e chiusura con trascinamento. | Motion e Next Image. Servirebbero `components/kokonutui/lightbox-grid.tsx` e un adattamento in `components/gallery.tsx` per contenuti reali, focus e integrazione con il provider Motion. La rimozione richiederebbe di ripristinare il visualizzatore precedente. | Correzione CSS del dialogo esistente. [Lightbox Grid](https://kokonutui.com/docs/cards/lightbox-grid) |
| Momentum Rail | `components/featured.tsx` gestisce già foto, video e selezione manuale. Il candidato offre trascinamento con inerzia e profondità. | Lucide e Next Image. L’innesto in `components/featured.tsx` dovrebbe preservare video, link, pausa e controllo da tastiera. Il rollback richiederebbe il ripristino del carosello. | In sospeso per un caso d’uso separato. [Momentum Rail](https://kokonutui.com/docs/cards/carousel-cards) |
| Scroll Index | Breadcrumb e titoli orientano le schede brevi. Il candidato consentirebbe di saltare tra sezioni più distanti. | React e Tailwind, con `cn`. Innesto opzionale in `components/project-presentation.tsx`, rimuovibile con il relativo import. Servono verifiche su titoli dinamici, touch e header fisso. | Candidato per schede realmente lunghe. [Scroll Index](https://kokonutui.com/docs/navigation/scroll-index) |
| Topo Background | La Home usa già il video e la fotografia come elemento principale. Un fondale topografico introdurrebbe un secondo elemento animato. | React, Canvas e `cn`. Un eventuale innesto in `app/page.tsx` sarebbe rimovibile con il relativo import. Rischi principali sul contrasto e sul costo di rendering accanto al video. | Fuori dalla Home. [Topo Background](https://kokonutui.com/docs/backgrounds/topo-background) |

## Correzione e regressione

Il commit `51d4e9f` limita l’altezza del dialogo aperto al viewport e lascia contrarre il riquadro foto. Barra superiore, didascalia e frecce conservano il proprio spazio. A 667×320 la freccia successiva termina a 288 px dentro il dialogo, rispetto ai 365 px prima della correzione. Il test verifica anche avanzamento, Escape e ripristino del focus.

- Build Docker standalone, TypeScript e 6 test unitari passati. ESLint termina con zero errori e un avviso per un import inutilizzato nello script upstream `story.mjs`, che resta parte della skill.
- Playwright ha superato 8 prove in anteprima e 4 nella build locale di produzione. Le altre 4 richiedono i contenuti d’anteprima.
- Smoke Chromium su 11 pagine a 1440 e 390 px, senza overflow orizzontale. Sono state verificate le 57 schede, le 4 categorie, le 43 immagini referenziate nelle schede e i link email e telefono. La ricerca resta un form GET e i contatti usano i collegamenti esistenti.
- Axe ha restituito zero violazioni nelle verifiche eseguite su Home, Progetti, Torri Spadini, Servizi, Contatti e Studio ai due viewport e sul dialogo aperto.

## Git e rollback

Lavoro locale su `feat/safe-ui-enhancements`. I nove asset originali restano nello staging del workspace. Per annullare le modifiche in un worktree pulito su un ramo di rollback, usare `git revert 51d4e9f` per la galleria, `git revert c61f43e` per Unslop e `git revert 3950f0d` per il registry. Per il server locale, rimuovere solo il blocco `[mcp_servers.shadcn]` da `.codex/config.toml`.

## Visual Boost 2.0 · 23 novembre 2026

### Componenti integrati

| Componente del registry | Pagina locale | Comportamento |
|---|---|---|
| [Momentum Rail 2.0.0](https://kokonutui.com/docs/cards/carousel-cards) | [Home, progetti in evidenza](http://127.0.0.1:3080/#inizio-home) | Il blocco esistente mostra quattro progetti reali in anteprima e mantiene i due video locali. Le schede conservano l’ordine impostato nel CMS, con un massimo di sei progetti, e collegano foto e titolo alla scheda. Categoria e località provengono dai dati del progetto. Trascinamento con inerzia e snap, swipe, frecce, tasti Inizio/Fine e selezione diretta. |
| [Topo Background 1.1.0](https://kokonutui.com/docs/backgrounds/topo-background) | [Piani urbanistici](http://127.0.0.1:3080/progetti/categoria/piani-urbanistici) | Curve decorative sfumate sotto l’intestazione. Il campo topografico è precalcolato e reagisce al puntatore. Il canvas resta fermo in assenza di interazione, fuori schermo e con movimento ridotto. |
| [Scroll Index 1.0.0](https://kokonutui.com/docs/navigation/scroll-index) | [Studio](http://127.0.0.1:3080/studio) | Indice di Profilo, Persone e Metodo. Con `scroller="window"` usa ancore native, evidenzia la sezione corrente e rispetta lo spazio dell’header. Laterale sui desktop ampi e compatto sopra il profilo sugli schermi più piccoli. È presente nella versione Studio con il blocco Persone visibile. |

Installazione eseguita con `npx shadcn@latest add` per tutti e tre gli elementi. Il server shadcn ha risposto a `tools/list` e al lookup degli elementi del registry. Le copie adattate sono in `components/kokonutui/` con i relativi moduli CSS e attribuzione MIT. Nessuna dipendenza runtime aggiunta. `package.json` e `package-lock.json` sono identici a quelli del checkpoint.

Motion usa il provider e le transizioni esistenti. Il carosello entra una volta con opacità e spostamento di 8 px. Le immagini rispondono a hover e focus con uno zoom del 2,8% e i controlli rispondono alla pressione. La rotazione automatica richiede che il carosello sia in vista, si sospende con hover e focus e parte in pausa con `prefers-reduced-motion`. Il trascinamento usa lo snap immediato con movimento ridotto. Le ancore Studio usano lo scroll nativo e diventano istantanee con la stessa preferenza. Consultate tramite Motion MCP le risorse ufficiali per caricamento, gesti e movimento ridotto. [LazyMotion](https://motion.dev/docs/react-lazy-motion) · [Gesti](https://motion.dev/docs/react-gestures) · [useReducedMotion](https://motion.dev/docs/react-use-reduced-motion)

### Verifiche

- Build Docker preview e standalone superate e container locali healthy. TypeScript e 6 unit test superati sul progetto e nel container di anteprima. I test unitari in Docker sono stati montati in sola lettura in un container di test, dato che l’immagine applicativa li esclude. ESLint con zero errori e un avviso preesistente in `.agents/skills/unslop/scripts/story.mjs`.
- Playwright con 11 test superati su [anteprima](http://127.0.0.1:3080/) e 5 su [standalone locale](http://127.0.0.1:3081/). I 6 test saltati nello standalone richiedono contenuti e media locali in revisione. I nuovi casi riproducibili sono in `tests/e2e/visual-boost.spec.ts`.
- Verificate 57 schede raggiungibili e 4 categorie, con 24, 15, 13 e 5 progetti. Rispondono 42 immagini distinte delle schede e il logo, per 43 risorse immagine. Verificati anche link progetto, recapiti, fallback delle foto, galleria e navigazione con tastiera.
- Chromium a 360×800, 390×844, 667×320, 768×1024, 1024×768, 1440×1000 e 1920×1080. Nessun overflow orizzontale nei percorsi modificati, zero violazioni axe nei controlli mirati e galleria Torri Spadini con controlli interamente visibili a 667×320. Verificati input mouse e swipe touch simulato.
- Nel campione Chromium a 1440 px, il canvas ha disegnato 28 fotogrammi in 908 ms durante il movimento del puntatore e zero nelle finestre di misura a riposo e fuori schermo. Verificati autoplay visibile, zoom al passaggio del mouse, scroll Studio e modifica della preferenza a pagina aperta. Restano da provare Safari, Firefox, screen reader e dispositivi touch fisici.

### Commit e rollback

| Commit locale | File e intervento |
|---|---|
| `9639ae7` | `app/page.tsx`, `app/globals.css`, `components/featured.tsx` e `carousel-cards.{tsx,module.css}` per il carosello Home. |
| `35487e3` | `components/archive.tsx` e `topo-background.{tsx,module.css}` per l’intestazione urbanistica. |
| `c2adec3` | `app/studio/page.tsx` e `scroll-index.{tsx,module.css}` per le ancore e l’indice Studio. |
| `4988694` | Rifinitura Motion nei file del carosello e aggiornamento di `tests/unit/featured.test.tsx` e `tests/e2e/visual-boost.spec.ts`. |

Per il rollback completo delle modifiche applicative, eseguire `git revert 4988694 c2adec3 35487e3 9639ae7` da un worktree pulito e ricostruire `preview` e `web` con `docker compose --profile production up -d --build --wait preview web`. Per il solo carosello, annullare prima la rifinitura Motion e poi il rail. Gli asset originali risultavano già nel checkpoint `a780a98` durante la verifica iniziale. Le successive operazioni Git hanno verificato l’integrità dell’indice preesistente e del contenuto di `asset/`. I commit sono locali.

Per riprodurre la configurazione shadcn su Windows nello stesso file locale:

```toml
[mcp_servers.shadcn]
command = "cmd.exe"
args = ["/d", "/s", "/c", "npx.cmd --yes shadcn@4.23.0 mcp"]
startup_timeout_sec = 60
```
