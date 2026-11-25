param(
    [Parameter(Mandatory)][ValidateSet('Start', 'Status', 'Stop')][string]$Action,
    [string]$AllowedMail
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$state = Join-Path $env:LOCALAPPDATA 'LoboStudio/editor-preview'
$hostFile = Join-Path $state 'host.txt'
$mediaFile = Join-Path $state 'media-path.txt'
$seedMarker = Join-Path $state 'seeded.txt'
$credential = Join-Path $state '.env.cms'
$passwordFile = Join-Path $state '.env.cms-login'
$tunnel = Join-Path $PSScriptRoot 'client-tunnel.ps1'
$composeArgs = @('-f', 'docker/compose.editor-preview.yaml')

function Read-EditorHash {
    $entry = (Get-Content -Raw -LiteralPath $credential).Trim()
    if ($entry -notmatch '^CMS_PASSWORD_HASH=([a-f0-9]{32}:[a-f0-9]{128})$') {
        throw 'Credenziale della copia di prova non valida.'
    }
    $Matches[1]
}

if ($Action -eq 'Status') {
    & $tunnel -Action Status -Mode Editor
    return
}

Push-Location -LiteralPath $root
try {
    if ($Action -eq 'Stop') {
        & $tunnel -Action Stop -Mode Editor
        if ((Test-Path -LiteralPath $hostFile) -and (Test-Path -LiteralPath $mediaFile)) {
            $env:LOBO_EDITOR_HOST = (Get-Content -Raw -LiteralPath $hostFile).Trim()
            $env:LOBO_EDITOR_MEDIA_DIR = (Get-Content -Raw -LiteralPath $mediaFile).Trim()
            $env:LOBO_EDITOR_PASSWORD_HASH = Read-EditorHash
            docker compose @composeArgs stop
            if ($LASTEXITCODE -ne 0) { throw 'Impossibile fermare i container della copia di prova.' }
        }
        return
    }

    New-Item -ItemType Directory -Path $state -Force | Out-Null
    if (-not (Test-Path -LiteralPath $mediaFile)) {
        $reviewSnapshot = Join-Path $env:LOCALAPPDATA 'LoboStudio/client-preview/media-path.txt'
        if (-not (Test-Path -LiteralPath $reviewSnapshot)) { throw 'Prepara prima i media della preview di consultazione.' }
        $snapshot = (Get-Content -Raw -LiteralPath $reviewSnapshot).Trim()
        Set-Content -LiteralPath $mediaFile -Value $snapshot
    }
    $env:LOBO_EDITOR_MEDIA_DIR = (Get-Content -Raw -LiteralPath $mediaFile).Trim()
    foreach ($folder in 'images', 'videos') {
        if (-not (Test-Path -LiteralPath (Join-Path $env:LOBO_EDITOR_MEDIA_DIR $folder) -PathType Container)) {
            throw "Snapshot incompleto: cartella $folder non disponibile."
        }
    }

    if (-not (Test-Path -LiteralPath $credential)) {
        Push-Location -LiteralPath $state
        try {
            node (Join-Path $PSScriptRoot 'setup-cms.mjs') | Out-Null
            if ($LASTEXITCODE -ne 0) { throw 'Impossibile creare le credenziali della copia di prova.' }
        } finally { Pop-Location }
    }
    $env:LOBO_EDITOR_PASSWORD_HASH = Read-EditorHash

    $url = & $tunnel -Action Start -Mode Editor -AllowedMail $AllowedMail
    try {
        if ($url -notmatch '^https://[a-z0-9-]+\.trycloudflare\.com$') {
            throw 'Origine HTTPS del tunnel non valida.'
        }
        $deadline = (Get-Date).AddSeconds(60)
        $emailGateReady = $false
        do {
            try {
                $gate = Invoke-WebRequest -Uri "$url/admin" -SkipHttpErrorCheck -TimeoutSec 8
                $emailGateReady = $gate.StatusCode -eq 200 -and $gate.Content -match 'id="totp-form"' -and
                    $gate.Content -match 'Cloudflare Access' -and $gate.Content -notmatch 'Password amministratore'
            } catch [System.Net.Http.HttpRequestException] { }
            if (-not $emailGateReady) { Start-Sleep -Seconds 2 }
        } until ($emailGateReady -or (Get-Date) -ge $deadline)
        if (-not $emailGateReady) {
            throw 'Il controllo del codice email sul tunnel non è riuscito.'
        }
        $env:LOBO_EDITOR_HOST = ([uri]$url).Host
        Set-Content -LiteralPath $hostFile -Value $env:LOBO_EDITOR_HOST

        docker compose @composeArgs build studio | Out-Host
        if ($LASTEXITCODE -ne 0) { throw 'Build della copia di prova non riuscita.' }

        if (-not (Test-Path -LiteralPath $seedMarker)) {
            $seedName = "lobo-editor-$([guid]::NewGuid().ToString('N')).sqlite"
            $containerSeed = "/tmp/$seedName"
            $localSeed = Join-Path $state $seedName
            try {
                Get-Content -Raw -LiteralPath (Join-Path $PSScriptRoot 'editor-preview-seed.mjs') |
                    docker compose exec -T preview node --input-type=module - $containerSeed
                if ($LASTEXITCODE -ne 0) { throw 'Copia dei contenuti pubblicati non riuscita.' }
                docker compose cp "preview:$containerSeed" $localSeed
                if ($LASTEXITCODE -ne 0) { throw 'Trasferimento della copia SQLite non riuscito.' }
                docker compose @composeArgs run --rm --no-deps -T --volume "${localSeed}:/seed.sqlite:ro" studio node -e `
                    "const f=require('node:fs'); if (!f.existsSync('/data/site.sqlite')) f.copyFileSync('/seed.sqlite','/data/site.sqlite',f.constants.COPYFILE_EXCL)"
                if ($LASTEXITCODE -ne 0) { throw 'Inizializzazione del volume isolato non riuscita.' }
                Set-Content -LiteralPath $seedMarker -Value 'Copia iniziale importata.'
            } finally {
                docker compose exec -T preview rm -f $containerSeed | Out-Null
                if (Test-Path -LiteralPath $localSeed) { Remove-Item -LiteralPath $localSeed }
            }
        }

        docker compose @composeArgs up -d --no-build --wait
        if ($LASTEXITCODE -ne 0) { throw 'Avvio della copia di prova non riuscito.' }
        $admin = Invoke-WebRequest -Uri 'http://127.0.0.1:3083/admin' -SkipHttpErrorCheck -TimeoutSec 15
        if ($admin.StatusCode -ne 200 -or $admin.Content -notmatch 'Password amministratore' -or
            $admin.Headers['X-Robots-Tag'] -notmatch 'noindex') {
            throw 'Il pannello della copia di prova non ha superato il controllo locale.'
        }
        [pscustomobject]@{ Url = "$url/admin"; PasswordFile = $passwordFile }
    } catch {
        & $tunnel -Action Stop -Mode Editor
        throw
    }
} finally {
    Remove-Item -LiteralPath Env:\LOBO_EDITOR_HOST,Env:\LOBO_EDITOR_MEDIA_DIR,Env:\LOBO_EDITOR_PASSWORD_HASH -ErrorAction SilentlyContinue
    Pop-Location
}
