# LoboStudio — Git / GitHub workflow

## Strategia: GitHub Flow (no develop fisso)
`main` è la linea integrabile e rilasciabile; per ogni variazione aprire un branch breve. Rilasci controllati con tag `v0.1.0`, `v1.0.0` quando approvati. In autonomia, il developer può committare localmente; push, PR remota, merge e deploy richiedono autorizzazione.

## Branch names
- `feat/app-foundation`, `feat/home-editorial`, `feat/portfolio`, `feat/studio-services`
- `fix/mobile-nav`, `fix/contact-validation`, `hotfix/critical-issue`
- `docs/weebly-migration`, `chore/ci-pipeline`, `test/portfolio-e2e`, `refactor/content-loader`
- Se usi GitHub Issues: `feat/12-portfolio-filter`.

## Conventional Commits
Formato `<type>(<scope>): <imperative description>` in inglese o italiano coerente, preferito inglese per tooling.
| Type | Uso | Esempio |
|---|---|---|
| `feat` | Funzionalità | `feat(portfolio): add typed project gallery` |
| `fix` | Correzione bug | `fix(nav): keep dropdown keyboard accessible` |
| `style` | Stile senza logica | `style(home): tune hero typography` |
| `refactor` | Riordino senza cambiare comportamento | `refactor(content): centralize project schema` |
| `test` | Test | `test(portfolio): cover filters and empty state` |
| `docs` | Documentazione | `docs(setup): add Windows PowerShell instructions` |
| `chore` | Manutenzione/config | `chore(repo): configure editorconfig` |
| `ci` | Pipeline | `ci(github): add lint typecheck test build` |
| `perf` | Performance | `perf(images): optimize hero image loading` |

## Sequenza quotidiana PowerShell
```powershell
git status --short --branch
git switch main
git pull --ff-only      # solo se il remote esiste e si è autorizzati
# Crea branch dalla main aggiornata
git switch -c feat/portfolio
# Lavorare e verificare
git diff --check
npm run lint
npm run typecheck
npm run test:unit
# Stage selettivo, non git add . a occhi chiusi
git add app/progetti components/portfolio content/projects tests
# Verifica che nessun segreto/originale sia staged
git diff --cached --stat
git diff --cached
git commit -m "feat(portfolio): add filterable project archive"
# Niente push / PR senza approvazione
```

## Review e merge
1. Lavoro su feature branch con 1–5 commit atomici coerenti (numero indicativo).
2. Esegui CI locale: `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build`; Playwright su funzionalità chiave.
3. Apri PR con template: perché, cosa, screenshot mobile/desktop, rischi, test, checklist assets/legal.
4. `main`: idealmente richiede PR + CI verde + almeno una review (per progetto solo, self-review consapevole in assenza di altro reviewer). Configurare GitHub Rulesets/branch protection **quando la repo remota viene creata**; non promettere un enforcement che non è stato configurato.
5. Preferisci `Squash and merge` per mantenere main leggibile, dopo review. Mantieni commit atomici nel branch per debug; il commit squash è una feature logica.
6. Tag e changelog per release; prima di produzione prepara rollback e backup dei dati/asset.

## Bootstrap (solo se `.git/` non esiste)
```powershell
git init -b main
git add AGENTS.md docs .github .gitignore .env.example README.md
git diff --cached --check
git commit -m "chore(repo): initialize LoboStudio project"
git switch -c feat/app-foundation
```
Adatta `git add` all'esistenza dei file. Se la repository esiste, non reinizializzarla.

## Guardrail
- Vietato `git reset --hard`, `git clean -fd`, `push --force`, `--no-verify` senza motivazione e approvazione.
- Non committare `.env.local`, chiavi, email di test, foto non autorizzate o backup pesanti.
- Le skill, le configurazioni MCP locali e gli originali restano fuori dal repository. Prima di pubblicare un branch verifica anche i commit locali che diventerebbero raggiungibili dal remoto.
- Se un tool crea file temporanei, pulirli solo dopo avere verificato di averne titolarità.
- Mai modificare `main` direttamente per nuove feature salvo setup iniziale esplicitamente previsto.
- Quando si consegna: comunicare branch, commit, `git status`, test e lista di operazioni remote da autorizzare.
