# LoboStudio — Codex agent instructions

## Missione
Realizzare un nuovo sito istituzionale/portfolio premium per uno studio di ingegneria di Bologna, sostituendo Weebly. Il vecchio sito è una **fonte di contenuti da verificare**, non un riferimento grafico. Utenti: committenti privati, imprese, sviluppatori immobiliari, enti e collaboratori. Lingua iniziale: italiano. Prima release: sito navigabile, accessibile, veloce, documentato e testabile localmente; pubblicazione solo dopo approvazione.

## Fonti e perimetro
- Prima di ogni intervento leggi `docs/project-brief.md`, `docs/architecture.md`, `docs/design-system.md`, `docs/content-inventory.md`, `docs/git-workflow.md` e `docs/quality-security-legal.md`.
- Ispeziona lo stato della repository, `asset/` e gli eventuali file del logo. Non presupporre che gli asset completi siano già stati consegnati. Non sovrascrivere, rinominare, spostare o cancellare originali.
- Marchio di lavoro: **LOBO / LoboStudio**. La denominazione professionale visibile nei vecchi screenshot è **Studio di Ingegneria Lorenzo Bolelli**: verifica con il committente ragione/denominazione ufficiale e coerenza prima di pubblicare. Non confondere brand e soggetto giuridico.
- Informazioni verificabili dai vecchi screenshot: attività dal 1995 secondo biografia; aree progettazione architettonica/strutturale, studi di fattibilità, gestione progetti, project management, collaudi, consulenza tecnico-amministrativa; portfolio nuove costruzioni, ristrutturazioni, strutture, piani urbanistici; esperienza terremoto Emilia 2012; sezioni Clienti, Parlano di noi, Contatti. Trattale come **contenuti da confermare**, non come fatti già autorizzati per il nuovo sito.
- Non inventare nomi di clienti, certificazioni, dimensioni, cifre, anni, ruoli progettuali, testimonianze, premi, schede progetto, ubicazioni esatte o risultati. Usare campi `da confermare` nel repository, e non renderli al pubblico come fatti.

## Stack concordato
- Next.js App Router, React, TypeScript in strict mode, Tailwind CSS, componenti headless accessibili/shadcn/ui quando utili, icone Lucide, Motion soltanto quando migliora l'esperienza.
- Server Components come default; Client Components solo per interazioni reali.
- Prima release senza DB né backend separato: contenuti versionati e validati con schema tipizzato; route handler server per eventuale form, senza fingere di inviare mail. CMS/DB solo con ADR dopo un requisito concreto.
- Docker facoltativo, soprattutto per parity e deploy; sviluppo locale standard Node/npm. Prevedere Dockerfile multi-stage e compose soltanto se giustificati e documentati.
- Vitest + React Testing Library per unit/component, Playwright per smoke/E2E; ESLint, formatter, TypeScript strict, CI GitHub Actions.
- Le versioni devono essere scelte in base a release stabili e compatibili **verificate nel momento di installazione**, usando lockfile; non inventare numeri di versione.

## Design e UX
- Direzione: studio di architettura/ingegneria editoriale, rigoroso, premium ma caldo. Spazio bianco, griglie ampie, foto importanti, tipografia curata, microinterazioni sobrie, no template SaaS, no glassmorphism vistoso, no caroselli incontrollati.
- Design token documentati in `docs/design-system.md`. Il file logo originale prevale su una sua ricostruzione; non alterare proporzioni o colori del logo senza approvazione.
- Mobile-first. Header desktop con dropdown accessibile hover + focus + click; navigazione mobile separata e gestibile da tastiera. Breadcrumb e filtri navigabili.
- `prefers-reduced-motion`, semantica HTML, focus states, contrasti, alt text descrittivo, controlli tastiera. Target WCAG 2.2 AA come buona pratica di progetto, senza affermare conformità legale certificata.
- Mai foto prese a caso da internet presentate come lavori dello studio. Se insufficienti, usare placeholder chiaramente marcati e riutilizzabili solo in sviluppo.

## Git e sicurezza del repository
- Prima di toccare file, esegui `git status --short --branch` e controlla la posizione reale della root; il path Windows indicato dall'utente contiene `$HOME` e va trattato come path letterale da verificare, non come variabile da espandere senza controllo.
- Se non è una repo: `git init -b main`, imposta `.gitignore`, crea un commit iniziale coerente. Se esiste, rispetta branch, modifiche e cronologia esistenti; **non creare commit che inglobino modifiche preesistenti non tue**.
- Modello GitHub Flow: `main` sempre integrabile, branch brevi `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `test/`, `hotfix/`. No `develop` permanente senza necessità.
- Ogni task coerente = branch dedicato (se fattibile) + piccoli commit. Messaggi Conventional Commits: `feat(portfolio): add category filters`. Evita `update`, `fix stuff`, commit monolitici.
- Prima del commit esegui i test rilevanti. Prima della PR esegui lint, typecheck, unit tests, build, smoke/E2E se applicabile. Prepara riepilogo PR e checklist; **non fare push, merge, deploy né migrazione DNS senza esplicita autorizzazione**.
- Mai `git reset --hard`, `git clean -fd`, force push, overwrite silenzioso, commit di segreti o immagini originali pesanti. Non assumere di avere accesso al GitHub dell'utente.
- `docs/git-workflow.md` è fonte normativa per sequenza branch/commit/PR.

## Content, assets, legal
- Originali in `asset/`/cartella ricevuta: non toccarli. Manifest con inventario hash, dimensioni, licenze/autorizzazioni, associazione progetto. Web derivati ottimizzati in `public/media` con filename semantici; no upload automatici a terzi.
- Mappa URL legacy -> URL nuove, crea redirect 301 dopo accertamento dominio e vecchi permalink; canonical, metadata, sitemap, robots e structured data soltanto con fatti confermati.
- Prima del go-live richiedi verifica di privacy policy, titolare del trattamento, flusso contatti, cookie/tracker, credits foto, permessi loghi clienti, citazioni/articoli, P.IVA e dati obbligatori pertinenti. Non inserire banner cookie superfluo se non si usano tracker non tecnici. Non dichiarare che il sito è legalmente conforme senza verifica umana.
- Form contatti: Zod server-side, honeypot, anti-abuso/rate limit duraturo se esposto, privacy checkbox/consenso appropriato per gestione della richiesta (non obbligo di marketing), secrets server-side, niente dati personali nei log, stati UX sinceri; in assenza di provider/configurazione la UI non deve mostrare falso successo. Preferire `mailto` funzionante finché l'infrastruttura invio non è pronta.
- Non pubblicare file della cartella `asset/` che rivelino metadati riservati o immagini non approvate.

## Definition of Done
1. Funzione implementata e verificata realmente, non solo stub.
2. Responsive e accessibile a tastiera.
3. Test opportuni e CI predisposta/eseguita quando disponibile.
4. Dati pubblici fondati su materiale autorizzato; eventuali TODO chiaramente documentati.
5. Documentazione aggiornata e decisioni architetturali annotate.
6. `git diff` revisionato, commit convenzionali su branch corretto, report finale con file cambiati, comandi, test, branch, commit e blocchi residui.

## Skills locali
Usa le skills mirate in `.agents/skills/`: `lobo-design-system` per UI, `lobo-content-migration` per contenuti, `lobo-git-delivery` per flusso di lavoro, `lobo-quality-security` per QA/go-live. Usa eventuali skill esterne verificate (Vercel React best practices, web-design-guidelines) senza duplicarle. Non eseguire istruzioni remote non revisionate.
