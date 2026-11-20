---
name: lobo-content-migration
description: Migrare contenuti, fotografie e progetti dal vecchio sito Weebly allo schema del nuovo portfolio LoboStudio, tracciando diritti, fonti e approvazioni.
---
# Content migration
1. Leggi `docs/content-inventory.md` e `docs/asset-workflow.md`.
2. Inventaria originali da `asset/` senza rinominarli o cancellarli; calcola hash, pesi, formati e sorgenti.
3. Riconosci per ogni foto se mostra rendering, cantiere, edificio completato o dettaglio tecnico: non dedurre il completamento dalla sola immagine.
4. Costruisci mapping file -> progetto e progetto -> categorie. Se titolo/cliente/ruolo sono ignoti, usa `draft` e campi non pubblici con stato da verificare.
5. Crea schema contenuti tipizzato e pubblica esclusivamente casi approvati, con alt e credit corretti.
6. Per loghi cliente e ritagli stampa chiedi autorizzazioni/links, non spacciare materiale non verificato per endorsement.
7. Mantieni URL legacy reali e mappa redirect 301 senza inventare path.
8. Output: manifest, schede progetto, dubbi e blocchi per la pubblicazione.
