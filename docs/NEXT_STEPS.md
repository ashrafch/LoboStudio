# Prossimi passi

## Hero 3D · in attesa dello ZIP

1. Copiare lo ZIP ricevuto in `assets/3d-building/original/`. Elencarne il contenuto prima di estrarre. Registrare hash, dimensioni, export Vectorworks, unità, riferimenti e autorizzazione all’uso. Conservare gli originali e lavorare su copie.
2. Importare l’FBX in Blender e verificare scala, orientamento, materiali, texture e geometrie riservate. Esportare un primo GLB e misurarlo con la CLI glTF Transform verificata e fissata per la sessione. Confrontarlo con il riferimento fornito.
3. Dopo la verifica del GLB, prototipare il modello reale in una demo locale isolata. Partire da Three.js, Fiber e Motion. Valutare Drei solo per un’esigenza concreta e verificare le dipendenze transitive prima di adottarlo. [Piano di produzione](3d-hero/PRODUCTION_PLAN.md)

## Collaudo e pubblicazione del sito

1. **Collaudo con il destinatario.** Sul link con editor completare l’accesso con il codice email e la password dedicata, aprire **Area riservata** e provare il flusso bozza → anteprima → pubblicazione nella copia isolata. Sul link di sola consultazione, verificare una scheda con foto e il `404` di `/admin` dopo il codice email. Verificare lo stato dei tunnel prima di condividere i link. [Stato](CURRENT_STATE.md) · [Guida](client-preview.md)
2. **Pubblicazione.** Confermare dominio, contenuti, revisione di rilascio e VPS con lo studio. Preparare il job GHCR, il volume persistente e il collaudo isolato seguendo la guida. Al lancio SQLite contiene anche i media. Prima dell’importazione massiva, provare la migrazione dei media a storage oggetti preservando ID e riservatezza delle bozze. [Guida GitHub e VPS](production-publishing.md) · [Stato go-live](go-live-status.md)
3. **Verifica prima del go-live.** Completare i controlli su Firefox, Safari, screen reader e dispositivo touch fisico, quindi aggiornare il registro di pubblicazione.

Al prossimo aggiornamento programmato delle anteprime, usare il Compose che monta `assets/` e verificare di nuovo il logo, le immagini e i due video. Conservare la copia `asset/` finché il mount storico serve a container attivi o al rollback. [Gestione degli asset](asset-workflow.md)

Cloudflare R2 è il candidato per i media e GitHub Container Registry è il candidato per le immagini Docker. Per stimare la capacità, 500 progetti con 20 foto da 300 KB occuperebbero circa 3 GB per un’unica variante WebP, a cui aggiungere video, altre varianti e copie di backup. Per riprodurre un problema scaricare l’immagine identificata dal digest. Quando servono i contenuti correnti, usare una copia coerente e isolata del database e dei media pertinenti.
