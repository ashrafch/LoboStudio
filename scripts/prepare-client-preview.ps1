$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$state = Join-Path $env:LOCALAPPDATA 'LoboStudio/client-preview'
$revision = git -C $root rev-parse --short HEAD
if ($LASTEXITCODE -ne 0) { throw 'Impossibile identificare il commit della preview.' }
$snapshot = Join-Path $state "media/$revision-$([guid]::NewGuid().ToString('N').Substring(0, 8))"
$images = Join-Path $snapshot 'images'
$videos = Join-Path $snapshot 'videos'
New-Item -ItemType Directory -Path $images, $videos -Force | Out-Null

Push-Location -LiteralPath $root
try {
    docker compose cp 'preview:/app/.local-media/.' $images
    if ($LASTEXITCODE -ne 0) { throw 'Avvia il servizio Docker preview prima di copiare le immagini.' }
    $manifest = Get-Content -Raw -LiteralPath 'content/preview-images.json' | ConvertFrom-Json
    foreach ($image in $manifest.PSObject.Properties.Name) {
        if (-not (Test-Path -LiteralPath (Join-Path $images "$image.webp") -PathType Leaf)) {
            throw "Derivato mancante per $image."
        }
    }
    foreach ($video in 'bologna_work_in_progress_988.mp4', 'sostegnazzo_video_presentazione_964.mp4') {
        Copy-Item -LiteralPath (Join-Path 'assets/archive/videos' $video) -Destination $videos
    }

    $env:LOBO_CLIENT_MEDIA_DIR = $snapshot
    docker compose -f docker/compose.client-preview.yaml up -d --build --force-recreate --wait
    if ($LASTEXITCODE -ne 0) { throw 'Build o avvio della preview non riuscito.' }
    Set-Content -LiteralPath (Join-Path $state 'media-path.txt') -Value $snapshot
    Write-Output 'Preview Docker disponibile su http://127.0.0.1:3082'
} finally {
    Pop-Location
}
