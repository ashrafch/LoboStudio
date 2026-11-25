# Pubblicare LoboStudio da GitHub su un VPS

**Sì, puoi partire da Git come su Vercel.** Su Vercel il push al ramo di produzione avvia build e pubblicazione. Qui GitHub Actions fa i test e carica l’immagine Docker su GitHub Container Registry (GHCR). Per il primo rilascio, dopo il collaudo, entri sul VPS via SSH e gli fai scaricare e avviare quell’immagine. Anche quest’ultimo passaggio può essere automatizzato. [Deploy da Git su Vercel](https://vercel.com/docs/git/vercel-for-github) · [Pubblicare immagini con GitHub Actions](https://docs.github.com/en/actions/use-cases-and-examples/publishing-packages/publishing-docker-images)

~~~text
main → GitHub Actions → immagine GHCR → staging → VPS → dominio HTTPS
                                                  │
                             CMS → SQLite sul volume persistente
                                                  │
                                       backup cifrato fuori host
~~~

Next.js serve frontend, backend e CMS dallo stesso container. SQLite conserva bozze, pubblicazioni e immagini WebP nel volume. Quando il tuo amico pubblica dal CMS, scrive in quel volume. Ogni nuovo container di produzione legge i dati dal **medesimo volume**, comprese le modifiche editoriali arrivate durante il tuo sviluppo. Per il primo rilascio usiamo un VPS europeo, Docker Compose, SQLite e un bucket privato per i backup. Lo storage R2 per le foto si aggiunge prima dell’importazione massiva. [Volumi Docker](https://docs.docker.com/engine/storage/volumes/) · [Guida CMS](cms.md#installazione-sul-sito-pubblico)

## 1. Prepara dominio, contenuti e Git

1. Individua chi gestisce dominio, DNS, email e sito Weebly. Salva l’elenco dei record DNS, un export del vecchio sito e i permalink effettivi. Scegli l’host pubblico canonico e un sottodominio per il collaudo. In questa guida `www.example.it` e `staging.example.it` sono esempi.
2. Conferma con lo studio quali schede e foto si possono pubblicare. Verifica crediti, recapiti, dati professionali, privacy e note legali. Per preparare i primi contenuti prima del lancio, usa il CMS locale sulla **3080**. [Stato go-live](go-live-status.md) · [Registro dei redirect](redirects.csv)
3. Verifica il repository con `git branch -a` e `git ls-remote --heads origin`. Nel checkout attuale manca un ramo locale `main`. Da un checkout pulito, identifica la revisione approvabile, verifica se esiste già un ramo di release remoto e prepara `main` con il flusso concordato. Rivedi l’intero storico che intendi pubblicare, soprattutto originali, segreti e backup. Usa le PR e le protezioni disponibili nel piano GitHub. [Flusso Git](git-workflow.md)
4. Usa il workflow `.github/workflows/ci.yml` esistente. Esegue lint, typecheck, test unitari, build Docker, Playwright e audit. Parti da una revisione che supera questi controlli.

## 2. Collega GitHub al registry Docker

In **Settings → Secrets and variables → Actions → Variables** crea `LOBO_SITE_URL` con l’origine HTTPS definitiva, per esempio `https://www.example.it`. L’origine canonica e l’indicizzazione entrano già nella build di produzione. Questa immagine sarà collaudata su staging dietro accesso nominativo.

Aggiungi questo job sotto `jobs:` nel workflow CI, allo stesso livello di `quality`. A ogni push su `main` con CI verde, pubblica l’immagine del commit. Prendi il riferimento con digest dalla pagina di riepilogo di GitHub Actions. [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) · [Buildx metadata file](https://docs.docker.com/reference/cli/docker/buildx/build/#metadata-file)

~~~yaml
  publish-image:
    needs: quality
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    env:
      SITE_URL: ${{ vars.LOBO_SITE_URL }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - name: Pubblica la build standalone
        env:
          GHCR_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          set -euo pipefail
          test -n "$SITE_URL"
          image="ghcr.io/${GITHUB_REPOSITORY,,}"
          printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u "$GITHUB_ACTOR" --password-stdin
          docker buildx build --platform linux/amd64 --target production \
            --build-arg "SITE_URL=$SITE_URL" --build-arg LOBO_INDEXING=1 \
            --label "org.opencontainers.image.source=${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}" \
            --label "org.opencontainers.image.revision=$GITHUB_SHA" \
            --tag "$image:$GITHUB_SHA" --push \
            --metadata-file "$RUNNER_TEMP/lobo-image.json" .
          digest=$(jq -er '."containerimage.digest"' "$RUNNER_TEMP/lobo-image.json")
          printf 'Commit: %s\nImmagine: %s@%s\n' \
            "$GITHUB_SHA" "$image" "$digest" >> "$GITHUB_STEP_SUMMARY"
~~~

Mantieni privato il package GHCR. Verifica che il repository abbia accesso al package. Sul VPS usa un account con accesso in lettura al package e un token classic con `read:packages`. Il workflow pubblica usando il suo `GITHUB_TOKEN`. [Autenticazione GHCR](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry)

## 3. Prepara il VPS

1. Scegli un VPS x86-64 in una regione UE. Per il lancio valuta **OVHcloud VPS-1**. Utilizza un’edizione Ubuntu LTS supportata da Docker. Configura la chiave SSH, mantieni disponibile la console di recupero del provider e verifica l’impronta SSH al primo accesso. [Piani OVHcloud](https://www.ovhcloud.com/it/vps/) · [Sistemi supportati da Docker](https://docs.docker.com/engine/install/ubuntu/)
2. Aggiorna il sistema e usa un utente nominativo con `sudo`. Verifica l’accesso con quell’utente prima di disabilitare il login SSH con password e l’accesso diretto di root. Limita SSH tramite firewall o VPN. Cloudflare Tunnel collega il VPS in uscita, mentre Docker può servire il sito sul solo loopback. [Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/concepts/)
3. Installa Docker Engine, Buildx e Compose Plugin tramite il repository APT ufficiale. Usa `sudo docker` per le operazioni amministrative. [Installazione Docker su Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

Sul VPS, in Bash:

~~~bash
sudo systemctl enable --now docker
sudo docker version
sudo docker compose version
sudo install -d -m 0700 -o "$(id -un)" -g "$(id -gn)" /srv/lobostudio
cd /srv/lobostudio
install -d -m 0700 production staging
read -r -p 'Account GitHub con accesso al package: ' github_user
read -r -s -p 'Token GHCR con read:packages: ' github_pat
printf '\n'
printf '%s' "$github_pat" | sudo docker login ghcr.io --username "$github_user" --password-stdin
unset github_pat
~~~

## 4. Configura i container e il volume del CMS

Salva `/srv/lobostudio/compose.release.yaml` con la configurazione seguente. Il Compose già nel repository costruisce e avvia l’app in locale e in CI. Qui il file di rilascio usa l’immagine GHCR e richiede un volume esplicito per ambiente. [Volumi esterni in Compose](https://docs.docker.com/reference/compose-file/volumes/)

~~~yaml
services:
  web:
    image: ${LOBO_IMAGE:?Indica il riferimento GHCR con digest}
    init: true
    restart: unless-stopped
    env_file:
      - ${CMS_CREDENTIAL_FILE:?Indica il file della credenziale CMS}
    environment:
      CMS_DB_PATH: /data/site.sqlite
      CMS_ORIGIN: ${CMS_ORIGIN:?Indica l origine HTTPS del CMS}
      SITE_URL: ${SITE_URL:?Indica l origine HTTPS canonica}
      LOBO_INDEXING: "1"
    ports:
      - "127.0.0.1:${HOST_PORT:?Indica la porta locale}:3000"
    volumes:
      - cms-data:/data
    cap_drop: [ALL]
    security_opt:
      - no-new-privileges:true
    logging:
      driver: local
volumes:
  cms-data:
    external: true
    name: ${CMS_VOLUME:?Indica il volume dell ambiente}
~~~

Con `umask 077`, salva `/srv/lobostudio/production.env`. Usa il digest riportato da GitHub Actions e il dominio effettivo.

~~~dotenv
LOBO_IMAGE=ghcr.io/organizzazione/lobostudio@sha256:SOSTITUISCI_CON_IL_DIGEST
SITE_URL=https://www.example.it
CMS_ORIGIN=https://www.example.it
CMS_CREDENTIAL_FILE=/srv/lobostudio/production/.env.cms
CMS_VOLUME=lobo-cms-production
HOST_PORT=3081
~~~

Crea `staging.env` con la stessa immagine e lo stesso `SITE_URL`. Imposta `CMS_ORIGIN=https://staging.example.it`, `CMS_CREDENTIAL_FILE=/srv/lobostudio/staging/.env.cms`, `CMS_VOLUME=lobo-cms-staging` e `HOST_PORT=3082`. **Ogni ambiente usa il proprio volume e la propria origine CMS**, senza slash finale. Staging testa il medesimo artefatto con i metadati canonici di produzione e resta protetto da Access.

Dal checkout approvato copia con SCP il file `scripts/setup-cms.mjs` in `/srv/lobostudio/setup-cms.mjs`. Sul VPS, crea i due volumi e genera le credenziali usando Node dall’immagine.

~~~bash
cd /srv/lobostudio
sudo docker volume create lobo-cms-production
sudo docker volume create lobo-cms-staging
read -r -p 'Riferimento completo dell’immagine GHCR con digest: ' image
sudo docker pull "$image"
for environment in production staging; do
  sudo docker run --rm --user "$(id -u):$(id -g)" \
    --mount "type=bind,src=$PWD/$environment,dst=/config" \
    --mount "type=bind,src=$PWD/setup-cms.mjs,dst=/setup-cms.mjs,readonly" \
    --workdir /config --entrypoint node "$image" /setup-cms.mjs
done
~~~

Salva le password generate nei file `.env.cms-login` in un gestore di password. Gli hash restano nei rispettivi `.env.cms` privati. Il CMS usa una password per ambiente. Per te e il redattore crea accessi nominativi distinti su Cloudflare e condividi la password CMS di produzione tramite un canale riservato. [Configurazione CMS](cms.md#installazione-sul-sito-pubblico)


## 5. Carica i contenuti iniziali

Con un CMS vuoto vai al passo 6. Se hai già pubblicato contenuti approvati sulla **3080**, esporta le versioni pubblicate e i media collegati con lo script del repository. Conserva gli ID delle immagini. Il backup completo, che include anche bozze e cronologia, è al passo 7.

Da PowerShell, nella root del repository con la 3080 attiva:

~~~powershell
$seedName = 'lobo-seed-' + [guid]::NewGuid().ToString('N') + '.sqlite'
$seedPath = Join-Path $env:LOCALAPPDATA $seedName
Get-Content -Raw -LiteralPath 'scripts/editor-preview-seed.mjs' |
    docker compose exec -T preview node --input-type=module - "/tmp/$seedName"
if ($LASTEXITCODE -ne 0) { throw 'Esportazione non riuscita' }
docker compose cp "preview:/tmp/$seedName" $seedPath
if ($LASTEXITCODE -ne 0) { throw 'Copia locale non riuscita' }
docker compose exec -T preview rm -f "/tmp/$seedName"
~~~

Trasferisci il file indicato da `$seedPath` via SCP nella cartella privata sul VPS. Verifica i permessi e il contenuto prima dell’importazione. Usa il blocco sotto prima con staging e, dopo il collaudo, sul volume **nuovo** di produzione. L’importazione valida il file e crea il database solo se il volume è vuoto. Una volta verificato il trasferimento, gestisci le copie temporanee secondo la conservazione concordata.

~~~bash
cd /srv/lobostudio
lobostudio() {
  local environment=$1
  shift
  sudo docker compose -f compose.release.yaml -p "lobo-$environment" \
    --env-file "$environment.env" "$@"
}

read -r -p 'Ambiente (staging o production): ' environment
read -r -p 'Percorso assoluto della copia SQLite autorizzata: ' seed
if [[ "$environment" == staging || "$environment" == production ]]; then
  lobostudio "$environment" run --rm --no-deps -T --entrypoint sh web -c '
    set -eu
    umask 077
    for occupied in /data/site.sqlite /data/site.sqlite-wal /data/site.sqlite-shm; do
      if [ -e "$occupied" ]; then
        printf "%s\n" "Usa un volume nuovo per importare il database." >&2
        exit 1
      fi
    done
    incoming=$(mktemp /data/.incoming.XXXXXX)
    trap "rm -f -- \"\$incoming\"" EXIT
    cat > "$incoming"
    node -e '\''const db = new (require("node:sqlite").DatabaseSync)(process.argv[1], {readOnly:true});
      if (db.prepare("PRAGMA integrity_check").get().integrity_check !== "ok" ||
          db.prepare("PRAGMA foreign_key_check").get()) process.exit(1);
      db.prepare("SELECT 1 FROM documents LIMIT 1").get(); db.close();'\'' "$incoming"
    ln "$incoming" /data/site.sqlite
  ' < "$seed"
fi
~~~

`lobostudio` è una funzione Bash che abbrevia i comandi Compose. Anche se salti l’importazione, definisci la funzione da `cd /srv/lobostudio` fino alla parentesi graffa di chiusura. Ridefiniscila a ogni nuova sessione SSH, oppure salvala in uno script operativo privato.

## 6. Avvia e collauda in privato

1. Prepara la zona DNS su Cloudflare. Se migri i nameserver, verifica i record del sito esistente e della posta, inclusi MX, SPF, DKIM, DMARC e lo stato di DNSSEC. Mantieni attive le destinazioni Weebly finché lo studio approva il cambio del sito. [Nameserver Cloudflare](https://developers.cloudflare.com/dns/nameservers/update-nameservers/) · [DNSSEC](https://developers.cloudflare.com/dns/dnssec/)
2. In Cloudflare Zero Trust crea un **Tunnel con nome** e installa `cloudflared` come servizio sul VPS con la procedura del dashboard. Prima configura un’applicazione Access per tutto `staging.example.it`, limitata alle identità autorizzate. Poi configura una route da `staging.example.it` a `http://127.0.0.1:3082`. Aggiungi su quell’hostname l’header `X-Robots-Tag: noindex, nofollow`. Custodisci il token del tunnel come segreto. [Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/get-started/) · [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/)
3. Avvia l’ambiente di collaudo. `config --quiet` valida Compose e `--wait` aspetta l’avvio e la verifica di salute dell’immagine.

~~~bash
lobostudio staging config --quiet
lobostudio staging pull web
lobostudio staging up -d --no-build --wait web
lobostudio staging ps
curl -fsS http://127.0.0.1:3082/ -o /dev/null
~~~

4. In una finestra privata verifica che Cloudflare protegga Home e pannello. Con un’identità autorizzata prova Home, Contatti, ricerca, una scheda e la galleria. Nel CMS prova **Salva bozza → Anteprima → Pubblica** con dati di prova, un caricamento immagine e il logout. Verifica che la foto della bozza risponda `404` per un visitatore senza sessione CMS e che il cookie CMS sia `Secure`. Se il login fallisce, verifica l’origine HTTPS del CMS e gli header inoltrati al container.

## 7. Verifica backup e ripristino prima del lancio

SQLite usa WAL. Per una copia coerente da un’app attiva usa la Online Backup API. Prova questo blocco prima su staging. Ripetilo con `environment=production` prima del cambio DNS e prima dei successivi rilasci. Il file comprende i WebP salvati dentro SQLite. [SQLite Online Backup](https://www.sqlite.org/backup.html) · [Node 24 e SQLite](https://nodejs.org/download/release/latest-v24.x/docs/api/sqlite.html)

~~~bash
environment=staging
backup_dir=/srv/lobostudio/backups
install -d -m 0700 "$backup_dir"
(
  set -euo pipefail
  umask 077
  temp_db=$(lobostudio "$environment" exec -T web mktemp /tmp/lobo-backup.XXXXXX)
  trap 'lobostudio "$environment" exec -T web rm -f -- "$temp_db"' EXIT
  stamp=$(date -u +%Y%m%dT%H%M%SZ)
  snapshot="$backup_dir/$environment-$stamp.sqlite"
  lobostudio "$environment" exec -T web node --input-type=module - "$temp_db" <<'NODE'
import { backup, DatabaseSync } from 'node:sqlite';
const source = new DatabaseSync(process.env.CMS_DB_PATH, { readOnly: true });
const destination = process.argv[2];
await backup(source, destination);
source.close();
const copy = new DatabaseSync(destination, { readOnly: true });
if (copy.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok' ||
    copy.prepare('PRAGMA foreign_key_check').get()) throw Error('Copia SQLite non valida');
copy.close();
NODE
  lobostudio "$environment" exec -T web cat "$temp_db" > "$snapshot"
  test -s "$snapshot"
  printf '%s\n' "$snapshot"
)
~~~

1. Crea un bucket R2 privato per i backup, con credenziali limitate al bucket. Sul VPS installa `rclone` e `age` e configura un remoto `lobo-backup` con provider S3 Cloudflare R2. Sulla postazione di recupero crea una chiave con `age-keygen -o lobo-backup-key.txt`. Custodisci la chiave privata fuori dal VPS. Sul VPS serve la chiave pubblica, ottenuta con `age-keygen -y lobo-backup-key.txt`. [Cifratura age](https://github.com/FiloSottile/age) · [R2 in rclone](https://rclone.org/s3/#cloudflare-r2)
2. Cifra la copia e inviala fuori host. Sostituisci `nome-bucket` con il nome scelto. Il confronto dei checksum verifica che sia recuperabile lo stesso file cifrato.

~~~bash
read -r -p 'Percorso dello snapshot SQLite: ' snapshot
read -r -p 'Chiave pubblica age: ' age_recipient
(
  set -euo pipefail
  umask 077
  encrypted="$snapshot.age"
  age -r "$age_recipient" -o "$encrypted" "$snapshot"
  remote="lobo-backup:nome-bucket/lobostudio/$(basename "$encrypted")"
  rclone copyto "$encrypted" "$remote"
  local_hash=$(sha256sum "$encrypted" | cut -d ' ' -f 1)
  remote_hash=$(rclone cat "$remote" | sha256sum | cut -d ' ' -f 1)
  test "$local_hash" = "$remote_hash"
)
~~~

3. Prova un recupero. Scarica il file cifrato sulla postazione autorizzata e decifralo con `age -d -i lobo-backup-key.txt -o restore.sqlite file.sqlite.age`. Per prove con dati reali usa solo i contenuti necessari. Su una copia completa rimuovi sessioni, contatori di accesso e dati riservati superflui prima di esporla in staging. Fermato il solo staging, crea un volume nuovo, impostalo in `staging.env` e ripristina la copia con il blocco del passo 5. Riavvia e prova pagine, progetti, immagini e CMS.
4. Programma un backup giornaliero e uno prima di ogni rilascio. Unisci i due blocchi in `/usr/local/sbin/lobostudio-backup`, di proprietà di root e con permessi `0700`. Includi la funzione `lobostudio` e sostituisci le letture interattive con l’ambiente `production`, la chiave pubblica e il nome del bucket. Passa allo stadio di cifratura il percorso stampato dallo stadio SQLite. Usa una configurazione `rclone` dedicata con percorso esplicito e permessi `0600`. Prova lo script con `sudo /usr/local/sbin/lobostudio-backup` prima di schedularlo. Crea questi due file in `/etc/systemd/system/`. [Timer di systemd](https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html)

~~~ini
# lobostudio-backup.service
[Service]
Type=oneshot
WorkingDirectory=/srv/lobostudio
ExecStart=/usr/local/sbin/lobostudio-backup
~~~

~~~ini
# lobostudio-backup.timer
[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
~~~

Ricarica systemd con `sudo systemctl daemon-reload`, poi avvia il timer con `sudo systemctl enable --now lobostudio-backup.timer`. Controlla l’esito con `sudo journalctl -u lobostudio-backup.service` e configura un avviso su errore o copia mancante. Concorda conservazione e tempi di recupero, configura la scadenza sul prefisso dei backup e ripeti la prova di ripristino. [Scadenza oggetti R2](https://developers.cloudflare.com/r2/buckets/object-lifecycles/)


## 8. Pubblica sul dominio definitivo

1. Controlla diritti delle immagini, recapiti, policy e redirect nel registro go-live. Per avere le prime schede già visibili al lancio, preparale sulla 3080 e importa i contenuti approvati nel nuovo volume di produzione con il passo 5. Puoi anche avviare un volume vuoto e aggiungere i progetti nel CMS dopo l’apertura del dominio.
2. Verifica che `production.env` punti al digest collaudato e a `lobo-cms-production`. Avvia sul loopback, controlla la salute e completa il backup di produzione fuori host.

~~~bash
lobostudio production config --quiet
lobostudio production pull web
lobostudio production up -d --no-build --wait web
lobostudio production ps
curl -fsS http://127.0.0.1:3081/ -o /dev/null
~~~

3. Prima di collegare il dominio al nuovo origin, crea un’applicazione Access per il pannello del dominio canonico e copri `/admin` e `/admin/*` con le identità autorizzate. Nella finestra concordata collega il dominio definitivo al tunnel verso `http://127.0.0.1:3081`. Attiva HTTPS e configura le varianti del dominio per il redirect al canonico. Applica i redirect 301 degli URL Weebly confermati. Mantieni una copia dei record modificati e la possibilità di tornare a Weebly durante il collaudo. [Percorsi Access](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/)
4. Da una rete esterna verifica che Home e portfolio siano pubblici e che `/admin`, `/admin/` e i percorsi amministrativi passino da Access. Verifica con una persona autorizzata il login CMS. Controlla schede, foto pubblicate e protezione delle bozze, recapiti, HTTPS, redirect, canonical, sitemap e `robots.txt`. Se serve diagnostica, usa `lobostudio production logs --tail=100 web` e `sudo journalctl -u cloudflared -n 100`. Aggiungi monitoraggio HTTPS, disco e backup.
5. Registra data, commit, digest, dominio, nome del volume e posizione del backup. Da questo momento il redattore pubblica sul CMS live. Il sito legge le modifiche dal database.

## 9. Rilascia una modifica successiva dal codice

1. Apri un branch dal commit di produzione o dalla base concordata. Se ti servono le ultime pubblicazioni, porta una copia recente del database e i media necessari sul tuo PC o in staging. Per modifiche puramente grafiche basta spesso un campione approvato. La copia locale rappresenta lo stato al momento dello snapshot.
2. Dopo revisione e CI, aggiorna `LOBO_IMAGE` in `staging.env` con il digest della build candidata. Esegui `lobostudio staging pull web` e `lobostudio staging up -d --no-build --wait web`. Prova la nuova versione con dati già esistenti. Per una migrazione, prova anche il rollback e concorda un’eventuale sospensione delle scritture.
3. Crea un backup di produzione. Registra il digest attuale. Aggiorna **solo `LOBO_IMAGE`** in `production.env` per un rilascio del codice e ripeti i comandi del passo 8. Con una sola istanza considera una breve interruzione mentre Compose sostituisce il container. Verifica subito HTTPS, pagine, media e login. Il nuovo container legge dallo stesso volume anche i progetti pubblicati dopo che hai scaricato la tua copia. [Ricreazione dei container con Compose](https://docs.docker.com/reference/cli/docker/compose/up/)
4. Se il difetto è nel codice e lo schema è compatibile, rimetti il digest precedente in `production.env` e ripeti `pull` e `up`. Per una correzione editoriale usa la cronologia del CMS. Per il recupero dell’intero database, ferma le scritture, salva lo stato corrente, verifica il backup su un volume separato e concorda il recupero delle modifiche successive. [Procedura operativa](../AGENTS.md#interventi-dopo-la-pubblicazione)

### Trasforma il rilascio in un pulsante su GitHub

Il job del passo 2 automatizza commit → test → immagine. Dopo aver collaudato un rilascio manuale, puoi aggiungere un workflow `workflow_dispatch` dal ramo `main`. Il campo di input è il digest già collaudato. Il job invoca via SSH uno script sul VPS che valida namespace e digest, crea il backup, aggiorna il riferimento dell’immagine e controlla la salute del sito. Usa una chiave dedicata con impronta SSH verificata, limita il comando eseguibile sul VPS e serializza i rilasci. Le approvazioni GitHub Environment dipendono dal piano e dalla visibilità del repository. Con questo flusso apri **Actions → Run workflow**, scegli la build e lanci il rilascio. [Workflow manuali GitHub](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow) · [Approvazioni e disponibilità](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments)

## 10. Prepara la crescita dell’archivio

Misura su un campione il peso effettivo dei WebP, la crescita del database, lo spazio residuo e il tempo di backup e ripristino. **500 × 20 × 300 KB ≈ 3 GB** per una sola variante, prima di video e derivati. Trenta copie giornaliere complete di un database da 3 GB occupano circa **90 GB** fuori server. Se il tempo di ripristino o il volume delle copie supera gli obiettivi concordati, anticipa il passaggio a storage oggetti. SQLite può restare sul VPS per progetti, metadati e cronologia. Valuta PostgreSQL se serviranno più istanze scriventi o se il carico misurato lo richiede. [Quando usare SQLite](https://www.sqlite.org/whentouse.html)

Prima dell’importazione massiva, implementa la destinazione R2 dei media nel CMS. Mantieni gli ID e gli URL esistenti, copia in modo ripetibile i BLOB, verifica quantità e checksum e prova bozze, immagini pubblicate, revoca e rollback. Mantieni private le immagini in bozza e applica la cache solo agli oggetti autorizzati alla pubblicazione. Gestisci i video separatamente secondo dimensioni e modalità di riproduzione. Prova un ripristino di database e oggetti collegati. Mantieni credenziali e bucket distinti per l’archivio dei media e per i backup. [Cloudflare R2](https://developers.cloudflare.com/r2/get-started/)
