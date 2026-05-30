# AGENTS.md

Política de aislamiento y trabajo de agentes en este repo.

## Aislamiento

- Cada agente trabaja en una rama feature, nunca directo en `main`.
- PRs cerrados por el sénior, no auto-merge.
- Sin acceso a credenciales de producción; solo `.env.local` (gitignored).

## Material del curso

Ver `docs/curso/`. Si un prompt referencia una plantilla o snippet, está ahí.
