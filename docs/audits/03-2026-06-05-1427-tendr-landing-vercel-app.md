# Auditoría · https://tendr-landing.vercel.app/ · 2026-06-05 14:27

> Generada por landing-auditor. Outputs crudos en `/var/folders/.../audit.URZXMJ4AOD/`. Config aplicada: `docs/audits/audit.config.json`. Tercera auditoría del sitio (post-fixes de F8.1, reporte 01) — auditoría final de F9 post-deploy con CI/CD activo.

## Resumen ejecutivo

- **Performance:** 92/100 — LCP 3337ms · INP n/d (métrica de campo; no medible en lab) · TBT 0ms · CLS 0
- **SEO:** 0 findings — indexable: sí · metadata: completa
- **GEO:** 0 findings — JSON-LD: SoftwareApplication + FAQPage + Organization (los 3 válidos) · crawlers IA: todos permitidos · llms.txt: sí
- **A11y:** 0 críticos · 0 serios · 0 moderados · 1 requiere revisión humana (color-contrast, ya revisado en F7/F8)
- **Motion:** ejecutada (served + source) — 2/3 librerías · reduced-motion: ok (guards en padres) · pins: 1/1

**Evolución vs reporte 01 (mismo sitio, antes de F8.1):** score 85 → 92, LCP 4117ms → 3337ms, JSON-LD Product inválido → SoftwareApplication válido. Los fixes de F8.1 están verificados en producción.

## Findings priorizados

### 🔴 CRÍTICO — bloquea deploy
- Ninguno.

### 🟠 ALTO — antes de la próxima release
- Ninguno.

### 🟡 MEDIO — próximo sprint
- **LCP 3337ms (lab) > 2500ms.** Mejoró 780ms desde el reporte 01 pero sigue fuera del umbral "good". Única opportunity accionable: `unused-javascript` (~450ms de ahorro estimado). Revisar el split de bundles de la ruta `/` (14 JS servidos) con `next build --analyze` antes de invertir más: TBT 0 y FCP 953ms indican que el problema es peso de red, no ejecución.
- **`audit.config.json` desactualizado respecto al design system.** `--ease-snap` `cubic-bezier(0.34, 1.56, 0.64, 1)` fue canonizado en `docs/design.md:152` (F8.1, commit `3b9c2b2`) pero el presupuesto de motion de la config sigue listando solo 3 easings → el auditor lo re-flaggea como drift en cada run. **Acción:** añadir `"easing-snap": [0.34, 1.56, 0.64, 1]` a `docs/audits/audit.config.json → motion.easings`.

### ⚪ BAJO — informativo
- **`cubic-bezier(0, 0, 0.2, 1)` en CSS servido** (no está en source propio): es el `ease-out` por defecto de la capa shadcn/tw-animate. No es drift del design system propio; no accionar.
- **a11y `color-contrast` incomplete (56 nodos):** axe no puede computar el contraste (gradientes/capas superpuestas). Revisado manualmente en F7 (se corrigieron los 2 casos reales de los doodles); sin cambios visuales desde entonces.
- **`llms-full.txt` no existe.** Opcional; el `llms.txt` actual (4.2KB, con H1/descripción/audiencia/pricing/FAQ) cubre el caso de uso.

### Falsos positivos del run (verificados, NO accionar)
- **"BoardHand.tsx y feature-showcase-panels.tsx sin guard reduced-motion":** el check es per-file; ambos son hojas presentacionales sin timeline propio. Los guards `useReducedMotion()` viven en los orquestadores (`FeatureShowcase.tsx`, `FeaturesBoard.tsx`), que cortan a estado estático antes de animar las hojas. Mismo veredicto que el triage de F8.1.
- **"4 archivos con position:sticky vs presupuesto de 1 pin":** clasificados — `Header.tsx` (nav sticky = layout, no coreografía), `app/showcase/design/playground.tsx` (ruta interna de showcase, no landing), `app/globals.css` + `TestimonialsCork.tsx` (el ÚNICO scroll-pin coreográfico, el del corcho §5). Pins coreográficos reales: 1/1 — dentro de presupuesto.

## Detalle por capa

### Performance
| Métrica | Valor | Umbral | Estado |
|---|---|---|---|
| Score | 92/100 | ≥90 | ✓ |
| LCP | 3337ms | <2500 | ✗ |
| CLS | 0 | <0.1 | ✓ |
| TBT | 0ms | <200 | ✓ |
| FCP / TTFB | 953ms / 25ms | — | — |

INP: no medible en laboratorio — requiere datos de campo (CrUX).

Top opportunities: `unused-javascript` — Reduce unused JavaScript — ~450ms.

### SEO
- Indexabilidad: meta robots `index, follow` · X-Robots-Tag: ausente (correcto)
- Title (55 chars), description (124 chars), canonical `https://tendr-landing.vercel.app`
- Open Graph: title/description/image/type completos, og:image absoluto · Twitter: `summary_large_image` con imagen
- Sitemap: accesible, 4 URLs
- Issues: ninguno

### GEO
- **llms.txt:** accesible · H1 + descripción + audiencia + pricing + FAQ · 4193 bytes · llms-full.txt: no
- **Crawlers (robots.txt):** training (GPTBot, ClaudeBot, Google-Extended, CCBot) todos `allowed-explicit` · retrieval (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, Perplexity*) todos permitidos — ninguno bloqueado
- **JSON-LD:** SoftwareApplication ✓ · FAQPage ✓ · Organization ✓ (0 errores; el Product inválido del reporte 01 quedó eliminado en producción)
- **Headings:** h1 ×1 · jerarquía limpia · directAnswerFirst: sí
- **SSR:** 6120 bytes de texto visible sin JS

### A11y
| Impact | Count | Reglas |
|---|---|---|
| critical | 0 | — |
| serious | 0 | — |
| moderate | 0 | — |
| minor | 0 | — |

Passes: 46. Incompleto (revisión humana): `color-contrast` (56 nodos — axe no puede computar sobre capas/gradientes; revisado manualmente en F7, sin regresión visual desde entonces). Motor: axe 4.11.4.

### Motion
- Librerías detectadas vs permitidas: served `lenis` + `motion` (2) / source `lenis` + `motion` — 2/3, dentro de presupuesto. CSS scroll-driven nativo permitido y en uso.
- Easings fuera del spec: `0.34,1.56,0.64,1` (`--ease-snap`) — **falso positivo por config desactualizada**, ya canonizado en design.md §2.7 (ver MEDIO). `0,0,0.2,1` solo en served — capa shadcn/tw-animate (ver BAJO).
- prefers-reduced-motion: kill-switch CSS global ✓ · guards JS en los orquestadores ✓ (los 2 archivos flaggeados son falsos positivos del check per-file).
- Scroll-pins: 1 coreográfico (TestimonialsCork) / 1 permitido ✓ — Header y playground son layout/ruta interna.
- **Juicio del agente (heurístico):** hay exactamente 1 wow (hero, `--easing-expo` acotado a `globals.css` + `Hero.tsx` — sus dos únicos usuarios legítimos) y 1 pin coreográfico. El presupuesto de motion se respeta en producción.

---

## Addendum post-fix (mismo día, 14:45)

Los dos MEDIOs se corrigieron (commits `e92dced` + `715ad49`) y se re-midió performance en producción tras el deploy:

| Métrica | Run 03 | Post-fix | Δ |
|---|---|---|---|
| Score | 92 | 93 | +1 |
| LCP | 3337ms | 3182ms | −155ms |
| unused-javascript | ~450ms | ~150ms | −300ms |

**Veredicto:** el finding unused-javascript queda resuelto (el chunk del form — zod + RHF + Turnstile — ya no se carga en la ventana del LCP; verificado con captura de red). El LCP restante (~3.2s) NO está dominado por JS: con TTFB 23ms y FCP ~1s, el gap vive en el render del elemento LCP (hipótesis: coreografía de entrada del hero y/o font del heading). Investigación propuesta para un sprint futuro: trace de lab del hero (`largest-contentful-paint-element` + film strip) antes de tocar nada.
