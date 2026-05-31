# Design System · Tendr

> Sistema visual destilado de la dirección **#3 "Papel anotado"** (ADR-002): Editorial / Paper Brutalism cálido (catálogo §2.1) + anotaciones Notebook hand-drawn (§2.10) + refinamiento Anthropic. La intersección de Attio / Linear / Cal / Stripe es el canon estructural; la piel papel-brutalist es el filtro que lo reinterpreta todo.
>
> Spec versionado. Lock para todas las fases de construcción. Cualquier desviación es bug, no creatividad.

**Versión:** 2.0 · **Última actualización:** 2026-05-31 · **Producto:** Tendr (landing pública, mini-CRM B2B con IA para perfiles junior).

**Decisión en una línea:** lienzo de papel cream + tinta cálida, UN acento amber para CTA + UN acento clay para anotaciones/estados, esquinas 0px (4px solo CTA), hard shadow `4px 4px` dosificado, y UN solo momento wow (el pipeline narrativo que cobra vida al scrollear con anotaciones que se dibujan solas).

---

## 1. Voz

La voz de marca es **confiable, ágil, sin corporativismo**, para una audiencia de 25-35 años (CS, account managers, consultores, freelancers junior). Se traduce a lo visual así:

| Atributo de voz | Traducción visual |
|---|---|
| **Confiable** | Tinta cálida casi negra sobre papel, contraste AA holgado, jerarquía clara por peso. Nada de glow neón ni efectos que tapen el contenido. |
| **Ágil** | Esquinas duras (0px), hard shadow sin blur, listas numeradas editoriales. Lectura rápida, cero relleno. Motion con restraint: solo se mueve lo que cuenta algo. |
| **Sin corporativismo** | Anotaciones hand-drawn que enseñan como un manual cercano, no como un dashboard enterprise. Paleta cálida (no el gris-azul financiero de Stripe). Copy en sentence case, frases cortas, verbos directos. |

**Reglas de copy:** sentence case en títulos (title case prohibido), sin jerga ("synergy", "leverage", "empower"), sin em-dash (usar guion normal), una intención por CTA ("Empezar gratis" + "Ver cómo funciona", nunca duplicar intención).

---

## 2. Tokens

Notación de color **OKLCH**. Formato Tailwind v4 `@theme` (`--color-*`). AA mínimo (4.5:1) en cualquier combinación texto+fondo. UN solo acento primario en toda la página, UN solo radius system, sombras tintadas al hue del papel (nunca negro puro).

### 2.1 Color

Lógica de la paleta (PARTE 1.4 "color como sistema"): **base cálida de baja saturación** (papel), **tinta cálida** como neutro de texto, **un acento amber de alta luminosidad** reservado para acción, **un acento clay** (tono Claude/Anthropic) para anotaciones, bordes-izquierda y wash, y **un teal** funcional solo para estados OK / datos del pipeline. El acento NO se reparte: amber = hacé clic, clay = mirá esto, teal = está bien. Esa separación de roles evita el ruido cromático y mantiene el "un solo acento de acción" del taste-skill (4.2 COLOR CONSISTENCY LOCK).

| Token | OKLCH | Rol · justificación (1 línea) |
|---|---|---|
| `--color-surface` | `oklch(0.97 0.015 90)` | Papel cream, fondo dominante. Cálido y suave (Anthropic, no póster) para una voz cercana sin gritar. |
| `--color-surface-raised` | `oklch(0.985 0.012 90)` | Superficie elevada (faux-UI, cards de pipeline). Un punto más clara que el papel para separar sin sombra pesada. |
| `--color-surface-sunken` | `oklch(0.94 0.018 88)` | Zonas hundidas (input fields, columnas vacías del kanban). Levemente más oscura para profundidad de papel. |
| `--color-text-primary` | `oklch(0.18 0.020 50)` | Tinta cálida casi negra. Contraste ~14:1 sobre papel; legible y de confianza, no negro frío de pantalla. |
| `--color-text-secondary` | `oklch(0.42 0.015 50)` | Subtexto / captions. ~6:1 sobre papel, jerarquía por luminosidad manteniendo la calidez. |
| `--color-text-muted` | `oklch(0.52 0.012 50)` | Metadata, labels mono, placeholders. ~4.7:1 (AA verificado con axe/Lighthouse); nunca para texto largo. |
| `--color-accent-primary` | `oklch(0.85 0.13 88)` | Amber CTA. Energía cálida de alta luminosidad; reservado SOLO a la acción primaria. |
| `--color-accent-primary-hover` | `oklch(0.81 0.14 86)` | Hover del CTA. Baja luminosidad un paso para feedback táctil sin cambiar de hue. |
| `--color-accent-primary-active` | `oklch(0.77 0.15 84)` | `:active` del CTA, combina con `translate-y-[1px]`. |
| `--color-on-accent` | `oklch(0.18 0.020 50)` | Texto sobre amber = misma tinta. Amber es claro: texto oscuro asegura AA (el blanco fallaría). |
| `--color-accent-secondary` | `oklch(0.50 0.16 38)` | Clay/coral (naranja Claude). Anotaciones hand-drawn, border-left editorial, wash ambient. El "mirá esto". Profundizado para pasar AA como texto sobre papel (4.5:1). |
| `--color-accent-secondary-soft` | `oklch(0.92 0.04 40)` | Fondo tenue clay para highlights y la card "en riesgo" del pipeline. |
| `--color-success` | `oklch(0.48 0.07 185)` | Teal funcional. Estado OK y datos del pipeline; el único frío, dosificado, hereda la lógica "color solo en data" de Attio. |
| `--color-success-soft` | `oklch(0.90 0.03 185)` | Fondo tenue teal para badges de estado positivo. |
| `--color-warning` | `oklch(0.70 0.14 65)` | Aviso ámbar-tostado, distinto del CTA en hue para no confundir acción con alerta. |
| `--color-danger` | `oklch(0.55 0.17 28)` | Error / destructivo. Rojo cálido alineado al clay, no rojo pantalla saturado. |
| `--color-border` | `oklch(0.85 0.015 80)` | Borde 1px hairline sobre papel. Tinta diluida, no gris frío. |
| `--color-border-strong` | `oklch(0.18 0.020 50)` | Borde de tinta plena (1px) para piezas brutalist y el contorno del CTA. |
| `--color-focus-ring` | `oklch(0.50 0.16 38)` | Focus visible = clay a 2px offset. Acento secundario para no chocar con el amber del CTA. |
| `--color-disabled-bg` | `oklch(0.92 0.008 88)` | Fondo deshabilitado, casi papel sin acento. |
| `--color-disabled-fg` | `oklch(0.68 0.008 60)` | Texto deshabilitado, bajo contraste a propósito. |
| `--color-shadow-tint` | `oklch(0.30 0.04 60)` | Tinte del hard shadow: tinta cálida al 90%, NUNCA negro puro (taste 4.4). |
| `--color-wash-from` | `oklch(0.90 0.06 70)` | Wash ambient del hero, inicio (amber suave). |
| `--color-wash-to` | `oklch(0.93 0.05 40)` | Wash ambient del hero, fin (clay suave). Barrido cálido→cálido, jamás AI-purple (THE LILA RULE). |

**Dark mode:** NO se implementa en v2.0. La identidad papel-cream es la firma; un dark mode invertiría la metáfora ("papel" deja de ser papel) y el usuario rechazó el registro oscuro en el análisis (negative #1). Page theme lock = light (taste 4.11). Si se pide en el futuro, sería un "papel nocturno" sepia, no un dark frío.

### 2.2 Tipografía

Reglas §1.5 (carácter + modulación + jerarquía). Tres familias, tres roles, tres caracteres distintos. **Todas verificadas open-source / licencia libre comercial.**

| Rol | Familia | Peso | Origen · licencia | Carácter (por qué este) | Equivalentes OSS del análisis |
|---|---|---|---|---|---|
| **Display** | Clash Display | 600 / 700 | Fontshare · libre comercial | Grotesca display con carácter, geométrica pero cálida; da el peso editorial sin gritar. Equivale al Cal Sans propio de Cal. | Cal Sans → Clash / Satoshi / General Sans (análisis Cal) |
| **Display fallback** | Space Grotesk | 600 / 700 | OFL (Google Fonts) | Misma familia de grotesca técnica; degrada sin romper jerarquía si Clash no carga. | (mismo que Display) |
| **Body** | Hanken Grotesk | 400 (500 énfasis) | OFL (Google Fonts) | Humanista legible @20px; el "carácter humano no técnico" que pide la voz cercana. Equivalente al Söhne de Stripe / Inter Display de Linear sin caer en Inter. | Söhne → Hanken / Schibsted / Geist (análisis Stripe); Inter Display → Hanken (análisis Linear) |
| **Mono** | JetBrains Mono | 400 / 500, uppercase | OFL · ya en preset Lyra | Mono técnica para metadata, numeración de pasos y labels `FIG 0.X`; aporta la "voz de ingeniería" de Linear/Attio dosificada. | Geist Mono / JetBrains (análisis Attio y Linear) |

**Riesgo de licencia:** ninguno detectado. Clash Display y Hanken Grotesk están bajo la licencia de Fontshare / OFL respectivamente, ambas permiten uso comercial y self-host (`next/font/local` o `@fontsource`). No se usa ningún tipo comercial restrictivo. Jamás Inter, Fraunces ni Instrument Serif (vetados, taste 4.1 + negative #7).

**Énfasis en headlines:** italic/bold de la MISMA familia (Clash 700 o italic), nunca inyectar un serif en un titular sans (taste 4.1 EMPHASIS RULE).

### 2.3 Escala tipográfica

Base 20px (body, no 16px: la voz pide lectura cómoda). Ratio **1.25** (major third). Jerarquía por PESO antes que por tamaño desbordado (intersección #2).

| Nivel | Tamaño | Line-height | Letter-spacing | Uso |
|---|---|---|---|---|
| `display-xl` | clamp(3rem, 6vw, 4.75rem) | 1.02 | -0.02em | Titular del hero (max 2 líneas). |
| `display-lg` | clamp(2.5rem, 4.5vw, 3.5rem) | 1.05 | -0.018em | Headline de sección wow. |
| `h1` | 2.5rem (40px) | 1.1 | -0.015em | Encabezado de sección. |
| `h2` | 2rem (32px) | 1.15 | -0.01em | Sub-sección. |
| `h3` | 1.5rem (24px) | 1.2 | -0.005em | Card / paso. |
| `body-lg` | 1.375rem (22px) | 1.55 | 0 | Subhead del hero (max 20 palabras). |
| `body` | 1.25rem (20px) | 1.6 | 0 | Cuerpo por defecto, max 65ch. |
| `body-sm` | 1rem (16px) | 1.55 | 0 | Texto secundario, captions. |
| `caption` | 0.875rem (14px) | 1.4 | 0.01em | Notas, pie. |
| `meta` | 0.75rem (12px) | 1.3 | 0.14em | Mono uppercase: numeración, labels, metadata. |

### 2.4 Espacio

Base 4pt. Escala lineal-modular. Mínimo `space-16` (64px) entre secciones para el aire editorial del papel.

| Token | Valor | Uso típico |
|---|---|---|
| `space-1` | 4px | Gaps micro, offset del hard shadow. |
| `space-2` | 8px | Gap label↔input. |
| `space-3` | 12px | Padding interno de pills. |
| `space-4` | 16px | Gap base entre elementos. |
| `space-6` | 24px | Padding de cards. |
| `space-8` | 32px | Gap entre cards. |
| `space-12` | 48px | Padding interno de secciones. |
| `space-16` | 64px | Separación mínima entre secciones. |
| `space-24` | 96px | Separación amplia / respiración del hero. |
| `space-32` | 128px | Zonas de scrollytelling (beats del pipeline). |

Layout contenido en `max-w-[1280px] mx-auto`. Hero `min-h-[100dvh]` (nunca `h-screen`). `pt` del hero ≤ `space-24` (taste 4.7).

### 2.5 Radii

UN solo radius system (taste 4.4 SHAPE CONSISTENCY LOCK): **todo 0px** (carácter brutalist editorial), **4px solo en el CTA primario** (la única concesión, heredada del ADR para suavizar la acción principal). Pills full solo donde el componente es inherentemente pill (eyebrow, badges de estado).

| Token | Valor | Uso |
|---|---|---|
| `radius-none` | 0px | Default: cards, faux-UI, inputs, secciones, imágenes. |
| `radius-cta` | 4px | EXCLUSIVO del botón primario. |
| `radius-pill` | 9999px | Eyebrow pill, badges de estado, nav pill flotante. |

### 2.6 Sombras

Hard drop shadow `4px 4px 0` SIN blur (firma brutalist), tintado al hue del papel vía `--color-shadow-tint`, NUNCA negro puro. Dosificado: solo piezas clave (CTA, card destacada del pipeline, tier popular). El resto agrupa con `border` (taste 4.4).

| Token | Valor | Uso |
|---|---|---|
| `shadow-hard` | `4px 4px 0 var(--color-shadow-tint)` | Pieza brutalist clave en reposo (CTA, card destacada). |
| `shadow-hard-sm` | `2px 2px 0 var(--color-shadow-tint)` | Hover del CTA (la pieza "baja" hacia la sombra). |
| `shadow-soft` | `0 8px 24px -12px oklch(0.30 0.04 60 / 0.25)` | Toque Anthropic: elevación suave para faux-UI flotante (excepción documentada al brutalist). |
| `shadow-none` | `none` | Default. La mayoría de elementos separan por borde o espacio. |

**Regla de convivencia hard vs soft (ADR tradeoff):** `shadow-hard` para lo interactivo/brutalist (CTA, tier popular), `shadow-soft` para el faux-UI del producto (refinamiento Anthropic). No se mezclan en la misma pieza. Esa es la regla bloqueada; cualquier otra combinación es bug.

### 2.7 Movimiento (easings + duraciones)

Definir una vez en `globals.css` (motion §4.4). Todo bajo `prefers-reduced-motion`.

| Token | Valor cubic-bezier | Uso · nombre canónico |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Reveals coreografiados on-scroll (motion §7.2). El 60% del premium feel. |
| `--ease-inout` | `cubic-bezier(0.4, 0, 0.2, 1)` | Toggles, tabs, FAQ expand. |
| `--ease-snap` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Pop-in brutalist con leve overshoot (el "aterrizaje" de la card del pipeline). |
| `--ease-expo` | `cubic-bezier(0.19, 1, 0.22, 1)` | EXCLUSIVO del único momento wow (sticky overlap hero→sección 2). |

| Duración | Valor | Uso |
|---|---|---|
| `duration-micro` | 80-150ms | Hover, micro-feedback. |
| `duration-reveal` | 480ms | Entradas on-scroll. |
| `duration-wow` | 720ms | El momento wow. |
| `duration-beat` | 1400ms | Beats del scrollytelling del pipeline. |

---

## 3. Componentes destacados

Componentes del sistema que requieren cuidado especial. Cada uno hereda el filtro papel-brutalist.

| Componente | Anatomía | Reglas / comportamiento |
|---|---|---|
| **Hero** | Wash ambient cálido (amber→clay) de fondo + titular `display-xl` (max 2 líneas) + subhead `body-lg` (max 20 palabras) + 2 CTAs. Faux-UI del pipeline VACÍO asomando abajo. | Max 4 elementos de texto (taste 4.7). Sin trust strip ni tagline en el hero. Layout asimétrico: texto izquierda, pipeline derecha (no centrado, DESIGN_VARIANCE 8). |
| **CTA primario** | Amber sólido, `radius-cta` 4px, `border 1px` tinta, `shadow-hard`, texto tinta (`--color-on-accent`). | UNA intención ("Empezar gratis"). `:active` baja a `shadow-hard-sm` + `translate-y-[1px]`. AA verificado: tinta sobre amber. |
| **CTA secundario** | Outline tinta 1px, fondo transparente, 0px, sin sombra. | "Ver cómo funciona". Nunca duplica intención del primario. |
| **Eyebrow pill** | Mono uppercase `meta`, `radius-pill`, border 1px clay. | Max 1 cada 3 secciones (taste 4.7 EYEBROW RESTRAINT). Hero cuenta como 1. |
| **Step-cards numeradas** | Lista editorial numerada `01/02/03` en mono + mini-ilustración faux-UI + flecha hand-drawn con draw-in. | NO grid de 3 cards iguales (negative #6). Numeración editorial, cada paso con ilustración distinta (truco Cal). |
| **Pipeline narrativo** | Faux-UI de kanban de clientes scroll-progress driven: arranca vacío en hero, se puebla al bajar, una card cambia de columna con FLIP, la IA marca un cliente "en riesgo" con círculo hand-drawn + anotación al margen. | LA firma única, el momento wow. `shadow-soft` (Anthropic). Sticky pin §6.4. Reduced-motion: estado final estático poblado. |
| **Anotaciones hand-drawn** | SVG de flechas/círculos/subrayados en clay, animados con draw-in (`stroke-dashoffset`). | Producidas con pipeline de ilustración, NO a mano alzada amateur (ADR tradeoff). Enseñan como manual premium. |
| **Tabs de producto** | Tab-switcher (pipeline / IA / reporting) → faux-UI animado por tab. | Mecanismo Attio (§4.1#8). Demo sin tour. Estado activo: border-bottom clay 2px. |
| **Bento de features** | Grid con ritmo (no 6 filos iguales), faux-UI hover-peek en desktop / in-view-replay mobile. | Bento cell count = nº de contenidos exactos (taste 4.7). Al menos 2-3 celdas con variación visual real (faux-UI, wash). |
| **Tier de pricing** | Card 0px + border; el "popular" escala 1.02 + `shadow-hard` + badge pill. | UN tier destacado. Glow sutil prohibido (sin neón). |
| **FAQ accordion** | Expand `--ease-inout` 240ms, border-top divisorio. | Sin sobreactuar. |
| **Footer** | Tinta sobre papel hundido (`surface-sunken`), border-top 1px, sin motion. | Cierre sobrio. Logo wall (si aplica) = solo logos, sin labels de categoría (taste 4.8). |

---

## 4. Animaciones recurrentes

6 patrones recurrentes. Motion budget (§1.4): **1 wow + carácter + micro**. El único wow está marcado. Todo respeta `prefers-reduced-motion` (entrada inmediata sin transform). Stack tope 3 libs: Motion (`motion/react`) + CSS scroll-driven nativo + Lenis. GSAP solo fallback si el scrub del pipeline exige timeline compleja.

| # | Patrón (canónico) | Duración | Easing | Trigger | Librería | Presupuesto |
|---|---|---|---|---|---|---|
| 1 | **Wash ambient** loop (motion §6.10) | lento, ~20s loop | linear | on-load, continuo | CSS scroll-driven / keyframes GPU | ambient (barato) |
| 2 | **Reveal coreografiado** stagger 60-100ms (motion §7.2) | 480ms | `--ease-out` | in-view (once) | Motion `whileInView` | carácter |
| 3 | **Sticky overlap + fade parallax** hero→sección 2 (motion §7.4.3 + §6.3 tipo 3) | 720ms | `--ease-expo` | scroll-driven | CSS scroll-driven (GSAP fallback) | **★ ÚNICO WOW** |
| 4 | **Draw-in** de anotaciones hand-drawn (motion §6.2, `stroke-dashoffset`) | 600ms | `--ease-out` | in-view (once) | Motion / CSS | carácter |
| 5 | **FLIP** card del pipeline cambia de columna (motion §5.1 / receta §10.7) | 520ms | `--ease-snap` | scroll-progress (beat) | Motion `layout`/`layoutId` | carácter |
| 6 | **Micro-feedback** táctil en CTA + hover-peek bento + ticker de métrica | 80-150ms | `--ease-inout` | hover / `:active` | Motion / CSS | micro |

**El wow es el patrón #3 + #4 + #5 encadenados en la sección del pipeline:** la sección sube como una carta de papel (overlap), las anotaciones se dibujan solas (draw-in) y una card salta de columna (FLIP) mientras la IA marca el cliente en riesgo. Es UN momento, no tres sueltos. El resto de la página es carácter y micro.

---

## 5. Principios

La **intersección de Attio / Linear / Cal / Stripe es el canon estructural**; la dirección **#3 "Papel anotado" es el filtro** que la reinterpreta. Cada patrón de intersección se aplica bajo la piel papel-brutalist.

1. **Lienzo contenido + UNA firma visual** (intersección #1). Ningún ref satura la página: Tendr elige UN momento de fuerza (el pipeline narrativo). El resto respira en papel cream.
2. **Jerarquía por PESO, no por tamaño desbordado** (intersección #2). Display con carácter (Clash) + subtexto en luminosidad menor. Nunca Inter plano.
3. **Hero con 2 CTAs** (intersección #3): primario amber sólido + secundario outline, intenciones distintas.
4. **Faux-UI animada protagonista, no screenshot plano** (intersección #4). El producto se cuenta solo vía el pipeline scroll-driven.
5. **Motion con restraint dentro del budget** (intersección #5): 1 wow + carácter + micro. Disruptivo ≠ todo moviéndose.
6. **Filtro papel-brutalist:** esquinas 0px (4px solo CTA), hard shadow `4px 4px` dosificado, listas numeradas editoriales en vez de grids de cards iguales, anotaciones hand-drawn que enseñan.
7. **Calidez Anthropic sobre el brutalismo:** cream suave de libro (no póster), acento clay (naranja Claude), wash ambient cálido en vez de blob aurora frío. Refinamiento sin perder carácter.
8. **Un acento por rol:** amber = acción, clay = atención/anotación, teal = estado OK. La separación evita ruido cromático y mantiene el COLOR CONSISTENCY LOCK.
9. **Motion motivado:** cada movimiento comunica jerarquía, narrativa, feedback o estado. Si no se puede justificar en una frase, se elimina.

---

## 6. Restricciones (negative instructions)

Cosas vistas en las refs que NO se deben usar (parte de §3 del análisis + taste-skill).

- **No monocromo total tipo Attio/Linear.** Motivo: el usuario rechazó el registro sobrio; Tendr necesita acento cálido vivo, no grayscale.
- **No gradiente AI-purple / violeta-azul de IA.** Motivo: THE LILA RULE; el wash va siempre en paleta cálida amber/clay propia.
- **No tono enterprise/financiero tipo Stripe** (jerga "infraestructura", densidad developer, métricas corporativas). Motivo: la voz le habla a juniors, cercana y sin corporativismo.
- **No fake dashboards de `<div>` sin alma ni screenshots planos.** Motivo: el producto es faux-UI estilizada con una idea por pieza (taste 4.8), no relleno de divs.
- **No motion en cada sección.** Motivo: motion budget; 1 wow + carácter + micro. Sobre-animar rompe la calma del papel (ADR tradeoff).
- **No tres columnas de features con icono arriba.** Motivo: patrón saturado de tutorial; se usa bento con ritmo o listas numeradas editoriales.
- **No Inter / Fraunces / Instrument Serif.** Motivo: vetados por taste-skill, debilitan carácter; display = Clash, mono = JetBrains.
- **No animación sin propósito.** Motivo: cada movimiento cuenta algo (jerarquía, narrativa, feedback, estado); decoración pura se elimina.
- **No glow neón / sombras negras puras.** Motivo: el papel no admite neón; las sombras se tintan al hue cálido del fondo.
- **No mezclar hard shadow brutalist y soft Anthropic en la misma pieza.** Motivo: shape/shadow consistency lock; regla bloqueada en §2.6.

---

## 7. Sugerencias premium

Componentes del catálogo 2026 re-estilados a papel/cream/amber/clay. **Cada uno suma valor concreto, ninguno es decoración.** Ninguno entra con glow neón ni AI-purple por defecto (taste-skill). Tope de 3 librerías de animación ya cubierto por Motion + CSS scroll-driven + Lenis; estos se adoptan como **patrón de referencia re-implementado en Motion**, no como dependencias extra que rompan el tope.

| Componente | Librería | Qué aporta | Dónde en Tendr · re-estilado |
|---|---|---|---|
| **Animated Tabs** | Aceternity | Tab-switcher con indicador `layoutId` que se desliza | Tabs de producto (pipeline/IA/reporting). Indicador clay 2px, fondo papel, mecanismo Attio sin tour. |
| **Number Ticker** | Magic UI | Conteo animado de dígitos al entrar | Métrica real de prueba social ("clientes gestionados"), tinta sobre papel, mono JetBrains. Reemplaza el contador Stripe sin estética financiera. |
| **Text Reveal / Blur In** | Motion Primitives | Reveal coreografiado de titular | Hero y headlines de sección, easing `--ease-out`. El premium feel sin librería pesada. |
| **In-View / Scroll Reveal** | Motion Primitives | `whileInView` con stagger limpio | Step-cards y bento. Patrón #2, ya nativo de Motion. |
| **Marquee** | Magic UI | Tira horizontal en loop | UNA sola vez en la página (logo wall o tira de roles "CS · account · consultor"), velocidad lenta, sin glow. Marquee max-one-per-page (taste 5). |
| **Box / Card Border Beam** | Aceternity | Borde animado sutil | SOLO el tier popular de pricing, re-estilado a un trazo clay tenue (no beam neón). Aporta foco al plan recomendado. |
| **Spotlight / Grain Texture** | Aceternity / custom | Capa de textura/grano | Capa `fixed pointer-events-none` de grano de papel sutil sobre el fondo, refuerza la metáfora papel. GPU-barato, opacidad baja. |
| **Pointer Highlight / Hand-drawn underline** | Aceternity (re-dibujado) | Subrayado/círculo que se dibuja | Anotaciones hand-drawn (patrón #4). Re-implementado como SVG draw-in en clay, el corazón del "Papel anotado". |

**Decisión de implementación:** estos patrones se re-construyen en Motion + CSS, no se importan ocho dependencias. El catálogo es inspiración de comportamiento; el código vive en el repo (análisis §8.2) y respeta el tope de 3 librerías de animación.

---

## 8. Cómo validar este `design.md`

Criterios objetivos verificables. La auditoría de fase posterior los chequea.

| # | Criterio | Cómo medirlo |
|---|---|---|
| 1 | **Performance ≥ 90** | Lighthouse mobile (perf ≥ 90, idealmente ≥ 95). El wash y el sticky overlap deben correr en GPU (CSS scroll-driven), no en JS de scroll por frame. |
| 2 | **CLS < 0.1** | Web Vitals en producción. Fuentes self-host con `font-display: swap` y `next/font`; faux-UI con dimensiones reservadas para evitar reflow del pipeline. |
| 3 | **Accesibilidad AA** | Contraste 4.5:1 en todo texto (verificado en §2.1), focus visible clay 2px, `prefers-reduced-motion` desactiva los 6 patrones (estado final estático). CTA con texto tinta sobre amber (no blanco). |
| 4 | **Coherencia de tokens** | Cero hex hardcoded: 100% vía `--color-*`. UN solo acento de acción (amber), UN radius system (0px / 4px CTA), sombras tintadas al hue cálido (sin negro puro). Auditar cada componente. |
| 5 | **Ausencia de patrones de la negative list** | Grep mecánico: sin Inter/Fraunces/Instrument Serif, sin gradiente violeta-azul, sin 3 columnas de features con icono arriba, sin fake dashboards de div, sin más de 1 eyebrow cada 3 secciones, sin más de 1 marquee, sin más de 1 momento wow. |

---

## 9. Referencias

URLs del moodboard con qué aportó cada una, y catálogos del sénior citados.

| Fuente | URL | Qué se destiló |
|---|---|---|
| **Attio** | https://attio.com | Faux-UI del producto como protagonista; mecánica tab→mockup; reveal hero→texto (sticky overlap). Base del pipeline que cobra vida. **Tomamos el mecanismo, no la paleta monocroma.** |
| **Linear** | https://linear.app | Estilo de ilustración crafted, restraint, jerarquía por peso, labels técnicos mono. **Adaptado con calidez y color, no dark monocromo.** |
| **Cal.com** | https://cal.com | Step-cards numeradas con mini-ilustración distinta por card; numeración editorial; nav pill flotante. **Evita el anti-pattern de 3 cards iguales.** |
| **Stripe** | https://stripe.com | Legibilidad y gradiente vivo, aquí reducido a **wash cálido ambient** en paleta Tendr (nunca el violeta-azul de IA). Métrica en vivo → ticker. |
| **Notion** | https://notion.so | Calidez de voz e ilustración hand-drawn cálida; el tono humano que ancla las anotaciones. Referencia de **voz, no de estructura**. |
| **Anthropic** | https://anthropic.com | Cream cálido refinado, acento clay/coral (naranja Claude), wash ambient. **NOTA DE HONESTIDAD: no estaba en el moodboard original; se añadió en la decisión (ADR-002) y aquí se confirma como filtro de refinamiento, a validar en construcción.** |

**Catálogos del sénior:**
- Estilos (`MANUAL_DISENO_WEB_MODERNO.md`): §2.1 Editorial/Paper Brutalism, §2.10 Notebook/Excalidraw, §3.2 combinación A, PARTE 1.4 paleta como sistema, PARTE 1.5 tipografía.
- Motion (`MANUAL_ANIMACIONES_WEB.md`): §1.4 motion budget, §4.4 easings, §6.2 draw-in, §6.4 sticky pin, §6.10 loop ambient, §7.2 reveal coreografiado, §7.4 transiciones entre secciones, §7.4.3 sticky overlap, §6.3 fade parallax, §5.1/§10.7 FLIP.
- Ilustración (`MANUAL_ILUSTRACIONES_ANIMADAS.md`): §4.1 patrones de comportamiento, §8.2 stack tooling, §11.2 faux-UI.

**Supuestos propios marcados:** (a) dark mode descartado en v2.0 por la metáfora papel; (b) tokens derivados (hover/active/disabled/borders/washes) extrapolados de los 5 tokens base del ADR aplicando la lógica de "color como sistema"; (c) los componentes premium se re-implementan en Motion en vez de importarse, para respetar el tope de 3 librerías de animación.

---

*Spec vivo. Cambios significativos requieren commit con prefijo `docs(design): ...` y bump de versión en cabecera.*
