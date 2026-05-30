# CLAUDE.md

Contexto del proyecto para Claude Code.

## Qué es este repo

Landing de Tendr, mini-CRM B2B para freelancers junior. Construida en el módulo 5/L16 del curso de desarrollo agéntico.

## Material del curso

El material del módulo está copiado en `docs/curso/`. Incluye plan, brief, plantillas y operación. Referenciar siempre desde ahí, no desde rutas externas.

## Stack (se cierra en F1)

Next.js 16 (App Router) + Tailwind v4 + shadcn/ui + Drizzle ORM + Neon Postgres + pnpm 11+. Hosting Vercel Hobby.

## Convenciones

- Commits convencionales (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`). Sin Co-Authored-By.
- Tags `clase-N` por fase. Cada tag publica un GitHub Release con notas.
- ADRs en `docs/decisions/NNN-titulo.md`.
- Documentación del curso en `docs/curso/` (refrescable con `bash scripts/bootstrap-docs-curso.sh`).
