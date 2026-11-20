# Consegna del MVP

## Scelte implementative

- La carrellata della home avanza su richiesta. La galleria di scheda usa un dialog nativo, comandi visibili, frecce, Escape e ripristino del focus.
- I font variabili Manrope e DM Sans sono inclusi localmente tramite Fontsource. Superfici avorio e inchiostro, accento terra scurito a `#7C503D` e testo secondario `#565F60` migliorano la leggibilità.
- Ricerca per parole nel contenuto versionato, normalizzazione accenti e URL GET. Le categorie conservano la ricerca quando si cambia filtro.
- L’API interna di sola lettura per la revisione serve una lista di immagini WebP da una directory fuori dagli asset pubblici. È condizionata all’ambiente di sviluppo. Le immagini fallite mostrano un fallback.
- Il sito usa un link email diretto. Gli aggiornamenti passano dal repository. Il Dockerfile e Docker Compose gestiscono l’anteprima locale e la build per l’hosting.
- I recapiti, il marchio JPEG e gli articoli in revisione sono visibili in anteprima. L’icona tecnica testuale identifica la scheda browser. I dati strutturati locali e le pagine indicizzabili dipendono da dati e dominio approvati.

## Modello di scheda

`content/projects/index.ts` valida slug univoci, categoria, descrizione, immagini e stato di pubblicazione. La prima immagine è la copertina. Località, anno e ruolo sono facoltativi. Se la scheda è pubblicata, ogni immagine richiede un percorso web locale e un credito. Verificare diritti, dati personali visibili e corrispondenza tra immagini e testo prima di cambiare lo stato.

Mapping di lavoro per la revisione:

| Derivato | Uso locale |
|---|---|
| lobo.webp | Marchio nell’header |
| malvezza.webp | Residenza con giardino |
| spadini.webp, torri.webp | Torri residenziali |
| esterno-notte.webp | Fronti industriali |
| pganino.webp | Facciata e percorsi |
| facciata.webp | Da associare |

## Revisione e integrazione

Rivedere gli screenshot di home desktop e mobile generati da Playwright, l’archivio, i layout tastiera e i contatti. La storia da verificare va dalla navigazione al filtro server, al contenuto versionato e alla galleria. La produzione deve rispondere 404 ai percorsi delle schede e dei media in revisione.

La repository partiva da `main` senza commit. Il ramo di consegna discende dal ramo di fondazione. Dopo approvazione esplicita, si può inizializzare localmente `main` al commit di bootstrap `f0309c5` con `git branch main f0309c5`, se il riferimento è ancora assente. La successiva integrazione può essere fast-forward se non ci sono altre modifiche. Prima di operazioni remote, rivedere lo stato dell’indice. Gli originali staged provengono dall’utente e devono restare fuori dal rilascio. Il rollback di una pubblicazione futura consiste nel ripromuovere la versione precedente sull’hosting e ripristinare le impostazioni DNS documentate.
