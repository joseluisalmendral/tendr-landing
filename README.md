# Tendr Landing

Landing pública de **Tendr**, un mini-CRM B2B con IA para freelancers y perfiles junior. Pre-lanzamiento: la landing presenta el producto, sus planes y captura emails para la waitlist.

**Producción:** <https://tendr-landing.vercel.app>

> Proyecto construido en el módulo 5/L16 del curso de desarrollo agéntico. El material del curso vive en [`docs/curso/`](docs/curso/).

## Stack

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, RSC, Server Actions) |
| UI | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) + [Motion](https://motion.dev) + [Lenis](https://lenis.darkroom.engineering) |
| Datos | [Drizzle ORM](https://orm.drizzle.team) + [Neon Postgres](https://neon.tech) (serverless) |
| Anti-bot | [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) |
| Testing | [Vitest](https://vitest.dev) + Testing Library (unit) · [Playwright](https://playwright.dev) (e2e + smoke) |
| Hosting | [Vercel](https://vercel.com) (Hobby — ver [disclaimer ToS](#disclaimer-tos-de-vercel-hobby)) |
| Tooling | pnpm 11 · TypeScript 5 · ESLint 9 |

## Arranque rápido

Requisitos: Node 24+ y pnpm 11+ (`corepack enable` lo resuelve desde el campo `packageManager`).

```bash
pnpm install
cp .env.example .env.local   # o `vercel env pull .env.local` si tenés acceso al proyecto
pnpm dev                     # http://localhost:3000
```

### Variables de entorno

| Variable | Uso | Sensible |
|---|---|---|
| `DATABASE_URL` | Connection string de Neon (branch `main` en dev, `prod` en producción) | ✦ |
| `TURNSTILE_SECRET_KEY` | Verificación server-side del token Turnstile | ✦ |
| `SUBSCRIBE_SALT` | Sal del hash de IP para rate limiting (distinta por entorno; no rotar) | ✦ |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Widget Turnstile en el cliente | — |
| `NEXT_PUBLIC_SITE_URL` | URL canónica para metadata/JSON-LD | — |

Las sensibles se gestionan con `vercel env add` (interactivo, sin valores en el historial). Para desarrollo local, Cloudflare publica [test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) que siempre validan.

### Base de datos

```bash
pnpm exec drizzle-kit push      # aplica el schema (db/schema/) al branch de DATABASE_URL
```

## Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` / `pnpm start` | Build y servidor de producción |
| `pnpm lint` | ESLint |
| `pnpm test` / `pnpm test:watch` | Unit tests (Vitest) |
| `pnpm test:e2e` | Suite e2e completa (Playwright, levanta su propio server) |
| `pnpm smoke` | Smoke post-build: la landing carga y el form de waitlist envía OK |

## CI/CD

- **CI** (`.github/workflows/ci.yml`): en cada PR y push a `main` — typecheck, unit tests, build de producción y smoke test con Playwright contra `next start`. El submit del form se prueba de verdad (Turnstile test keys + Neon dev vía secret `DATABASE_URL`).
- **CD**: integración Git de Vercel — push a `main` despliega producción; cada PR genera un preview. `main` está protegida: el check `ci` es obligatorio para mergear.
- **Auditoría**: la Skill [`landing-auditor`](.claude/skills/landing-auditor/) audita la landing publicada en 5 capas (performance, SEO, GEO, a11y, motion). Reportes en [`docs/audits/`](docs/audits/).

## Estructura

```
app/                  Rutas (App Router): /, /agencias, /pricing, /privacy, /terms
  actions/            Server Actions (subscribe + tests)
components/
  landing/            Secciones y piezas de la landing
  seo/                Metadata helpers + JSON-LD
  ui/                 Primitivas shadcn/ui
db/                   Cliente Drizzle + schema (subscribers)
drizzle/              Migraciones generadas
e2e/                  Playwright: landing.spec (motion) + smoke.spec (CI)
docs/
  decisions/          ADRs (stack, dirección visual, hosting/ToS)
  audits/             Reportes de landing-auditor + audit.config.json
  curso/              Material del curso (plan, brief, plantillas)
```

## Decisiones de arquitectura

Las decisiones relevantes están documentadas como ADRs en [`docs/decisions/`](docs/decisions/):

- [001 · Stack](docs/decisions/001-stack.md)
- [002 · Dirección visual](docs/decisions/002-direccion-visual.md)
- [003 · Plan de hosting y ToS de Vercel](docs/decisions/003-deploy-tos.md)

## Disclaimer: ToS de Vercel Hobby

Esta landing corre en el plan **Hobby (gratuito) de Vercel**, que el ToS restringe a uso *"personal or non-commercial"* (ToS §4). Las [Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage) definen uso comercial de forma amplia — incluye *"advertising the sale of a product or service"* — por lo que una landing con pricing de planes de pago **encaja en esa definición aunque aún no facture**.

Riesgos asumidos mientras no haya decisión (estado: propuesto):

- Vercel puede exigir upgrade a Pro (20 $/mes) o retirar el deployment; su práctica documentada es avisar antes, pero el contrato permite actuar sin aviso.
- En Hobby no hay pay-as-you-go: exceder un límite (100 GB bandwidth, 1M function invocations…) pausa la feature hasta 30 días.

Los tres caminos de salida (mantener Hobby, Pro, o migrar a Cloudflare/Netlify/Render) están analizados con citas y tradeoffs en el **[ADR 003](docs/decisions/003-deploy-tos.md)**. Revisión programada: anual.

## Convenciones

- Commits convencionales (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`).
- Cada fase del curso se cierra con un tag `clase-N` y su GitHub Release.
- ADRs para toda decisión con tradeoffs (`docs/decisions/NNN-titulo.md`).

## Licencia

[MIT](LICENSE).
