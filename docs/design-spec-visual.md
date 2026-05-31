# Spec visual ejecutable · Tendr

> F3 · Etapa 5 (vibe-design §4.5 / prompt §6.5). Mapea sección a sección de la landing a componentes concretos + motion level + trigger. Derivado de `docs/design.md` v2.0 (dirección #3 "Papel anotado", ADR-002). Validado sección a sección con el usuario.

**Versión:** 1.0 · **Fecha:** 2026-05-31 · **Estado:** cerrado, listo para construir (F4).

---

## Criterio rector (gobierna todo el doc)

`design.md §7` bloqueó el stack real. Por eso, en cada sección:

- **"Componente base / librería"** = el **patrón de referencia** de dónde sale el comportamiento (Aceternity / Magic UI / Motion Primitives, o búsqueda Magic MCP). **NO se importa la dependencia**: se **re-implementa** en el stack locked.
- **Librería de implementación** (lo que de verdad se instala) = **shadcn (base) + Motion (`motion/react`) + Lenis + CSS scroll-driven nativo**.
- Fuentes de catálogo acotadas a las **3 vetadas en design.md §7**: **Aceternity, Magic UI, Motion Primitives**. Sin 4ª.

**Tope de librerías (regla §6.5 + design.md):** 3 mecanismos de animación = **Motion + CSS scroll-driven (nativo) + Lenis**, sobre **shadcn**. CSS scroll-driven no es dependencia (es nativo). Los componentes de catálogo son inspiración de comportamiento, no imports.

**Motion budget (design.md §4):** **1 wow** (transición Hero→Cómo funciona) + **carácter** + **micro**. Todo bajo `prefers-reduced-motion`. Hero puede ser wow; el resto **≤ medio**; footer **simple**.

---

## 1. Hero

- **Componente base**: **Custom sobre shadcn** + patrones re-implementados. Reveal del titular = Motion Primitives `TextEffect` / "Blur In" (patrón, re-build en Motion variants). Wash ambient = CSS `@keyframes` GPU. Faux-UI del pipeline **vacío** = custom (divs/SVG estilizados con dimensiones reservadas para CLS 0).
- **Motion level**: **wow** (única sección con wow). El wow real no está *dentro* del hero, sino en la **transición Hero→Cómo funciona** (sticky overlap + draw-in + FLIP encadenados). El hero *arranca* esa narrativa con el pipeline vacío.
- **Animation trigger**:
  - `on-load`: reveal coreografiado del titular → Motion variants, stagger 60-100ms, `--ease-out`, `--duration-reveal` (480ms).
  - continuo: wash ambient loop ~20s → CSS `@keyframes` (solo `transform`/`opacity`, GPU); bajo `prefers-reduced-motion` se congela.
  - `on-scroll`: sticky overlap hacia sección 2 → CSS scroll-driven (`animation-timeline: view()`), `--ease-expo`, `--duration-wow` (720ms); Lenis suaviza el scrub. Reduced-motion: estado final estático.
- **Por qué este**: el hero ES la firma; un hero importado (Aceternity `HeroHighlight`/`Spotlight`) trae spotlight neón / registro dark que rompen el papel cream (THE LILA RULE, negative #2/#9). Custom habilita el wash cálido amber→clay + el faux-UI del pipeline vacío, que es el diferencial narrativo. Layout asimétrico (texto izq / pipeline der, DESIGN_VARIANCE 8), jerarquía por peso (Clash Display).
- **Alternativas**: (a) Aceternity `HeroHighlight` re-estilado a papel sin spotlight; (b) Motion Primitives `AnimatedGroup` como base mínima del stagger + wash en CSS aparte.
- **Tokens aplicables**: `--color-wash-from` / `--color-wash-to` (fondo ambient), `--color-surface` (papel), `--color-text-primary` / `--color-text-secondary` (titular + subhead), `--color-accent-primary` + `--color-on-accent` + `--radius-cta` + `--shadow-hard` (CTA "Empezar gratis"), `--color-border-strong` (CTA secundario outline "Ver cómo funciona"), `--text-display-xl` (titular, max 2 líneas), `--text-body-lg` (subhead, max 20 palabras), `--font-display` / `--font-sans`, `--ease-out` + `--ease-expo`, `min-h-[100dvh]`, `space-24` (respiración, `pt ≤ space-24`).

---

## 2. Cómo funciona (3 pasos)

- **Componente base**: **Custom sobre shadcn** - lista editorial numerada (`01 / 02 / 03` mono) con mini-ilustración faux-UI distinta por paso + flecha hand-drawn que se dibuja sola. **NO grid de 3 cards iguales con icono arriba** (negative #6). Patrones re-implementados: Motion Primitives `AnimatedGroup` (stagger in-view) + draw-in por `stroke-dashoffset` (SVG custom en Motion).
- **Motion level**: **medio** (carácter).
- **Animation trigger**:
  - `on-scroll`: reveal de cada paso → Motion `whileInView` (Intersection Observer), `once: true`, stagger 60-100ms, `--ease-out`, `--duration-reveal`.
  - `on-scroll`: draw-in de las flechas clay entre pasos → `stroke-dashoffset` in-view once, `--ease-out`, ~600ms. Reduced-motion: trazo final estático.
- **Por qué este**: truco Cal - cada paso con su ilustración salva el "3 columnas iguales" (negative #6); numeración editorial mono refuerza el papel; la flecha hand-drawn **guía la lectura como anotación de manual** (voz sin corporativismo). El movimiento *enseña el flujo*, no decora.
- **Alternativas**: (a) Aceternity `Timeline` re-estilado a papel (numeración + línea clay, no glow); (b) bento asimétrico 2+1 si 3 pasos en fila quedan cortos en desktop.
- **Tokens aplicables**: `--text-meta` (numeración mono), `--color-accent-secondary` (flechas/subrayados clay), `--text-h3` (título de paso), `--color-text-primary` / `--color-text-secondary`, `--color-surface-raised` (mini faux-UI), `--color-border` (hairline), `--font-display` / `--font-mono` / `--font-sans`, `space-16` / `space-32`, `--ease-out`, `--duration-reveal`.

---

## 3. Features

**Concepto disruptivo: "tablero de notas vivas".** Las features no se *cuentan* con icono+texto, se *muestran funcionando*: cada celda es un fragmento faux-UI real del CRM (mini-columna kanban, card "en riesgo" con círculo hand-drawn, toast de recordatorio, métrica), montado como notas de papel pegadas en un tablero - **con físicas**.

- **Componente base**: Magic UI / 21st.dev **`Bento Product Features`** (slot-based asimétrico, vía Magic MCP) **adaptado** → cada slot = faux-UI distinto del producto, no card genérica. Hover-peek con spotlight clay (mecánica del "Cybernetic Bento" re-skinned, sin neón). Toque papel-pegado: rotación sutil ±1° + lift en hover ("Colorful Bento"). Re-implementado en Motion sobre shadcn `Card`.
- **Motion level**: **medio** (carácter). On-demand, no auto-play → no compite con el wow del hero.
- **Físicas (núcleo disruptivo, con sentido)**:
  - Cada nota es `drag` de Motion con `dragConstraints` al tablero + `dragElastic: 0.15` (rubber-band sutil) + `dragTransition` (bounceStiffness/bounceDamping) → **asienta como papel con chinche**. `transformOrigin` cerca del pin → pivota como péndulo corto al soltarla. `whileDrag`: `scale 1.04` + rotación leve.
  - Todo en **motion values** (`useMotionValue`/`useTransform`), cero `useState` → off-render, perf intacta.
  - **Sentido**: arrastrar = "vos organizás tus clientes". La física *es* el value-prop hecho tacto.
  - **Guardas**: en **mobile NO hay free-drag** (chocaría con el scroll, taste gesture-conflicts) → ahí solo hover-peek / in-view-replay. `prefers-reduced-motion`: drag desactivado, notas estáticas. El contenido de cada nota se lee sin tocar nada (a11y: drag es enhancement).
- **Animation trigger**:
  - `on-scroll`: entrada de celdas → Motion `whileInView` (`once: true`), spring suave (stiffness ~100, damping ~14), stagger 80-100ms, `--ease-snap` ("aterrizaje" de la nota).
  - `on-hover` (desktop): hover-peek → micro faux-UI anima (un recordatorio dispara, la IA circula un cliente) + spotlight clay siguiendo el cursor con motion values, `--duration-micro`.
  - `on-drag` (desktop): físicas descritas arriba.
  - mobile: in-view-replay → micro-demo 1 vez al entrar (Intersection Observer).
- **Por qué este**: el grid por slots da ritmo asimétrico real (1 grande + chicas) y variación visual genuina por celda → cumple "2-3 celdas con faux-UI" y mata el anti-pattern de 3 columnas iguales (negative #6). Mostrar la feature funcionando es la promesa "faux-UI protagonista" (intersección #4). La física tiene sentido (organizar clientes), no es lucimiento.
- **Alternativas**: (a) Aceternity `CardSpotlight` re-skinned a clay si el slot-grid de Magic UI no encaja; (b) listas editoriales 2-columnas con faux-UI si el bento pelea con mobile (riesgo de densidad, ADR).
- **Re-skin obligatorio del snippet**: trae `lucide-react`, `rounded-lg`, `shadow-sm` → cambiar a **Phosphor** (icon lib del proyecto), `0px` y tokens de sombra propios.
- **Tokens aplicables**: `--color-surface-raised` + `shadow-soft` (celdas faux-UI flotantes), `--color-surface` (fondo tablero), `--color-accent-secondary` / `--color-accent-secondary-soft` (spotlight clay + círculo "en riesgo"), `--color-success` / `--color-success-soft` (badges estado kanban), `--text-h3` (título celda) + `--text-body-sm` + `--text-meta` (labels mono), `--color-border` (hairline), `radius-none`, `--font-display` / `--font-mono` / `--font-sans`, `--ease-snap` + `--ease-out`, `--duration-reveal` / `--duration-micro`, `space-8` (gap), `space-16`.

---

## 4. Pricing (3 tiers)

**Concepto: "el plan recomendado, anotado a mano".** Un mini-recomendador interactivo + una anotación que señala el plan. Clarity para el cliente + anclaje honesto hacia el tier objetivo.

- **Componente base**: **Custom sobre shadcn `Card`** (3 tiers, 0px) + `Switch` (mensual/anual) + **mini-selector "¿cuál te sirve?"** (toggles: *Solo yo / Equipo* · *Pocos clientes / Cartera grande*). Según la respuesta, una **flecha hand-drawn + tag "Recomendado" se mueven al tier que matchea** (FLIP `layoutId`). Estado por defecto = ya apunta al **tier objetivo**. Patrón de borde Aceternity `Border Beam`, **re-implementado como anotación hand-drawn, NO beam neón**.
- **Motion level**: **medio** (lo justifica el recomendador; sigue sin ser wow).
- **Animation trigger**:
  - `on-scroll`: reveal de los 3 tiers → Motion `whileInView` (`once`), stagger 80ms, `--ease-out`, `--duration-reveal`.
  - `on-interaction`: al togglear el selector → flecha + tag "Recomendado" saltan al tier con **FLIP** (`layout`/`layoutId`, `--ease-snap`, ~400ms) y la caja hand-drawn se redibuja. Motion **motivado** (state transition: la recomendación cambia).
  - `on-scroll`: caja + anotaciones de margen del recomendado se dibujan 1 vez (`stroke-dashoffset`, `--ease-out`); el tier sube a `scale 1.02` + `--shadow-hard`.
  - `on-hover` toggle / CTA: micro-feedback `--duration-micro`. Reduced-motion: flecha/caja estáticas en el recomendado, sin FLIP ni scale animado.
- **Estructura de anclaje (vender el tier objetivo, honesto)**: 3 tiers ordenados para que el **objetivo (medio, "Pro")** quede entre un básico y un premium-ancla; el premium hace que el Pro lea como la decisión inteligente. Comparación compacta (diferenciadores clave resaltados, **no tabla de 20 filas**, content density). Cada plan dice **para quién es** ("para empezar" / "para profesionalizarte" / "para equipos").
- **Guardarraíl de honestidad**: sin contador de stock falso, sin cuenta regresiva, sin números inventados (taste copy rules). El esteer es por valor real + jerarquía visual. La recomendación va **también en texto** (no solo en la flecha) para a11y y reduced-motion.
- **Por qué este**: combina claridad (el cliente sabe cuál es su plan) con anclaje honesto (jerarquía + badge + anotación que argumenta valor). La flecha que se mueve es disruptiva y útil a la vez.
- **Alternativas**: (a) sin selector interactivo, solo el tier recomendado anclado + anotación; (b) Magic UI `Pricing` re-skinned si se quiere matriz comparativa más densa.
- **Tokens aplicables**: `--color-surface-raised` (cards) + `--color-surface-sunken` (tiers no recomendados, un punto atrás), `--color-border` / `--color-border-strong`, `--color-accent-secondary` (flecha + caja + anotaciones clay), `--color-accent-primary` + `--color-on-accent` + `--radius-cta` + `--shadow-hard` (CTA del recomendado + `scale 1.02`), `--color-success-soft` (badge "incluido"), `--text-h2` (precio) + `--text-meta` (período mono) + `--text-body-sm` (features + "para quién"), `radius-none` (cards), `--ease-out` + `--ease-snap` + `--ease-inout`, `--duration-reveal` / `--duration-micro`, `space-8` / `space-16`.

---

## 5. Testimonials

**Concepto: notas de clientes ancladas al mismo tablero** (cohesión con Features). Cada testimonio es una ficha de papel **clavada con chincheta que se descuelga al scrollear**.

- **Componente base**: 21st.dev / Magic UI **`Testimonials`** (grid asimétrico de citas, vía Magic MCP) **adaptado** a fichas de papel con chincheta. Una nota "destacada" más grande (asimetría). Re-implementado en Motion sobre shadcn `Card` (mismo lenguaje que el bento de Features).
- **Motion level**: **sutil-medio**. A propósito más calmo que Features: **no se repite el `drag`** (el wow ya se gastó).
- **Chincheta scroll-driven (diferencial, óptimo)**:
  - Cada nota nace **clavada** por una chincheta (SVG arriba-centro), con tilt ±1.5° y `--shadow-hard` (sombra de papel clavado).
  - Coreografía atada al progreso de scroll de **cada** nota con **CSS `animation-timeline: view()`** (GPU, off-main-thread, sin listener de scroll → óptima):
    1. Entra por abajo → chincheta clavada, nota algo torcida.
    2. Cruza el centro → la chincheta **se levanta** (`translateY -8px` + `opacity → 0` + leve rotación), la nota **se endereza** (tilt → 0°), la sombra muta `--shadow-hard → --shadow-soft` (de "clavada" a "en la mano").
    3. Asienta con micro-overshoot `--ease-snap`.
  - **Óptima**: solo `transform` + `opacity` (CLS 0), GPU, cero JS por frame. Motion **motivado**: scrollear = descolgás la nota para leerla.
  - **Guardas**: `prefers-reduced-motion` → chincheta + nota en estado final estático, legible. Sin soporte de scroll-driven → progressive enhancement al estado final (no se rompe). El hover-lift queda como capa táctil opcional en desktop.
  - **Budget**: micro por-nota, NO sticky-pin de sección → no compite con el wow del hero.
- **Animation trigger**:
  - `on-scroll`: reveal stagger de las fichas → Motion `whileInView` (`once`), 80-120ms, `--ease-out`, `--duration-reveal`.
  - `on-scroll` (per-nota): chincheta scroll-driven (arriba) → CSS `animation-timeline: view()`.
  - `on-hover`: lift sutil + endereza (tilt → 0°) con spring corto → motion values, `--duration-micro`.
- **Por qué este**: reusar el tablero da cohesión (Features y Testimonials hablan el mismo idioma) y transmite confianza cercana, no corporativa. La chincheta premia el scroll con un micro-momento orgánico. Asimetría mata la grilla uniforme.
- **Alternativas**: (a) grid con stagger limpio (3er resultado Magic MCP) si el tablero recarga; (b) sticky-stack (2º resultado) **descartado a propósito** - competiría con el sticky-overlap del hero.
- **Guardarraíles de cita (taste 4.10)**: cita **≤ 3 líneas**; atribución **nombre + rol + empresa** (nunca solo nombre); comillas tipográficas; **sin em-dash**; **sin dots de estado decorativos** (el snippet traía un dot verde → fuera); avatares creíbles y **nombres realistas locales** (no "Jane Doe"); sin encabezado "Quietly trusted by".
- **Tokens aplicables**: `--color-surface-raised` + `--shadow-hard` / `--shadow-soft` (fichas con/sin chincheta), `--color-surface` (tablero), `--color-accent-secondary` (chincheta + subrayado clay de la destacada), `--color-text-primary` (cita) + `--color-text-secondary` (rol/empresa), `--text-body` (cita) + `--text-meta` (rol mono) + `--text-body-sm`, `--color-border` (hairline), `radius-none`, `--font-sans` (cita) / `--font-mono` (rol) / `--font-display` (nombre destacado), `--ease-out` + `--ease-snap`, `--duration-reveal` / `--duration-micro`, `space-8` / `space-16`.

---

## 6. FAQ

- **Componente base**: **shadcn `Accordion`** (Radix) custom-styled a papel. No necesita componente premium: es utilidad, no espectáculo.
- **Motion level**: **sutil**.
- **Animation trigger**: `on-click` expand/collapse → Radix `data-state` + altura animada, `--ease-inout`, 240ms. Reduced-motion: toggle instantáneo. Opcional: subrayado hand-drawn clay en la pregunta abierta (draw-in 1 vez).
- **Por qué este**: Radix da accesibilidad completa (teclado, `aria-expanded`); el motion budget no se gasta en una FAQ.
- **Alternativas**: (a) Motion Primitives `Disclosure` si se quiere spring; (b) Animata accordion para un hueco puntual.
- **Tokens aplicables**: `--color-border` (border-top divisorio), `--text-h3` (pregunta) / `--text-body` (respuesta), `--color-accent-secondary` (subrayado opcional), `--color-text-primary` / `--color-text-secondary`, `radius-none`, `--ease-inout`, `space-8` / `space-16`.

---

## 7. Footer

- **Componente base**: **Custom sobre shadcn** (logo, nav links, legal). Sobrio.
- **Motion level**: **ninguno** (a lo sumo un fade-up `once` muy leve al entrar). Regla: footer simple.
- **Animation trigger**: ninguno / `on-scroll` fade-up once leve.
- **Por qué este**: cierre que no sobreactúa (regla footer + motion budget).
- **Diferencial opcional**: una **única tira marquee** de roles ("CS · account manager · consultor · freelance") como banda **pre-footer** - es el **único marquee de toda la página** (max-one-per-page, taste 5), lento, sin glow. El footer en sí queda inmóvil. Patrón de referencia: Magic UI `Marquee`, re-implementado en CSS/Motion.
- **Alternativas**: shadcn base sin más; logo wall (si aplica) = **solo logos, sin labels de categoría** (taste 4.8).
- **Tokens aplicables**: `--color-surface-sunken` (fondo hundido), `--color-border` (border-top 1px), `--color-text-secondary` / `--color-text-muted`, `--text-meta` (links mono), `--color-accent-primary` (solo si hay un CTA final), `radius-none`, `space-16` / `space-24`.

---

## Resumen de stack y librerías (auditoría)

| Capa | Qué se usa | Cuenta para el tope |
|---|---|---|
| **Base de componentes** | shadcn/ui (Radix + preset Lyra) | base, no cuenta |
| **Animación 1** | Motion (`motion/react`): reveals, FLIP, drag, hover, variants | ✅ 1 |
| **Animación 2** | CSS scroll-driven nativo (`animation-timeline: view()`): wash, sticky overlap, chincheta | ✅ 2 (nativo) |
| **Animación 3** | Lenis: smooth-scroll que suaviza los scrubs | ✅ 3 |
| **Iconos** | Phosphor (`@phosphor-icons/react`) | base, no cuenta |

**Fuentes de catálogo referenciadas (NO importadas, re-implementadas):** Aceternity, Magic UI, Motion Primitives. **Tope de 3 librerías de animación respetado.**

## Mapa de motion por sección

| Sección | Motion level | Momento clave |
|---|---|---|
| Hero | **wow** | sticky overlap Hero→Cómo funciona (★ único wow) |
| Cómo funciona | medio | draw-in de flechas (carácter) |
| Features | medio | físicas drag "tablero de notas vivas" (carácter, on-demand) |
| Pricing | medio | FLIP del recomendador (carácter, on-interaction) |
| Testimonials | sutil-medio | chincheta scroll-driven (carácter, GPU) |
| FAQ | sutil | accordion expand (micro) |
| Footer | ninguno/sutil | fade-up once (micro) |

## Cómo validar este spec antes de construir (F4)

| # | Criterio | Cómo |
|---|---|---|
| 1 | **≤ 3 librerías de animación** | Solo Motion + CSS scroll-driven + Lenis instaladas. Ningún import de Aceternity/Magic UI/Motion Primitives. |
| 2 | **1 solo momento wow** | Únicamente Hero→Cómo funciona. El resto ≤ medio. Footer simple. |
| 3 | **Reduced-motion en todo** | Cada patrón con estado final estático bajo `prefers-reduced-motion`. |
| 4 | **Perf GPU** | Scrubs (wash, sticky, chincheta) en CSS scroll-driven (no JS por frame); valores continuos en motion values (no `useState`). LCP < 2.5s, CLS < 0.1. |
| 5 | **Coherencia con design.md** | 100% tokens `--color-*` / `--text-*` / `--ease-*`; sin hex hardcoded; un solo acento de acción (amber); 0px salvo CTA. |
| 6 | **Sin patrones de la negative list** | Sin neón/AI-purple, sin 3 columnas iguales, sin fake dashboards de div, sin dots decorativos, sin em-dash, sin números falsos en pricing. |

---

## Referencias

- `docs/design.md` v2.0 - sistema visual (tokens, voz, componentes, animaciones, negative list).
- `docs/decisions/002-direccion-visual.md` - ADR dirección #3 "Papel anotado".
- `docs/moodboard/analisis.md` - síntesis transversal + mapa de motion por sección.
- `docs/curso/operacion/vibe-design-referencias.md` §6.5 (prompt canónico) + §7 (catálogo).
- Búsquedas Magic MCP (21st.dev) usadas: Features (`interactive bento features grid`), Testimonials (`testimonials cards wall`). Hero/Pricing/FAQ/Footer resueltos por catálogo curado (sin dudas → sin Magic MCP, regla §6.5).

**Componentes Magic MCP adaptados (no importados):** `Bento Product Features` (Features), `Testimonials` (Testimonials). Re-skinned a papel + re-implementados en el stack locked.

---

*Spec vivo. Cambios significativos requieren commit `docs(design): ...` y bump de versión.*
