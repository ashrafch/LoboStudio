# Asset workflow — nessuna perdita di originali

## Regola 1
Non spostare/rinominare/sovrascrivere `asset/` senza consenso. Gli originali restano tali; le immagini web sono **copie derivate**. Non usare schermate di Weebly come immagini di progetto.

## Quando arrivano nuovi file
1. Elenca tutto: `Get-ChildItem .\asset -File -Recurse | Select FullName,Length,Extension`.
2. Genera manifest CSV in `docs/asset-manifest.csv` con hash SHA-256, path, dimensioni pixel, formato, eventuale EXIF/location, categoria ipotetica, project slug, status diritti, approvazione.
3. Identifica duplicati esatti via hash, senza eliminarli.
4. Richiedi mapping originale -> progetto e verifica diritti d'uso/clienti/persone visibili.
5. Copia **solo gli asset approvati** in `public/media`, con filename descrittivi, WebP/AVIF dove appropriato e screenshot/renders senza perdita eccessiva.
6. Ottimizza larghezze/responsive e alt text: `alt` descrive cosa è mostrato, non è un elenco di keyword.
7. Definisci selezione hero e focal point; non tagliare elementi tecnici importanti.

## Git e dimensione repository
- Commit di asset WEB ottimizzati approvati dentro `public/media`.
- Se gli originali `asset/` pesano molto o comprendono dati sensibili, mantenere `asset/raw`, `asset/incoming`, `asset/originals` fuori Git (gitignore) o repository separato/archivio dedicato.
- Non cancellare `asset/` e non ignorare tutto indiscriminatamente se lì è presente l'unica copia del logo.
- Per asset che devono essere versionati ma superano limiti opportuni, valutare Git LFS consapevolmente. Non caricare pacchetti di fotografie pesanti in commit senza approvazione.

## Naming suggerito
`public/media/progetti/<slug>/<descrizione>-<sequenza>.webp`; logo `public/brand/lobo-logo.svg` o file originale ottimizzato, se permesso.
