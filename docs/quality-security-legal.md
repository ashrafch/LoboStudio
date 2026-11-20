# Qualità, sicurezza, privacy e go-live — checklist

> Documento tecnico di preparazione. Non è parere legale né attestazione di conformità. Validare con il titolare dello studio e consulente privacy/legale prima della pubblicazione.

## Security-by-design
- [ ] Dipendenze stabili/compatibili, lockfile, `npm audit` revisionato, Dependabot attivo dopo creazione repo.
- [ ] Nessun segreto/versione credenziale in Git; `.env.example` solo nomi; rotazione e storage secrets del provider.
- [ ] HTTPS forzato, dominio canonico, headers HTTP ragionati (X-Content-Type-Options, Referrer-Policy, CSP testata e compatibile, HSTS solo quando infrastruttura pronta).
- [ ] Validazione input client + server, limiti payload, output encoding, gestione errori senza stacktrace pubblico.
- [ ] Server side form anti-spam: honeypot, rate limiter condiviso/persistente, eventuale challenge privacy-reviewed, nessun email header injection.
- [ ] No PII in analytics, error logging, screenshot, URL/query string.
- [ ] Form che fallisce in modo chiaro quando provider non configurato; niente messaggi di successo finti.
- [ ] Admin, CMS, DB, auth NON pubblicati se non servono.
- [ ] Scansioni e controlli PR/branch configurati e realmente attivi; backup e rollback documentati.
- [ ] `robots.txt` e noindex per preview/draft; non confondere `robots` con controllo accessi.

## Privacy & cookie (Italia / GDPR)
- [ ] Identificare titolare, contatti, finalità, basi giuridiche, categorie dati, destinatari, fornitori/sub-responsabili, retention, trasferimenti, diritti e canali d'esercizio.
- [ ] Se il sito ha solo cookie tecnici e non usa tracker non necessari, in generale non occorre un banner di consenso preventivo; informativa sulle tecnologie comunque appropriata. Evitare banner fittizi per default.
- [ ] Inventario reale cookie/SDK, font, mappe, video, CDN, analytics, widget. Non caricare tracker non tecnici prima del consenso, se richiesto.
- [ ] Se si aggiungono tracker che richiedono consenso, gestire rifiuto equivalente, revoca/nuova scelta e blocco preventivo; verificare soluzione con Garante.
- [ ] Nel form informativa breve con link privacy e checkbox appropriata per presa visione se scelta; non imporre consenso marketing per semplice risposta a richiesta. Gestire eventuale mailing list in flusso separato.
- [ ] Conservazione e accesso a email di contatto documentati; non usare contenuti di richieste per addestramento o analytics senza base giuridica.
- [ ] Trasferimenti extra UE/catena dei provider valutati prima del go-live.

Fonti: https://www.garanteprivacy.it/faq/cookie ; https://eur-lex.europa.eu/eli/reg/2016/679/oj

## Accessibilità
- [ ] Progettazione/test su WCAG 2.2 AA come benchmark: focus, keyboard, contrasti, target, semantic HTML, etichette, error states, alt, reduced motion.
- [ ] Test automatizzati axe/Lighthouse + manuali con tastiera e screen reader; nessun badge di certificazione automatico.
- [ ] Verificare se e quali obblighi specifici italiani si applichino allo studio; la disciplina su siti/app e il D.Lgs 82/2022 hanno perimetri diversi, non dare per scontato obbligo di dichiarazione AgID per un piccolo sito vetrina.

Fonti: https://www.agid.gov.it/it/design-servizi/accessibilita/linee-guida-accessibilita-privati ; https://www.agid.gov.it/it/ambiti-intervento/accessibilita-usabilita ; https://www.w3.org/TR/WCAG22/

## Materiali, copyright e claims
- [ ] Logo LOBO: titolarità e file autorizzato.
- [ ] Foto e render: diritti del fotografo, clienti, architetti/collaboratori, autorizzazione dove necessaria; verificare dati personali visibili.
- [ ] Loghi clienti: permesso e rapporto professionale comprovato.
- [ ] Rassegna stampa: fonte, autore, link, breve sintesi originale; niente riproduzioni integrali non autorizzate.
- [ ] Schede progetto: ruolo reale dello studio, fase progettuale vs realizzato, approvazione informazioni sensibili.
- [ ] Sisma 2012: distinguere attività storica da consulenza vigente; non pubblicare procedure normative non aggiornate.
- [ ] Nome legale, sede, P.IVA, PEC/albo/ordine professionale quando pertinenti e confermati; verificare requisiti obbligatori del professionista prima del go-live.

## SEO / migrazione Weebly
- [ ] Controllo dominio e DNS, export/backup sito Weebly e percorso rollback prima di disattivarlo.
- [ ] Mappatura link legacy in `docs/redirects.csv`, redirect permanenti 301 verso nuove pagine pertinenti.
- [ ] Sitemap, canonical, robots, metadata social, favicon/logo, URL leggibili e descrizioni distinte.
- [ ] Structured data con soli attributi verificati; no finte recensioni/valutazioni.
- [ ] Search Console sul dominio confermato, test mobile, performance e crawling post go-live.

## UAT e release gate
- [ ] Ogni pagina visitabile senza errori JS.
- [ ] Dropdown, filtri, gallery, 404, responsive, keyboard testati realmente.
- [ ] Il progetto builda da checkout pulito: `npm ci`, lint, typecheck, unit, build; E2E essenziali.
- [ ] Form contatti verificato con messaggio realmente recapitato o esplicitamente disattivato.
- [ ] Contenuti/logo/foto/privacy/contatti firmati dal titolare.
- [ ] Deploy preview revisionato; domain switch con finestra/rollback; dopo pubblicazione smoke test.

## Registro blocchi per pubblicazione
Tenere un `docs/go-live-status.md` con `PASS`, `FAIL`, `PENDING OWNER`, data, evidenza e responsabile per ogni requisito. Non simulare una certificazione o approvazione.
