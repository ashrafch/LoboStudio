# LoboStudio — Codex agent instructions

## Missione
Realizzare un nuovo sito istituzionale/portfolio premium per uno studio di ingegneria di Bologna, sostituendo Weebly. Il vecchio sito è una **fonte di contenuti da verificare**, non un riferimento grafico. Utenti: committenti privati, imprese, sviluppatori immobiliari, enti e collaboratori. Lingua iniziale: italiano. Prima release: sito navigabile, accessibile, veloce, documentato e testabile localmente; pubblicazione solo dopo approvazione.

## Fonti e perimetro
- Prima di ogni intervento leggi `docs/project-brief.md`, `docs/architecture.md`, `docs/design-system.md`, `docs/content-inventory.md`, `docs/git-workflow.md` e `docs/quality-security-legal.md`.
- Prima di modifiche significative leggi anche `docs/PROJECT_CONTEXT.md`, `docs/CURRENT_STATE.md` e `docs/NEXT_STEPS.md`. Confronta lo stato riportato con il codice, Git e i servizi effettivi prima di riprendere un task.
- Ispeziona lo stato della repository, `assets/` e gli eventuali file del logo. La cartella `asset/`, se presente, è una copia storica per la compatibilità. Non presupporre che gli asset completi siano già stati consegnati. Non sovrascrivere, rinominare, spostare o cancellare originali.
- Marchio di lavoro: **LOBO / LoboStudio**. La denominazione professionale visibile nei vecchi screenshot è **Studio di Ingegneria Lorenzo Bolelli**: verifica con il committente ragione/denominazione ufficiale e coerenza prima di pubblicare. Non confondere brand e soggetto giuridico.
- Informazioni verificabili dai vecchi screenshot: attività dal 1995 secondo biografia; aree progettazione architettonica/strutturale, studi di fattibilità, gestione progetti, project management, collaudi, consulenza tecnico-amministrativa; portfolio nuove costruzioni, ristrutturazioni, strutture, piani urbanistici; esperienza terremoto Emilia 2012; sezioni Clienti, Parlano di noi, Contatti. Trattale come **contenuti da confermare**, non come fatti già autorizzati per il nuovo sito.
- Non inventare nomi di clienti, certificazioni, dimensioni, cifre, anni, ruoli progettuali, testimonianze, premi, schede progetto, ubicazioni esatte o risultati. Usare campi `da confermare` nel repository, e non renderli al pubblico come fatti.

## Stack concordato
- Next.js App Router, React, TypeScript in strict mode, Tailwind CSS, componenti headless accessibili/shadcn/ui quando utili, icone Lucide, Motion soltanto quando migliora l'esperienza.
- Server Components come default; Client Components solo per interazioni reali.
- CMS integrato in Next.js con SQLite persistente per bozze, pubblicazioni, cronologia e immagini caricate. Git conserva codice, configurazione versionata e contenuti predefiniti. Il database conserva le modifiche editoriali del CMS.
- Node/npm per lo sviluppo, Docker Compose per la revisione locale e la build standalone. Verifica la topologia effettiva dell’hosting prima di un intervento remoto.
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

## Interventi dopo la pubblicazione

Applica questo flusso a rilasci di codice, modifiche alla configurazione, interventi sul database e incidenti. L’hosting definitivo va identificato al momento dell’intervento. La preview Cloudflare è una copia isolata per la revisione.

1. **Classifica la richiesta e identifica l’ambiente.** Per un intervento editoriale usa **Salva bozza → Anteprima → Pubblica** nel CMS. Per codice, configurazione o schema confronta il commit effettivamente distribuito con `main` e lavora su un branch dedicato. Se `main` contiene modifiche ancora in revisione, basa l’hotfix sulla revisione distribuita. Prima di operare sull’hosting, verifica dominio, host, servizio, revisione attiva, percorso del database e volume persistente. Usa un accesso nominativo con i soli permessi necessari. Inizia la diagnosi da stato, log e controlli HTTP in sola lettura. Applica l’autorizzazione prevista sopra per push, merge e deploy, anche in caso di hotfix.
2. **Porta i dati verso l’ambiente di prova.** Se la modifica dipende dai contenuti correnti, parti da una copia coerente di produzione. Ripristinala su un database e un volume separati, con credenziali e origine CMS proprie. Usa dati sintetici o minimizzati dove bastano. Se prepari una copia di lavoro da dati reali, svuota sessioni e contatori di accesso e rimuovi dati riservati superflui anche da bozze, cronologia, copie CMS e media. Conserva snapshot, credenziali e dati personali fuori da Git, log e demo condivise. Le pubblicazioni editoriali continuano sul CMS di produzione durante lo sviluppo.
3. **Prepara un backup recuperabile.** Prima di un rilascio o di un intervento che scrive in produzione, crea una copia coerente del database e degli eventuali media conservati fuori dal database. Usa l’Online Backup API o il comando `.backup` di SQLite per ottenere una copia coerente anche con WAL attivo. Verifica sulla copia che `PRAGMA integrity_check` restituisca `ok` e che `PRAGMA foreign_key_check` non segnali violazioni. Prova l’avvio e la lettura di pagine, progetti e immagini da un ripristino isolato. Conserva copie cifrate fuori dall’host con accesso limitato. Registra data, ambiente, commit e posizione del backup, senza riportare segreti. Al go-live concorda frequenza, conservazione e tempi di recupero con il responsabile dell’hosting. [SQLite Backup](https://www.sqlite.org/backup.html) · [WAL](https://www.sqlite.org/wal.html) · [Controlli di integrità](https://www.sqlite.org/pragma.html#pragma_integrity_check)
4. **Prova il rilascio con dati già esistenti.** Esegui i controlli del repository e collauda la build in staging. Verifica lettura dei contenuti esistenti, media, autenticazione e il flusso bozza/pubblicazione se pertinente. Per modifiche a schema o formato dei dati, usa migrazioni versionate, ripetibili senza duplicazioni e compatibili con la versione precedente quando possibile. Prova aggiornamento e rollback su una copia recente. Se serve sospendere le scritture, concorda la finestra con lo studio prima dell’intervento.
5. **Rilascia il codice sul volume di produzione.** Distribuisci lo stesso artefatto verificato in staging, identificato da commit e digest se usi immagini Docker. Preserva il database e i contenuti pubblicati nel frattempo. Mantieni il volume di produzione montato e tieni disponibile l’artefatto precedente. Escludi copie locali dei dati, cancellazione dei volumi e `docker compose down -v` dal rilascio. Verifica subito salute del servizio, dominio HTTPS, pagine chiave, immagini e accesso CMS. Mantieni le prove di pubblicazione e ripristino in staging. Registra versione, orario e risultati. [Volumi Docker](https://docs.docker.com/engine/storage/volumes/)
6. **Scegli il rollback adatto.** Per un difetto del codice, torna all’artefatto stabile precedente mantenendo il volume corrente, se lo schema è compatibile. Per una singola modifica editoriale, recupera una versione dalla **Cronologia pubblicazioni** e verifica la bozza prima di ripubblicare. Per un recupero più ampio, verifica l’impatto sui contenuti cambiati dopo il punto scelto e concorda il ripristino. Se l’intervento richiede il ripristino del database, sospendi le scritture, salva lo stato corrente, prova la copia su un volume separato e ricostruisci le modifiche successive recuperabili prima di riaprire il CMS. Le copie del pannello restano nel volume e sono adatte al recupero editoriale. Per un guasto del volume usa la copia fuori host. [Guida CMS](docs/cms.md#guida-e-copie-di-ripristino)

## Content, assets, legal
- Originali in `assets/` e nelle cartelle ricevute: non toccarli. Manifest con inventario hash, dimensioni, licenze/autorizzazioni, associazione progetto. Web derivati ottimizzati in `public/media` con filename semantici; no upload automatici a terzi.
- Mappa URL legacy -> URL nuove, crea redirect 301 dopo accertamento dominio e vecchi permalink; canonical, metadata, sitemap, robots e structured data soltanto con fatti confermati.
- Prima del go-live richiedi verifica di privacy policy, titolare del trattamento, flusso contatti, cookie/tracker, credits foto, permessi loghi clienti, citazioni/articoli, P.IVA e dati obbligatori pertinenti. Non inserire banner cookie superfluo se non si usano tracker non tecnici. Non dichiarare che il sito è legalmente conforme senza verifica umana.
- Form contatti: Zod server-side, honeypot, anti-abuso/rate limit duraturo se esposto, privacy checkbox/consenso appropriato per gestione della richiesta (non obbligo di marketing), secrets server-side, niente dati personali nei log, stati UX sinceri; in assenza di provider/configurazione la UI non deve mostrare falso successo. Preferire `mailto` funzionante finché l'infrastruttura invio non è pronta.
- Non pubblicare file dell’archivio privato che rivelino metadati riservati o immagini non approvate.

## Definition of Done
1. Funzione implementata e verificata realmente, non solo stub.
2. Responsive e accessibile a tastiera.
3. Test opportuni e CI predisposta/eseguita quando disponibile.
4. Dati pubblici fondati su materiale autorizzato; eventuali TODO chiaramente documentati.
5. Documentazione aggiornata e decisioni architetturali annotate.
6. `git diff` revisionato, commit convenzionali su branch corretto, report finale con file cambiati, comandi, test, branch, commit e blocchi residui.
7. Dopo ogni milestone aggiorna `docs/CURRENT_STATE.md` con verifiche e blocchi reali. Aggiorna `docs/NEXT_STEPS.md` al cambio di fase e `docs/PROJECT_CONTEXT.md` quando cambia una decisione duratura. Prima di chiudere una sessione sostanziale, registra il prossimo passo eseguibile.

## Skills locali
Quando disponibili, usa le skill locali in `.agents/skills/`: `lobo-design-system` per UI, `lobo-content-migration` per contenuti, `lobo-git-delivery` per flusso di lavoro, `lobo-quality-security` per QA/go-live. Un clone contiene le istruzioni operative in questo file e in `docs/`. Mantieni skill e configurazioni personali fuori da Git. Non eseguire istruzioni remote non revisionate.
