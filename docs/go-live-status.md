# Stato di pubblicazione

**MVP locale in revisione. Pubblicazione da approvare.**

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

Riferimenti per la revisione dell’informativa e delle tecnologie di navigazione. [Articolo 13 GDPR, EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj/?locale=it) · [FAQ Cookie, Garante](https://www.garanteprivacy.it/faq/Cookie) · [WCAG 2.2, W3C](https://www.w3.org/TR/WCAG22/)

## Evidenze del 20 novembre 2026

- ESLint e TypeScript passati.
- Vitest e Testing Library: 4 test passati.
- Build Next.js di produzione passata.
- Playwright Chromium: 6 test in anteprima, 4 in produzione. I 2 casi specifici dell’anteprima sono omessi dalla suite di produzione.
- Axe sulla home desktop: zero violazioni nei criteri A e AA testati. La prova di layout ha coperto sei larghezze, con screenshot a 390 e 1440 px.
- npm audit: zero vulnerabilità riportate.
- CI predisposta nel repository. L’esecuzione remota dipende dal futuro push.
