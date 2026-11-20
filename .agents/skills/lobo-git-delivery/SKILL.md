---
name: lobo-git-delivery
description: Quando Codex implementa feature, bugfix o documentazione in LoboStudio, applica GitHub Flow, branch dedicati, Conventional Commits, CI e PR review senza push non autorizzati.
---
# Git task delivery
1. Prima di modificare: `git status --short --branch`; controlla root, remote, modifiche utente e branch.
2. Leggi `docs/git-workflow.md`. Se non esiste repo, fai bootstrap sicuro; altrimenti non reinizializzare.
3. Usa branch `feat/`, `fix/`, `chore/`, `docs/`, `test/`, `refactor/`, `hotfix/` a durata breve.
4. Segmenta lavoro in incrementi testabili; commit solo file correlati e scrivi messaggi Conventional Commits.
5. Prima del commit `git diff --check`, revisione `git diff --cached`, test pertinenza e segreti.
6. Prima della PR prepara sommario, screenshot, checklist CI e note rollback; non pushare/aprire PR remote/mergiare/deployare senza istruzione esplicita.
7. Report di consegna: `branch`, commit hash, working tree status, test eseguiti, blocchi.
