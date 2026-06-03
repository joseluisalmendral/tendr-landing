# Research · Motion/ilustración del hero en 3 actos

> Investigación validada con fuentes para la pieza frameless de 3 actos (El Hilo → Constelación → Time-cascade) que se encadenan en loop. Objetivo: presencia de IA, cursores con "software-feel", toques hand-drawn, profesional y conceptualmente claro. Tokens del sistema en `docs/design.md` (ink #101010, support #B23A86, highlight #FFF8BB solo fondo de texto, sin glow).

Fecha: 2026-06-03. Honestidad: las duraciones exactas por acto NO están documentadas públicamente para Family.co/Arc; las cifras de cadencia abajo son derivadas de NN/g + práctica de scroll-driven, no copiadas de un caso concreto.

---

## 1. Motivo de cursor (multiplayer / software-feel)

Observaciones validadas:
- En Figma/FigJam el cursor multiplayer NO es solo un puntero: lleva **avatar + nombre en una chip de color**, y transmite presencia (chat, emote). El label es lo que da el "software colaborativo" instantáneo, no la flecha. ([Figma blog](https://www.figma.com/blog/multiplayer-editing-in-figma/))
- La suavidad NO se logra animando posición con `ease-in-out`: con CSS transition se usa timing **`linear`** (un cursor no "frena" al llegar). Para naturalidad real se usa **spring** (tiene en cuenta el momentum, no solo el destino). ([Liveblocks](https://liveblocks.io/blog/how-to-animate-multiplayer-cursors))
- Updates reales llegan throttled (~80–120 ms); de ahí que el movimiento crudo se vea a saltos y haya que interpolar. Para una pieza scriptada esto se traduce en: **no teletransportar el cursor, moverlo con spring entre keyframes**. ([Liveblocks](https://liveblocks.io/blog/how-to-animate-multiplayer-cursors))
- `perfect-cursors` (tldraw) usa interpolación por **spline** que pasa por todos los puntos: más preciso, leve delay. Útil si queremos trayectorias curvas "humanas" en El Hilo. ([perfect-cursors](https://github.com/steveruizok/perfect-cursors))
- Lo premium vs gimmicky: el cursor es premium cuando **hace algo** (clickea, arrastra, señala) y desaparece tras actuar; es gimmicky cuando persigue al mouse del visitante o llena la pantalla de efectos (ripple neón, trails). Las libs tipo Cursify/neon-cursor son justo lo que NO queremos. ([Cursify](https://cursify.vercel.app/))

Do / Don't para Tendr:
- **DO** forma de puntero clásico (flecha sólida ink #101010), 1–2 cursores máximo en pantalla, cada uno con **chip de nombre** redondeada (`radius-full`), texto pequeño Geist Mono, fondo tint suave.
- **DO** click-feedback discreto: un único anillo que se expande y desvanece (~250 ms, `easing-standard`) en ink/support, NO ripple de color saturado.
- **DO** mover con **spring** (stiffness media, damping alto) o spline; velocidad de tránsito ~600–900 ms entre puntos; micro-pausa antes de cada acción para que se lea.
- **DON'T** cursor que reacciona al mouse del visitante, trails, glow, multicolor, ni más de 2 cursores simultáneos. El cursor es actor del guion, no decoración.

## 2. Presencia de IA (patrón restringido)

Hipótesis del brief (chip "IA" + burbuja con texto escribiéndose + UN ✦ diminuto, tokens ink/support, sin glow): **VALIDADA con matices.**
- El ✦ sparkle es ya cuasi-universal para IA, pero **pierde significado cuando se pone en todas partes**; funciona mejor para *generación*, y conviene **acompañarlo de label de texto** porque la convención aún no es legible sola. Un solo ✦ pequeño está bien; sparkle-spam no. ([Shape of AI · Iconography](https://www.shapeof.ai/patterns/iconography), [Slate](https://slate.com/technology/2025/12/artificial-intelligence-tools-icon-google-gemini-chatgpt-design.html))
- El patrón canónico para "la IA sugiere" son **Suggestions** + **Inline Action** + **Disclosure** (marcar claramente lo entregado por IA). Es decir: una sugerencia contextual anclada a algo de la pantalla, no un panel flotante con glow. ([Shape of AI](https://www.shapeof.ai/))
- La señal "IA" sin violeta ni glow se consigue con **ghost text / streaming**: texto que aparece atenuado y se "escribe" (gris/secundario), como Copilot. El streaming suave (carácter a carácter, no en bloques) es lo que lee "IA pensando". ([VS Code Copilot](https://code.visualstudio.com/docs/editing/ai-powered-suggestions), [Upstash smooth streaming](https://upstash.com/blog/smooth-streaming))
- Casi todo glow/gradiente violeta viola nuestra ley anti-lila y la regla no-glow. La **alternativa restringida**: chip con borde hairline + ✦ en support #B23A86 + texto que se escribe en `text-secondary`. El color "IA" es nuestro support rosa, no morado.

Patrón recomendado para Tendr (Acto I/II — el aviso de cliente en riesgo):
- Chip pequeña "IA ✦" (✦ en support, texto ink, fondo `accent-soft`, `radius-full`, hairline). Una sola ✦.
- Burbuja de sugerencia anclada al chip de cliente en riesgo, con **texto escribiéndose** (~30–45 ms/carácter) tipo: "Hace 12 días que no hablás con X". Cursor de la IA puede "soltar" la burbuja.
- Sin glow, sin gradiente, sin pulso luminoso. El énfasis se da con el trazo hand-drawn (un círculo support rodeando al cliente en riesgo).

3 referencias reales: **Notion AI** (panel de sugerencias inline + disclosure), **GitHub Copilot** (ghost text atenuado, el oro del "menos es más"), **Grammarly/Notion inline overlay** (sugerencia contextual sobre el contenido). ([Notion AI](https://www.notion.com/product/ai), [Copilot](https://code.visualstudio.com/docs/editing/ai-powered-suggestions), [UX Collective](https://uxdesign.cc/where-should-ai-sit-in-your-ui-1710a258390e))

## 3. Transiciones entre actos (tríptico en loop)

Tres patrones viables:
- **A. Sticky-stack con wipe/clip** — actos absolutamente apilados, cada uno se recorta al entrar el siguiente; sincronizado a scroll. Es el patrón Apple/scroll-driven probado. ([CSS-Tricks Apple-style](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/), [Builder view-timeline](https://www.builder.io/blog/view-timeline))
- **B. Shared element / morph** — un elemento sobrevive y se transforma: el **hilo** de Acto I se rompe en los **chips-constelación** de Acto II, que se reorganizan en la **timeline** de Acto III. Máxima continuidad narrativa.
- **C. Crossfade simple temporizado** — fundido entre actos por tiempo (loop ambient), sin scroll. Más barato, menos memorable.

**Recomendación: B (shared element) como columna vertebral, con micro-crossfade de apoyo en el hand-off.** Es lo que hace que un desconocido entienda que es UN día/relación, no tres animaciones sueltas — el elemento compartido es el hilo conductor literal. Encaja con el único "wow" permitido del sistema (`easing-expo`) si se ancla a scroll; si es loop ambient autónomo, usar `easing-emphasis`.

Cadencia (derivada de NN/g sobre duración de animación + práctica scroll, NO de un caso citado):
- **Por acto: 4–7 s** de lectura/acción antes del hand-off. Menos de 3 s genera ansiedad; más de ~8 s aburre en loop.
- **Transición entre actos: 500–700 ms** (`easing-expo`/`emphasis`). El morph debe ser legible, no instantáneo.
- **Ciclo total: ~18–24 s**. ([NN/g animation duration](https://www.nngroup.com/articles/animation-duration/))
- **Indicadores de acto: SÍ, mínimos** — tres dots o numerales `01/02/03` en Geist Mono (no barra de progreso ansiosa). Dan orientación de "vas por el acto 2" sin presionar. Los dots usan support (permitido como no-textual; highlight NO).

## 4. Híbrido hand-drawn + chrome digital (4 reglas)

Lo que hace que la mezcla se vea intencional y no chocante (Excalidraw/Notion/Claude como referencia de que el trazo a mano "quita la esterilidad" y se siente exploratorio):
1. **Roles separados, no mezclados en el mismo objeto.** El trazo a mano = capa de *anotación humana* (círculo que rodea, flecha que señala, subrayado). La UI/cursor/chip = capa *crisp/geométrica*. Nunca un botón "dibujado a mano" + cursor pixel-perfect en el mismo borde. ([Excalidraw](https://excalidraw.com/), [Claude](https://claude.com/product/claude-code))
2. **Un solo color de tinta hand-drawn = support #B23A86**, `stroke-linecap: round`, trazo limpio-geométrico (v2: menos jitter que v1). 1–2 anotaciones por acto máximo, como acento.
3. **El hand-drawn entra animado con `stroke-dashoffset` (draw-in ~600 ms)** justo cuando la IA/cursor actúa — así el trazo a mano refuerza la acción digital en vez de competir con ella (la mano "subraya" lo que el software señala).
4. **La UI faux es crisp y a tokens** (cards `radius-lg`, hairlines, mini-kanban real); el hand-drawn vive *encima/alrededor*, nunca dentro de la geometría de la card. Contraste deliberado mano vs. máquina = la firma de Tendr.

## 5. Recursos (leer por patrones, no instalar)

- **perfect-cursors** — interpolación spline para trayectorias de cursor humanas. Tomar: el algoritmo de spline para El Hilo. https://github.com/steveruizok/perfect-cursors
- **Liveblocks · How to animate multiplayer cursors** — spring vs lerp vs spline + throttle. Tomar: usar spring para mover cursores entre keyframes. https://liveblocks.io/blog/how-to-animate-multiplayer-cursors
- **Motion · Custom Cursor docs** — follow/magnetic/replace patterns en React. Tomar: API de cursor + springs. https://motion.dev/docs/cursor
- **The Shape of AI** — catálogo de patrones IA (Suggestions, Inline Action, Disclosure, Iconography). Tomar: etiqueta del ✦ + patrón de sugerencia restringida. https://www.shapeof.ai/
- **CSS-Tricks · Apple-style scroll / sticky-stack wipe** — apilado + clip de escenas. Tomar: técnica de stack + wipe para hand-off scroll-driven. https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/
- **Builder · CSS view-timeline** — scroll-driven nativo (en nuestro tope de 3 libs). Tomar: sincronizar actos a scroll sin JS pesado. https://www.builder.io/blog/view-timeline
- **NN/g · Animation duration** — base de las cifras de cadencia. https://www.nngroup.com/articles/animation-duration/

No verificado: duraciones/coreografía concretas de Family.co, Arc y Attio (no documentadas públicamente; sus animaciones no exponen specs). Las cifras de cadencia son derivadas, no copiadas.
