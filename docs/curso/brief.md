# Brief de la Lección: Landing de Tendr con design system iterable

## Metadatos

- **ID:** M5/L16
- **Módulo:** M5 · Track Fullstack
- **Lección:** L16 · Landing de Tendr con design system iterable
- **Tipo:** caso-práctico (todas las clases C1–C9 con frontmatter `tipo: caso-práctico`)
- **Descripción del syllabus (actualizada):** Caso práctico completo en el que el alumno construye la **landing pública de Tendr** (el producto que se desarrolla en L17). El alumno decide stack, hace exploración visual con IA (Stitch 2.0), destila la dirección elegida a un `design.md` versionado, construye componentes base con SEO + GEO + rendimiento + accesibilidad integrados, monta la landing con estructura GEO-friendly (`llms.txt`, `robots.txt` para crawlers de IA, JSON-LD profundo), genera variantes coherentes con motivo de negocio explícito, integra captura de email persistida en Neon, construye una Skill multicapa de auditoría (SEO + GEO + performance + a11y) y despliega a producción en Vercel con CI/CD, dominio y lectura crítica del ToS.
- **Verificado:** 2026-05-19
- **Producto del caso:** landing pública de **Tendr** (mini-CRM con IA que se construye en L17).
- **Conexión con L17:** comparten identidad visual (`design.md`), pricing tiers (Free / Pro €9 / Team €29 "próximamente") y Skill de auditoría reutilizable. Decisiones compartidas en `../_compartido/tecnico/preguntas-compartidas.md`.
- **Clases a generar:** 10 (C0, C1, C2, C3, C4, C5, C6, C7, C8, C9). C0 es guion corto del vídeo intro; C1–C9 son las fases del proyecto.

## Contexto de la lección

Primera lección del track Fullstack. El alumno construye la landing pública de un producto real (Tendr) que se desarrolla en la lección siguiente. El foco no es la landing en sí: es el **patrón de trabajo profesional con IA en 2026**, donde el flujo visual va antes que el código, el sistema de diseño se vive como spec versionado y los componentes nacen con SEO, GEO, rendimiento y accesibilidad dentro.

La novedad de 2026 que esta lección integra es **GEO (Generative Engine Optimization)**: cómo se estructura un sitio para que los LLMs (ChatGPT, Claude, Perplexity, Google AI Overviews) lo entiendan, lo citen y lo recomienden cuando alguien pregunta por un producto como Tendr. Sin esta capa, un sitio queda invisible al canal de descubrimiento que más crece.

La landing termina desplegada en Vercel con dominio (opcional), captura de email funcional persistida en Neon, una Skill propia de auditoría que el alumno se lleva a cualquier proyecto futuro, y una lectura honesta del ToS de Vercel Hobby que prepara el camino a L17.

## Output esperado del alumno

Al completar las guías de esta lección, el alumno será capaz de:

- Justificar y arrancar un stack moderno para landing (Next.js 16 + Tailwind v4 + shadcn/ui + Neon + Drizzle + Cloudflare Turnstile + Vercel) documentando la decisión en un ADR.
- Hacer exploración visual divergente con **Stitch 2.0** y galerías premium (21st.dev, Aceternity UI, Magic UI, React Bits) sin caer en copy-paste: usar el export como **referencia visual**, no como código final.
- Destilar la dirección visual elegida a un `design.md` operable: tokens (color, tipografía, escala), voz, principios y restricciones (negative instructions) que el agente lea como contexto persistente.
- Construir una biblioteca de componentes con SEO técnico, GEO, rendimiento (Core Web Vitals) y accesibilidad (WCAG AA) integrados desde el primer commit.
- Montar la landing con **estructura GEO-friendly**: `llms.txt`, `robots.txt` permitiendo GPTBot/ClaudeBot/PerplexityBot/Google-Extended, JSON-LD profundo (Organization, SoftwareApplication, FAQPage, Product) y FAQ con sub-queries reales que los LLMs citen.
- Generar variantes coherentes del sistema con motivo de negocio explícito (A/B testing, verticales, i18n, multimarca, estacionalidad) sin romper el spec.
- Integrar captura de email con Server Action + Zod + Drizzle + Neon + Cloudflare Turnstile, con rate limiting básico y manejo correcto de duplicados.
- Construir una **Skill propia multicapa** que audita SEO + GEO + performance + a11y de cualquier landing, reutilizable en L17 y en proyectos futuros.
- Desplegar en Vercel con CI/CD (GitHub Actions), dominio propio, smoke test con Playwright CLI y disclaimer documentado del ToS de Vercel Hobby.

---

## Contexto previo (lo que el alumno ya sabe al llegar aquí)

### Conceptos asumidos

El alumno ha completado el tronco común (M0–M4). Asumido:

- **Trabajo con agente operativo:** instalación, autenticación, sesión, permisos y `AGENTS.md` / `CLAUDE.md` (cubierto en L0, L3, L4).
- **Paradigma agéntico:** harness, loop ReAct, ventana de contexto, coste por sesión (cubierto en L2).
- **Context engineering:** preload de información crítica, just-in-time retrieval, archivos de contexto del proyecto (cubierto en L3).
- **Bucle de trabajo:** plan, ejecuta, verifica, corrige (cubierto en L4).
- **Git en flujo agéntico:** commits atómicos, ramas, PRs, `.gitignore`, exclusión de secretos (cubierto en L4).
- **MCPs:** cómo se instalan, primitivas (tools, resources, prompts), criterio de mínimo privilegio (cubierto en L7).
- **Skills y slash commands:** empaquetar comportamiento reutilizable del agente (cubierto en L6).
- **Diseño técnico previo:** ADRs, decisiones de stack, estructura del repo (cubierto en L9).
- **Spec-Driven Development:** escribir spec antes que código cuando aplica (cubierto en L10).
- **Construcción con agente:** trabajar sobre código existente, construir features, debugging, refactor (cubierto en L11).
- **Testing con agente:** unitarios, integración, e2e, criterio de qué testear (cubierto en L12).
- **Seguridad básica:** vulnerabilidades frecuentes en código generado por IA, calibración de permisos (cubierto en L13).
- **Deployment con agente:** CI/CD, configuración de pipelines, versionado de prompts (cubierto en L14).
- **Observabilidad:** logs, trazas, pipeline de calidad (cubierto en L15).

### Herramientas ya configuradas

- Claude Code, Codex CLI y OpenCode operativos con sus archivos de contexto.
- Git + GitHub CLI (`gh`).
- pnpm o bun como package manager (introducidos en L1 si el alumno hizo prework, o asumidos por convención del programa).
- Node.js ≥22 LTS.
- Cuenta de GitHub y Vercel (creada en esta lección si no existía).
- Cuenta de Cloudflare (gratuita, para Turnstile; dominio opcional si el alumno tiene).

### Convenciones del programa ya introducidas

- `AGENTS.md` como contexto compartido entre herramientas.
- Commits atómicos con mensajes redactados por el agente bajo revisión humana.
- Trunk-based development con PRs cuando el cambio lo justifique.
- ADRs en `docs/decisions/` para decisiones de arquitectura.
- Pipeline de calidad: linter, formateador, tests automáticos en CI.
- Higiene de secretos: `.env.local` fuera del repo, secretos en el dashboard del proveedor.

### Lo que aún NO se ha introducido (no asumir)

- **Autenticación, sesiones, dashboard, RLS:** se introducen en L17 (Tendr SaaS con Supabase). Aquí la landing es pública y la única persistencia es la lista de suscriptores.
- **Multi-provider de IA con BYO key, envelope encryption, jobs persistidos:** se introducen en L17.
- **Realtime, Storage de documentos, Stripe Checkout:** se introducen en L17.
- **App móvil, React Native, Expo:** se introduce en L18.
- **RAG, embeddings, tool use en runtime:** track de AI Engineering (L19–L20).

**Implicación práctica:** la landing es un proyecto autocontenido. Captura emails en Neon (Postgres serverless gratuito), no hay BBDD del producto, no hay login. Se elige **Neon (no Supabase)** deliberadamente para evitar solape con L17 y para que el alumno conozca otra opción de Postgres serverless.

---

## Decisiones clave fijadas para el caso

| Decisión | Detalle | Por qué |
|---|---|---|
| Diseño primero, código después | Fases 2–4: explorar visualmente, destilar a `design.md`, construir | Refleja el flujo profesional real con IA en 2026 |
| Stitch 2.0 como herramienta principal de exploración, **sin MCP** | Export HTML/Figma como referencia visual; el código final lo construye el agente con las Skills del alumno | Transparencia + reproducibilidad + el sistema propio gana al output enlatado |
| `design.md` como contrato versionado | Tokens, voz, escala, principios, negative instructions; reutilizado en L17 | SDD aplicado a diseño antes que a código |
| Componentes con SEO + GEO + lazy + a11y integrados | Semantic HTML, `next/dynamic`, `next/image`, JSON-LD profundo, `aria-*` | Cada componente nace bien hecho, no se parchea después |
| **GEO como capa de visibilidad** | `llms.txt` + `robots.txt` ajustado + JSON-LD profundo + estructura de respuesta directa + sub-queries en FAQ | Los LLMs son canal de descubrimiento crítico; sin GEO el sitio queda invisible |
| Skill propia multicapa | SEO + GEO + performance + a11y en una sola Skill auditable | Reutilizable en L17 y en proyectos futuros del alumno |
| Persistencia en Neon, no Supabase | Tabla `subscribers` con Drizzle | Evita solape con L17; introduce alternativa de Postgres serverless |
| Resend como extensión opcional | Solo si el alumno quiere email de confirmación | DNS y verificación de dominio son fricción para arranque |
| Cloudflare Turnstile como anti-spam | CAPTCHA gratis, sin coste | Estándar moderno en lugar de honeypot o reCAPTCHA |
| Hosting en Vercel Hobby con disclaimer | Lectura crítica del ToS como momento pedagógico | Ejercicio explícito de delegar la lectura del ToS al agente |

---

## Stack final verificado (mayo 2026)

| Capa | Herramienta | Versión | Por qué |
|---|---|---|---|
| Framework | Next.js | 16.x (16.2+ en mayo 2026) | App Router estable, Turbopack por defecto, React Compiler 1.0, Server Actions maduros |
| Estilos | Tailwind CSS | v4.x | `@theme` nativo, CSS-first, encaja con `design.md` como fuente de tokens |
| Componentes | shadcn/ui | CLI v4 (marzo 2026), Tailwind v4 compatible | Código copiable al repo, el agente lo modifica sin pelearse con API cerrada |
| Tipado y validación | TypeScript + Zod | TS 5.x, Zod 3.x | Tipado end-to-end, validación en boundaries |
| Persistencia | Neon | Postgres serverless, free tier 3GB | Sin solape con L17, sin DNS |
| ORM | Drizzle + drizzle-kit | 0.3x | Schema-first, migraciones reversibles |
| Email (opcional) | Resend | API actual 2026 | 3.000 emails/mes free, requiere dominio verificado |
| Anti-spam | Cloudflare Turnstile | Estable | Gratuito, verificación server-side |
| Hosting | Vercel Hobby | Plan free | Suficiente para landing personal, **ToS prohíbe uso comercial** |
| CI/CD | GitHub Actions | Built-in | Free generoso |
| Auditoría | Skill propia (Lighthouse + axe-core + checks) | N/A | Reutilizable en L17 |
| Linter/Formato | Biome (opcional) | 2.x | Reemplaza ESLint+Prettier en proyectos nuevos |

---

## Investigación por clase

### C0. Introducción

**Descripción del syllabus:** Vídeo que engloba y contextualiza la lección.

**Puntos clave del guion:**
1. Por qué una landing es el primer caso práctico: superficie pequeña, ciclo corto, todas las decisiones del fullstack en miniatura (stack, diseño, contenido, captura de leads, deploy, dominio).
2. Qué hace distinta esta landing: el flujo profesional real con IA en 2026. El diseño se descubre **viendo opciones** (Stitch 2.0), se destila a un `design.md` que el agente lee como contrato, y los componentes nacen con SEO, GEO, rendimiento y a11y dentro.
3. **GEO como diferencial 2026:** cuando alguien pregunta a ChatGPT, Claude o Perplexity por un CRM ligero, queremos que aparezca **Tendr** citado. Eso no pasa por accidente: se estructura.
4. Qué construye el alumno al terminar: la landing pública de un producto real (Tendr) que se desarrolla en la lección siguiente, lista en producción con captura de email, auditoría propia y la capacidad de iterar variantes en minutos.

**Ejemplo de negocio:**

> Tendr es un producto que vas a construir en la lección siguiente: un mini-CRM con IA para perfiles B2B junior. Aquí construyes la landing que lo vende. Cuando termines L17, la landing y el producto comparten identidad visual, pricing tiers y la Skill de auditoría. Es la mecánica que un equipo de producto real usa.

Duración objetivo: 2–4 minutos.

---

### C1. Decisión de stack y scaffolding

**Tipo:** Decisión · **Artefacto:** proyecto creado + ADR de stack documentado.

**Puntos clave técnicos:**
1. Criterios para elegir framework de landing en 2026: rendering (SSG/SSR/ISR), SEO técnico (Metadata API), Core Web Vitals, ecosistema de hosting, curva de adopción agéntica.
2. **Next.js 16** como default razonado: App Router estable, Turbopack cold starts ~76% más rápidos, React Compiler 1.0, Server Actions maduros. Para una landing + captura es cobertura cómoda y continuidad clara con L17.
3. **Tailwind v4 + shadcn/ui:** Tailwind v4 trae `@theme` y tokens CSS-first; shadcn es código copiable que el agente modifica sin abstracción opaca.
4. **Neon (no Supabase) + Drizzle:** Postgres serverless, free 3GB, sin DNS. Drizzle por schema-first y migraciones reversibles. La decisión de **no usar Supabase aquí** es deliberada: L17 lo usará a fondo, y conviene que el alumno conozca al menos otra opción de Postgres serverless.
5. **TypeScript + Zod** para tipado end-to-end y validación de Server Actions.
6. Scaffolding con el agente:
   ```
   pnpm create next-app@latest tendr-landing --typescript --tailwind --app --eslint
   cd tendr-landing
   pnpm dlx shadcn@latest init
   pnpm add drizzle-orm @neondatabase/serverless zod
   pnpm add -D drizzle-kit
   ```
7. Alternativas que se descartan con argumento: Astro (excelente estático puro, pero perderías Server Actions y la continuidad con L17), SvelteKit (más rápido pero menos shadcn), Remix (web-standards puristas pero menor adopción agéntica). Firebase para captura (NoSQL, lock-in, peor DX que Postgres). Supabase (queda para L17 a fondo).

**Setup previo de herramientas del agente** (una sola vez, antes de la fase 1):
- **Context7 MCP** activo: `claude mcp add context7 --scope user -- npx -y @upstash/context7-mcp`. Imprescindible para docs vigentes de Next.js 16. Es el único MCP imprescindible en L16.
- **`neonctl` CLI** autenticado: `pnpm add -g neonctl && neonctl auth`. CLI primario para crear BD y obtener `DATABASE_URL`. Neon MCP es opcional, solo si el alumno quiere introspección conversacional avanzada.
- **`vercel` CLI** autenticado: `pnpm add -g vercel && vercel login`. CLI primario para deploys, logs y env vars. Vercel MCP queda opcional para debugging post-deploy intensivo.
- Skill `sdd-explore` invocable si el alumno quiere SDD desde el inicio.

Criterio MCP vs CLI documentado en `_compartido/tecnico/skills-y-mcps.md §1` y `COMPLEMENTARIO.md §12`.

**Herramientas recomendadas:**

| Herramienta | Versión | Por qué aquí | Fuente |
|---|---|---|---|
| Next.js | 16.x (16.2+ mayo 2026) | Framework de referencia para web fullstack con agente | HERRAMIENTAS_VALIDADAS §Web/Fullstack |
| Tailwind CSS | v4.x | CSS utility-first con `@theme` nativo | HERRAMIENTAS_VALIDADAS §Web/Fullstack |
| shadcn/ui | CLI v4 (marzo 2026) | Componentes copiables, modificables sin abstracción opaca | HERRAMIENTAS_VALIDADAS §Web/Fullstack |
| Neon | Postgres serverless | 3GB free, sin DNS, branching nativo | [https://neon.tech/pricing](https://neon.tech/pricing) verificada 2026-05-19 |
| Drizzle ORM | 0.3x | Schema-first, migraciones reversibles | HERRAMIENTAS_VALIDADAS §Web/Fullstack |
| Zod | 3.x | Validación en boundaries de Server Actions | HERRAMIENTAS_VALIDADAS §Web/Fullstack |
| Context7 MCP | Oficial Upstash | Docs vivas de Next.js, Tailwind, shadcn, Drizzle. **Imprescindible** | HERRAMIENTAS_VALIDADAS §MCPs |
| `neonctl` CLI | Oficial Neon | Crear BD, branches y obtener connection strings. **CLI primario en L16**; Neon MCP opcional para introspección conversacional avanzada | [https://neon.tech/docs/reference/neon-cli](https://neon.tech/docs/reference/neon-cli) |
| `vercel` CLI | Oficial Vercel | Deploys, logs (`vercel logs <url>`), env vars (`vercel env ls`). **CLI primario en L16**; Vercel MCP opcional solo para debugging post-deploy intensivo | [https://vercel.com/docs/cli](https://vercel.com/docs/cli) |
| Biome (opcional) | 2.x | Linter + formateador unificado | HERRAMIENTAS_VALIDADAS §Auxiliares |

**Ejemplo de negocio sugerido:**

> Te encargan la landing del próximo lanzamiento de un SaaS B2B. Tienes una semana. Decides el stack en una sesión con el agente antes de escribir una línea: comparas tradeoffs, firmas el ADR, montas el repo. Sales con el proyecto creado y el primer commit hecho.

**Trade-offs clave:**

1. **Next.js vs Astro:** Next.js cuando vas a iterar mucho y/o tener Server Actions; Astro para estático puro sin lógica server.
2. **Neon vs Supabase aquí:** Neon evita solape con L17 y enseña al alumno otra opción seria de Postgres serverless. Supabase queda como protagonista de L17.
3. **shadcn vs MUI/Mantine/Chakra:** shadcn por control total del código modificable por el agente; las librerías tradicionales cuando hace falta data tables avanzados out-of-the-box.
4. **Biome vs ESLint+Prettier:** Biome para proyectos nuevos sin plugins ESLint exóticos.

**Mentalidad senior a transmitir:**
- La elección de stack se justifica antes de empezar, no después. Un ADR de 30 líneas en `docs/decisions/001-stack.md` ahorra discusiones futuras.
- Los defaults del agente no son tus defaults. Pedir "crea un proyecto Next.js" sin especificar acaba con configuración no deseada.
- El agente es excelente para evaluar opciones; no para decidir por ti.

**Qué NO delegar al agente:**
- La decisión final de stack (firma humana del ADR).
- La estructura inicial de carpetas si hay convenciones de equipo.

**Pitfalls a evitar:**
- Copiar el stack sin justificar.
- Sobreingeniería: 15 dependencias antes de necesitarlas.
- Saltarse el ADR pensando "ya me acuerdo del porqué".
- No commitear pronto (mejor un commit a los 10 minutos que ninguno).

**Referencias web verificadas:**
- Next.js 16: [https://nextjs.org/blog/next-16](https://nextjs.org/blog/next-16). Verificada 2026-05-19.
- Tailwind v4 en shadcn/ui: [https://ui.shadcn.com/docs/tailwind-v4](https://ui.shadcn.com/docs/tailwind-v4). Verificada 2026-05-19.
- Neon docs: [https://neon.tech/docs](https://neon.tech/docs). Verificada 2026-05-19.

**Recursos visuales sugeridos:**
- Diagrama Mermaid del stack: Next.js + Tailwind + shadcn como UI, Neon como persistencia, Vercel como hosting.
- Tabla de comparativa de stacks evaluados con criterios.

---

### C2. Exploración visual con IA

**Tipo:** Tutorial · **Artefacto:** carpeta `exploration/` con 3–5 direcciones visuales + decisión documentada + export de la elegida como referencia.

**Puntos clave técnicos:**

1. **Por qué divergir visualmente antes de escribir tokens.** Ningún diseñador profesional empieza por tokens abstractos. La direccionalidad visual se descubre **viendo opciones**. Saltarse esta fase produce `design.md` genéricos que el agente "interpreta" como puede, resultando en landings producidas en cadena.
2. **Stitch 2.0 como herramienta principal de divergencia** (verificada mayo 2026):
   - Gratis, multi-screen (hasta 5 pantallas interconectadas), voice canvas, AI-native infinite canvas.
   - Inputs: texto, voz, sketches, screenshots de referencia, imágenes.
   - Outputs: HTML/CSS, Figma con Auto Layout y layers nombrados, ZIP, copy al clipboard, integración con MCP, Google AI Studio, Antigravity IDE.
3. **Decisión deliberada: NO se usa el MCP de Stitch en esta lección.** Razones:
   - Introduce dependencia opaca de un servicio externo que el alumno no controla.
   - El alumno deja de ver qué pasa entre "diseño" y "código", lo opuesto al espíritu del programa.
   - Las Skills propias del alumno (`taste-skill`, `ui-ux-pro-max`, Emil Kowalski) producen mejor resultado porque respetan su sistema.
4. **Flujo de export como referencia, no como código final:**
   ```
   1. Generar 3-5 direcciones en Stitch 2.0
   2. Elegir una con criterio (público, voz, producto)
   3. Export como REFERENCIA, no como código final:
      - Opción A: HTML/CSS de Stitch + screenshots de cada sección
      - Opción B: Export a Figma con Auto Layout, refinar manualmente, screenshots
   4. La referencia visual queda en exploration/dir-elegida/
   5. El agente lee este material como contexto cuando construye
      componentes (C4) y la landing (C5), junto con design.md + Skills
   ```
5. **Alternativas verificadas si Stitch no basta:**
   - **Bolt.new** (free 1M tokens/mes, 300K diarios): para un bloque concreto que Stitch no resuelve bien (ej: pricing tier interactivo complejo).
   - **Figma Make** (incluido con Figma free): si el alumno viene de Figma y quiere refinar manualmente.
   - **Lovable** (5 créditos/día): se descarta para L16 por overkill.
   - **v0.dev**: se descarta por foco y simplicidad.
6. **Galerías de inspiración complementarias** (referencias visuales, no copy-paste): 21st.dev, Aceternity UI, Magic UI, React Bits, Hover.dev. Se navegan buscando referencias para piezas específicas (hero wow, pricing card distintivo, FAQ accordion). Solo capturas + notas, no código.
7. **Organización de la carpeta `exploration/`:**
   ```
   exploration/
   ├── dir-1-clean-saas/
   │   ├── stitch-hero.png
   │   ├── stitch-pricing.png
   │   ├── stitch-export.html       ← referencia, NO se copia al proyecto
   │   └── notes.md                  ← qué funciona, qué no
   ├── dir-2-editorial/...
   ├── dir-3-brutal-minimal/...
   ├── galleries-references/
   │   ├── aceternity-3d-card.md
   │   └── react-bits-text-anim.md
   └── decision.md
   ```
8. **Cómo el agente "consume" esto en fases posteriores:** el alumno hace `@exploration/dir-elegida` en su prompt para que Claude lea screenshots + HTML como contexto. El HTML NO se copia a `app/`; sirve solo para que el agente entienda la intención visual.

**Skills activas durante esta fase:**
- `taste-skill` (criterio anti-slop con negative instructions): `DESIGN_VARIANCE 7-8`, `MOTION_INTENSITY 5-6`, `VISUAL_DENSITY 4-5`.
- `ui-ux-pro-max` (catálogo de 67 estilos, 161 paletas, 57 font pairings).
- `Emil Kowalski animations` (motion con propósito).

**Herramientas recomendadas:**

| Herramienta | Versión | Por qué aquí | Fuente |
|---|---|---|---|
| Stitch 2.0 | Beta marzo 2026 | Multi-screen, voice canvas, exploración divergente | [https://stitch.withgoogle.com/](https://stitch.withgoogle.com/) verificada 2026-05-19 |
| Bolt.new (opcional) | Actual mayo 2026 | Free 1M tokens/mes, bloques específicos | [https://bolt.new/](https://bolt.new/) verificada 2026-05-19 |
| 21st.dev | Web | Marketplace de componentes marketing | [https://21st.dev/](https://21st.dev/) |
| Aceternity UI | Web | Wow visual fuerte (3D, particle, beams, spotlight) | [https://ui.aceternity.com/](https://ui.aceternity.com/) |
| Magic UI | Web | Microinteracciones y polish | [https://magicui.design/](https://magicui.design/) |
| React Bits | Web | Animaciones de texto sin payload Framer | [https://www.reactbits.dev/](https://www.reactbits.dev/) |
| Figma Make (opcional) | Incluido con Figma | Refinamiento manual desde Figma | [https://www.figma.com/make/](https://www.figma.com/make/) |
| taste-skill | `Leonxlnx/taste-skill` | Anti-slop con negative instructions y tunables | HERRAMIENTAS_VALIDADAS §Skills UI/UX |
| ui-ux-pro-max | `nextlevelbuilder/ui-ux-pro-max-skill` | Catálogo amplio de estilos, paletas y guidelines | HERRAMIENTAS_VALIDADAS §Skills UI/UX |
| Emil Kowalski animations | `emilkowal.ski/skill` | Motion con propósito, filosofía Linear | HERRAMIENTAS_VALIDADAS §Skills UI/UX |

**Ejemplo de negocio sugerido:**

> Necesitas la dirección visual de Tendr (producto B2B junior, voz "confiable, ágil, sin corporativismo"). En 90 minutos generas cinco direcciones distintas con Stitch (clean SaaS, editorial, brutal-minimal, etc.), las comparas con criterio profesional ("¿encaja con el público?", "¿con la voz?"), eliges una y documentas el porqué. Te llevas la referencia como contexto del agente para las fases siguientes.

**Trade-offs clave:**

1. **Stitch vs v0 vs Bolt para divergencia:** Stitch por multi-screen + voice + free; Bolt para bloques específicos; v0 queda para casos donde se necesita componente único de calidad alta inmediata (descartado aquí).
2. **MCP de Stitch vs export manual:** export manual gana en transparencia, reproducibilidad y respeto a tu sistema. El MCP queda fuera por crear dependencia opaca.
3. **Copiar HTML de Stitch al proyecto vs usarlo como referencia:** referencia siempre. Copiar acaba con landings que se sienten genéricas y no respetan tu sistema.

**Mentalidad senior a transmitir:**
- Divergir antes de converger es ingeniería, no procrastinación.
- El export de una herramienta de IA es referencia, no producto final.
- "Me gusta más" no es criterio. "Encaja con el público B2B junior" sí lo es.
- Documentar descartes vale tanto como documentar la elección.

**Qué NO delegar al agente:**
- La elección final de la dirección visual (firma humana en `exploration/decision.md`).
- La identificación de qué encaja con la marca: el agente sugiere, tú decides.

**Pitfalls a evitar:**
- Quedarse con la primera dirección sin compararla.
- Pedir "una landing moderna" sin contexto del producto.
- Saltar la documentación de descartes.
- **Copiar el HTML de Stitch al proyecto en lugar de usarlo como referencia.**
- Conectar el MCP de Stitch para "automatizar" el paso a código: rompe la transparencia.

**Referencias web verificadas:**
- Stitch 2.0: [https://stitch.withgoogle.com/](https://stitch.withgoogle.com/). Verificada 2026-05-19.
- Bolt.new pricing: [https://bolt.new/](https://bolt.new/). Verificada 2026-05-19.

**Recursos visuales sugeridos:**
- Tabla comparativa de Stitch / Bolt / Figma Make / v0 con criterios.
- Diagrama Mermaid del flujo: divergencia → comparación → elección → export → referencia para el agente.

---

### C3. `design.md` como destilación del sistema

**Tipo:** Tutorial · **Artefacto:** `design.md` versionado.

**Puntos clave técnicos:**

1. **Qué es el `design.md`.** La dirección visual elegida en C2 se convierte aquí en spec versionado. Es el **lock** del sistema: tokens (color, tipografía, escala, espaciado, sombras, radios), voz, principios, restricciones (negative instructions) y referencias visuales. Una vez escrito, el agente lo lee en cada sesión y cualquier desviación es bug, no creatividad.
2. **Secciones mínimas del `design.md`:**
   - **Voz:** descripción operable de cómo escribe la marca (tono, jerga prohibida, longitud típica de titulares).
   - **Tokens de color** (preferentemente en `oklch` para mejor degradación en mobile): primary, secondary, neutros, semánticos (success, error, warning). Con códigos y mapeo a variables CSS o Tailwind v4 (`@theme`).
   - **Tipografía:** familia display y body, escala (base 4pt, ratio 1.25), pesos, line-heights.
   - **Espaciado:** escala (4, 8, 12, 16, 24, 32, 48, 64, 96).
   - **Radios y sombras:** valores fijos y nombrados.
   - **Principios:** jerarquía con peso tipográfico no con tamaño desbordado, espacio blanco generoso, motion sutil no protagónico.
   - **Restricciones (negative instructions):** no Inter (overused en SaaS), no glassmorphism, no tres columnas de features con iconos arriba, no gradient sobre texto, etc. **Las negative instructions son lo más valioso del `design.md`.**
   - **Referencias visuales:** Linear (motion y restraint), Stripe (legibilidad), etc.
3. **Por qué markdown y no JSON puro.** El agente razona mejor con prosa estructurada que con un blob de tokens. El JSON va dentro de `globals.css` o `tailwind.config.ts`; el `design.md` lo explica y le da voz, principios y restricciones.
4. **Cómo el agente lo usa.** Referenciado desde `AGENTS.md` (`@design.md`) o cargado explícitamente al inicio de la sesión de diseño. La Skill `taste-skill` se complementa con este archivo: el `design.md` aporta el sistema concreto, taste-skill el criterio universal de calidad.
5. **Iteración.** Cambiar el `design.md` y pedir al agente que regenere componentes produce resultados coherentes con el cambio. Si una decisión visual no está en el `design.md`, no existe.
6. **Reuso en L17.** El mismo `design.md` se usa para que la app Tendr (L17) comparta identidad visual con la landing.

**Estructura típica que el alumno produce:**

```markdown
# Design System · Tendr

## Voz
- Confiable, ágil, sin corporativismo.
- Sin jerga corporativa ("leverage", "synergy", "best-in-class").
- Titulares < 12 palabras, beneficio primero.

## Tokens
### Color (oklch para mejor degradación en mobile)
- primary: oklch(0.65 0.18 250)
- ...
### Tipografía
- display: Geist Sans 600/700
- body: Geist Sans 400/500
### Escala
- base 4pt, ratio 1.25

## Principios
- Jerarquía con peso tipográfico, no con tamaño desbordado.
- Espacio blanco generoso entre secciones.
- Motion sutil, nunca protagónico.

## Restricciones · no hacer
- No Inter (overused en SaaS).
- No glassmorphism.
- No tres columnas de features con iconos arriba.
- No gradient sobre texto.

## Referencias
- Linear (motion y restraint).
- Stripe (legibilidad).
```

**Skills activas:** `taste-skill` (sobre todo por las negative instructions), `cognitive-doc-design` para que la voz sea legible.

**Trade-offs clave:**

1. **`design.md` vs design tokens JSON puros (Style Dictionary, W3C):** la práctica correcta es ambas; el `design.md` aporta la parte cualitativa (voz, principios) y el JSON la implementación.
2. **Spec abstracto vs prescriptivo:** suficientemente concreto para que el agente no improvise, suficientemente flexible para que evolucione con el proyecto.

**Mentalidad senior a transmitir:**
- Un sistema de diseño es la API entre el equipo de diseño, el agente y el código.
- La voz de marca es tan importante como los colores; un agente sin voz definida produce copy de manual.
- Las negative instructions valen más que las positive: definir qué NO se hace evita el "estilo IA medio".

**Qué NO delegar al agente:**
- La voz de marca (redactarla tú; el agente la aplica, no la inventa).
- Los tokens primarios de color si vienen de un brand book existente.

**Pitfalls a evitar:**
- Spec abstracto sin valores reales ("usar colores apropiados").
- Spec demasiado prescriptivo (microspecs imposibles de mantener).
- Olvidar las negative instructions.
- No versionarlo en git.

**Referencias web verificadas:**
- Tailwind v4 `@theme`: [https://ui.shadcn.com/docs/tailwind-v4](https://ui.shadcn.com/docs/tailwind-v4). Verificada 2026-05-19.

**Notas adicionales para el agente generador-guia:**
- Incluir una plantilla completa de `design.md` (con secciones y ejemplos rellenos) que el alumno pueda copiar y adaptar para Tendr.
- Mostrar el commit que añade `design.md` al repo y el `AGENTS.md` actualizado con `@design.md`.

**Recursos visuales sugeridos:**
- Diagrama Mermaid del flujo: dirección visual elegida (C2) → `design.md` → componentes (C4) → landing (C5) → variantes (C6).
- Tabla de secciones del `design.md` con ejemplo breve por sección.

---

### C4. Componentes base con SEO + GEO + lazy + a11y

**Tipo:** Tutorial · **Artefacto:** biblioteca de componentes en `components/`.

**Puntos clave técnicos:**

1. **La capa entre el `design.md` y la landing real.** El alumno no construye la landing directamente: primero construye **las piezas con las que la landing se va a montar**.
2. **Estructura propuesta:**
   ```
   components/
   ├── ui/                   ← shadcn base (Button, Input, Dialog, etc.)
   ├── landing/
   │   ├── Hero.tsx
   │   ├── Section.tsx
   │   ├── Feature.tsx
   │   ├── PricingCard.tsx
   │   ├── TestimonialCard.tsx
   │   └── FAQ.tsx
   ├── seo/
   │   ├── JsonLd.tsx        ← inyecta structured data
   │   └── metadata.ts       ← helpers de Metadata API
   └── a11y/
       └── SkipLink.tsx
   ```
3. **Cada componente nace con buenas prácticas integradas, no parcheadas después:**

| Práctica | Cómo se traduce a código |
|---|---|
| Semantic HTML | `<section>`, `<article>`, `<nav>`, `<header>`, `<main>`, `<footer>` |
| Image optimization | `next/image` con `priority` en hero, `sizes` correctos, `alt` descriptivo, `placeholder="blur"` cuando aporta |
| Font optimization | `next/font` con subsetting, `display: swap`, preload de la familia principal |
| Code splitting | `next/dynamic` para componentes pesados below-the-fold (testimonios, FAQ con animación, vídeos). Hero y nav nunca se lazy-loadean |
| Suspense boundaries | `<Suspense>` envolviendo bloques que dependen de data o son client-only; `loading.tsx` por ruta para skeleton inicial |
| RSC por defecto | Server Components siempre; `'use client'` solo cuando hay interactividad |
| Metadata API | Cada ruta exporta `metadata` o `generateMetadata` con título, descripción, OG, Twitter Card |
| JSON-LD (SEO + GEO) | `<JsonLd type="Organization">` en footer, `<JsonLd type="Product">` en pricing, `<JsonLd type="FAQPage">` en FAQ, `<JsonLd type="SoftwareApplication">` en root |
| Accesibilidad | Un solo `<h1>` por página, focus styles visibles, `aria-label` cuando texto no basta, contraste AA, `prefers-reduced-motion` respetado |

4. **Galerías premium como referencia para wow factor** (no como copy-paste): 21st.dev, Aceternity UI, Magic UI, React Bits, Hover.dev. Patrón obligatorio:
   ```
   1. Detectas necesidad: "el hero pide algo con más fuerza visual"
   2. Buscas en galerías un componente que se acerque a la idea
   3. Lees el código como REFERENCIA, no como solución
   4. Pides al agente: "construye un componente equivalente respetando
      design.md, taste-skill y los tokens del proyecto"
   5. Agente + Skills generan código adaptado a tu sistema
   6. Validas visualmente: ¿captura la esencia sin romper el sistema?
   ```
5. **Magic MCP de 21st.dev queda fuera de esta lección** por las mismas razones que el MCP de Stitch (C2): dependencia opaca, output no respeta tu sistema. Se menciona como herramienta del mercado que existe.

**Skills activas durante esta fase:**
- `vercel-react-best-practices` (64 reglas de Vercel Engineering: waterfalls, bundle, re-renders, rendering, `useEffect`).
- `shadcn` (Skill oficial).
- `taste-skill` con configuración de C2.
- `ui-ux-pro-max` para guidelines puntuales.
- Context7 MCP siempre activo para Next.js 16 docs.

**Flujo recomendado:**

1. Listar componentes necesarios según la landing planificada (`sdd-explore` ayuda a no olvidar primitivas).
2. **shadcn primero** (vía CLI, no a mano):
   ```
   pnpm dlx shadcn@latest add button input card dialog tooltip accordion
   ```
3. Componentes landing-specific uno a uno:
   - Pedir al agente: "construye `Hero.tsx` consumiendo tokens de `design.md`, respetando `taste-skill` negative instructions, con semantic HTML y `<h1>` único".
   - Renderizar en `/_showcase` route (visible solo en dev).
   - Verificar visualmente y con `axe-core` (`pnpm add -D @axe-core/react`).
   - Repetir.
4. Helpers SEO/GEO:
   - `components/seo/JsonLd.tsx` recibe props (`type`, `data`) y emite `<script type="application/ld+json">`.
   - `components/seo/metadata.ts` con helpers para `Organization`, `SoftwareApplication`, `Product`, `FAQPage`.
   - Validar JSON-LD en cada commit con Rich Results Test.
5. Verificación incremental: tipos OK (`pnpm tsc --noEmit`), a11y básica (`axe-core`), renderiza SSR + client.

**Ejemplo de negocio sugerido:**

> El equipo de marketing pide cinco landings al mes. Si cada `Hero` se reescribe desde cero, no se acaba el trimestre. La biblioteca de componentes es la línea de montaje: 10 piezas que se combinan en infinitas landings, con SEO, GEO, rendimiento y a11y dentro de cada pieza.

**Trade-offs clave:**

1. **Server Components por defecto vs Client selectivos:** Server por defecto (menos JS al cliente, mejor LCP). Client solo cuando hay interactividad (form, toggles, animaciones complejas).
2. **shadcn out-of-the-box vs personalizar:** shadcn como base, personalizar para identidad propia. Una landing 100% shadcn sin tocar no transmite marca.
3. **Galerías como referencia vs Magic MCP:** referencia gana en transparencia y respeto al sistema propio.

**Mentalidad senior a transmitir:**
- El componente más importante no es el visual: es el de SEO + GEO. Un `<h1>` mal puesto cuesta tráfico orgánico durante meses y oculta el sitio a los LLMs.
- "Funciona en mi máquina" no aplica a Core Web Vitals: se mide en condiciones reales (red 4G, móvil de gama media).
- Los componentes se diseñan para variantes desde el primer momento; si `Hero` solo admite un layout, el sistema ya está roto.

**Qué NO delegar al agente:**
- La auditoría de a11y real (navegación por teclado, lector de pantalla).
- La elección de imágenes y assets de marca.

**Pitfalls a evitar:**
- Sobreingeniería: componentes con 12 props "por si acaso".
- Tailwind soup con valores hardcoded en lugar de tokens del `design.md`.
- Accesibilidad como afterthought.
- Saltarse el showcase y ver los componentes solo cuando ya están en la landing.

**Referencias web verificadas:**
- Next.js 16 Metadata API: [https://nextjs.org/docs/app/api-reference/functions/generate-metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata). Verificada 2026-05-19.
- Core Web Vitals: [https://web.dev/vitals/](https://web.dev/vitals/). Verificada 2026-05-19.
- Schema.org: [https://schema.org/](https://schema.org/). Verificada 2026-05-19.
- Aceternity UI: [https://ui.aceternity.com/](https://ui.aceternity.com/). Verificada 2026-05-19.

**Recursos visuales sugeridos:**
- Tabla de componentes base con su responsabilidad SEO/GEO/UX.
- Diagrama Mermaid de Server vs Client Components en una landing.

---

### C5. Landing v1 con estructura GEO-friendly

**Tipo:** Tutorial · **Artefacto:** landing pública en local + preview de Vercel + `llms.txt` + `robots.txt` ajustado + JSON-LD profundo + FAQ con sub-queries.

**Puntos clave técnicos:**

1. **Composición de la landing real** a partir de los componentes de C4. Páginas: `/`, `/pricing`, `/privacy`, `/terms` (placeholder), `sitemap.ts`, `robots.ts`, `llms.txt`. Copy real, sin Lorem.
2. **Jerarquía de información en landings B2B:**
   - Hero (propuesta de valor < 12 palabras + CTA principal)
   - Cómo funciona (3 pasos visuales)
   - Features (bloques con capacidades clave)
   - Pricing (3 tiers: Free / Pro €9 / Team €29 "próximamente")
   - Testimonios (placeholders con foto + cita)
   - FAQ (5–8 preguntas con **sub-queries reales**)
   - Captura de email (waitlist)
   - Footer (legales, contacto, redes)
3. **Estructura GEO-friendly (novedad 2026).** Los LLMs son canal de descubrimiento crítico. Pilares aplicados:

| Pilar | Implementación |
|---|---|
| **`llms.txt` en root** | Archivo de texto plano en `/llms.txt` (o ruta dinámica) que describe el sitio en lenguaje natural: qué es Tendr, secciones, links, audiencia, pricing. "README para LLMs" |
| **`robots.txt` ajustado** | Permitir explícitamente GPTBot, ClaudeBot, PerplexityBot, Google-Extended. Sin esto los crawlers de IA pasan de largo |
| **Respuesta directa primero** | Cada sección abre con la respuesta a "qué es esto" en una frase. Patrón inverted pyramid |
| **Heading jerarquía limpia** | Un solo `<h1>` por página, `<h2>` por sección mayor, `<h3>` por subsección. Un topic por heading |
| **JSON-LD profundo** | Mínimo: `Organization` + `SoftwareApplication` + `FAQPage` + `Product` |
| **Sub-queries en FAQ** | El FAQ no responde solo "qué es"; responde "cuánto cuesta", "para quién es", "qué lo diferencia de HubSpot", "tiene plan gratis", "puedo importar CSV", "qué pasa con mis datos si cancelo" |
| **Citas externas** | Sección con menciones, partners o casos de uso (placeholder); los LLMs ponderan citas externas |

4. **Patrón de respuesta directa en cada sección:** primera frase responde "qué es esto", después el contexto. Es bueno tanto para humanos escaneando como para LLMs leyendo.
5. **`llms.txt` patrón:**
   ```
   # Tendr
   > Gestor de clientes externos para perfiles B2B junior (consultoría, AM, ventas).
   
   ## Qué hace
   - Clientes y casos en pipeline ...
   ## Pricing
   - Free: 3 clientes ...
   ## Audiencia
   - Customer success, account managers, consultores junior ...
   ```
6. **Logs del preview deploy desde CLI** (`vercel logs <preview-url>`) si hay build errors a diagnosticar.

**Skills activas:**
- `cognitive-doc-design` para reducir carga cognitiva del copy.
- `Emil Kowalski animations` para microinteracciones del hero.
- `taste-skill` con configuración de C2.

**Flujo recomendado:**

1. Scaffold de página primero, sin contenido real (secciones vacías con comentario del propósito).
2. Llenar bloque a bloque con copy concreto. Pedir al agente: "redacta hero respetando voz de `design.md`, propuesta clara en menos de 12 palabras, sin jerga corporativa, lead con beneficio". **Time-box explícito de 30 min para v1 del hero.**
3. FAQ con sub-queries reales (críticas para GEO): pedir al agente 8 candidatas y el alumno elige 5.
4. `app/llms.txt` (route handler o estático en `public/`) con descripción estructurada.
5. `robots.ts` ajustado:
   ```typescript
   export default function robots() {
     return {
       rules: [
         { userAgent: '*', allow: '/' },
         { userAgent: 'GPTBot', allow: '/' },
         { userAgent: 'ClaudeBot', allow: '/' },
         { userAgent: 'PerplexityBot', allow: '/' },
         { userAgent: 'Google-Extended', allow: '/' },
       ],
       sitemap: 'https://tendr.app/sitemap.xml',
     }
   }
   ```
6. Validar JSON-LD con Google Rich Results Test y con schema.org validator.
7. Preview en Vercel: push a rama, esperar preview URL. Iteraciones contra preview.
8. Lectura en mobile + desktop.

**Verificación pre-producción:**
- Lighthouse ≥95 en Performance.
- LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.
- Validación HTML.
- Schema markup verificado en Rich Results Test.

**Ejemplo de negocio sugerido:**

> Lanzas la landing del Black Friday del e-commerce un martes. El viernes la conversión está al 30% por debajo de lo esperado. El sistema permite cambiar copy del hero y CTA en una sesión. Y porque está bien estructurada, cuando alguien pregunta a Perplexity "qué CRM ligero hay", Tendr aparece citado.

**Trade-offs clave:**

1. **Open Graph image estática vs dinámica con `@vercel/og`:** dinámica para landings con variantes; estática para landings fijas.
2. **Copy del agente vs copy de marketing:** borrador del agente, edición del responsable, sign-off humano. El agente no decide la voz.
3. **`llms.txt` como ruta dinámica vs estático en `public/`:** estático si no cambia con frecuencia; route handler si tiene contenido dinámico.

**Mentalidad senior a transmitir:**
- Una landing v1 está incompleta por diseño. La v1 sale rápido; el sistema se afina con métricas reales.
- El FAQ con sub-queries es la pieza GEO más valiosa. Saltarlo deja al sitio invisible a los LLMs.
- `robots.txt` bloqueando crawlers de IA por defecto es un error común en templates; revisarlo siempre.

**Qué NO delegar al agente:**
- La aprobación final del copy.
- La selección de imágenes y assets de marca.

**Pitfalls a evitar:**
- Copy genérico ("La mejor herramienta para tu equipo").
- Cargar la landing de features (fatiga visual).
- Hero sin propuesta clara.
- Saltarse el FAQ pensando "no hace falta".
- **Olvidar `llms.txt`**: el sitio queda invisible a la capa LLM.
- **`robots.txt` bloqueando crawlers de IA** por defecto.
- JSON-LD inválido o incompleto (Rich Results Test es gratuito).
- No probar en mobile.

**Referencias web verificadas:**
- `llms.txt` proposal: [https://llmstxt.org/](https://llmstxt.org/). Verificada 2026-05-19.
- Rich Results Test: [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results). Verificada 2026-05-19.
- Schema.org SoftwareApplication: [https://schema.org/SoftwareApplication](https://schema.org/SoftwareApplication). Verificada 2026-05-19.

**Recursos visuales sugeridos:**
- Wireframe de la landing v1 (placeholder `<!-- IMAGEN: wireframe landing v1 con secciones marcadas -->`).
- Tabla de checks pre-producción (Lighthouse, CWV, schema markup, `llms.txt`).

---

### C6. Sistema de variantes con motivo de negocio

**Tipo:** Tutorial · **Artefacto:** 2 variantes de hero (A/B) + 1 variante de landing completa para un vertical distinto.

**Puntos clave técnicos:**

1. **Por qué se generan variantes en producto real** (motivo antes que técnica). Los seis motivos profesionales:

| Motivo | Ejemplo concreto |
|---|---|
| **A/B testing de conversión** | Mismo producto, dos copys del hero distintos. 50/50, se mide qué variante convierte mejor |
| **Verticales y audiencias** | Mismo producto, landings adaptadas a tres públicos: "para agencias", "para consultores solo", "para freelances" |
| **Iteración rápida cuando algo no funciona** | El conversion rate está bajo; se prueba una variante con orden distinto o copy más directo |
| **Internacionalización** | Mismo producto en ES, EN, PT-BR. Cada idioma necesita ajustes visuales además de la traducción |
| **Multimarca dentro de una misma empresa** | Sistema de diseño que sirve a varios productos hermanos |
| **Estacionalidad o campañas** | Black Friday, lanzamiento, evento puntual |

2. **Lo que diferencia a un equipo profesional:** las variantes son **recombinaciones controladas del mismo sistema**, no rediseños desde cero. Cada variante respeta tokens, voz y principios del `design.md`. La diferencia está en composición, copy, énfasis u orden.
3. **Patrón técnico:** cada variante vive en una ruta (`/variantes/azul`, `/variantes/agresivo`) o en un parámetro de URL (`/?v=azul`) que un layout lee. **Variantes de A/B test deben excluirse del sitemap principal para no canibalizar SEO.**
4. **Cómo se le pide al agente:**
   - Referencia explícita al `design.md` y a los componentes base.
   - Brief corto de la variante: para quién, qué cambia, qué se mantiene, **motivo del negocio**.
   - Salida: PR con commits atómicos por componente modificado.
5. **A/B testing básico:** dos variantes en producción con un `proxy.ts` simple (la capa de interceptación de Next.js 16, antes `middleware.ts`) que reparte tráfico 50/50, o con Vercel Edge Config / Statsig / GrowthBook si se quiere instrumentación. Considerar caching: si la respuesta se cachea por URL, el experimento se rompe.
6. **Slash command propio (`/variant`):** el alumno puede empaquetar el patrón como comando que toma un brief y produce la variante respetando el sistema.

**Configuración de `taste-skill` para variantes:** subir `DESIGN_VARIANCE` a 7-8 para que las variantes diverjan lo suficiente sin romper el sistema.

**Anti-patrones a evitar:**
- Variante que añade nuevos tokens de color sin actualizar `design.md`.
- Variante que duplica componentes en vez de extender los existentes.
- Variante que rompe Core Web Vitals (imagen mucho más pesada, JS añadido).
- Generar variantes sin motivo claro (ruido).
- Variantes casi idénticas (no aportan información si fuera A/B).
- Confundir variante de vertical con rediseño.

**Trade-offs clave:**

1. **Variante por ruta vs por feature flag:**
   - Por ruta: simple, URL explícita, fácil de compartir y medir; riesgo de SEO duplicado.
   - Por feature flag: una sola URL, asignación dinámica, mejor para A/B test ciego.
2. **Slash command vs Skill propia:**
   - Slash command: empieza aquí (un prompt parametrizable basta para 80% de los casos).
   - Skill: promoción cuando el patrón se solidifica y necesita archivos auxiliares.

**Ejemplo de negocio sugerido:**

> El equipo de growth quiere probar tres tonos distintos del hero (formal, cercano, urgente) durante la semana de lanzamiento. El sistema de variantes permite tener las tres listas para producción en una mañana, con un `proxy.ts` que reparte el tráfico.

**Mentalidad senior a transmitir:**
- Una variante no es un fork. Si rompe el sistema, no es variante, es otro proyecto.
- El valor del sistema se mide en la quinta variante, no en la primera.
- Las variantes son decisión de producto, no creatividad libre. Sin motivo claro, no hay variante.

**Qué NO delegar al agente:**
- Decidir qué variantes vale la pena probar (lo decide marketing/producto con datos).
- Aprobar la publicación de la variante en producción.

**Pitfalls a evitar:**
- Variantes por URL con sitemap: excluir las experimentales del sitemap principal.
- A/B testing con caching agresivo de Vercel: configurar headers `Cache-Control` o usar Vary.
- No descartar al final (quedan zombies en `main`).
- Iterar infinito.

**Referencias web verificadas:**
- Vercel Edge Middleware: [https://vercel.com/docs/edge-network/edge-middleware](https://vercel.com/docs/edge-network/edge-middleware). Verificada 2026-05-19.

**Notas adicionales para el agente generador-guia:**
- Incluir el contenido completo del slash command `/variant` como parte de la clase.
- Mostrar un ejemplo end-to-end: del brief de la variante al PR generado.

**Recursos visuales sugeridos:**
- Diagrama Mermaid del flujo: brief de variante → slash command → PR → revisión humana → merge → deploy.
- Tabla de los seis motivos de variante con ejemplos.

---

### C7. Captura de email con Neon + Drizzle + Turnstile

**Tipo:** Tutorial · **Artefacto:** form funcional + Server Action + Zod + Drizzle + Neon + Cloudflare Turnstile + rate limiting básico. Resend como extensión opcional.

**Puntos clave técnicos:**

1. **Arquitectura:** Form en Client Component (`<form action={serverAction}>`) → Server Action que valida con Zod → verificación de Turnstile server-side → insert en Neon vía Drizzle → respuesta al cliente.
2. **Schema Drizzle** en `db/schema/subscribers.ts`:
   ```typescript
   subscribers
     id (uuid pk)
     email (unique)
     created_at
     ip_hash
     referrer
     confirmed_at (nullable, para double opt-in si se activa Resend)
   ```
3. **Crear y aplicar migración con `drizzle-kit`:** "crea la migración inicial con `drizzle-kit generate`, después aplícala con `drizzle-kit push` contra `DATABASE_URL` de la branch dev de Neon".
4. **Validación:**
   - Cliente: HTML5 (`type=email`, `required`).
   - Servidor: Zod schema (`{ email: z.string().email(), turnstileToken: z.string().min(1) }`).
   - **Cloudflare Turnstile** como anti-bot: verificación server-side con POST a `https://challenges.cloudflare.com/turnstile/v0/siteverify` usando `TURNSTILE_SECRET_KEY`. Si falla, devolver 400 sin tocar BD.
   - **Rate limiting básico** por IP (Upstash Redis o Vercel KV; alternativa: middleware en memoria, no escala).
5. **Manejo de duplicados** con `ON CONFLICT (email) DO NOTHING RETURNING id`. Si no devuelve row, mensaje "ya estás suscrito" (no error).
6. **UI con `useFormStatus`** (App Router moderno): loading, success y error visibles. Widget de Cloudflare Turnstile integrado.
7. **Tests de Vitest** del Server Action: éxito, duplicado, Turnstile fail, email inválido. Mock del fetch a Cloudflare.
8. **Extensión opcional Resend** (al final del caso, no obligatoria): si el alumno quiere email de confirmación, instalar Resend MCP, crear domain, mandar email con link de confirmación que actualiza `confirmed_at`. **DNS (SPF/DKIM/DMARC) configurado por el alumno, no por el agente.**

**Cumplimiento básico:**
- GDPR/LSSI mínimo: checkbox de consentimiento, política de privacidad enlazada, propósito declarado.
- El agente puede redactar la política base; firma humana o legal.

**Herramientas recomendadas:**

| Herramienta | Versión | Por qué aquí | Fuente |
|---|---|---|---|
| Neon | Postgres serverless | 3GB free, branching nativo para dev | [https://neon.tech/pricing](https://neon.tech/pricing) verificada 2026-05-19 |
| Drizzle ORM | 0.3x | Schema-first, migraciones reversibles | HERRAMIENTAS_VALIDADAS §Web/Fullstack |
| Zod | 3.x | Validación de schema en Server Action | HERRAMIENTAS_VALIDADAS §Web/Fullstack |
| Cloudflare Turnstile | Estable | CAPTCHA gratuito, server-side verify | [https://www.cloudflare.com/products/turnstile/](https://www.cloudflare.com/products/turnstile/) verificada 2026-05-19 |
| Upstash Redis (opcional) | Actual | Rate limiting por IP | [https://upstash.com/](https://upstash.com/) verificada 2026-05-19 |
| Resend (opcional) | API actual 2026 | Email de confirmación; 3.000/mes free, 100/día | [https://resend.com/pricing](https://resend.com/pricing) verificada 2026-05-19 |
| Server Actions (Next.js) | 16.x | Endpoint sin definir `/api/route.ts` separado | HERRAMIENTAS_VALIDADAS §Web/Fullstack |

**Alternativas a Resend:** Loops, Postmark, SendGrid (cuidado: SendGrid eliminó el free tier en 2026). El patrón es el mismo.

**Ejemplo de negocio sugerido:**

> Un curso online lanza una lista de espera para la próxima cohorte. La landing capta correos en Neon, manda confirmación opcional por Resend y segmenta a los interesados. Cuando se abre la inscripción, sale un email a esa lista. Todo sin CRM.

**Trade-offs clave:**

1. **Server Actions vs API route:** Server Actions ganan en menos boilerplate y type-safety end-to-end; API route si vas a consumir el endpoint desde otra app.
2. **Neon vs Resend Audiences:** Neon controla los datos en tu BBDD; Resend Audiences se queda en cero infraestructura pero menos control. Aquí Neon porque el alumno necesita aprender el patrón ORM + Postgres.
3. **Turnstile vs honeypot vs reCAPTCHA:** Turnstile gana en UX (sin desafíos visuales en el 99% de casos), gratis, y la verificación server-side es trivial.
4. **Double opt-in vs single opt-in:** double opt-in da lista limpia y cumplimiento UE más sólido pero pierde ~20-30% de conversión. Empezar con single opt-in + Turnstile, mover a double si hay problema de calidad.

**Mentalidad senior a transmitir:**
- Un formulario sin rate limiting es un blanco de spam en horas. No es paranoia: es el estado por defecto de Internet.
- La política de privacidad y el checkbox de consentimiento no son opcionales en UE.
- "Funciona en local" no es deployable: la API key vive en Vercel, no en `.env.local`.

**Qué NO delegar al agente:**
- La política de privacidad y términos legales (borrador del agente, revisión humana o legal).
- La configuración del dominio de envío en Resend (SPF, DKIM, DMARC).

**Pitfalls a evitar:**
- Validar solo en cliente (security theatre).
- No manejar duplicados (crash en producción).
- Olvidar rate limiting.
- Commitear secret keys.
- Form sin feedback de éxito/error.
- API key de Resend en el repo: `.gitignore` excluye `.env.local`; secretos en Vercel dashboard.

**Referencias web verificadas:**
- Cloudflare Turnstile docs: [https://developers.cloudflare.com/turnstile/](https://developers.cloudflare.com/turnstile/). Verificada 2026-05-19.
- Neon Drizzle integration: [https://neon.tech/docs/guides/drizzle](https://neon.tech/docs/guides/drizzle). Verificada 2026-05-19.
- Next.js Server Actions: [https://nextjs.org/docs/app/api-reference/functions/server-actions](https://nextjs.org/docs/app/api-reference/functions/server-actions). Verificada 2026-05-19.

**Recursos visuales sugeridos:**
- Diagrama Mermaid del flujo: cliente → Server Action → Zod → Turnstile verify → Drizzle → Neon → respuesta.
- Tabla de estados del formulario (`idle`, `submitting`, `success`, `error`) con UX por estado.

---

### C8. Skill de auditoría SEO + GEO + performance + a11y

**Tipo:** Tutorial · **Artefacto:** Skill propia versionada en `.claude/skills/landing-auditor/` + reporte multicapa sobre la landing publicada.

**Puntos clave técnicos:**

1. **Qué construye el alumno.** Una Skill que audita la landing en cuatro capas: **SEO clásico, GEO, rendimiento y accesibilidad**. Ejecuta `@unlighthouse/cli`, verifica metadata, valida JSON-LD contra schema.org, comprueba `llms.txt` y `robots.txt`, valida estructura GEO-friendly (jerarquía de headings, respuesta directa, FAQ con sub-queries), y reporta Core Web Vitals + issues de a11y. El agente interpreta el output.
2. **Estructura del SKILL.md:**
   ```yaml
   ---
   name: landing-auditor
   description: Audita landing publicada en SEO, GEO, performance, a11y
   trigger: cuando el usuario dice "audita la landing en {url}"
   ---
   ```
   Después instrucciones para que el agente ejecute los cuatro scripts y compile el reporte.
3. **Scripts auxiliares:**
   - `scripts/audit-performance.sh`: `npx @unlighthouse/cli ci --site $URL --output-format json` y parseo de Core Web Vitals.
   - `scripts/audit-seo.sh`: `curl + cheerio` extrae metadata, valida OG (`og:title`, `og:description`, `og:image`), Twitter Card, sitemap accesible (200 OK), canonical.
   - `scripts/audit-geo.sh` (lo más distintivo):
     - `GET /llms.txt` → si 404 fail crítico; si 200 validar secciones esperadas.
     - `GET /robots.txt` → verificar que permite GPTBot, ClaudeBot, PerplexityBot, Google-Extended.
     - Validar cada JSON-LD del HTML contra schema.org (Organization, SoftwareApplication, FAQPage, Product).
     - Verificar jerarquía de headings (un solo `<h1>`, sin saltos h1 → h3).
     - Detectar FAQ con sub-queries reales (no genéricas tipo "¿cómo empezar?").
   - `scripts/audit-a11y.sh`: corre `@axe-core/cli` contra la landing publicada o vía Playwright headless.
4. **Output estructurado en markdown** que el agente interpreta:
   ```
   ## Performance · score 94 ⚠
   - LCP 2.8s (target < 2.5s) ← prioridad alta
   ## SEO · OK ✓
   ## GEO · score 7/10 ⚠
   - llms.txt presente ✓
   - robots.txt bloquea GPTBot ✗ ← CRÍTICO
   ## A11y · 2 issues
   ```
5. **Reuso en L17:** la misma Skill audita el dashboard de Tendr antes de su deploy.

**Skill `skill-creator` activa** para generar el scaffold inicial.

**Trade-offs clave:**

1. **Skill propia vs servicio externo (Lighthouse-CI, axe-monitor):** Skill propia da control total y se versiona en el repo; servicios externos eliminan setup pero crean dependencia.
2. **Output estructurado vs HTML/PDF:** markdown estructurado porque el agente lo interpreta y prioriza.

**Mentalidad senior a transmitir:**
- Una Skill bien hecha es un activo reusable que el alumno se lleva a cualquier proyecto futuro.
- Cierra el ciclo del caso (construir + verificar) y refuerza la filosofía "IA como ambiente".
- La auditoría profesional moderna cubre las tres capas de visibilidad: humanos (UX + Core Web Vitals), buscadores tradicionales (SEO) y LLMs (GEO).

**Qué NO delegar al agente:**
- La definición de qué se considera "crítico" vs "warning" en cada capa: lo decides tú con criterio.

**Pitfalls a evitar:**
- Skill que solo ejecuta Lighthouse sin interpretar las cuatro capas.
- Output demasiado verbose (el agente no sabe qué priorizar).
- Demasiado prescriptiva (no transferible a otros proyectos).
- Olvidar la capa GEO porque "es nueva": es donde más diferencia hace.
- No commitear la Skill al repo.

**Herramientas recomendadas:**

| Herramienta | Versión | Por qué aquí | Fuente |
|---|---|---|---|
| `@unlighthouse/cli` | Actual 2026 | Lighthouse en CI con scoring y oportunidades parseables | [https://unlighthouse.dev/](https://unlighthouse.dev/) verificada 2026-05-19 |
| `@axe-core/cli` | Actual | Auditoría de a11y automatizada | [https://github.com/dequelabs/axe-core](https://github.com/dequelabs/axe-core) verificada 2026-05-19 |
| schema-dts | Actual | Validación TypeScript de JSON-LD contra schema.org | [https://github.com/google/schema-dts](https://github.com/google/schema-dts) |
| Rich Results Test (Google) | Web | Validar JSON-LD profundo y previsualizar en SERPs | [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results) verificada 2026-05-19 |
| skill-creator | Skill del ecosistema | Scaffold de Skills nuevas con frontmatter válido | HERRAMIENTAS_VALIDADAS §Skills |

**Referencias web verificadas:**
- Unlighthouse: [https://unlighthouse.dev/](https://unlighthouse.dev/). Verificada 2026-05-19.
- Schema.org validators: [https://validator.schema.org/](https://validator.schema.org/). Verificada 2026-05-19.
- llmstxt.org: [https://llmstxt.org/](https://llmstxt.org/). Verificada 2026-05-19.

**Recursos visuales sugeridos:**
- Diagrama Mermaid del flujo de la Skill: trigger → 4 scripts → output estructurado → interpretación del agente.
- Ejemplo de reporte multicapa con secciones SEO/GEO/Performance/A11y.

---

### C9. Deploy y dominio

**Tipo:** Tutorial · **Artefacto:** landing pública en producción + CI/CD con GitHub Actions + dominio opcional + disclaimer ToS documentado.

**Puntos clave técnicos:**

1. **Deploy a Vercel:**
   - `vercel link` y `vercel deploy --prod` desde CLI. Toda la operación de deploy va por CLI.
   - Variables de entorno en Vercel dashboard (`DATABASE_URL`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_SITE_KEY`), distinguiendo Production / Preview / Development. El agente verifica con `vercel env ls` desde CLI.
2. **Dominio propio (opcional):**
   - Comprar dominio (Namecheap, Cloudflare Registrar, Porkbun).
   - Añadir dominio en Vercel + DNS record en Cloudflare.
   - HTTPS automático vía Let's Encrypt.
   - Redirección canónica (con/sin www).
3. **CI/CD con GitHub Actions:**
   ```yaml
   on: pull_request
   jobs:
     validate:
       - lint (Biome)
       - typecheck (tsc --noEmit)
       - test (Vitest)
       - drizzle-kit check
       - build (next build)
       - audit (Skill landing-auditor contra preview URL)
   ```
4. **Smoke test con Playwright CLI:** `e2e/smoke.spec.ts` con dos checks: landing carga, form de email envía con OK. `npx playwright test smoke.spec.ts --reporter=line`.
5. **Ejercicio explícito de lectura de ToS** (clave pedagógica): el alumno pide al agente *"usa WebSearch y lee los Terms of Service y Fair Use Guidelines de Vercel Hobby; dime explícitamente si puedo monetizar esta landing, qué constituye uso comercial, y qué pasa si infrinjo"*. El agente devuelve resumen + cita textual. El alumno lo documenta en `README.md` + tres caminos de salida:
   - **Vercel Pro $20/mes/desarrollador** (uso comercial permitido).
   - **Cloudflare Pages + `@opennextjs/cloudflare`** (gratuito para uso comercial).
   - **Netlify** (equivalente a Vercel para sitios estáticos).
6. **Auditoría final post-deploy** invocando la Skill de C8: "audita la landing en https://...". El reporte se sube como artefacto del workflow.
7. **Observabilidad mínima:**
   - Vercel Analytics (Web Vitals reales de campo).
   - Sentry opcional (5K eventos/mes free).
   - Plausible o Vercel Web Analytics para tráfico (privacy-friendly, sin consent banner forzoso).

**Herramientas recomendadas:**

| Herramienta | Versión | Por qué aquí | Fuente |
|---|---|---|---|
| Vercel | Plan Hobby | Hosting nativo Next.js, preview por PR, HTTPS automático | HERRAMIENTAS_VALIDADAS §Web/Fullstack |
| Vercel Analytics | Built-in | Web Vitals reales de campo | [https://vercel.com/docs/analytics](https://vercel.com/docs/analytics) verificada 2026-05-19 |
| GitHub Actions | Built-in | CI free generoso para repos públicos | HERRAMIENTAS_VALIDADAS §Control de versiones |
| Playwright CLI | Actual 2026 | Smoke test simple y rápido | [https://playwright.dev/](https://playwright.dev/) verificada 2026-05-19 |
| Sentry (opcional) | Actual | Error tracking en producción | HERRAMIENTAS_VALIDADAS §Observabilidad |
| Cloudflare DNS / Namecheap | Web | Compra y gestión del dominio | [verificar] |

**Trade-offs clave:**

1. **Vercel vs Cloudflare Pages vs Netlify vs self-hosted:** Vercel da experiencia premium para Next.js pero ToS prohíbe uso comercial en Hobby; Cloudflare Pages permite uso comercial gratis pero requiere algo más de configuración para Next.js full features.
2. **Web Analytics privacy-friendly vs GA4:** privacy-friendly (Plausible/Vercel Analytics/Fathom) sin cookies, cumplimiento UE más fácil. GA4 obliga a consent banner que reduce conversión.
3. **Branch protection estricta vs commitear a `main`:** estricta (PR + checks) en cuanto haya más de una persona. Solo, según preferencia.

**Mentalidad senior a transmitir:**
- El deploy no es el final, es el inicio del ciclo de feedback. Vercel Analytics te dice si el LCP real coincide con el de Lighthouse.
- Las variables de entorno son código: versionarlas implícitamente con un `.env.example` documentado.
- Un dominio sin HTTPS no es deployable en 2026.
- Rollback rápido (un click en Vercel) es más valioso que evitar todos los bugs.

**Qué NO delegar al agente:**
- La compra y configuración del dominio (cuenta del registrar es del alumno).
- La rotación de secretos si se filtra alguno.
- La firma del acuerdo legal del registrar y el proveedor.

**Pitfalls a evitar:**
- Olvidar env vars y deploy falla silenciosamente.
- Commitear secrets en `.env`.
- Saltarse smoke check.
- No documentar el ToS gotcha.
- No probar el form en producción (puede fallar por env vars distintas).
- DNS de Cloudflare con Vercel: si usas Cloudflare como registrar pero Vercel como hosting, el proxy de Cloudflare (naranja) puede romper. Dejarlo en gris (DNS only) o configurar full strict.
- Variables de entorno por scope (Production vs Preview vs Development) en Vercel: si las pones solo en Production, las previews del PR fallan.

**Referencias web verificadas:**
- Vercel Next.js docs: [https://vercel.com/docs/frameworks/full-stack/nextjs](https://vercel.com/docs/frameworks/full-stack/nextjs). Verificada 2026-05-19.
- Vercel Custom Domains: [https://vercel.com/docs/projects/domains](https://vercel.com/docs/projects/domains). Verificada 2026-05-19.
- Vercel ToS (Hobby): [https://vercel.com/legal/terms](https://vercel.com/legal/terms). Verificada 2026-05-19.

**Notas adicionales para el agente generador-guia:**
- Cubrir el escenario completo en una sola sesión de trabajo con el agente: del primer push al dominio activo.
- Mencionar al pasar que la siguiente lección (Tendr SaaS) reutiliza este stack pero añade auth, Supabase, IA multi-provider, pagos y observabilidad.

**Recursos visuales sugeridos:**
- Diagrama Mermaid del flujo CI/CD: push → PR → checks → audit con Skill → preview → merge → production → smoke.
- Tabla de checks post-deploy (HTTPS activo, metadatos correctos, formulario funcional, Web Vitals reales, reporte de Skill landing-auditor).

---

## Hacia dónde lleva esta lección

L16 deja al alumno con un patrón completo de proyecto fullstack sencillo en producción: stack moderno, exploración visual con IA disciplinada, `design.md` como contrato versionado, componentes con SEO + GEO + lazy + a11y integrados, landing GEO-friendly, sistema de variantes con motivo de negocio, captura de leads en Neon con Turnstile, Skill propia multicapa de auditoría, deploy con dominio y lectura crítica del ToS.

Es la base operativa de la que parte **L17 (Tendr SaaS con Next.js + Supabase)**, donde se añade:

- **Producto real (Tendr)** que la landing de L16 vendía.
- Autenticación con patrón anónimo a autenticado (Linear / Notion / Figma).
- Base de datos con RLS (Supabase Postgres con policies por workspace).
- 4 features IA con **multi-provider BYO key** (Vercel AI SDK + envelope encryption AES-256-GCM).
- Jobs persistidos + Realtime para trabajo IA largo.
- Pagos con Stripe sandbox + webhooks signed + idempotencia.
- Observabilidad multicapa (Sentry + Langfuse + tabla `jobs`).
- Fase QA dedicada (E2E con Playwright + a11y + responsive + cross-browser).
- CI/CD agéntico con `claude-code-action` revisando PRs.

El `design.md` y la **Skill `landing-auditor` producidos en L16 se reutilizan tal cual en L17**. El patrón de slash command para variantes también escala al producto: variantes de onboarding, de dashboard, de email transaccional.

---

## Notas para el agente generador-guia

- **Formato caso-práctico:** las clases C1–C9 no siguen la estructura de secciones numeradas (`## 1. ...`) del tronco común. Se organizan por bloques del guion grabable. Cada clase es un episodio del proyecto.
- **Frontmatter:** `tipo: caso-práctico` en todas las clases C1–C9. C0 mantiene `tipo: introducción`.
- **Continuidad narrativa:** las clases cuentan un proyecto único de principio a fin. Hay referencias cruzadas entre clases ("el `design.md` que construiste antes", "los componentes de la clase anterior") con redacción natural, **sin notación interna del programa** (no decir "en C3"; sí "el `design.md` que construiste antes").
- **Stack único, no comparativa:** este caso fija un stack (Next.js 16 + Tailwind v4 + shadcn/ui + Neon + Drizzle + Turnstile + Vercel) y lo desarrolla. Las alternativas se mencionan en C1 como ADR.
- **Producto fijado:** Tendr. Pricing tiers Free / Pro €9 / Team €29 "próximamente". Identidad visual a destilar por el alumno en C3 partiendo de la exploración de C2.
- **Stitch 2.0 sin MCP:** el flujo es export como referencia, código final construido por el agente con las Skills del alumno. Explicar por qué.
- **GEO 2026 es protagonista, no nota al pie:** integrar `llms.txt`, `robots.txt` para crawlers de IA, JSON-LD profundo y sub-queries en FAQ como parte natural del flujo.
- **Código completo permitido:** a diferencia del tronco común, en casos prácticos el código del proyecto vive en las guías cuando hace falta para seguir el flujo.
- **Tono:** la voz es la del formador-mentor que construye en directo. Más narrativa, primera persona del formador permitida ("vamos a abrir el `design.md` y..." o "fíjate en cómo el agente respeta los tokens"). Sin perder rigor técnico.
- **Verificaciones operativas:** Lighthouse ≥95 en Performance, Core Web Vitals reales, validación HTML, schema markup verificado, `llms.txt` accesible, `robots.txt` permitiendo crawlers de IA son criterios de aceptación, no opcionales.
- **Idioma:** español neutro, sin voseo, sin guion largo retórico (excepto cabecera y pie del template), sin patrón "no es A, es B".
- **Notación interna:** prohibida en cuerpo de guía. Solo en cabecera y pie. No usar "track Fullstack" ni "M5" en el cuerpo.
- **Decisiones compartidas con L17:** `../_compartido/tecnico/preguntas-compartidas.md` (nombre del producto, pricing tiers, hosting, identidad visual compartida, Skill reusable, idioma de la UI). Cualquier cambio que afecte a L17 debe coordinarse.
- **SDD aplicado al caso:** opcional pero recomendado en C1 (decisión de stack con `sdd-explore/sdd-propose`), C3 (`design.md` como spec) y C8 (Skill con `sdd-design` previo). Detalle del mapeo de fases a fases SDD en `../_compartido/tecnico/sdd-framework-adapters.md`.
