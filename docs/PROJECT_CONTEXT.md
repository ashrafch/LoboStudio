# Contesto di LoboStudio

LoboStudio è il portfolio istituzionale in italiano di uno studio di ingegneria di Bologna. `assets/` raccoglie gli originali, i contenuti storici di Weebly e i materiali di lavoro. Il go-live richiede la conferma del titolare su materiali, recapiti, dati professionali e privacy.

## Architettura effettiva

- Next.js 16.4.6 App Router, React 19.3.1, TypeScript 5.9.3 strict, Tailwind 4.3.5, Motion 14.14.0 dal lockfile. Il Dockerfile usa Node 24. Vitest, Testing Library, Playwright Chromium e axe coprono regressioni. GitHub Actions costruisce e verifica l’immagine standalone.
- Home, Studio, Servizi, Progetti, Clienti, Rassegna, Contatti e pagine legali vivono in `app/`. Il portfolio offre ricerca GET, categorie con URL propri, schede e gallerie. `content/projects/` contiene catalogo e stati editoriali. La preview di consultazione seleziona anche le 57 schede storiche in revisione.
- Il CMS Next.js usa SQLite. Il codice contiene contenuti iniziali e metadati. Il database conserva pubblicazioni, bozze, cronologia, copie, sessioni e WebP caricati. `content/cms/public.ts` unisce le pubblicazioni CMS con il catalogo versionato. Le immagini CMS seguono le regole di visibilità di `/media/cms/[id]`.
- Il design è editoriale e fotografico, con Manrope e DM Sans serviti localmente. Motion governa microinterazioni, gallerie e scroll. Le integrazioni Kokonut presenti sono Momentum Rail, Topo Background e Scroll Index. Il dialog fotografico è un componente locale. `components.json` configura il registry Kokonut. Skill e configurazioni MCP degli agenti restano locali. [Guida alle skill](skills-installation.md)

La futura hero 3D verrà valutata prima in una demo locale isolata. Gli asset di lavorazione restano in `assets/3d-building/` e la hero fotografica rimane il riferimento e il fallback per un’eventuale integrazione. [Piano hero 3D](3d-hero/PRODUCTION_PLAN.md)

## Ambienti e perimetro

`compose.yaml` resta alla root per l’avvio locale e la CI. `docker/` raggruppa i Compose di consultazione e redazione con le configurazioni dei gateway Nginx.

| Ambiente | Origine locale | Dati |
|---|---|---|
| Sviluppo Docker `preview` | `127.0.0.1:3080` | Volume CMS locale e originali in sola lettura per generare derivati. |
| Docker `web` | `127.0.0.1:3081` | Standalone locale con il volume CMS condiviso e archivio pubblico. |
| `lobostudio-client` | `127.0.0.1:3082` | Standalone isolato senza volume CMS. Gateway in sola consultazione, derivati e due video in sola lettura. |
| `lobostudio-editor` | `127.0.0.1:3083` | Copia di prova con credenziale, gateway e volume distinti. |

La preview di consultazione usa un Quick Tunnel Cloudflare con accesso nominativo tramite codice email. L’hosting di produzione rimane da scegliere. La direzione proposta è un VPS europeo con Docker, SQLite persistente e storage oggetti separato per l’archivio media. Va validata prima di una migrazione. Il digest dell’immagine identifica il codice distribuito. Per riprodurre i contenuti servono uno snapshot coerente del database e i media collegati. Il rilascio del codice riusa i dati di produzione in sede.

[Design](design-system.md) · [CMS](cms.md) · [Preview](client-preview.md) · [Go-live](go-live-status.md) · [Workflow operativo](../AGENTS.md#interventi-dopo-la-pubblicazione)
