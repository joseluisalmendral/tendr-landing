# ADR-001 · Stack y scaffolding

- **Estado:** Aceptado
- **Fecha:** 2026-05-31
- **Fase:** F1 (Clase 1)

## Contexto

Tendr es una landing + mini-CRM B2B para freelancers junior. La F1 cierra el
stack y deja el proyecto scaffoldeado, con la capa de datos instalada y una
postura de seguridad de la cadena de suministro activa desde el primer commit.
Las decisiones se toman sobre el ecosistema vigente a mayo de 2026.

## Decisión

### Framework y build

- **Next.js 16.2.6** con **App Router** y **Turbopack** como bundler por defecto
  (en Next 16 ya no se configura por flag).
- **React 19.2.4**, **TypeScript 5.9.3**, **Tailwind CSS v4** (vía
  `@tailwindcss/postcss`), **ESLint 9** (`eslint-config-next`).
- Sin directorio `src/`, alias de imports `@/*`, sin React Compiler (se evalúa
  más adelante de forma deliberada).
- **pnpm 11.5** como gestor obligatorio (ver postura de seguridad).

### UI

- **shadcn/ui 4.8.3** con:
  - Librería de primitivas: **Radix** — madura y con el ecosistema completo de
    bloques de marketing que necesita una landing.
  - Estilo: **Lyra** (`style: "radix-lyra"`) — sharp/técnico, alineado con la
    estética de producto tech vigente.
  - `baseColor: neutral`, `cssVariables: true`, iconos **Phosphor**.

### Datos y validación

- **drizzle-orm 0.45.2** como ORM headless y type-safe.
- **@neondatabase/serverless 1.1.0** como driver para Neon Postgres.
- **zod 4.4.3** para validación de esquemas en runtime.
- **drizzle-kit 0.31.10** (dev) para migraciones.
- Convención de conexión: `DATABASE_URL` pooled para runtime serverless;
  conexión directa (unpooled) reservada para migraciones de `drizzle-kit`.

### Seguridad de la cadena de suministro

Postura definida en `docs/curso/operacion/produccion-del-curso.md` §13 (defensa
frente a Shai-Hulud y variantes):

- `.npmrc` versionado con los defaults endurecidos de pnpm 11 declarados de
  forma explícita: `strict-dep-builds`, `minimum-release-age=1440`,
  `block-exotic-subdeps`.
- Build scripts nativos aprobados de forma explícita en `pnpm-workspace.yaml`
  (`allowBuilds`): `sharp`, `unrs-resolver`, `msw`, `esbuild`.
- **gitleaks** como hook de pre-commit (`.githooks/pre-commit`, activado con
  `git config core.hooksPath .githooks`) para bloquear secretos antes de que
  entren al historial.

### Hosting

- **Vercel Hobby**.

## Consecuencias

### Positivas

- Stack moderno, type-safe de extremo a extremo (Drizzle + Zod + TS).
- Defensa de supply chain activa desde el primer commit, no como añadido tardío.
- shadcn con Radix mantiene abierto el catálogo de bloques para F5/F6.

### Costes y trade-offs

- Los defaults endurecidos de pnpm exigen aprobar cada build script de forma
  explícita: es fricción deliberada, no un bug.
- Apostar por Radix (frente a Base UI) prioriza ecosistema sobre la primitiva
  más nueva; revisable si el caso lo pide.
- `core.hooksPath` es config local: cada clon nuevo debe activarlo una vez.

### Seguimiento

- `drizzle.config.ts` + cliente Neon (pendiente del `DATABASE_URL`).
- Consolidar las fuentes en `app/layout.tsx` (Geist + JetBrains Mono redundantes).
