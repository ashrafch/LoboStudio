# Skill Codex — come usarle senza duplicati

Codex cerca skill nel repository sotto `.agents/skills/<nome>/SKILL.md`, e per l'utente sotto `$HOME/.agents/skills/<nome>/SKILL.md` (Windows tipicamente `%USERPROFILE%\.agents\skills`). Usa skills locali per le regole specifiche di LoboStudio e skill utente per regole generali tra progetti.

## Skill già incluse nel kit
- `lobo-design-system`: guida visuale e interazioni LOBO.
- `lobo-content-migration`: classificazione progetti e migrazione Weebly.
- `lobo-git-delivery`: branch, commit e PR.
- `lobo-quality-security`: controlli qualità, sicurezza e legal gate.

## Skill esterne consigliate, da installare solo se assenti
- Vercel `vercel-react-best-practices` (performance React/Next.js).
- Vercel `web-design-guidelines` (audit UX/accessibilità; attenzione: versioni della skill possono caricare regole da remote `main`, revisionare sorgenti/changes in pipeline).
- Vercel `vercel-composition-patterns` (se componenti crescono e serve riuso).
- Vercel `building-components` (facoltativa, accessibilità componenti).
- `agent-browser` o uso nativo di Playwright (facoltativo, se l'ambiente consente test visivi).

## Comandi PowerShell (dalla root)
```powershell
Get-ChildItem -Path .\.agents\skills -Directory -ErrorAction SilentlyContinue
Get-ChildItem -Path "$HOME\.agents\skills" -Directory -ErrorAction SilentlyContinue
# Mostra opzioni CLI e conferma dove installerà (progetto vs globale)
npx skills --help
# Esempi dalla repo del publisher
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
```
Se la CLI domanda l'agente, seleziona **Codex** e installazione **Project** se desideri versionarle nella repo; se già installate user-level non serve duplicarle. Controlla versioni e contenuti prima di installare skill di terzi.

## Documentazione verificabile
- OpenAI Codex: https://learn.chatgpt.com/docs/build-skills
- Vercel: https://vercel.com/docs/agent-resources/skills
- Repo: https://github.com/vercel-labs/agent-skills
