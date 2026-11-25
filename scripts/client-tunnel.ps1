param(
    [Parameter(Mandatory)][ValidateSet('Start', 'Status', 'Stop')][string]$Action,
    [string]$AllowedMail,
    [ValidateSet('Viewer', 'Editor')][string]$Mode = 'Viewer'
)
$ErrorActionPreference = 'Stop'

$editor = $Mode -eq 'Editor'
$state = Join-Path $env:LOCALAPPDATA $(if ($editor) { 'LoboStudio/editor-preview' } else { 'LoboStudio/client-preview' })
$stateFile = Join-Path $state 'tunnel.json'
$proxy = if ($editor) { 'http://127.0.0.1:3083' } else { 'http://127.0.0.1:3082' }
$metrics = if ($editor) { '127.0.0.1:49306' } else { '127.0.0.1:49305' }

function Get-ManagedProcess($record) {
    if (-not $record) { return }
    $process = Get-Process -Id $record.processId -ErrorAction SilentlyContinue
    if ($process -and $process.ProcessName -eq 'cloudflared' -and
        $process.StartTime.ToUniversalTime().Ticks -eq [long]$record.started) {
        return $process
    }
}

$record = if (Test-Path -LiteralPath $stateFile) {
    Get-Content -Raw -LiteralPath $stateFile | ConvertFrom-Json
}
$running = Get-ManagedProcess $record

if ($Action -eq 'Status') {
    if (-not $running) { Write-Output 'Tunnel fermo.'; return }
    $ready = Invoke-WebRequest -Uri "http://$metrics/ready" -SkipHttpErrorCheck -TimeoutSec 5
    [pscustomobject]@{ Url = $record.url; ProcessId = $running.Id; Ready = $ready.StatusCode -eq 200 }
    return
}
if ($Action -eq 'Stop') {
    if ($running) { Stop-Process -Id $running.Id }
    if (Test-Path -LiteralPath $stateFile) { Remove-Item -LiteralPath $stateFile }
    Write-Output 'Tunnel fermo.'
    return
}
if ($AllowedMail -notmatch '^[a-zA-Z0-9._+%-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$') {
    throw 'Indica un indirizzo email autorizzato per il tunnel protetto.'
}
if ($running) {
    if ($record.allowedMail -cne $AllowedMail) {
        throw 'Ferma il tunnel attivo prima di cambiare il destinatario.'
    }
    Write-Output $record.url
    return
}

$installed = Get-Command cloudflared -ErrorAction SilentlyContinue
$exe = if ($installed) { $installed.Source } else { Join-Path $env:LOCALAPPDATA 'LoboStudio/bin/cloudflared.exe' }
if (-not (Test-Path -LiteralPath $exe -PathType Leaf)) { throw 'Installa cloudflared prima di avviare il tunnel.' }
if (-not ((& $exe tunnel --help | Out-String).Contains('--allowed-mail'))) {
    throw 'Serve una versione di cloudflared con il supporto per --allowed-mail.'
}
if (-not $editor) {
    $homeResponse = Invoke-WebRequest -Uri "$proxy/" -SkipHttpErrorCheck -TimeoutSec 10
    $adminResponse = Invoke-WebRequest -Uri "$proxy/admin" -SkipHttpErrorCheck -TimeoutSec 10
    if ($homeResponse.StatusCode -ne 200 -or $homeResponse.Content -notmatch 'Progetti in fotografia' -or
        $adminResponse.StatusCode -ne 404 -or $homeResponse.Headers['X-Robots-Tag'] -notmatch 'noindex') {
        throw 'I controlli della preview isolata non sono riusciti.'
    }
}

New-Item -ItemType Directory -Path $state -Force | Out-Null
$log = Join-Path $state 'cloudflared.log'
$stdout = Join-Path $state 'cloudflared.stdout.log'
$process = Start-Process -FilePath $exe -WindowStyle Hidden -PassThru -RedirectStandardError $log -RedirectStandardOutput $stdout -ArgumentList @(
    'tunnel', '--url', $proxy, '--allowed-mail', $AllowedMail, '--protocol', 'http2', '--metrics', $metrics, '--no-autoupdate'
)

try {
    $deadline = (Get-Date).AddSeconds(40)
    do {
        Start-Sleep -Milliseconds 500
        $process.Refresh()
        if ($process.HasExited) { throw 'Cloudflared si è arrestato prima di aprire il tunnel.' }
        $match = [regex]::Match([string](Get-Content -Raw -LiteralPath $log), 'https://[a-z0-9-]+\.trycloudflare\.com')
        if ($match.Success) {
            $ready = Invoke-WebRequest -Uri "http://$metrics/ready" -SkipHttpErrorCheck -TimeoutSec 3 -ErrorAction SilentlyContinue
            if ($ready.StatusCode -eq 200) {
                @{ processId = $process.Id; started = [string]$process.StartTime.ToUniversalTime().Ticks; url = $match.Value; allowedMail = $AllowedMail } |
                    ConvertTo-Json | Set-Content -LiteralPath $stateFile
                Write-Output $match.Value
                return
            }
        }
    } while ((Get-Date) -lt $deadline)
    throw 'Cloudflare non ha registrato la connessione entro il tempo previsto.'
} catch {
    if (-not $process.HasExited) { Stop-Process -Id $process.Id }
    throw
}
