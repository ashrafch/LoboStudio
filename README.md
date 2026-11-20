# LoboStudio

Portfolio istituzionale in italiano. La home presenta una selezione fotografica a scorrimento manuale. L’archivio offre categorie con URL propri, ricerca testuale, schede individuali e gallerie espandibili. Le pagine istituzionali coprono studio, servizi, sisma Emilia 2012, clienti, rassegna e contatti.

## Avvio su Windows

Con Node.js 24 LTS e npm, da PowerShell:

```powershell
Set-Location -LiteralPath 'C:\Users\ashra\$HOME\Dev\LoboStudio'
npm ci
npm run media:preview
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run dev
```

Apri [http://127.0.0.1:3000](http://127.0.0.1:3000). La preparazione media legge gli originali da `asset/`, aggiorna il manifest e crea WebP derivati in `.local-media/`. La modalità locale è attiva soltanto con il server di sviluppo e `LOBO_LOCAL_PREVIEW=1`. Da un checkout senza originali lo script media si può saltare e il sito è navigabile con gli stati vuoti o i fallback. I recapiti riportati nell’anteprima provengono dalle schermate e sono in verifica. Il link email apre il programma di posta.

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
scripts/             Derivazione WebP e manifest SHA-256
tests/               Vitest, Testing Library, Playwright e axe
docs/                Specifiche, inventari, decisioni e stato pubblicazione
.github/             CI, Dependabot e modello di PR
asset/               Originali di proprietà dello studio
.local-media/        Derivati locali ignorati da Git
```

## Contenuti e pubblicazione

Il progetto usa Next.js App Router, TypeScript strict e Tailwind CSS. L’archivio legge contenuti versionati. Il processo Next gestisce rendering e ricerca. Database, CMS e modulo di contatto restano fuori dal perimetro di questa release. Per sviluppo e build basta Node.js.

Per pubblicare un progetto occorrono scheda approvata, credito per ogni immagine e derivati in `public/media/`. Lo stato `published` li abilita nella build. Impostare `SITE_URL` all’origine HTTPS definitiva prima di generare URL canonici. Abilitare `LOBO_INDEXING=1` solo dopo la revisione. Per l’anteprima remota usare il controllo accessi dell’hosting. Le direttive per i motori di ricerca non proteggono l’accesso.

Vedi [stato go-live](docs/go-live-status.md), [architettura](docs/architecture.md) e [workflow Git](docs/git-workflow.md).
