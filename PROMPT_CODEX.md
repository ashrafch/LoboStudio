# PROMPT PER CODEX — LOBO STUDIO (fase 0 -> MVP completo locale)

Agisci come un team senior di **product designer, art director, frontend engineer, full-stack engineer, content strategist, QA engineer, security engineer e tech lead**. Hai la responsabilità di produrre un sito realmente navigabile, non una demo con schermate statiche.

## Contesto
Stiamo rifacendo completamente il vecchio sito Weebly dello **Studio di Ingegneria Lorenzo Bolelli**, con identità visuale **LOBO / LoboStudio** (naming finale da confermare). Sito precedente: biografia del fondatore, progetti di nuove costruzioni, ristrutturazioni, strutture, piani urbanistici, sezione terremoto Emilia 2012, clienti, rassegna stampa, contatti, slideshow di foto. Il sito vecchio è la fonte di partenza per materiale e categorizzazione, **non il modello da replicare**.

La repo di lavoro è nella cartella `LoboStudio` che sto aprendo in VS Code. Gli asset disponibili si trovano in `asset/`, ma non sono definitivi: ne arriveranno molti altri. **Non perdere, spostare o sovrascrivere gli originali**. Il path segnalato è `C:\Users\ashra\$HOME\Dev\LoboStudio\asset`: verifica effettivamente la root sul filesystem; `$HOME` potrebbe essere una cartella letterale. Non utilizzare l'editor Weebly come fonte consultabile automaticamente: hai screenshot di riferimento comunicati dall'utente e i file locali.

Leggi integralmente `AGENTS.md`, `docs/project-brief.md`, `docs/architecture.md`, `docs/design-system.md`, `docs/content-inventory.md`, `docs/asset-workflow.md`, `docs/git-workflow.md`, `docs/quality-security-legal.md`. Attiva quando pertinenti le skill locali `.agents/skills/*` e le skill Vercel eventualmente installate. Se il codice preesiste, conserva ciò che funziona e analizzalo prima di riscriverlo.

## Risultato atteso
Creare l'MVP **completo in locale**, pronto per revisione del committente e predisposto al go-live dopo verifiche sui contenuti e configurazioni mancanti:

1. **Home premium/editoriale**: hero memorabile con fotografie di lavori reali quando disponibili; copy professionale essenziale; progetti selezionati; chi siamo; servizi/competenze; breve metodo; CTA contatti. Il vecchio slideshow diventa un'esperienza editoriale curata. Evita caroselli automatici non controllabili e le solite card da template.
2. **Studio**: storia e profilo di Lorenzo Bolelli, eventuale ritratto originale, valori/metodo, ambiti di lavoro e competenze. Anno di fondazione 1995 e altri dati biografici soltanto se confermati nel materiale approvato.
3. **Progetti**: archivio filtrabile e ricercabile (se utile) e pagine singole con slug semantici, categoria, titolo, descrizione, località generica o specifica se autorizzata, anno se verificato, ruolo dello studio se documentato, tipologia e gallery accessibile. Categorie: nuove costruzioni, ristrutturazioni, strutture, piani urbanistici. Data model per aggiungere progetti senza modificare componenti.
4. **Servizi**: studi di fattibilità, progettazione architettonica, progettazione strutturale, gestione di progetti integrati, project management, collaudi e consulenza tecnico-amministrativa. Sezione dedicata alla ricostruzione/assistenza post-sisma 2012 come esperienza storica, senza presentare pratiche/benefici scaduti come attuali. Verificare disponibilità attuale dei servizi.
5. **Clienti e collaborazioni**: impaginazione dei loghi autorizzati con alternative testuali. Non affermare collaborazioni non confermate.
6. **Rassegna stampa**: articoli o menzioni con autore/fonte/data/link e breve sintesi originale; non copiare lunghi testi protetti né usare immagini senza autorizzazione. Distingui articoli esterni da progetti realmente seguiti dallo studio.
7. **Contatti**: recapiti reali solo se confermati, informazioni chiare, CTA `mailto` funzionante, eventuale form server-side **solo se realmente inviabile e protetto**; mappa tramite link esterno prima di caricare iframe con tracking non valutato. Privacy e stati di errore onesti.
8. **Sito globale**: header, mega-menu/dropdown progetti accessibile, footer completo, 404 curato, pagine legali con placeholders espliciti non indicizzati fino alla revisione, metadata, OG, sitemap, robots, SEO locale Bologna, breadcrumb e link interni.

## Direzione grafica obbligatoria
- Editorial / Swiss-modernist / studio tecnico creativo. Minimalismo rigoroso, non asettico; geometrie, griglie, forte fotografia architettonica e microinterazioni utili.
- Palette iniziale da token: avorio caldo `#F7F6F2`, nero inchiostro `#191C1D`, grigio `#667073`, linea `#D8DAD7`, accento terra `#946A55` (da testare WCAG e rifinire, non usare indiscriminatamente). Rispetto del logo originale LO/BO monocromatico: prima cercarlo negli asset, mai ricreare un logo inesatto se il file è disponibile.
- Titoli generosi, corpo leggibile, composizione asymmetrical controllata, sezioni contrastate con misura, display di immagini a proporzioni reali, hover raffinati, transizioni non distraenti, reduced motion.
- Distinzione forte tra desktop (ampio portfolio) e mobile (navigazione e immagini fluide), con breakpoint verificati a 360, 390, 768, 1024, 1440 e 1920px.
- Ispirazione qualitativa da portfolio contemporanei di architettura/ingegneria, **senza clonare** siti o copiare asset altrui.
- Scegli una coppia di font open-source, documentandola, senza caricamenti da terzi durante le visite se evitabile.

## Architettura e qualità
- Next.js App Router, TypeScript strict, Tailwind, componenti accessibili e componibili, server-first, asset ottimizzati via next/image. Dipendenze aggiornate e compatibili dopo verifica, lockfile presente.
- Contenuti `content/projects` e `content/services` (JSON/MDX/TS tipizzati con schema Zod o equivalente), separati dai componenti e con possibilità di migrazione futura a headless CMS. Implementa dati dimostrativi solo se chiaramente etichettati `demo` e non pubblicati come lavori reali.
- Evita DB nella prima release. Non creare architettura microservizi, autenticazione o dashboard amministrativa non richieste. Documenta un percorso CMS/database futuro in `docs/architecture.md`.
- Contatti: preferisci `mailto` finché SMTP/provider transazionale, criteri anti-spam, policy privacy e gestione dati non sono definiti. Se implementi il form, valida sul server, proteggi dalle submission automatiche, configura variabili ambiente con `.env.example`, testa invio reale in un ambiente configurato e fail closed in produzione.
- Tecniche: lazy loading dove opportuno, SEO SSR/SSG, metadati, font optimization, image optimization, sitemap, robots, JSON-LD solo con dati verificati; no librerie pesanti per effetti minimi.
- Unit/component test con Vitest, smoke E2E con Playwright, lint, typecheck, build, a11y audit e test funzionamento mobile. Non dichiarare “tests passed” senza eseguire i comandi.
- Documentazione completa e riproducibile: README, setup Windows PowerShell, variabili ambiente, architettura, design tokens, modello dati, migrazione Weebly, assets, workflow Git, go-live/security/legal checklist, decisioni e backlog con motivazioni.
- Per privacy/cookie: preferisci la soluzione senza tracker e senza embed, privacy informativa comunque da finalizzare; verifica norme con professionista prima di andare online. Per accessibilità punta a WCAG 2.2 AA e non dichiarare certificazioni automatiche.

## Git workflow — obbligatorio
1. Ispeziona `git status`, `.git`, branch, remote e file esistenti. Non inghiottire modifiche non tue.
2. Se non è una repo, inizializzala in `main`, aggiungi `.gitignore` e bootstrap dei documenti. Crea un primo commit: `chore(repo): initialize LoboStudio project`.
3. Implementa in branch brevi e coerenti, esempio (adatta all'ordine necessario):
   - `feat/app-foundation` → `chore(app): scaffold Next.js TypeScript project`; `feat(layout): add global shell and routing`.
   - `feat/design-system` → `feat(ui): introduce LOBO tokens and typography`; `feat(ui): build accessible navigation`.
   - `feat/portfolio` → `feat(portfolio): add typed content schema`; `feat(portfolio): implement filters and project pages`.
   - `feat/studio-services` → contenuti e layout istituzionali.
   - `feat/contact-seo` → contatti, metadata, sitemap e route legali.
   - `test/quality-gates` o `chore/ci-pipeline` → test e CI.
4. Ogni commit deve essere atomico, con file correlati e messaggio Conventional Commits (`feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `perf`, `ci`). Prima di ogni commit `git diff --check`, test pertinenti e `git status`.
5. Prima di proporre merge: lint + typecheck + unit test + build + smoke E2E. Compila PR template con scope, screenshot prima/dopo, checklist, rischio/rollback. Se non disponi di GitHub remoto, prepara branch/commits locali e istruzioni per PR.
6. Non pushare, non creare PR remota, non fare merge, non impostare dominio e non pubblicare senza mia autorizzazione esplicita. Non fare force push/reset distruttivi.
7. Se ti chiedo di continuare da un branch o da codice esistente, non ripartire da zero e non annullare lavoro preesistente.

## Fasi operative: non fermarti al solo planning
**Fase A — audit**: rileva root, file, asset, logo, stato Git, strumenti disponibili; prepara `docs/audit.md`, inventario asset e un breve backlog con priorità. Dove mancano dati, usa fallback sicuri; non rimanere bloccato per dettagli editoriali.

**Fase B — struttura**: imposta Next.js, TS, routing, layout, design system e componenti base; avvio locale e primo controllo visivo.

**Fase C — contenuti funzionali**: realizza realmente home, studio, portfolio filtrabile, scheda progetto, servizi, clienti, rassegna, contatti, fallback 404 e informativa privacy provvisoria contrassegnata come non approvata. Usa solo dati disponibili/validati; ove assenti, generazione di contenuti demo chiaramente riconoscibili e **non presentati come portfolio reale**.

**Fase D — QA**: responsive, keyboard, contrast, media performance, metadata/SEO, test, validazione contenuti, error handling, test immagini mancanti, assenza di riferimenti a Weebly.

**Fase E — consegna locale**: README con `npm install`, `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build`, `npm run test:e2e` quando configurati; CI GitHub pronta. Mostra elenco commit per branch, test eseguiti e cosa manca solo per il go-live.

## Output finale che mi devi restituire
- Screenshot o descrizione delle pagine implementate verificabili aprendo il sito locale; se hai strumenti browser, esegui screenshot reali, non dichiararli se non li hai fatti.
- Albero delle cartelle reale.
- Comandi precisi per avvio su Windows e Docker solo se creato.
- Stato Git: branch attuale, cronologia commit, modifiche non committate e istruzioni di merge.
- Tabella stato feature (completa / incompleta / bloccata), test realmente passati e obblighi prima della pubblicazione.
- Report di eventuali informazioni che richiedono conferma del professionista (identità legale, foto, loghi, informazioni su progetti, contatti, privacy, dominio).

**Non limitarti a scrivere un bel README o un mockup: realizza l'applicazione navigabile e verificabile, con qualità professionale.**
