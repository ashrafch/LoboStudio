# Decision log (ADR light)

| ID | Decisione | Stato | Motivo |
|---|---|---|---|
| ADR-001 | Next.js App Router + TypeScript | Proposto | SEO e web app server-first |
| ADR-002 | Contenuti in repo, no DB MVP | Proposto | Semplicità, pochi editor e poco traffico previsto |
| ADR-003 | GitHub Flow senza `develop` permanente | Accettato nel brief | Team piccolo con feature branches |
| ADR-004 | Form contatti non attivo finché provider e security non sono pronti | Proposto | Niente false submission o PII perse |
| ADR-005 | Originali asset preservati, derivati web separati | Accettato nel brief | Qualità e tracciabilità |
| ADR-006 | No tracker non necessari nel MVP | Proposto | Privacy-by-design e velocità |
| ADR-007 | CMS introdotto solo quando serve editing autonomo | Proposto | Evitare costi e superfici d'attacco |
| ADR-008 | Docker multi-stage con servizi Compose per anteprima e produzione | Implementato | Riprodurre il sito su Linux e testare l’immagine distribuibile con i media privati confinati all’anteprima locale. |

Registrare nel tempo alternative valutate, tradeoff, chi ha approvato e data. Le decisioni `Proposto` non equivalgono all'approvazione del titolare.
