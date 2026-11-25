# LoboStudio

Portfolio istituzionale in italiano. La home presenta una selezione fotografica a scorrimento manuale. L’archivio offre categorie con URL propri, ricerca testuale, schede individuali e gallerie espandibili. Le pagine istituzionali coprono studio, servizi, sisma Emilia 2012, clienti, rassegna e contatti.

## Avvio con Docker

Le istruzioni per l’accesso al pannello, l’importazione dei progetti e la configurazione sul sito pubblico sono nella [guida di gestione contenuti](docs/cms.md).

Dalla cartella del repository, con Docker Desktop in modalità container Linux o Docker Engine con Compose, avvia entrambe le versioni del sito.

```sh
docker compose --profile production up -d --build --wait
```

| Servizio | Indirizzo locale | Contenuti |
|---|---|---|
| `preview` | [Apri l’anteprima](http://127.0.0.1:3080) | Progetti in revisione e fotografie derivate dall’archivio privato `assets/`. |
| `web` | [Apri la build di produzione](http://127.0.0.1:3081) | Sito Next.js standalone con le sole schede approvate per il pubblico. |

I due servizi ascoltano sul tuo computer. Per vedere le fotografie dopo un nuovo clone, ripristina la copia autorizzata di `assets/` seguendo i percorsi nel [manifest](docs/asset-manifest.csv), quindi avvia `preview`. Il codice dell’anteprima viene copiato nell’immagine Docker. Dopo una modifica ai testi, aggiorna solo l’anteprima con `docker compose up -d --build --wait preview`, quindi ricarica la pagina nel browser.

Per controllare stato e log o fermare il progetto:

```sh
docker compose --profile production ps
docker compose logs --tail=50 preview web
docker compose --profile production down
```

## Avvio con Node.js su Windows

Con Node.js 24 LTS e npm, da PowerShell:

```powershell
Set-Location -LiteralPath 'C:\Users\ashra\$HOME\Dev\LoboStudio'
npm ci
npm run media:preview
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run dev
```

Apri [http://127.0.0.1:3000](http://127.0.0.1:3000). La preparazione media legge `assets/projects/`, `assets/studio/` e `assets/archive/`, aggiorna il manifest e crea WebP derivati in `.local-media/`. La modalità locale è attiva soltanto con il server di sviluppo e `LOBO_LOCAL_PREVIEW=1`. Da un checkout senza originali lo script media si può saltare e il sito è navigabile con gli stati vuoti o i fallback. I recapiti riportati nell’anteprima provengono dalle schermate e sono in verifica. Il link email apre il programma di posta.

## Verifica

```powershell
npm run lint
npm run typecheck
npm run test:unit
npm run build
npx playwright install chromium
npm run test:e2e
$env:LOBO_E2E_PREVIEW = '1'
npm run test:e2e
Remove-Item Env:LOBO_E2E_PREVIEW
npm audit --omit=dev
```

Per la seconda suite, genera prima i media e arresta altri processi `next dev` avviati nella stessa checkout. Playwright avvia il server di test sulla porta 3217. La suite di produzione verifica anche che schede e media in revisione restituiscano 404. Gli screenshot desktop e mobile finiscono in `test-results/preview/` quando si esegue la suite locale. La pipeline GitHub Actions usa la build di produzione.

## Struttura

```text
app/                 Pagine, metadati, robots, sitemap e media locali
components/          Navigazione, archivio, galleria, immagini e layout
content/             Progetti Zod, attività, rassegna e configurazione
scripts/             Preparazione delle anteprime, media e setup CMS
tests/               Vitest, Testing Library, Playwright e axe
docs/                Specifiche, inventari, decisioni e stato pubblicazione
.github/             CI, Dependabot e modello di PR
Dockerfile            Immagini Linux per anteprima e produzione
compose.yaml          Servizi, porte locali e controlli di salute
docker/              Compose delle anteprime riservate e gateway Nginx
assets/              Archivio privato e workspace 3D
.local-media/        Derivati locali ignorati da Git
_archive/            Copie locali del kit di partenza
```

Le estensioni e le istruzioni per gli agenti installate sul computer si trovano nelle directory locali descritte nella [guida alle skill](docs/skills-installation.md). La guida condivisa del progetto è `AGENTS.md`.

## Contenuti e pubblicazione

Il progetto usa Next.js App Router, TypeScript strict e Tailwind CSS. Next gestisce rendering, ricerca e CMS. Il sito combina i contenuti versionati con le pubblicazioni del CMS. SQLite conserva bozze, pubblicazioni, cronologia e immagini caricate. I contatti usano link a email e telefono. [Guida CMS](docs/cms.md)

Per pubblicare un progetto occorrono una scheda approvata e il credito per ogni immagine. I progetti versionati usano lo stato `published` e i derivati in `public/media/`. Nel CMS si salva la bozza, si controlla l’anteprima e si pubblica la versione salvata. Impostare `SITE_URL` all’origine HTTPS definitiva per gli URL canonici e abilitare `LOBO_INDEXING=1` dopo la revisione. La demo remota richiede un accesso nominativo. [Anteprima riservata](docs/client-preview.md)

Per un hosting che esegue immagini OCI, costruire il target `production` del Dockerfile. Passare `SITE_URL` e `LOBO_INDEXING` sia in build sia a runtime, usare la porta interna 3000 dietro HTTPS e conservare tag e digest della release per il rollback. In Compose le due variabili vengono lette dall’ambiente della shell o dal file indicato con `--env-file`. Per il CMS, collegare `web` al volume persistente e seguire la guida per l’origine HTTPS, le credenziali e i backup. Un rilascio del codice riusa il volume corrente. [Installazione CMS](docs/cms.md#installazione-sul-sito-pubblico)

Guide operative e riferimenti di progetto sono raccolti nell’[indice della documentazione](docs/README.md).
