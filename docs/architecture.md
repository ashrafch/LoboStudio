# Architettura proposta — ADR iniziale

## Decisione
**Next.js App Router + TypeScript strict + Tailwind + content store versionato**, con backend minimo nel medesimo progetto. Motivazione: SEO, velocità, facile deploy, controllo del codice e assenza di requisiti di gestione dati strutturati.

## Albero obiettivo (adattare allo scaffold effettivo)
```
LoboStudio/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ studio/page.tsx
│  ├─ servizi/page.tsx
│  ├─ progetti/page.tsx
│  ├─ progetti/[slug]/page.tsx
│  ├─ progetti/categoria/[slug]/page.tsx
│  ├─ clienti/page.tsx
│  ├─ rassegna-stampa/page.tsx
│  ├─ competenze/sisma-emilia-2012/page.tsx
│  ├─ contatti/page.tsx
│  ├─ privacy/page.tsx
│  ├─ note-legali/page.tsx
│  ├─ sitemap.ts
│  ├─ robots.ts
│  └─ not-found.tsx
├─ components/
│  ├─ layout/
│  ├─ ui/
│  ├─ portfolio/
│  └─ sections/
├─ content/
│  ├─ projects/
│  ├─ services/
│  └─ press/
├─ lib/
│  ├─ content/
│  ├─ seo/
│  └─ validation/
├─ public/
│  ├─ brand/
│  └─ media/                # DERIVATI WEB, non originali
├─ asset/                    # Originali consegnati: salvaguardare
├─ tests/
│  ├─ unit/
│  └─ e2e/
├─ docs/
├─ .agents/skills/
├─ .github/workflows/
├─ AGENTS.md
├─ .env.example
└─ README.md
```

## Modello di contenuto `Project`
- `id`, `slug`, `title`, `category`, `summary`, `description`, `hero`, `gallery[]`, `featured`, `sortOrder`, `publicationStatus` (`draft`, `review`, `published`).
- Facoltativi (solo se documentati): `year`, `location`, `client`, `role`, `services[]`, `scope`, `materials`, `pressRefs[]`.
- `hero` e gallery: path locale, width, height, `alt`, credits/rights, eventuale focal point. Slug unici e deterministici.
- Pubblicare nei percorsi pubblici esclusivamente record con `publicationStatus: published`. In dev, possibile vista preview chiaramente marcata.
- I file mancanti non devono causare crash; test sulla validazione contenuti e link interni.

## Backend/form contatti
- Di default contatto email diretto + telefono funzionanti e mappa via link esterno.
- Quando approvati provider e informativa: `POST /api/contact` (Node runtime) con Zod, max size, anti-abuso robusto, invio con segreti non esposti, dati essenziali, nessuna memorizzazione non necessaria.
- Non affidare rate limit a sola memoria del processo in serverless. Scegli servizio duraturo/infrastruttura appropriata e documenta gli accessi.
- Produzione senza credenziali: form disabilitato oppure messaggio esplicito di indisponibilità; mai successo fittizio.

## Evoluzione futura
Quando il proprietario richiederà la gestione autonoma dei contenuti, valutare headless CMS (es. Sanity, Directus, Payload) con requisiti: autenticazione, ruoli, backup, versionamento, costi, hosting, storage e tracciamento. Un DB non è giustificato solo per visualizzare una ventina di schede.

## Docker e hosting
- Docker Compose avvia `preview` per la revisione locale e `web` per la prova di produzione. Porte, comandi e configurazione sono nel [README](../README.md#avvio-con-docker).
- Il Dockerfile condivide le dipendenze tra gli stadi di build. Lo stadio finale esegue il server standalone con utente non privilegiato e controllo di salute HTTP. Gli originali entrano solo nel container di anteprima tramite mount in lettura.
- Deploy: GitHub -> preview per PR (se abilitato/approvato) -> produzione da `main`. Nessuna modifica DNS finché redirect, SSL, policy, contenuti e rollback non sono validati.

## Route legacy
Mantenere registro `docs/redirects.csv` delle vecchie URL raccolte dal sito pubblico o export autorizzato, con destinazione e 301. Non inventare path Weebly.

## Riscontro dell’implementazione

La struttura corrente è nel README. Il server Next gestisce le pagine e l’archivio GET. La route `/anteprima-media/[name]` legge i derivati per la revisione locale e restituisce 404 in produzione. Il processo di pubblicazione usa immagini approvate in `public/media/`. Il contatto passa dal client di posta.
