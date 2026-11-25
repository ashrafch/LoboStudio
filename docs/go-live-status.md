# Stato di pubblicazione

**MVP locale in revisione. Pubblicazione da approvare.**

La demo riservata gira in un progetto Docker dedicato e passa da Cloudflare Access con codice email. La guida riporta il perimetro esposto e le verifiche di accesso, mentre il report Visual Experience 3.0 documenta i test di regressione. [Gestione della demo](client-preview.md) · [Visual Experience 3.0](visual-experience-3.md)

| Verifica | Stato | Evidenza e responsabilità |
|---|---|---|
| Identità, logo e recapiti | PENDING OWNER | Logo JPEG 62 × 96 usato in locale. Richiesta versione sorgente ad alta risoluzione, denominazione, recapiti, P.IVA e dati professionali pertinenti. |
| Portfolio | PENDING OWNER | Nove originali inventariati. Quattro schede provvisorie consultabili in sviluppo. Confermare mapping, titolo, ruoli, località, fase, crediti e diritti d’uso. |
| Ritratto, clienti e stampa | PENDING OWNER | Ritratto e loghi originali da acquisire e autorizzare. Fonte Artribune verificata. Confermare pertinenza allo studio e le altre fonti. |
| Contatti | PENDING OWNER | Email, telefono e indicazioni testabili in anteprima. Confermare i recapiti e le regole di gestione dei messaggi. |
| Privacy e note legali | PENDING OWNER | Bozze marcate noindex. Completare titolare, finalità, basi, destinatari, conservazione, trasferimenti e diritti con i dati effettivi. |
| Tecnologie di navigazione | PASS locale | Font serviti dal sito. Il codice applicativo usa link esterni espliciti e non integra analytics, tracker o iframe. Ripetere verifica con l’hosting definitivo. |
| Sicurezza pubblicazione | PENDING ENGINEER | Header, noindex di default e separazione media verificabili in locale. Verificare HTTPS, dominio, controlli di accesso, log e rollback dopo configurazione hosting. CSP compatibile con script inline del runtime Next. |
| Accessibilità | PENDING ENGINEER | Browser Chromium e axe inclusi nelle suite. Revisione con screen reader e dispositivi reali da completare prima della pubblicazione. |
| Migrazione Weebly | PENDING OWNER | Servono vecchi URL reali e backup. Il registro CSV va compilato prima di attivare i 301. |
| Hosting e DNS | PENDING OWNER | Attendere scelta del dominio, ambiente preview autorizzato e piano di transizione. |
| Pannello amministratore | PENDING HOSTING | Configurare l’origine HTTPS, la credenziale del titolare e la protezione a monte di `/admin`. Verificare il backup e il ripristino del volume prima della pubblicazione. Vedi [guida di gestione](cms.md). |

Guida e copie di ripristino CMS verificate su un database isolato. Il test browser ha pubblicato due versioni, provato l’annullamento prima della conferma, ripristinato una copia e recuperato lo stato precedente. I test unitari coprono cronologia, visibilità delle immagini e rifiuto di modifiche da vecchie schede. [Guida e copie di ripristino](cms.md#guida-e-copie-di-ripristino)

Nella copia di prova con editor sono stati verificati il blocco Cloudflare prima del codice email, il link nel footer, il login CMS tramite gateway locale, il cookie sicuro, il salvataggio e la pubblicazione di una scheda sintetica. La scheda è risultata visibile solo nella copia di prova ed è stata rimossa dopo il collaudo. [Copia di prova con editor](client-preview.md#copia-di-prova-con-editor)

Riferimenti per la revisione dell’informativa e delle tecnologie di navigazione. [Articolo 13 GDPR, EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj/?locale=it) · [FAQ Cookie, Garante](https://www.garanteprivacy.it/faq/Cookie) · [WCAG 2.2, W3C](https://www.w3.org/TR/WCAG22/)

## Evidenze del 24 novembre 2026

Quindici prove Chromium passate nel container della demo di consultazione. Sette prove applicabili passate sulla build di produzione locale. Sul gateway, i percorsi riservati rispondono `404` alle richieste di lettura verificate. Dall’esterno, il link HTTPS richiede il codice email prima di esporre il sito. Resta il collaudo dalla casella autorizzata. [Stato corrente](CURRENT_STATE.md)

## Evidenze del 23 novembre 2026 · Motion

Build Next.js standalone, ESLint, TypeScript e sei test unitari superati. Playwright ha completato sette prove nell’anteprima e quattro nel container con build di produzione. Tre prove richiedono l’archivio fotografico locale. Verificati ingresso della Home, comparsa delle schede durante lo scroll, hover, focus, navigazione touch, chiusura con Escape e variazione di `prefers-reduced-motion` a pagina aperta. Hero e schede sono leggibili anche con JavaScript disabilitato. [Componenti Motion](design-system.md#motion)

### Audit UI e galleria

Le frecce della galleria sono accessibili a 667×320 dopo la correzione locale. Le suite aggiornate hanno superato otto prove in anteprima e quattro nel container con build di produzione. [Report di audit](safe-ui-audit.md)

### Visual Boost 2.0

Momentum Rail, Topo Background e Scroll Index sono verificati nei container locali. Playwright ha completato 11 prove in anteprima e 5 nello standalone. Sono state verificate tutte le 57 schede, le 4 categorie e 43 risorse immagine. Il collaudo di accessibilità su altri browser, screen reader e dispositivi reali resta aperto. [Report e rollback](safe-ui-audit.md#visual-boost-20--23-novembre-2026)

## Evidenze del 20 novembre 2026

### Aggiornamento del 22 novembre · editor visivo

Verifica Chromium su database isolato. La prova ha coperto selezione delle foto, modifiche in tempo reale, ordine dei blocchi, salvataggio privato, pubblicazione, blocco della pubblicazione con modifiche locali e impaginazione finale nella pagina pubblica. Controllate sei larghezze da 360 a 1920 px. Il controllo automatico axe sull’editor della Home ha restituito zero violazioni nei criteri A e AA esaminati.

### Sito pubblico

- ESLint e TypeScript passati.
- Vitest e Testing Library: 4 test passati.
- Build Next.js di produzione passata.
- Playwright Chromium: 6 test in anteprima, 4 in produzione. I 2 casi specifici dell’anteprima sono omessi dalla suite di produzione.
- Axe sulla home desktop: zero violazioni nei criteri A e AA testati. La prova di layout ha coperto sei larghezze, con screenshot a 390 e 1440 px.
- npm audit: zero vulnerabilità riportate.
- Docker Compose su Windows con container Linux: servizi `preview` e `web` healthy. Playwright eseguito sui container con 6 test superati in anteprima e 4 in produzione. L’immagine standalone esegue il server con UID 1000 e non contiene gli originali né il file di ambiente locale.
- GitHub Actions costruisce il target di produzione e avvia Playwright sul container a ogni push o pull request.

## Foto delle attività e accesso studio

Verificati in locale il caricamento delle sette fotografie e la selezione a sei larghezze tra 360 e 1920 px. Su una copia con database isolato sono stati provati l’accesso dal footer, il caricamento dalla libreria, il salvataggio della bozza, la pubblicazione su Home e Servizi, la rimozione e il ripristino della foto iniziale.
