# Stato corrente

## 25 novembre 2026 · Struttura del repository

- I Compose delle anteprime riservate sono in `docker/` accanto ai gateway, mentre l’avvio standard e la CI usano il Compose alla root. Il brief iniziale è consultabile in `docs/history/`. Contesti di build, mount, porte e identificativi dei progetti Compose verificati.
- Skill, configurazioni MCP e media originali restano sul computer. Le istruzioni condivise sono in `AGENTS.md` e `docs/`. La copia storica `asset/` continua a servire alle anteprime convenzionali già attive. [Guida alle skill](skills-installation.md) · [Archivio media](asset-workflow.md)

## 25 novembre 2026 · Archivio media unificato

- `assets/` è l’archivio operativo. Copiati 73 file da `asset/` con SHA-256 identico. I due download parziali `.crdownload` del vecchio inventario erano già assenti. Il manifest aggiorna percorsi, duplicati e materiali presenti. Il video di riferimento della hero è in `assets/3d-building/reference/`.
- Le nuove configurazioni Compose e gli script di preparazione leggono `assets/`. Confermati typecheck, 8 test unitari, build standalone e validazione dei tre Compose. In una preview isolata i 56 WebP e i campioni dei due video HTTP 206 sono identici a quelli della preview corrente. Lo standalone isolato serve lo snapshot e risponde 404 al percorso diretto dell’archivio. Le istanze locali 3080–3083 rispondono ancora 200.
- La cartella `asset/` rimane disponibile per i container avviati con la configurazione storica e per il rollback. [Struttura e procedura](asset-workflow.md)

## 25 novembre 2026 · Hero 3D Fase 0

- Verificati frontend, hero fotografica e animazioni scroll esistenti. Sei skill disponibili. Il server Motion ha restituito documentazione sullo scroll. Verificata da PowerShell la CLI Blender 5.3.0 con gli operatori FBX e glTF. FFmpeg, FFprobe e la CLI glTF non sono stati individuati in locale.
- La simulazione npm con Three 0.187.0 e Fiber 9.8.2 riesce con React 19.3.1 e Motion 14.14.0. Anche Drei 10.7.9 risolve i peer, con una seconda copia di Three 0.170.0 come dipendenza di `stats-gl`. La prima demo partirà da Fiber e dal loader Three. Il test a runtime resta da fare sul modello reale.
- Predisposto il workspace `assets/3d-building/`, con marker versionati e asset esclusi da Git e dal contesto Docker del sito. Rilevate le porte Docker 3080–3083 in uso. Demo futura su progetto separato e loopback. In attesa dello ZIP Vectorworks e della validazione del primo derivato. [Piano di produzione](3d-hero/PRODUCTION_PLAN.md)
- Verificati con `git check-ignore` i percorsi di ZIP, FBX, texture, video, Blender e GLB. Le tre configurazioni Compose correnti passano `config --quiet`. Otto test unitari superati.

## 24 novembre 2026 · recupero contesto

- Branch di partenza `feat/client-cms-preview` a `704ef69`. Lavoro ripreso su `fix/visual-experience-3-preview`. Alla ripresa erano già staged 102 aggiunte di configurazione MCP e skill locali. Il codice applicativo corrispondeva a `HEAD`.
- Visual Experience 3.0 è presente nel codice, con Showcase (`98be189`), roadmap (`f9cd3a5`), anteprima fotografica (`b8f1464`) e test (`3c0b70c`). Il report documenta il riassestamento iniziale dei font su Studio. [Report](visual-experience-3.md)
- Docker Desktop in modalità Linux. `preview` su 3080, `web` su 3081 e la copia editor su 3083 operativi. I container del viewer su 3082 risultavano fermi. Entrambi i tunnel Cloudflare risultavano fermi. `cloudflared` 2026.11.1 supporta `--allowed-mail`.
- Chromium ha riprodotto il difetto di Studio sulla copia editor con un ritardo di un secondo sui WOFF2. In una prima rilevazione, CLS da 0,0011 a 0,0636 su sei larghezze tra 360 e 1920 px. I risultati storici per l’intera suite sono nei report precedenti.
- Il titolare della richiesta ha confermato il riuso dell’indirizzo già autorizzato per l’editor anche per la preview di consultazione. Conservare indirizzo e URL temporaneo nello stato operativo locale.

## 24 novembre 2026 · Visual Experience 3.0

- Metriche dei font di riserva adeguate a Manrope e DM Sans. Il riquadro fotografico mantiene il posizionamento richiesto da Next Image anche quando è nascosto. [Report](visual-experience-3.md)
- La prova a 768 px ha riprodotto due volte CLS 0,0395 sulla build precedente. Sul gateway della nuova preview, con un secondo di ritardo sui WOFF2, il valore è 0,0170. A 360, 375, 390, 768, 1024, 1440 e 1920 px entrambe le famiglie hanno caricato e il documento rientra nel viewport.
- Playwright Chromium ha superato 15/15 prove sul gateway Docker e 7/7 prove applicabili con la build locale di produzione. Otto prove dipendono dai contenuti o dai componenti disponibili in anteprima.
- Build, typecheck, 8 test unitari e audit npm delle dipendenze di produzione passati. ESLint ha riportato un avviso preesistente nella skill Unslop.

## 24 novembre 2026 · Cloudflare Client Preview

- Gateway `127.0.0.1:3082` e servizio `studio` del progetto `lobostudio-client` avviati con il codice applicativo `09084f3`. L’app è su rete interna, con due mount dei soli media in lettura e senza configurazione o volume CMS.
- Sul gateway hanno risposto 57 schede, 4 categorie, 56 WebP e 2 video con Range HTTP `206`. Admin, CMS, API e sviluppo hanno risposto `404` alle richieste di lettura provate. Il gateway ha rifiutato le POST con `405` e applicato `noindex` e `no-store`.
- Quick Tunnel Viewer attivo al termine del collaudo. Il sito e i percorsi di prova su HTTPS rispondono con redirect `302` all’autenticazione. Chromium in sessione nuova mostra il modulo email Cloudflare. Il collaudo dopo il codice monouso è in attesa della casella autorizzata.
- Lo script rifiuta di restituire l’URL di un tunnel attivo se gli viene passato un altro indirizzo. URL e identità autorizzata sono nel registro locale `%LOCALAPPDATA%\LoboStudio\client-preview\tunnel.json`. Consulta [la guida operativa](client-preview.md) per stato e revoca.

## 24 novembre 2026 · copia con editor

- Quick Tunnel Editor attivato per lo stesso indirizzo autorizzato del Viewer. I due tunnel risultano operativi. Il gateway editor sulla 3083 riusa il volume esistente `lobostudio-editor_cms-data`, distinto da quello del CMS locale.
- Dall’esterno, Home, `/admin`, archivio e media richiedono l’autenticazione Cloudflare via HTTPS. Il modulo email è visibile in Chromium da una nuova sessione. Sul gateway locale sono verificati il collegamento **Area riservata**, il login con la password dedicata, il cookie `Secure`, `HttpOnly` e `SameSite=Strict`, le sezioni Progetti e Libreria media e il logout.
- Resta la prima prova del destinatario con codice email, password CMS e una modifica di esempio. URL temporaneo e credenziale dedicata sono nello stato operativo locale `%LOCALAPPDATA%\LoboStudio\editor-preview`. [Procedura](client-preview.md#copia-di-prova-con-editor)

## 24 novembre 2026 · preparazione della pubblicazione

- Guida GitHub Actions, GHCR, VPS e Cloudflare con procedura di rilascio per digest e archivio persistente. La configurazione proposta usa SQLite anche per i media iniziali. L’integrazione dei media su R2 precede l’importazione massiva.
- Esempi verificati localmente per sintassi e per configurazione Compose dei due ambienti. Provati snapshot SQLite in WAL, ripristino di dati sintetici e rifiuto di un’importazione invalida o su un database esistente. Il job GHCR e l’installazione sul VPS restano da predisporre. [Guida GitHub e VPS](production-publishing.md)

## 24 novembre 2026 · credito del sito

- Il footer include «Realizzazione web · Ashraf Chouikh». Verificati la resa e il contrasto a sei larghezze tra 360 e 1920 px nella preview locale sulla 3080. Build e typecheck superati. Otto unit test e sette prove Playwright di produzione superati.
