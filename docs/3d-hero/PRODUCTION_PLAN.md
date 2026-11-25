# Hero 3D · Piano di produzione

Verifica del 25 novembre 2026. La Fase 0 prepara il workspace. Il primo collaudo della pipeline richiede lo ZIP Vectorworks e la CLI di validazione glTF.

## Stato del frontend

- Next.js 16.4.6 App Router, React e React DOM 19.3.1, TypeScript 5.9.3 strict, Tailwind 4.3.5 e Motion 14.14.0. Node 26.13.1 e npm 11.20.0 sulla postazione. Docker usa Node 24 su Debian Bookworm e il target standalone di Next.js.
- `app/page.tsx` è un Server Component. Legge pagine e progetti pubblicati tramite `content/cms/public.ts`. La `.cover` rende titolo, testo e CTA in `HeroReveal` e la sequenza fotografica `Featured`. Le slide seguono la selezione CMS. `FilmIntro` può precedere la cover nella preview locale e si pausa fuori vista.
- `components/motion/settings.tsx` imposta `MotionConfig reducedMotion="user"`, `LazyMotion` e la preferenza condivisa `useReducedPreference`. Reveal, navigazione, galleria e caroselli usano Motion. La cover usa un reveal iniziale e un carosello con pausa. Il parallax di `ArchitecturalShowcase` in Home usa `useScroll`, `useSpring` e `useTransform`. `StudioRoadmap` usa `useScroll` e `useTransform` per il tratto progressivo su `/studio`.
- `package.json`, lockfile, `npm ls` e la ricerca nel sorgente confermano l’assenza di `three`, Fiber e Drei.

## Compatibilità e dipendenze della futura demo

| Pacchetto | Versione verificata | Esito |
| --- | --- | --- |
| `react` e `react-dom` | `19.3.1` | Versioni in uso e allineate. |
| `motion` | `14.14.0` | Peer React e React DOM `^18.0.0 \|\| ^19.0.0`. Riutilizzare la versione corrente. |
| `three` e `@types/three` | `0.187.0` | Coppia candidata per motore e tipi. |
| `@react-three/fiber` | `9.8.2` | Peer React e React DOM `>=19 <19.4` e Three `>=0.156`. Fiber 8 è per React 18. |
| `@react-three/drei` | `10.7.9` | Peer React e React DOM `^19`, Fiber `^9.0.0`, Three `>=0.159`. Opzionale. Nel dry run `stats-gl@2.4.2` aggiunge Three `0.170.0` tramite `^0.170.0`. |

Metadati controllati sul registro npm. Due risoluzioni con `npm install --dry-run --ignore-scripts --strict-peer-deps` su una copia temporanea del manifest sono riuscite. Con il solo Fiber è stata risolta una sola copia di Three. Iniziare con Three, i tipi e Fiber. Il loader ufficiale `GLTFLoader` con `useLoader` basta per il primo GLB. Se Drei diventa necessario, rivalutare il doppio Three e misurare il bundle. La risoluzione dei peer precede i test effettivi di build, SSR e browser. Fissare le versioni stabili nel lockfile della demo al momento dell’installazione. [Compatibilità Fiber](https://r3f.docs.pmnd.rs/getting-started/installation)

## Strumenti e skill

| Strumento | Verifica |
| --- | --- |
| Blender 5.3.0 | CLI funzionante con percorso assoluto `C:/Program Files/Blender Foundation/Blender 5.3/blender.exe`. Fuori da `PATH`. Avviato in background con `--factory-startup --disable-autoexec`. `bpy` ha riconosciuto `IMPORT_SCENE_OT_fbx` e `EXPORT_SCENE_OT_gltf`. |
| FFmpeg e FFprobe | Assenti da `PATH` e dalle posizioni di installazione verificate. Servono per analizzare il video di riferimento e per eventuali derivati video, indipendentemente dal primo GLB. |
| glTF Transform | `@gltf-transform/cli@4.5.1` disponibile su npm, richiede Node `>=20`. CLI assente in locale. Adottare una versione fissata per `inspect` e `validate` in un ambiente strumenti separato. |
| Altri strumenti glTF | Nessun `gltf-validator`, `gltfpack`, `gltfjsx`, `ktx` o `toktx` in `PATH`. La validazione può passare dalla CLI glTF Transform. Valutare gli altri solo se il modello o le texture lo richiedono. |
| Docker | Engine 29.9.3 Linux `x86_64`, Compose 5.7.0. Ispezione in sola lettura. |

Letti i sei `SKILL.md` locali in `.agents/skills/`. Motion AI Kit (`motion`), Unslop, `threejs-react-three-fiber`, `threejs-asset-pipeline`, `vercel-react-best-practices` e `web-design-guidelines` sono disponibili. Il server Motion risponde a una ricerca sullo scroll. Il checksum del riferimento locale delle Web Interface Guidelines corrisponde a quello dichiarato dalla skill. [CLI glTF Transform](https://gltf-transform.dev/cli)

## Workspace e tutela degli asset

| Directory sotto `assets/3d-building/` | Contenuto |
| --- | --- |
| `original/` | ZIP e FBX consegnati, conservati integri, con hash SHA-256. |
| `textures/` | Copie di lavoro delle texture collegate, mantenendo i riferimenti relativi quando servono. |
| `reference/` | Foto, video e indicazioni approvate per inquadrature e materiali. Qui è conservato il video di riferimento già ricevuto. |
| `processed/` | File Blender di lavoro, GLB esportati, varianti ottimizzate e report locali. |

Git include solo i marker `.gitkeep` del workspace. Il `.dockerignore` usa una lista di inclusione che esclude `asset/` e `assets/` dal contesto di build del sito. Conservare modelli, texture, riferimenti e report riservati fuori da `public/`. Portare nella demo solo una copia del GLB e degli eventuali file approvati per il gruppo di revisione. Per la pubblicazione serve una versione verificata e autorizzata, con percorso dedicato e nome versionato. Un file servito al browser è scaricabile.

## Pipeline Vectorworks → FBX → Blender → GLB

1. Inventariare lo ZIP prima dell’estrazione. Controllare dimensioni dichiarate e radice dei percorsi. Escludere percorsi assoluti, risalite `..` e collegamenti esterni dalla procedura di estrazione. Registrare hash dello ZIP e dell’FBX, versione di Vectorworks, unità di misura, origine, texture, riferimento visivo e autorizzazione. Conservare l’originale e importare una copia.
2. Importare FBX in Blender e salvare il file di lavoro in `processed/`. Confrontare con una misura nota. Verificare assi, normali, origine, coordinate georeferenziate, UV, gerarchia, materiali e texture mancanti. Rimuovere dalla copia di lavoro geometrie fuori inquadratura o riservate, interni e dettagli non autorizzati. Se il file non regge la semplificazione, chiedere un export limitato alle parti visibili.
3. Esportare un GLB glTF 2.0 con asset incorporati e ispezionarlo prima della compressione. Registrare dimensione, triangoli, materiali, texture, estensioni e resa. Confrontare colori, vetri e silhouette con il riferimento. Rimuovere nomi, metadati o geometrie che svelano informazioni riservate.
4. Su copie, eliminare dati inutilizzati e duplicati. Ridurre texture e geometria in base all’inquadratura. Valutare Meshopt o Draco per la geometria e KTX2 per le texture soltanto dopo una misura, includendo costo dei decoder e resa. Per le estensioni adottate, servire localmente i decoder compatibili. Ripetere `inspect` e `validate` sul derivato finale e controllare errori e avvisi nel browser. [Import FBX](https://docs.blender.org/manual/en/5.0/files/import_export/fbx.html) · [Export glTF](https://docs.blender.org/manual/en/5.1/addons/import_export/scene_gltf2.html)

## Demo isolata e scena React

Docker mostra le quattro porte locali 3080–3083 occupate dai servizi del sito e delle preview. La porta 3090 non risultava in ascolto al momento della verifica. Per il prototipo usare un’app di demo in una directory con contesto di build dedicato e, quando serve Docker, un progetto Compose autonomo `lobostudio-3d-demo`, esposto su `127.0.0.1:3090` dopo ricontrollo. Usare un processo non-root con `cap_drop: [ALL]` e `no-new-privileges`. Copiare o montare in sola lettura il solo derivato approvato. Escludere `.env`, `asset/`, `original/`, volumi SQLite, rete del CMS e collegamenti ai gateway esistenti. Applicare `noindex` al prototipo.

L’involucro HTML contiene titolo, CTA, spazio riservato al visual e poster. Un confine client carica `Canvas` in modo differito solo quando abilitato e vicino al viewport. Dentro `Canvas` usare Suspense per il caricamento del GLB e gestire errori di caricamento e perdita del contesto. Tenere separati modello, luci e configurazione della camera. Prediligere WebGL e un set di luci leggero. Gestire rimozione delle sottoscrizioni e ciclo di vita delle risorse GPU.

### Camera guidata dallo scroll

Usare lo scroll nativo con una sezione dedicata e visual sticky su viewport adatti. Motion `useScroll` misura il progresso `0–1` rispetto al contenitore, con offset definiti sugli ingressi e sulle uscite della sezione. Mappare il valore su pose di camera e target ricavate dal modello reale. Interpolare posizione e orientamento, limitando il progresso ai capi. Passare il valore al rig tramite un `MotionValue` o un ref, evitando aggiornamenti React per ogni frame. Con `frameloop="demand"`, invalidare quando cambia il valore o finché l’eventuale interpolazione si assesta. Verificare scroll inverso, ridimensionamento, ingresso a metà pagina e ripristino della posizione. Su mobile verificare un percorso più breve o la variante statica. [Motion useScroll](https://motion.dev/docs/react-use-scroll)

## Performance, verifiche e integrazione

- Misurare una baseline della Home fotografica e poi la demo. Registrare peso trasferito di GLB, texture, decoder e chunk JS, tempo al primo frame, LCP, CLS, INP, draw call, triangoli e tempi di frame. Concordare i limiti dopo il primo export reale. Ridurre DPR, texture, ombre e dettagli in base ai risultati, con prova su un telefono reale di fascia media, Safari, Firefox e Chromium.
- Verificare caricamento lento o fallito, WebGL indisponibile, perdita del contesto, uscita dalla sezione e `prefers-reduced-motion` a pagina aperta. Mantenere poster o hero fotografica, titolo e CTA disponibili con tastiera, screen reader e JavaScript disattivato. Conservare spazio stabile per evitare salti di layout.
- Dopo la demo approvata, integrare sul branch dedicato dietro un’opzione disattivata di default. Preservare `HeroReveal`, `Featured`, testi CMS, CTA e ordine editoriale della Home. Tenere la cover fotografica come fallback completo e percorso di rollback. Verificare build standalone, lint, typecheck, test e Playwright con 3D attivo e disattivo, controllo axe e navigazione touch.
- Rischi da separare nel collaudo: scala e assi dell’export, texture perse e incoerenze visive, esposizione di dati del progetto, costo di GPU e memoria mobile, dipendenze duplicate, cache del derivato, scroll sticky e preferenze di accessibilità. Il passaggio a una preview esterna richiede l’approvazione del derivato e un ambiente di revisione dedicato.

**Al ricevimento dello ZIP** inventariare e importare il modello, ottenere il primo GLB validato e concordare l’inquadratura. La demo della camera parte da quel derivato reale.
