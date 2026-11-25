# Anteprima riservata LoboStudio

## Architettura

La porta 3080 serve lo sviluppo Next.js con il CMS locale. La 3081 serve lo standalone con i contenuti pubblicati. La preview client usa un secondo progetto Docker, `lobostudio-client`, con una build standalone e uno snapshot dei derivati fotografici e dei due video. Il catalogo storico comprende 57 schede in revisione. La copia usa l’ordine iniziale del catalogo per il Momentum Rail, mentre l’ordine personalizzato del CMS è visibile sulla 3080.

Il gateway Nginx ascolta su `127.0.0.1:3082`. Accetta GET e HEAD sulle pagine del sito, i file statici e i media previsti. L’applicazione gira su una rete Docker interna, con le copie dei media in sola lettura. Il container di revisione usa il catalogo nel codice e parte senza configurazione CMS. Le richieste ad amministrazione, CMS e percorsi di sviluppo ricevono 404. Il gateway imposta `noindex` e `no-store`.

Cloudflared apre una connessione in uscita e consegna un URL HTTPS temporaneo. L’indirizzo autorizzato riceve il codice monouso da Cloudflare quando apre il link e richiede di accedere. [Cloudflare Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/)

## Avvio e gestione

Eseguire da PowerShell 7 nella root di LoboStudio. La preview di sviluppo deve essere attiva per copiare i derivati già generati.

```powershell
.\scripts\prepare-client-preview.ps1
$indirizzoAutorizzato = Read-Host 'Email autorizzata'
.\scripts\client-tunnel.ps1 -Action Start -AllowedMail $indirizzoAutorizzato
.\scripts\client-tunnel.ps1 -Action Status
```

Lo script di avvio stampa l’URL reale. Lo stato riporta il PID e la disponibilità di Cloudflared. Il processo è separato dalla sessione di lavoro. Stato e log sono in `%LOCALAPPDATA%\LoboStudio\client-preview`.

Per disattivare il link e revocare l’accesso, eseguire `.\scripts\client-tunnel.ps1 -Action Stop`. Per cambiare il destinatario, eseguire `Stop`, poi usare `Start` con il nuovo indirizzo autorizzato e condividere il nuovo URL generato.

Per aggiornare la demo, lavorare sulla 3080 e verificare il commit desiderato. Eseguire `prepare-client-preview.ps1` dalla revisione che si intende mostrare. Lo script crea una nuova copia dei media e sostituisce soltanto i due container dell’anteprima riservata. Se si vuole tenere la demo chiusa durante l’aggiornamento, fermare prima il tunnel. Finché è attivo, il link dipende da Docker Desktop, cloudflared e dalla connessione del PC.

Per fermare anche i container della demo, dopo aver fermato il tunnel:

```powershell
$env:LOBO_CLIENT_MEDIA_DIR = (Get-Content -Raw -LiteralPath (Join-Path $env:LOCALAPPDATA 'LoboStudio/client-preview/media-path.txt')).Trim()
docker compose -f docker/compose.client-preview.yaml stop
```

## Verifica esterna

La preview di consultazione richiede Cloudflare Access via HTTPS. In una finestra privata, aprire il link e verificare che Cloudflare chieda l’email prima di mostrare il sito. Per il collaudo autenticato, usare l’indirizzo autorizzato e il codice monouso ricevuto via email. Aprire Home e un progetto con foto, poi verificare che `/admin` e `/media/cms/…` restituiscano `404`. Il gateway riscrive i riferimenti Open Graph della demo sul dominio del tunnel. [Stato dell’ultimo collaudo](CURRENT_STATE.md)

## Copia di prova con editor

Avvia l’editor quando il destinatario deve provare il pannello. Parti dalla preview locale sulla 3080 e da uno snapshot dei media della demo già preparato. La copia usa Docker `lobostudio-editor`, il gateway sulla 3083 e un proprio volume persistente. All’inizializzazione importa le versioni pubblicate dal CMS locale e i media collegati. Bozze originali, cestino, cronologia, copie di ripristino e sessioni partono vuoti. Il catalogo storico in revisione viene letto dal codice e dallo snapshot dei media in sola lettura.

```powershell
$indirizzoAutorizzato = Read-Host 'Email autorizzata'
.\scripts\editor-preview.ps1 -Action Start -AllowedMail $indirizzoAutorizzato
.\scripts\editor-preview.ps1 -Action Status
```

Condividi l’URL `/admin` prodotto dallo script. Il destinatario autentica l’email con il codice Cloudflare e inserisce la password della copia di prova. Il file della password è indicato dall’avvio e va condiviso tramite un canale riservato, separato dal link. Dal sito l’accesso è nel footer, sotto **Area riservata**. **Pubblica** applica le modifiche soltanto alla copia di prova.

`.\scripts\editor-preview.ps1 -Action Stop` termina il tunnel e ferma i container conservando il volume. Un nuovo avvio genera un altro link e recupera il lavoro già salvato. L’URL è temporaneo e dipende dal PC, dalla connessione e da Docker. [Cloudflare Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/)
