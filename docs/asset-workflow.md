# Asset workflow — nessuna perdita di originali

## Archivio privato

| Directory | Contenuto |
| --- | --- |
| `assets/projects/` | Originali per progetto e raccolte tecniche esistenti. I nomi dei file conservano la provenienza. |
| `assets/studio/` | Logo originale, profilo, attività e materiali dei clienti. |
| `assets/archive/weebly/` | Tavole e file storici di Weebly. |
| `assets/archive/videos/` | I due video selezionati per le anteprime. |
| `assets/archive/unclassified/` | Materiali in attesa di attribuzione. |
| `assets/3d-building/` | Originali, texture, riferimenti e lavorati della hero 3D. |

Usa `assets/` per il nuovo materiale. Conserva gli originali integri e usa copie derivate per il web. `content/preview-images.json` e `sources` nelle schede usano percorsi relativi a `assets/`. Il manifest usa percorsi dalla root, mentre la colonna `duplicato_di` usa percorsi relativi a `assets/`.

La cartella storica `asset/` resta disponibile per i container già avviati e per il recupero della revisione precedente. Quando verrà ritirata, verificare prima che nessun container monti più quel percorso e conservare una copia recuperabile dell’archivio. Una nuova preview monta in sola lettura soltanto le tre directory necessarie e gli snapshot client/editor ricevono soltanto i WebP e i due video selezionati.

## Quando arrivano nuovi file
1. Elenca tutto: `Get-ChildItem .\assets -File -Recurse | Select FullName,Length,Extension`.
2. Genera manifest CSV in `docs/asset-manifest.csv` con hash SHA-256, path, dimensioni pixel, formato, eventuale EXIF/location, categoria ipotetica, project slug, status diritti, approvazione.
3. Identifica duplicati esatti via hash, senza eliminarli.
4. Richiedi mapping originale -> progetto e verifica diritti d'uso/clienti/persone visibili.
5. Copia **solo gli asset approvati** in `public/media`, con filename descrittivi, WebP/AVIF dove appropriato e screenshot/renders senza perdita eccessiva.
6. Ottimizza larghezze/responsive e alt text: `alt` descrive cosa è mostrato, non è un elenco di keyword.
7. Definisci selezione hero e focal point; non tagliare elementi tecnici importanti.

## Git e dimensione repository
- Commit di asset WEB ottimizzati approvati dentro `public/media`.
- Git conserva solo i marker della struttura `assets/`. Mantieni una copia privata recuperabile degli originali, incluso il logo.
- Per asset che devono essere versionati ma superano limiti opportuni, valutare Git LFS consapevolmente. Non caricare pacchetti di fotografie pesanti in commit senza approvazione.

## Naming suggerito
`public/media/progetti/<slug>/<descrizione>-<sequenza>.webp`; logo `public/brand/lobo-logo.svg` o file originale ottimizzato, se permesso.
