# Setup Windows

Usa PowerShell e Node.js 24 LTS. La cartella chiamata `$HOME` è letterale. Usa le virgolette singole e `Set-Location -LiteralPath` come nel README. I comandi npm si eseguono dalla root del repository.

`npm run dev` e `npm run start` si legano a 127.0.0.1. Per provare la build in locale esegui `npm run build` seguito da `npm run start`. Se la porta 3000 è occupata, usa `npm run dev -- --port 3001`.

Per il test Playwright esegui `npx playwright install chromium`. Prima di avviare la suite di sviluppo arresta il server della stessa checkout con Ctrl+C. Il README contiene le sequenze complete. I WebP in `.local-media` rimangono locali. Le variabili di configurazione di esempio sono in `.env.example`. Docker non è richiesto per questa architettura.
