# Análisis visual del moodboard · Tendr

> F2 · Etapa 2 (vibe-design §4.2). Análisis por referencia (prompt §6.1) + síntesis
> transversal (prompt §6.2). Vertical: mini-CRM B2B con IA para perfiles junior
> (CS, account managers, consultores). Voz: confiable, ágil, sin corporativismo.
>
> Método: lectura **visual** de los screenshots provistos (sin Playwright, sin descargar
> assets). OKLCH aproximado, deducido del píxel. Las referencias sin screenshot en este
> lote se analizan como **línea visual general** y se marcan como tal.
>
> Vocabulario de motion/ilustración citado contra los catálogos del sénior
> (`MANUAL_ANIMACIONES_WEB.md`, `MANUAL_ILUSTRACIONES_ANIMADAS.md`).

---

## Attio — https://attio.com

1. **Paleta percibida.** Fondo blanco puro `oklch(0.99 0 0)`. Texto negro casi pleno `oklch(0.20 0 0)`. Casi monocromo. Acentos **funcionales** solo dentro de los mockups: verde de estado `oklch(0.75 0.16 150)` ("Completed/Live"), azul de acción `oklch(0.55 0.18 255)`, y una paleta de datos saturada (rosa/azul/teal/púrpura) en el reporting. Base fría-neutra, saturación = casi nula salvo data viz.
2. **Tipografía.** Display = grotesca geométrica **bold con tracking muy apretado**, escala grande (~80px, "engineered for scale"). Body = sans neutra en gris medio. Contraste display-bold vs body-regular alto.
3. **Jerarquía y ritmo.** Hero centrado (manifiesto), espacio negativo generoso arriba; debajo, mockup de producto grande y detallado. Contraste alto blanco↔mockup.
4. **Motion percibido.** (a) Tabs (Ask Attio / Data model / Workflows / Reporting) que al click cargan su mockup con transición → **multi-state cycle con tabs** (ilustración §4.1#8). (b) Microanimaciones "live" dentro del mockup (runs completándose). (c) Lo que anotaste: al scrollear, texto oculto detrás del hero emerge mientras el hero se va → **sticky overlap** (motion §7.4.3) tintado con **fade parallax** (§6.3 tipo 3).
5. **Pattern destacable.** Tab-switcher → mockup animado = **demo sin tour**. Y faux-UI real como héroe visual (no screenshot plano).
6. **Type open-source equivalente.** La grotesca apretada → **Geist Sans** (tight), **General Sans** o **Schibsted Grotesk**. Mono interno → **Geist Mono** / **JetBrains Mono**.

> **Tu lectura:** te gusta el tab→mockup, el reveal hero→texto, y el estilo de ilustración propio. No querés sus colores sobrios. **Tomamos el mecanismo, no la paleta.**

---

## Linear — https://linear.app

1. **Paleta percibida.** Fondo negro casi pleno con tinte frío `oklch(0.16 0.01 280)`. Texto blanco `oklch(0.96 0 0)`, body gris `oklch(0.62 0 0)`. Ilustraciones en líneas blancas finas. Labels `FIG 0.X` en gris tenue. Monocromo dark total, **cero acento de color** en esta vista.
2. **Tipografía.** Display = sans neutra display (peso medium), escala media en los headings de columna. Body gris legible. Labels técnicos en **mono** ("FIG 0.2") → voz de ingeniería.
3. **Jerarquía y ritmo.** 3 columnas con separadores verticales finos. Contraste **medio** (todo dark, diferencias por peso/opacidad). Espacio negativo amplio: mucho negro rodeando cada ilustración.
4. **Motion percibido.** Ilustraciones isométricas de line-art que con alta probabilidad se **dibujan al entrar** (`draw-in` por `stroke-dashoffset`, motion §6.2) y/o tienen **loop ambient** sutil. Linear es referente de scroll-driven con restraint.
5. **Pattern destacable.** (a) Ilustración isométrica de wireframe/blueprint como **estilo diferencial**. (b) Labeling técnico `FIG 0.X` + mono.
6. **Type open-source equivalente.** Inter Display (vetado Inter) → **Geist** / **Hanken Grotesk**. Mono → **JetBrains Mono** (ya viene en nuestro preset Lyra).

> **Tu lectura:** amás el **estilo de ilustración animada**, pero lo ves demasiado sobrio/profesional. **Tomamos el lenguaje de ilustración crafted; le sumamos calidez y color.**

---

## Cal.com — https://cal.com

1. **Paleta percibida.** Fondo gris muy claro `oklch(0.97 0 0)`, cards blancas `oklch(1 0 0)`. Texto negro `oklch(0.20 0 0)`, subtexto gris `oklch(0.55 0 0)`. CTA primario negro sólido. Casi monocromo; el único color vive en los iconos de las mini-ilustraciones (Google Cal, Outlook). Temperatura neutra-fría.
2. **Tipografía.** Display = grotesca bold, escala grande, tracking levemente apretado ("Con nosotros, programar citas es fácil"). Body gris. Números de paso `01/02/03` en **caja mono pequeña**.
3. **Jerarquía y ritmo.** Hero centrado con **eyebrow pill** ("Cómo funciona") y **nav pill flotante** redondeada. Debajo, 3 cards numeradas iguales. Espacio negativo medio-generoso.
4. **Motion percibido.** Ilustraciones animadas distintas por card: **orbital** (iconos de calendario orbitando el logo), toggles de UI, video-call mockup. Comportamiento esperable: **in-view triggered** (ilustración §4.1#3) + hover. Probable `draw-in` en la órbita.
5. **Pattern destacable.** **Step-cards numeradas con mini-ilustración de producto embebida** — calza directo con "Cómo funciona" en 3 pasos del brief. Y el nav pill flotante.
6. **Type open-source equivalente.** Cal Sans (display propio) → **Clash Display**, **Satoshi** o **General Sans**.

> **Sin anotación tuya → línea general investigada.** Cal salva el riesgo de "3 cards iguales" porque cada card lleva una ilustración distinta. Ese es el truco a robar para nuestro "Cómo funciona".

---

## Stripe — https://stripe.com

1. **Paleta percibida.** Fondo blanco `oklch(0.99 0 0)`. Texto near-black `oklch(0.25 0.02 280)` + un **gris-violeta** para la segunda mitad del titular `oklch(0.62 0.05 290)` (técnica "titular + continuación atenuada"). Acento primario índigo (botón) `oklch(0.55 0.20 280)`. **La firma: una cinta de gradiente multi-hue** naranja→rosa→magenta→violeta→azul, saturación alta, barrido cálido→frío. Base fría limpia, momento cálido en el gradiente.
2. **Tipografía.** Display = sans humanista de **contraste bajo y peso medium** (no bold extremo → elegancia), escala ~56-64px. Subhead al mismo tamaño que el titular pero atenuado en gris-violeta.
3. **Jerarquía y ritmo.** Contraste alto blanco↔cinta de color. Espacio negativo a la izquierda; la mitad derecha es puro gradiente. Hero limpio → logo wall (Amazon, NVIDIA, Ford, Google, Shopify…).
4. **Motion percibido.** **Gradient mesh animado** en loop lento (motion §6.10.2, **loop ambient**) — GPU-barato. Número "PIB procesado 1,65…%" = **contador en vivo** (dígitos animados). Reveals on-scroll suaves.
5. **Pattern destacable.** (a) Cinta de gradiente vivo como **firma de marca**. (b) Métrica en vivo como prueba social cuantitativa.
6. **Type open-source equivalente.** Söhne → **Hanken Grotesk**, **Schibsted Grotesk** o **Geist** (carácter grotesco-humanista).

> **Tu lectura:** querés "hero con fondo animado y disruptivo". **Tomamos el gradiente vivo — con la paleta cálida de Tendr, NUNCA el violeta-azul genérico de IA** (taste-skill, THE LILA RULE).

---

## Notion — https://notion.so

> **Sin screenshot en este lote → línea visual general (no análisis de píxel).**

1. **Paleta percibida (general).** Fondo blanco/crema cálido `oklch(0.98 0.005 90)`, texto near-black cálido. Acentos pastel multicolor en ilustraciones. Temperatura **cálida**, saturación baja-media. Muy "friendly".
2. **Tipografía.** Mezcla serif editorial cálida (display) + sans de sistema (body). Carácter humano, no técnico.
3. **Jerarquía y ritmo.** Generosa, mucho aire, ilustraciones hand-drawn como firma.
4. **Motion.** Sutil; reveals suaves, ilustraciones mayormente estáticas o con micro-loops.
5. **Pattern destacable.** **Tono de copy humano** + ilustración cálida → el antídoto contra el "tono de manual". Es nuestra referencia de **voz/calidez**, no de estructura.
6. **Type open-source.** Serif cálido → **Newsreader** o **Source Serif 4** (evitar Fraunces/Instrument Serif, vetados por taste-skill como default). Sans → **Geist**.

---

# Síntesis transversal (§6.2)

Corpus de píxel = 4 referencias (Attio, Linear, Cal, Stripe). Notion entra solo como aporte de **voz/calidez**.

## 1. Intersección (patrones en ≥3 de 4)

- **Base neutra clara/contenida + UN dispositivo visual de firma.** Stripe=blanco+gradiente; Attio=blanco+faux-UI; Cal=gris+mini-ilustraciones; Linear=negro+isométricos. Ninguno satura toda la página: eligen un único momento de fuerza. → Tendr: lienzo limpio + **una firma propia**.
- **Display grotesco/sans con carácter + subhead gris, jerarquía por peso, no por tamaño desbordado.** Los 4. → Tendr: display con carácter (no Inter).
- **Hero con 2 CTAs** (primario sólido + secundario outline). Los 4. → "Empezar gratis" + "Ver cómo funciona".
- **Faux-UI / ilustración de producto animada como protagonista, NO screenshot plano** (top-tier §11.2). Attio, Cal, Linear. → Tendr.
- **Motion con restraint:** reveals on-scroll + micro-interacción, nada estridente. Respeta motion budget (§1.4).

## 2. Únicos con motivo (vale incorporarlos aunque sean de una sola ref)

- **[Attio] Tab-switcher → mockup animado** (multi-state cycle, ilustración §4.1#8): muestra las vistas del CRM (pipeline / IA / reporting) **sin tour**. Lo destacaste.
- **[Attio] Reveal hero→texto-detrás** (sticky overlap §7.4.3 + fade parallax §6.3 tipo 3): **la transición disruptiva-con-sentido** que pediste. Es la pieza más diferencial.
- **[Stripe] Gradiente vivo** (gradient mesh animado §6.10.2): energía en el hero, con paleta Tendr.
- **[Cal] Step-cards numeradas con mini-ilustración** (in-view §4.1#3 + draw-in flechas §7.5): directo para "Cómo funciona" en 3 pasos.
- **[Linear] Estilo de ilustración** isométrico/blueprint + labels técnicos: lenguaje crafted, **adaptado con calidez y color**.

## 3. Negative instructions (lo que NO copiamos)

1. **No monocromo total tipo Attio/Linear.** Lo rechazaste explícito ("demasiado sobrio"). Tendr necesita un **acento cálido vivo + neutros**, no grayscale.
2. **No gradiente AI-purple.** Si adoptamos el gradiente de Stripe, va en la paleta propia de Tendr, jamás el violeta-azul genérico (THE LILA RULE).
3. **No tono enterprise/financiero tipo Stripe** ("infraestructura", métricas corporativas, densidad de developer). Tendr le habla a juniors: cercano, claro, sin jerga.
4. **No fake dashboards de `<div>` sin alma ni screenshots planos.** Las piezas de producto son **faux-UI estilizada, una idea por pieza** (ilustración §3.3, §11.2).
5. **No motion en cada sección.** Motion budget (§1.4): **1 wow + 3-5 carácter + resto micro**. Disruptivo ≠ todo moviéndose.
6. **No tres columnas de features con icono arriba** (brief C3 + taste-skill). Bento con ritmo o demos hover.
7. **No Inter, no Fraunces/Instrument Serif** como default. Display con carácter (Geist/Clash/General Sans), mono JetBrains (ya en Lyra).
8. **No animación sin propósito.** Cada movimiento cuenta algo: jerarquía, narrativa, feedback o estado (motion §1).

## 4. Tono en una frase

> **Producto-vivo cálido:** la base limpia y legible de Attio/Linear, con un acento cálido propio y una capa de movimiento **narrativa y con propósito** (gradiente vivo en el hero, reveal con profundidad hero→sección, y una ilustración del pipeline que cobra vida al scrollear) que hace a Tendr **cercano y disruptivo sin caer en lo corporativo ni en lo sobrecargado**.

---

# Dirección de interacción y motion (investigación premium aplicada a Tendr)

> Esto responde tu pedido: experiencia interactiva **sin pasarse**, con transiciones
> disruptivas entre secciones que **tengan sentido** y se sientan nuevas. Es input para
> el `design-spec-visual.md` de F3; lo validás sección a sección.

## Cómo lo consiguen las webs premium (y de dónde sale el "disruptivo con sentido")

Lo que percibís como "magia" en Stripe/Attio/Linear son **3 técnicas**, no veinte:

1. **Loop ambient barato en el fondo** (gradiente vivo): corre siempre, no gasta atención. Motion §6.10.2.
2. **Reveal coreografiado al entrar** cada sección: eyebrow→headline→subline→grid en stagger 60-100ms, easing `--ease-out`. Motion §7.2. Es el 60% del "premium feel".
3. **Transición ENTRE secciones** (lo que casi nadie hace): el vacío entre A y B se diseña. Las 5 estrategias del §7.4 → para Tendr elegimos **sticky overlap** (la sección sube sobre la anterior como una "carta", §7.4.3) y, en el salto hero→sección 2, el **fade parallax** que viste en Attio.

La clave del motion budget (§1.4): **1 solo momento wow**. El resto es carácter y micro. Eso es "sin pasarse".

## La firma propia de Tendr (el "algo nuevo")

**El pipeline que cobra vida al scrollear.** Una única ilustración narrativa de producto, **scroll-progress driven** (ilustración §4.1#5), como hilo conductor de la página: arranca como un pipeline vacío en el hero y, a medida que bajás, se va poblando de clientes, una card se mueve de columna con **FLIP** (dominio CRM → §5.1 y receta §10.7), la IA resalta un cliente "en riesgo", y al final el pipeline está lleno. **El producto se cuenta solo, sin tour y sin screenshot.** Eso es narrativa (no decoración) → cumple "con sentido".

## Mapa de motion por sección (borrador para F3)

| Sección | Patrón | Trigger | Presupuesto |
|---|---|---|---|
| **Hero** | Gradient mesh vivo (paleta Tendr) + reveal coreografiado del titular | loop ambient + on-load | ambient (barato) |
| **Hero → Sección 2** | Sticky overlap + fade parallax (el reveal de Attio) | scroll-driven | **★ momento wow (único)** |
| **Cómo funciona (3 pasos)** | Step-cards con mini-ilustración + draw-in en flechas | in-view one-shot (§4.1#3) | carácter |
| **Features** | Bento con faux-UI hover-triggered (desktop) / in-view-replay (mobile, §7.3) | hover / in-view | carácter |
| **Vistas del producto** | Tab-switcher → mockup animado (mecanismo Attio) | click, multi-state (§4.1#8) | carácter |
| **Pricing** | Tier "popular" escala 1.02 + glow sutil al entrar | in-view (§7.5) | micro |
| **Testimonios / FAQ / Footer** | fade-up con stagger; FAQ expand ease-in-out 240ms; footer sin sobreactuar | in-view | micro |

## Stack recomendado (respeta el tope de 3 librerías de vibe-design)

- **shadcn/ui** (base, ya instalado) + **Motion (`motion/react`)** para reveals, hover demos, tabs y FLIP (`layout`/`layoutId`). Es el default 2026 y mantiene el código en el repo (ilustración §8.2).
- **CSS scroll-driven animations** (`animation-timeline`, nativo) para el gradiente, el sticky overlap y el parallax del hero → **evita meter GSAP** y cuida Core Web Vitals (motion §6.4.1, §7.4.2). GSAP ScrollTrigger queda como fallback **solo si** el scrub del pipeline narrativo necesita timeline compleja.
- **Rive**: NO por ahora. Solo si más adelante el pipeline narrativo necesita state machine real reutilizable en la app de L17 (§8.2). Empezamos con Motion y escalamos solo al tocar techo.
- **Lottie**: descartado (i18n y edición costosa, §8.3).

## Easings y duraciones (definir una vez en `globals.css`, motion §4.4)

`--ease-out: cubic-bezier(0.22,1,0.36,1)` (reveals) · `--ease-inout: cubic-bezier(0.4,0,0.2,1)` (toggles) · `--ease-expo: cubic-bezier(0.19,1,0.22,1)` (el momento wow, 1 uso) · `--ease-bounce` dosificado para el "aterrizaje" de la card del pipeline.
Duraciones: micro 80-150ms · reveal 480ms · wow 720ms · beats de scrollytelling 1400ms.

## Dials sugeridos (a validar)

Brief C2 fijaba `DESIGN_VARIANCE 7-8 · MOTION 5-6 · DENSITY 4-5`. Dado que pediste **más disruptivo sin pasarte**, propongo subir **MOTION a 6-7 solo en hero + transición hero→sección 2 + pipeline narrativo**, y mantener 5 (o menos) en el resto. Todo bajo `prefers-reduced-motion` (motion §13, taste-skill 6.B).

---

*Pendiente F3: validar este mapa sección a sección y destilar tokens (color cálido + neutros, tipografía, easings) a `docs/design.md` y `docs/design-spec-visual.md`.*
