# Gestione contenuti

## Avvio locale

Il pannello usa il volume Docker `cms-data`. Per generare le credenziali locali e avviare il sito:

```powershell
node scripts/setup-cms.mjs
docker compose --profile production up -d --build --wait
```

Il primo comando salva l’hash in `.env.cms` e la password iniziale in `.env.cms-login`. Entrambi i file sono ignorati da Git. Conserva la password in un gestore e rimuovi la copia in chiaro quando non serve più. In locale **Area riservata** apre il pannello sulla porta 3080 da entrambe le versioni del sito. Anche l’accesso diretto a `/admin` sulla porta 3081 rimanda al pannello sulla 3080. Le due versioni leggono gli stessi contenuti pubblicati. Una pubblicazione locale serve per le prove. [Apri il pannello](http://127.0.0.1:3080/admin)

## Contenuti e pubblicazione

In **Progetti**, apri la scheda e usa **Foto del progetto**, in cima all’editor. Puoi caricare una foto dal computer o sceglierla dalla libreria. Nell’anteprima locale trovi anche le fotografie del vecchio portfolio associate alla scheda, con il loro testo alternativo. Seleziona una miniatura della bozza per cambiarne posizione, credito o descrizione, impostarla come copertina o rimuoverla dalla galleria.

Scegli **Essenziale** per una scheda compatta o **Racconto** per aprire con la copertina a tutta larghezza. Puoi aggiungere un’introduzione breve e, per ogni foto, una didascalia e un tipo di immagine. L’anteprima della scheda usa la stessa impaginazione del sito.

In **Pagine → Home**, usa le frecce accanto alle miniature sotto **Ordine dei progetti in Home**. Il primo progetto apre il carosello. Salva e pubblica la bozza della Home per applicare l’ordine. I progetti in evidenza aggiunti in seguito seguono quelli già ordinati.

Nella stessa pagina, seleziona **Progetti in fotografia** nell’editor visivo. Puoi aggiungere fino a quattro schede con foto, cambiarne l’ordine, rimuoverle dalla sequenza o nascondere la sezione. **Ripristina selezione iniziale** ripropone i tre progetti predefiniti. Le foto e i testi seguono le schede progetto. Salva e pubblica la bozza della Home per applicare la selezione.

Apri **Pagine**, scegli una pagina e seleziona un elemento nella composizione. Il riquadro bordeaux indica dove stai lavorando. I controlli accanto alla pagina aggiornano subito il testo o la foto. Il lucchetto indica la posizione di una sezione predefinita del sito.

Con **Aggiungi blocco** inserisci testo e immagini. **Prima** e **Dopo** cambiano l’ordine. Nei progetti la prima foto diventa la copertina. Usa **Anteprima** per nascondere i controlli e l’icona del telefono per verificare la composizione stretta. **Salva bozza** conserva le modifiche. **Pubblica la bozza salvata** le rende visibili sul sito.

- **Progetti**. Cerca per titolo, slug o località. Imposta descrizione, categoria, luogo, periodo, ruolo, galleria e visibilità in home. Lo slug rimane stabile dopo la creazione. Salva la bozza, controlla l’anteprima della bozza salvata e pubblicala. Le modifiche a una bozza restano private. Le pubblicazioni sostituite possono essere rimesse in bozza dalla cronologia. Il cestino è recuperabile.
- **Pagine**. Modifica titolo, introduzione e blocchi testo/immagine. Puoi riordinare i blocchi e scegliere fra Standard, Compatta e Ampia. Home e Contatti hanno campi dedicati. I blocchi possono affiancare o sostituire le sezioni editoriali delle pagine. L’archivio progetti conserva sempre filtri e risultati.
- **Libreria media**. Carica immagini JPEG, PNG, WebP o AVIF da massimo 8 MB. Il server le ridimensiona e le converte in WebP. I progetti richiedono un testo alternativo e un credito per ogni immagine. La rimozione di un’immagine è bloccata se la usano una bozza, una scheda pubblicata o la cronologia.
- **Importa**. Recupera le schede del portfolio storico come bozze. Le foto storiche possono essere copiate dall’anteprima alla libreria associando il credito corretto. Per un archivio esterno importa un elenco JSON di massimo 1.000 progetti alla volta. Gli slug già presenti sono ignorati. Se una riga non è valida, il lotto resta intatto.

```json
[
  {
    "slug": "via-rossi",
    "title": "Residenza in via Rossi",
    "category": "nuove-costruzioni",
    "description": "Descrizione dell’intervento residenziale.",
    "location": "Bologna",
    "period": "2025–2026",
    "role": "Progettazione strutturale"
  }
]
```

Le altre categorie sono `ristrutturazioni`, `strutture` e `piani-urbanistici`.

## Guida e copie di ripristino

La guida si apre al primo accesso al pannello da un browser. I passaggi evidenziano i controlli direttamente sulle schermate del pannello, dalla modifica delle pagine fino alla pubblicazione e al recupero. **Avanti** e **Indietro** possono aprire la scheda relativa al passaggio. Puoi chiudere la guida con **Esc** e ricominciare in qualsiasi momento da **Guida**, accanto a **Esci**.

In **Backup**, assegna un nome alla copia dello stato che vuoi conservare, per esempio «Portfolio approvato», e premi **Crea copia di ripristino**. La copia comprende le pagine e i progetti nel CMS, con bozze salvate, versioni pubblicate, cestino, cronologia e immagini associate. Prima di un cambio di pubblicazione o di un ripristino il pannello crea una copia automatica.

Per correggere una singola scheda, usa **Cronologia pubblicazioni**, controlla la versione rimessa in bozza e pubblicala. Per recuperare più contenuti insieme, scegli la copia in **Backup** e conferma. Il ripristino aggiorna subito le versioni pubbliche e le bozze. Una copia automatica prima della pubblicazione include la bozza che avevi già salvato in quel momento. Per annullare un ripristino, scegli la copia **Prima di ripristinare** appena creata.

Le copie di ripristino sono conservate nel volume SQLite del CMS. Il backup del volume fuori host resta la procedura di recupero in caso di guasto del disco.

## Installazione sul sito pubblico

L’assetto SQLite è per Docker su un solo host con volume persistente locale. Configura un reverse proxy HTTPS davanti a `web` e imposta `CMS_WEB_ORIGIN` all’origine HTTPS esatta, senza slash finale. Il proxy deve conservare l’host pubblico. Proteggi `/admin` anche a monte, idealmente con un accesso nominativo con MFA, e applica un limite di richieste e dimensioni coerente con il caricamento. Le credenziali locali servono ai test. Per il titolare configura una credenziale dedicata nel secret store dell’hosting.

Il database contiene contenuti, cronologia e immagini. Esegui backup regolari con l’API SQLite `backup` e conserva le copie fuori host con accesso limitato. Verifica il ripristino in un volume separato prima della pubblicazione. Per installazioni su più nodi o filesystem condivisi, migra il livello di persistenza verso un database e uno storage condivisi.

L’importazione dell’archivio esterno richiede un export e una mappatura dei campi. Il pannello usa le pagine e i componenti del sito esistente. Video, codice, stili e menu si gestiscono nel progetto.

## Foto delle attività

Dal piè di pagina apri **Area riservata**, accedi e scegli **Pagine → Servizi → Foto delle attività**. Seleziona l’attività per vedere la foto in uso. Puoi scegliere una foto dalla libreria, descriverla, rimuoverla o ripristinare quella iniziale. Per usare un nuovo file, caricalo prima nella Libreria media. **Salva bozza** conserva le modifiche per la revisione. **Pubblica** le applica alla Home e alla pagina Servizi.

Le sette immagini iniziali sono fotografie illustrative. I crediti e le fonti Pexels sono registrati in `content/services/photos.json`.
