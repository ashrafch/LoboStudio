# Inventario contenuti — estratto dalle schermate Weebly (non certificato)

## Sezioni rilevate
| Legacy | Contenuti visibili | Nuova destinazione | Stato |
|---|---|---|---|
| Home | `In evidenza`, player video e gallery opere | Hero + progetti selezionati | asset mancanti |
| Progetti principali | Categoria link, ricerca, immagini senza casi studio | Archivio progetto filtrabile | dati da arricchire |
| Nuove costruzioni | Griglia densa render e fotografie palazzi/villette | Categoria | foto da associare |
| Ristrutturazioni | Render, interni e facciate | Categoria | foto da associare |
| Strutture | Foto cantieri, consolidamenti, elementi in legno/acciaio | Categoria | foto da associare |
| Piani urbanistici | Mappe aeree e costruzioni | Categoria | titoli e permessi mancanti |
| Studio/profilo | Ritratto B/N, descrizione Lorenzo Bolelli, attività | Studio e servizi | verifica redazionale |
| Sisma Emilia 2012 | Testo storico su D.L. 74/2012 e procedure contributi | Esperienza specialistica storicizzata | verifica attualità normativa |
| Clienti | Loghi di imprese e marchi | Clienti/partnership | diritti autorizzazione |
| Parlano di noi | Screenshots/articoli di stampa | Rassegna stampa con link | fonti/copyright |
| Contatti | Via Marzabotto 8 Bologna, tel, email, Google Map e form | Contatti | confermare recapiti |

## Attività lette nelle schermate
- Studi di fattibilità
- Progettazione architettonica
- Progettazione strutturale
- Gestione di progetti integrati
- Project Management
- Collaudi
- Consulenza tecnico-amministrativa

## Biografia: claim da verificare
Nelle immagini compaiono: **Lorenzo Bolelli, classe 1966**, apertura studio a Bologna nel **1995**, orientamento a risparmio energetico/sostenibilità ambientale, staff di consulenti, competenze su edifici danneggiati dal sisma del maggio 2012. Non pubblicare età, anno, staff o claims finché non confermati.

## Sisma: cautela
Le vecchie pagine menzionano una cifra cumulativa di contribuzione pubblica, numeri di ordinanze e procedure. Sono dati **storici**, potenzialmente non più attuali. La nuova pagina deve trattare il know-how storico, non promettere agevolazioni oggi disponibili né riproporre testi giuridici vecchi senza aggiornamento.

## Scheda lavoro da compilare per ogni progetto
```
id:
slug:
titolo:
categoria:
anno: DA_CONFERMARE
luogo: DA_CONFERMARE
committente: NON PUBBLICARE SENZA AUTORIZZAZIONE
ruolo dello studio: DA_CONFERMARE
scope/obiettivo:
soluzione tecnica:
foto: [file sorgente, file derivato, alt, credits, permesso]
fonte del testo:
autorizzazione pubblicazione:
status: draft|review|published
```

## Migrazione e responsabilità

### Importazione dei materiali di novembre 2026

Le schede in `assets/archive/weebly/infoImage/` sono fonti storiche. Le quattro liste delle attività hanno alimentato le schede ricercabili del portfolio. Dove la tavola conteneva fotografie o rendering isolabili, i ritagli sono stati estratti senza le intestazioni e i testi impaginati. Le descrizioni sono testo della pagina e ogni scheda conserva i riferimenti agli originali.

| Fonte | Uso nell’anteprima |
|---|---|
| `nuovecostruzioni/` e `ultimiprogetti/` | Torri Spadini, Via San Pier Tommaso, Tagliacozzi, Complesso Borgonuovo, Residenza Porta Saffi, Officine Arcoveggio e Via Toffano, oltre alle schede degli elenchi. |
| `ristrutturazioneErecupero/`, `Struttureedadeguamentisismici/`, `pianiurbanistici/` | Archivio documentale per recupero, strutture e urbanistica. La scheda di Monte San Pietro usa la veduta identificata dal nome del file. |
| `studioecurriculum/` e `profilo/` | Ritratto di Lorenzo e cenni sulla formazione. Recapiti, dati fiscali e iscrizioni citati nel curriculum storico vanno verificati prima della pubblicazione. |
| `clienti/` e `paraladinoi/` | Loghi nell’anteprima e riferimenti editoriali con link alle fonti. I loghi non attestano un rapporto commerciale attuale. |

Arcoveggio 48 e le Officine Arcoveggio hanno due schede. Le tavole storiche collegano le Officine a via Manin, mentre il rendering di Arcoveggio 48 è identificato dalla cartella di consegna. Le foto in `strutture/` che non riportano un collegamento verificabile a una commessa sono raccolte nella galleria di cantiere. Il rendering notturno `4442340_orig.png` e la vista `whatsapp-image-2025-01-24-at-18-30-37-1_orig.jpeg` restano da attribuire. I file parziali `.crdownload` sono censiti e restano fuori dall’anteprima.

I record progetto si trovano in `content/projects/entries.ts`, il registro dei media in `content/preview-images.json` e l’inventario con hash e duplicati in `docs/asset-manifest.csv`. Questa struttura fornisce al futuro pannello campi per categoria, testo, periodo, ruolo, galleria e stato editoriale. Per la versione pubblica restano da confermare attribuzioni, crediti e autorizzazioni.

Le schermate Weebly del 20 novembre 2026 documentano il profilo (n. 6), la home e l’archivio per categorie (7–8), il resoconto post-sisma (9) e i quattro archivi fotografici (10–13). Il profilo riporta il 1966 come anno di nascita e il 1995 come apertura dello studio a Bologna. Il dato di 2,6 milioni di euro e la scadenza del 2014 appartengono al resoconto storico. Biografia, attività post-sisma e cifre sono riportate in anteprima per la revisione. Le miniature senza didascalia non identificano con certezza singoli cantieri o committenti.
Raccogliere i progetti uno per uno quando arriverà la cartella completa. Non assumere che ogni foto sia un progetto distinto, né che tutti i rendering rappresentino lavori completati. Distinguere rendering/proposta, cantiere, opera realizzata. Preservare fonti e liberatorie ove necessario.
