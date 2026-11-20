---
name: lobo-quality-security
description: Revisionare sicurezza, privacy, performance, SEO, accessibilità, form contatti e go-live readiness del sito LoboStudio prima di PR o pubblicazione.
---
# QA / release gate
1. Leggi `docs/quality-security-legal.md` e `docs/go-live-status.md`.
2. Esegui test reali: lint, typecheck, unit, build ed E2E se configurati. Non affermare di averli eseguiti senza output.
3. Verifica con browser, keyboard, responsive, immagini fallite, alt e motion reduction.
4. Audit dipendenze e segreti, validazione form lato server, abuse prevention, error handling, cache e HTTPS headers pertinenti.
5. Verifica che tracker/iframe font/video non violino scelte privacy e che le informative non siano false certificazioni.
6. Identifica claim non verificati, materiale protetto e dati legali assenti.
7. Aggiorna `docs/go-live-status.md` con evidenze. Blocca marcatura 'pronto al deploy' se esistono requisiti PENDING critici.
8. Output: difetti ordinati per gravità, fix applicati, regressioni, verifiche manuali residue.
