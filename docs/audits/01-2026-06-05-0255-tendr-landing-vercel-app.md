# Auditoría · https://tendr-landing.vercel.app/ · 2026-06-05

> Generada por landing-auditor (5 capas). Config aplicada: `docs/audits/audit.config.json`. Modo: portable (local).

## Resumen ejecutivo

- **Performance:** 85/100 — LCP 4117ms · INP n/d (field-only) · TBT 0ms · CLS 0.005 · FCP 1838ms · TTFB 27ms
- **SEO:** 0 issues reales — indexable (`index, follow`) · metadata completa · canonical a dominio de producción (correcto)
- **GEO:** 3 issues — JSON-LD Org/SoftwareApp/FAQ válidos, **3× Product sin `image`** · llms.txt completo · todos los crawlers IA permitidos
- **A11y:** 0 violations · 46 passes · 1 incompleto (56 nodos de contraste a revisar)
- **Motion:** dentro de presupuesto (2/3 libs) · **2 coreografías sin guard reduced-motion** · drift `--ease-snap`

Veredicto: **base sólida, lista para producción con 2-3 arreglos de release**. Sin bloqueantes duros. Lo más accionable: completar los `Product` JSON-LD y meter `useReducedMotion` en dos componentes.

## Findings priorizados

### 🔴 CRÍTICO — bloquea deploy
- _Ninguno._

### 🟠 ALTO — antes de la próxima release
- **JSON-LD `Product` inválido (×3): falta `image`.** Los tres tiers de pricing emiten `Product` sin imagen → Google Rich Results lo descarta y los motores generativos pierden el grounding de la oferta. **Acción:** añadir `image` (absoluta) a cada `Product`, o degradarlos a `Offer` dentro del `SoftwareApplication` si no son productos independientes. *(emisor del JSON-LD de pricing).*
- **2 coreografías sin `prefers-reduced-motion` propio.** `components/landing/BoardHand.tsx` y `components/landing/feature-showcase-panels.tsx` animan con Motion/JS; el kill-switch CSS global NO frena animaciones JS por sí solo. **Acción:** `useReducedMotion()` en ambos y cortar a estado final estático cuando sea `true`.
- **LCP 4117ms** (apenas sobre el umbral de 4s, lab throttled). TTFB es 27ms (servidor rápido) → el coste está en render/JS. **Acción:** reducir JS no usado (~450ms según Lighthouse); confirmar con un run desktop o datos de campo antes de invertir más.

### 🟡 MEDIO — próximo sprint
- **Drift de easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (`--ease-snap`, overshoot del FLIP de pricing) está en `app/globals.css` pero NO en design.md §2.7. **Acción:** legalizarlo en el spec (es un easing legítimo del FLIP) o sustituirlo por uno de los tres canónicos.
- **A11y — 56 nodos de contraste "incompletos".** axe no pudo decidir el contraste (típico de texto sobre gradiente/imagen). **Acción:** revisión humana de esos nodos; no es violation pero sí riesgo.
- **Scroll-pins a clasificar (4 sticky).** `Header.tsx` = layout (OK), `showcase/design/playground.tsx` = no producción. Confirmar que `TestimonialsCork.tsx` no introduce un 2º scroll-pin compitiendo con el wow Hero→"Cómo funciona" (`globals.css` + `Hero.tsx`). El presupuesto es 1 wow.

### ⚪ BAJO — informativo
- **canonical → `https://tendr.app`** (≠ URL auditada). **Correcto e intencional** si tendr.app es el dominio de producción y vercel.app un alias — evita contenido duplicado. Solo confirmar que tendr.app está live y sirve el mismo contenido.
- `llms-full.txt` no existe (opcional; el llms.txt de 4.2KB ya es un índice completo).
- Bezier `cubic-bezier(0,0,0.2,1)` en el CSS servido (ease-out, probablemente de Tailwind/tercero) — cosmético.

## Detalle por capa

### Performance — 85/100
| Métrica | Valor | Umbral | Estado |
|---|---|---|---|
| Score | 85/100 | ≥90 | ⚠️ |
| LCP | 4117ms | <2500 | ✗ |
| CLS | 0.005 | <0.1 | ✓ |
| TBT | 0ms | <200 | ✓ |
| FCP / TTFB | 1838ms / 27ms | — | ✓ |

INP: no medible en laboratorio (requiere datos de campo / CrUX). Top opportunity: `unused-javascript` (−450ms).

### SEO
- Indexabilidad: `index, follow` · sin X-Robots-Tag bloqueante ✓
- Title (58) y description (139) en rango SERP ✓ · canonical `https://tendr.app` (producción)
- Open Graph completo con imagen absoluta (`https://tendr.app/og.png`) · Twitter `summary_large_image` ✓
- Sitemap accesible, 4 URLs ✓

### GEO
- **llms.txt:** accesible, 4193 bytes, con H1 + descripción + audiencia + pricing + FAQ ✓ (esperadas por config)
- **Crawlers (robots.txt):** training (GPTBot, ClaudeBot, Google-Extended, CCBot) y retrieval (OAI-SearchBot, ChatGPT-User, Claude-*, Perplexity*) todos permitidos ✓
- **JSON-LD:** Organization ✓ · SoftwareApplication ✓ · FAQPage ✓ · **Product ×3 inválidos (falta `image`)**
- **Headings:** h1 ×1 · jerarquía limpia · directAnswerFirst ✓
- **SSR:** 6120 bytes de texto visible sin JS ✓ (los bots IA lo ven)

### A11y
| Impact | Count |
|---|---|
| critical / serious / moderate / minor | 0 / 0 / 0 / 0 |

46 passes, 0 violations. 1 incompleto: `color-contrast` en 56 nodos (revisión humana — axe no pudo decidir, probablemente texto sobre fondos no planos). Motor: axe-core 4.11.4.

### Motion
- **Librerías:** `lenis` + `motion` (2/3, dentro de presupuesto). Sin deps fuera de budget ✓. CSS scroll-driven nativo presente ✓.
- **reduced-motion:** kill-switch CSS global presente, pero `BoardHand.tsx` y `feature-showcase-panels.tsx` (Motion/JS) **sin guard propio** → ver ALTO.
- **Easings:** los 3 del spec presentes + `--ease-snap` fuera de spec (drift, ver MEDIO).
- **Pins:** 4 sticky a clasificar (ver MEDIO). wow esperado: Hero→"Cómo funciona" (`globals.css` + `Hero.tsx`).
- **Heurístico (juicio):** el wow único parece respetado; el riesgo real es `TestimonialsCork.tsx` si fija scroll.

---
_Outputs crudos: `/var/folders/.../audit.qqGqSzbNWd/`. Reporte completo versionado en `docs/audits/`._
