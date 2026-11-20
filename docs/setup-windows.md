# Setup Windows

Usa PowerShell e Node.js 24 LTS. La cartella chiamata `$HOME` è letterale. Usa le virgolette singole e `Set-Location -LiteralPath` come nel README. I comandi npm si eseguono dalla root del repository.

`npm run dev` e `npm run start` si legano a 127.0.0.1. Per provare la build in locale esegui `npm run build` seguito da `npm run start`. Se la porta 3000 è occupata, usa `npm run dev -- --port 3001`.

Per eseguire i test nel browser, installa Chromium con `npx playwright install chromium`. Con i container attivi puoi eseguire entrambe le suite dalla root.

```powershell
$env:LOBO_E2E_BASE_URL = 'http://127.0.0.1:3081'
Remove-Item Env:LOBO_E2E_PREVIEW -ErrorAction SilentlyContinue
npm run test:e2e
$env:LOBO_E2E_BASE_URL = 'http://127.0.0.1:3080'
$env:LOBO_E2E_PREVIEW = '1'
npm run test:e2e
Remove-Item Env:LOBO_E2E_BASE_URL, Env:LOBO_E2E_PREVIEW
```

L’anteprima completa richiede gli originali locali in `asset/`. I comandi Docker per avvio e arresto sono nel [README](../README.md#avvio-con-docker).
