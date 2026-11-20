# LoboStudio — Product brief v0.1

## Vision
Dal sito vetrina Weebly a un ambiente editoriale professionale per lo studio di ingegneria: progetti al centro, servizi comprensibili, identità autorevole, contatti facili e contenuti che evolvono.

## Identità da validare
- Brand di lavoro: **LoboStudio** / marchio **LO/BO** verticale, monocromatico, visto nelle schermate.
- Nome in vecchio sito: **Studio di Ingegneria Lorenzo Bolelli**. L'uso ufficiale delle due denominazioni va approvato dal titolare.
- Località dichiarata nei vecchi contenuti: Bologna; indirizzo, recapiti e dati fiscali da validare prima del go-live.
- La biografia visibile afferma studio aperto nel 1995. Pubblicare solo dopo conferma.

## Audience
1. Proprietari/committenti interessati a nuove costruzioni e ristrutturazioni.
2. Imprese e sviluppatori in cerca di progettazione strutturale e supporto tecnico.
3. Collaboratori professionali e studi complementari.
4. Enti/organizzazioni con esigenze urbanistiche e amministrative.

## Differenziazione
- Storytelling fondato sui progetti realizzati; evidenza del metodo progettuale e del contributo effettivo dello studio.
- Sobrietà visiva da studio tecnico, capacità di spiegare complessità senza gergo gratuito.
- Portfolio consultabile per esigenze, non catalogo di thumbnail anonime.

## Mappa pagine
| Pagina | Route indicativa | Contenuto/CTA |
|---|---|---|
| Home | `/` | Hero, progetti, studio, competenze, metodo, contatti |
| Studio | `/studio` | Profilo, storia, metodo, team se confermato |
| Servizi | `/servizi` | Competenze, processi, rimandi a progetti |
| Progetti | `/progetti` | Filtro categoria, ricerca opzionale, cards curate |
| Categoria | `/progetti/categoria/[slug]` | Intro e progetti per categoria |
| Scheda progetto | `/progetti/[slug]` | Case study, ruolo, gallery, correlati |
| Esperienza sisma | `/competenze/sisma-emilia-2012` | Esperienza storica con disclaimer temporale |
| Clienti | `/clienti` | Relazioni/loghi autorizzati |
| Rassegna | `/rassegna-stampa` | Fonti e link verificati |
| Contatti | `/contatti` | Recapiti validati, mailto, form quando pronto |
| Privacy | `/privacy` | Informativa approvata, non generica |
| Cookie | `/cookie` se necessaria | Tecnologie effettive, non template inventato |
| Note legali | `/note-legali` | Dati/crediti pertinenti verificati |

## Coperture della home
1. Hero: progetto principale con fotografie autorizzate; titolo forte, CTA esplora progetti.
2. Statement/manifesto breve con spiegazione di ambiti e approccio.
3. Featured projects: 3-6 case studies con forme compositive diverse.
4. Competencies: categorie servizi con link contestuali.
5. Studio: ritratto e profilo essenziale, rimando alla storia.
6. Metodo: processo progettuale semplice, verificabile.
7. Clienti/collaborazioni solo previa autorizzazione.
8. CTA finale con contatti e località.

## Metriche di accettazione
- Navigazione completa su mouse, touch e tastiera; nessun link finto.
- Portfolio funzionale anche con asset incompleti e content model espandibile.
- Layout pulito da 360 a 1920px, immagini senza distorsioni, contrasto testato.
- Misure Core Web Vitals reali da registrare, target LCP <= 2.5s, INP <= 200ms e CLS <= 0.1 al percentile 75 in produzione quando disponibili (obiettivi, non garanzie).
- No informazioni professionali inventate, nessun tracciamento non necessario.

## Fuori scope MVP
Pannello di amministrazione, login clienti, DB, blog con editor, pagamenti, chat, area riservata, internazionalizzazione completa. Predisporre espansione senza implementare codice inutile.
