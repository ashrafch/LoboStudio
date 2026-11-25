# Skill e configurazioni locali

Codex trova le skill di progetto in `.agents/skills/<nome>/SKILL.md` e quelle dell’utente in `$HOME/.agents/skills/<nome>/SKILL.md`. Mantieni una cartella per skill al livello che Codex si aspetta. Le copie già installate per altri agenti seguono i loro percorsi di ricerca.

Git ignora `.agents/`, `.claude/`, `.codex/`, `.mcp.json` e `skills-lock.json`. Le skill installate, le risorse collegate e le configurazioni personali restano sul computer. Un clone usa [AGENTS.md](../AGENTS.md) e le guide del progetto anche senza le skill locali.

## Skill locali di LoboStudio
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
git check-ignore -- .agents/skills .claude .codex .mcp.json skills-lock.json
```
Usa l’installazione locale al progetto per le skill specifiche di LoboStudio. Usa il livello utente per le skill generali che vuoi condividere tra progetti. Controlla versione e contenuto prima di installare una skill esterna.

## Documentazione verificabile
- OpenAI Codex: https://learn.chatgpt.com/docs/build-skills
- Vercel: https://vercel.com/docs/agent-resources/skills
- Repo: https://github.com/vercel-labs/agent-skills
