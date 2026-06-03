# Hero "El Hilo" — Director's Cut (contrato de implementación)

> Generado por los agentes especialistas (dirección de motion + artesanía SVG) el 2026-06-03.
> Fuente de verdad para la implementación del hero scene v2. Dos partes: SCORE (timeline) y ASSETS (SVG).

---

# PARTE 1 · MOTION SCORE (director)

> Contrato de implementación. El Hilo es la columna vertebral; Constelación, Time-cascade y Órbita única entran como ACENTOS sobre esa espina, no como cuatro piezas pegadas. **Una sola idea:** "tu cartera es un hilo vivo y nada se te cae." Todo lo demás sirve a esa frase.

## 1. Tempo & rhythm map

**Loop total: 13 200 ms** (extendido de 10.5s; lo pide el cierre del círculo + el solape de reset). Linear master clock `t ∈ [0,1]`, un solo `useMotionValue` (loop ambient: un reloj, muchos `useTransform`).

Estructura musical (5 movimientos + coda solapada):

| Mov. | Nombre | Rango ms | Frac. t | Carácter rítmico |
|---|---|---|---|---|
| I | **Intro — el trazo** | 0–2 600 | .000–.197 | Acelera. Expo-out: arranca rápido, frena al llegar. La nib lidera. |
| II | **Build — cascada** | 2 400–5 600 | .182–.424 | Pulso. 3 moments + 1 fugaz entran en **cascada staccato** (stagger 280ms), cada uno con write-on de su timestamp. ESTE es el "ritmo". |
| III | **Tension — la caída** | 5 600–7 200 | .424–.545 | Respira y cae. Tras la cascada, silencio: el reloj cae y se atenúa. Beat más lento del loop (hold de incomodidad). |
| IV | **Resolution — cerrar el círculo** | 7 200–10 200 | .545–.773 | Crescendo controlado. El trazo support dibuja un círculo casi completo alrededor del reloj y **lo CIERRA justo a tiempo** → reloj sube → check → subrayador. Punto emocional. |
| V | **Coda — respirar** | 10 200–11 600 | .773–.879 | Sostiene la composición completa. La escena "respira" (breath scale 1→1.006→1). Premio en pantalla. |
| — | **Reset solapado** | 11 600–13 200 | .879–1.0 | El NUEVO trazo empieza a dibujarse MIENTRAS el viejo se desvanece. **Nunca lienzo en blanco.** |

**Qué significa "con ritmo" beat a beat:** Intro acelera (energía) → Build pulsa (los moments caen como gotas, no como bloque) → Tension frena y respira (el vacío hace que la caída duela) → Resolution sube en crescendo (alivio) → Coda sostiene → reset invisible. Tensión-y-suelta, no monotonía.

**Anti-monotonía (sin `Math.random` en render):** loop **determinista con micro-alternancia de 2 estados** vía contador de iteración guardado en `useRef` (se incrementa en el callback `onRepeat` de `animate`, NO en render). Alternancia A/B:
- **Iter par (A):** el moment fugaz es **"propuesta vista"** (ojo); el chip ambient que se aleja es el monograma **"L"**.
- **Iter impar (B):** el moment fugaz es **"nota nueva"** (punto+línea); el chip que se aleja es **"R"**.
La espina, la caída y el cierre del círculo son idénticos siempre (son la narrativa). Solo varían dos detalles ambientales.

## 2. Full timeline table

Easings:
- `EXPO_OUT` = `cubic-bezier(0.16, 1, 0.3, 1)` — el único wow (draw, cierre del círculo).
- `EMPHASIS` = `cubic-bezier(0.2, 0.8, 0.2, 1)` — reveals, recuperación del reloj.
- `STANDARD` = `cubic-bezier(0.4, 0, 0.2, 1)` — micro, fades.

| # | Elemento | Mov. | Qué pasa | Transform / opacity | Dur (ms) | Easing | Stagger |
|---|---|---|---|---|---|---|---|
| 1 | **Nib (punta de tinta)** | I | Punto de tinta r=3 lidera la cabeza del trazo; recorre el path por offsetDistance | `offset-distance 0%→100%`, `opacity 0→1` (0–120ms) | 0–2 600 | EXPO_OUT | — |
| 2 | **Trazo principal (ink)** | I | Se dibuja L→R, dos curvas intencionales | `strokeDashoffset 1→0` | 0–2 600 | EXPO_OUT | — |
| 3 | Nib fade-out | I→II | La nib se disuelve al asentarse el trazo | `opacity 1→0`, `scale 1→0.6` | 2 600–2 850 | STANDARD | — |
| 4 | **Moment 1 — NOTE (glyph)** | II | Fade-up + blur-in al pasar la cabeza | `opacity 0→1`, `y 10→0`, `blur 6→0` | 2 400–2 900 | EMPHASIS | base |
| 5 | **Label "9:12 · Ana" (mono)** | II | **Write-on / mask reveal**: clip-path inset derecha→0 | `clip-path inset(0 100%→0 0)`, `opacity 0→1` | 2 600–3 050 | EMPHASIS | +200 vs glyph |
| 6 | **Moment 2 — ENVELOPE** | II | Fade-up + blur-in + flechita "send" | `opacity 0→1`, `y 10→0`, `blur 6→0` | 2 950–3 450 | EMPHASIS | +550 |
| 7 | **Label "propuesta"** | II | Write-on L→R | `clip-path inset →0`, `opacity 0→1` | 3 150–3 600 | EMPHASIS | +750 |
| 8 | **Moment 3b — FUGAZ** (4º moment) | II | Micro-glyph entre envelope y reloj (ojo A / nota B) | `opacity 0→0.9`, `y 8→0`, `blur 5→0` | 3 500–3 950 | EMPHASIS | +1100 |
| 9 | Label fugaz (mono, dim) | II | Write-on corto ("visto" / "nota") | `clip-path →0`, `opacity 0→0.75` | 3 700–4 050 | EMPHASIS | +1300 |
| 10 | **Moment 4 — CLOCK (glyph)** | II | Aparece como los demás (aún sano) | `opacity 0→1`, `y 10→0`, `blur 6→0` | 4 050–4 550 | EMPHASIS | +1650 |
| 11 | **Label "Marta · 12 días" (mono)** | II | Write-on; queda en pantalla para la tensión | `clip-path →0`, `opacity 0→1` | 4 250–4 700 | EMPHASIS | +1850 |
| 12 | *Hold de cascada* | II→III | Todo asentado, escena viva, breath sutil | — | 4 700–5 600 | — | — |
| 13 | **CLOCK cae** | III | y +16, dim. El follow-up olvidado | `y 0→16`, `opacity 1→0.32`, `blur 0→1.5` | 5 600–7 000 | STANDARD (caída pesada, NO expo) | — |
| 14 | Label "Marta" cae con el reloj | III | Acompaña la caída, dim | `y 0→16`, `opacity 1→0.4` | 5 600–7 000 | STANDARD | — |
| 15 | *Hold de tensión* | III | El reloj caído, quieto. Silencio. | — | 7 000–7 200 | — | — |
| 16 | **Círculo de rescate (support)** | IV | El trazo support dibuja un círculo ~330° alrededor del reloj caído (NO un lazo suelto) | `strokeDashoffset 1→0.08` (deja gap visible), `opacity 0→1` (7 200–7 350) | 7 200–9 100 | EXPO_OUT | — |
| 17 | **CIERRE del círculo** (el gesto) | IV | Los últimos ~30° se cierran de golpe suave; el gap desaparece | `strokeDashoffset 0.08→0` | 9 100–9 450 | EMPHASIS | tras #16 |
| 18 | **CLOCK sube + recupera** | IV | Disparado por el cierre: sube y revive | `y 16→0`, `opacity 0.32→1`, `blur 1.5→0` | 9 200–10 000 | EMPHASIS | +100 tras cierre |
| 19 | Label "Marta" recupera | IV | Sube y vuelve a full | `y 16→0`, `opacity 0.4→1` | 9 200–10 000 | EMPHASIS | — |
| 20 | **Check (firma, support)** | IV | Draw-in del check sobre badge inferior-derecho del reloj | `strokeDashoffset 1→0`, `opacity 0→1` | 9 600–10 000 | EXPO_OUT | tras subida |
| 21 | **Label "Retomar"** | IV | Fade-in justo antes del subrayador | `opacity 0→1`, `y 6→0` | 9 700–10 050 | STANDARD | — |
| 22 | **Subrayador buttermilk** | IV | Sweep L→R bajo "Retomar" (único highlight) | `scaleX 0→1` (origin left) | 10 050–10 600 | EXPO_OUT | tras label |
| 23 | *Coda — respira* | V | Composición completa sostenida; breath de toda la escena | `scale 1→1.006→1` (grupo raíz) | 10 200–11 600 | STANDARD (ease-in-out) | — |
| 24 | **Old scene fade (reset)** | reset | Toda la escena vieja baja opacidad | `opacity 1→0` | 11 600–12 900 | STANDARD | — |
| 25 | **NEW trazo arranca (solape)** | reset | La nib + trazo del SIGUIENTE ciclo empiezan a dibujarse mientras #24 aún se ve | nib+trazo `dashoffset 1→~0.6` ya visible al volver t=0 | 12 400–13 200→0 | EXPO_OUT | **solape 500ms** |

**Capa ambient — Constelación ("tu cartera viva")** — corre en loops PROPIOS lentos, NO en el clock narrativo:

| # | Elemento | Qué pasa | Valores | Período | Easing |
|---|---|---|---|---|---|
| A1 | **Chip monograma 1** ("A") | Drift anti-gravedad alrededor de la ruta, lejos del foco | `x ±6px`, `y ±8px`, `opacity .14↔.22` | 9 000ms | ease-in-out (yoyo) |
| A2 | **Chip monograma 2** ("M") | Drift desfasado | `x ±7px`, `y ±5px`, `opacity .12↔.20` | 11 000ms | ease-in-out (yoyo) |
| A3 | **Chip "que se aleja"** (L iter-A / R iter-B) | Deriva hacia fuera atenuándose; en el beat de rescate recupera opacidad un pelín (eco visual, sin robar foco) | `x →+14px`, `opacity .18→.06`, luego →.14 en t≈.62 | 13 200ms (atado a iteración) | ease-in-out |

> Los chips son **monogramas en círculo hairline** (`--color-border-strong`, 28px), opacidad máx **.22** — nunca compiten con la narrativa.

## 3. Depth & life

**Z-layering (atrás→delante):**
1. **z0 — Ambient:** chips monograma, `blur(0.4px)`, opacity ≤.22, scale .9.
2. **z10 — Espina:** trazo principal ink + nib.
3. **z20 — Moments:** glyphs ink nítidos, sin blur en reposo.
4. **z25 — Rescate:** círculo support + check.
5. **z30 — Tipografía narrativa:** labels como HTML real sobre el SVG (seleccionable, AA).
6. **z31 — Subrayador:** buttermilk DETRÁS del texto "Retomar".

**Jerarquía scale/blur:** ambient `scale .9 + blur .4px` (lejos) vs narrativa `scale 1 + blur 0` (cerca). Durante la caída, SOLO el reloj recibe blur 1.5px, nada más.

**Breathing:** grupo raíz `scale 1→1.006→1` período 6s (independiente, yoyo). La nib: punto de tinta r=3 vía `offset-path`/`offset-distance` — la cabeza viva del trazo, se disuelve al asentar.

## 4. Color discipline check

| Elemento | Token | Rol |
|---|---|---|
| Trazo principal, nib, moments | `--color-text-primary` #1F1B16 | estructura ink |
| Labels timestamp (mono) | `--color-text-tertiary` | meta |
| Label "propuesta" / "Retomar" | `--color-text-secondary` / `primary` | texto |
| Círculo de rescate + cierre | `--color-support` #B23A86 | firma (ÚNICO stroke support narrativo) |
| Check | `--color-support` | firma |
| Subrayador "Retomar" | `--color-highlight` #FFF8BB | solo fondo de texto |
| Chips ambient | `--color-border-strong` (círculo) + `--color-text-tertiary` (letra) | hairline |

**Decisión de disciplina:** NINGÚN accent support en el ambient. El cierre del círculo debe ser el ÚNICO rosa de la escena (+ swoosh del sobre a opacity 0.5 según assets). Los chips quedan hairline.

## 5. Reduced-motion composition (frame estático exacto)

- Trazo principal **completo**, sin nib.
- Los 4 moments **visibles, asentados** (fugaz en estado iter-A).
- Clock **arriba y recuperado**.
- Labels **completos** (sin write-on).
- **Círculo de rescate CERRADO** + **check dibujado** + **subrayador pintado**.
- Chips ambient: **2 visibles, quietos** a opacity .12-.18. El "que se aleja" se omite.
- Sin breath. Una sola foto: hilo dibujado, círculo cerrado, todo a salvo.

## 6. Mobile (<lg) score

- Escena debajo del headline, viewBox recompuesto vertical (`~360×400`).
- Espina + nib: sí, ruta más vertical (S suave).
- Moments: **3, no 4** (se elimina el FUGAZ). Cascada stagger 200ms.
- Caída + cierre + check + subrayador: **intactos**.
- Chips: **1** (A1), opacity máx .16, drift ±4px. En ≤480px: **0 chips**.
- Loop mobile: **12 000 ms**. Breath `scale 1→1.004`.

## 7. Performance notes

- **Un solo `useMotionValue(t)` linear** para TODA la narrativa vía `useTransform`. Cero `useState` para valores continuos.
- **Ambient en loops SEPARADOS** (`animate(...)` con `repeat: Infinity, repeatType: "mirror"`, períodos 9-13s, primos entre sí).
- **Breath:** loop propio 6s mirror.
- **Solo transform / opacity / strokeDashoffset / clip-path.**
- **Pause offscreen:** `useInView(amount: 0.3)` — todos los loops `.stop()`, escena aparcada en frame final.
- **Iteración A/B:** contador en `useRef` actualizado en `onRepeat`, nunca en render. Default A para SSR.
- **CLS:** `aspect-ratio` reservado.
- Nib vía `offset-path`/`offset-distance`.

## 8. Quality bar (5 criterios auditables)

1. **El rescate se lee como ALIVIO:** círculo ~330° con GAP visible antes de cerrarse; el cierre coincide (±100ms) con la subida del reloj. Círculo ya-cerrado o lazo-garabato = FALLA.
2. **Nunca lienzo en blanco:** pausando en cualquier ms del reset, el trazo nuevo ya es visible. Un frame vacío = FALLA.
3. **La cascada tiene RITMO:** write-on escalonado ≥200ms entre labels, gota a gota. Todo a la vez o fade plano = FALLA.
4. **Disciplina de color:** único rosa = rescate+check (+swoosh 0.5); único amarillo = subrayador. Una gota fuera = FALLA.
5. **El ambient no roba foco:** chips ≤ opacity .22, nunca sobre un glyph narrativo. Si un chip atrae la mirada = FALLA.

**Handoff:**
- `RESCUE_PATH` = arco circular real centrado en CLOCK (radio ~26), abierto ~30°, cierre como segmento separado — NO el doble-curl del v1.
- Variante `useWriteOn(t, start)` que devuelva `clipPath inset`.
- FUGAZ y chip A/B leen iteración vía `useRef` + `onRepeat`; default A.
- El reset solapado exige que el draw del MAIN_PATH arranque ANTES de resetEnd (ventana 12 400→wrap): en t≈0 el dashoffset ya está ~0.6.

---

# PARTE 2 · ASSET SPEC (artesano SVG)

**viewBox `0 0 480 520`** (más alto que el 440×440 del v1). Anchors: `NOTE (96,108)` · `ENVELOPE (268,210)` · `CLOCK (356,392)`. Opcional 4º moment `SEED (188,158)`.

**Crítica al v1 (load-bearing):** los glyphs son clones de icon-library (nota = rectángulo + líneas regladas; sobre = rect + flecha snap-on; reloj = círculo perfecto). Sin presión, sin tilt, sin overshoot. Parecen *colocados*, no *dibujados por la misma mano que la ruta*. Cada forma cerrada lleva tilt leve, una esquina con over/undershoot y round joins; cada marca "a mano" es un trazo confiado, no una primitiva construida.

## 1. La ruta (master path — UN path animable)

```
M 40 64
C 70 86, 78 100, 96 108
C 156 134, 150 184, 268 210
C 340 226, 322 360, 356 392
```

- `stroke-width: 2.75`, `linecap: round`, `linejoin: round`, `stroke: var(--color-text-primary)`.
- `pathLength={1}`, `strokeDasharray: 1`, `strokeDashoffset 1→0`.
- **Ink-bleed (textura estática, NO animada):** segundo path idéntico DEBAJO, `stroke-width: 4`, `opacity: 0.05`, `blur(0.6px)`, visible desde t=0. No animar. (Omitir bajo `prefers-reduced-transparency`.)
- **Nib:** `<circle r="3.2" fill="var(--color-text-primary)">` con `offset-path: path("…same d…")` + `offsetDistance 0%→100%` con el MISMO drawProgress. Fade-out al asentar.

## 2. Las cuatro viñetas

Glyphs alrededor de origen local `(0,0)`; el wrapper `<Moment>` traslada al anchor. **Stroke unificado: `1.9`, round caps/joins, `var(--color-text-primary)`, `fill:none`.** Tilt estático en `<g transform="rotate(…)">` interno (separado del transform de reveal del wrapper).

### 2a · "La nota" (9:12 · Ana) — papel rasgado, tilt -4°
```
<g transform="rotate(-4)">
  <path d="M -22 -18 C -10 -20, 8 -20, 14 -18 L 22 -10 L 22 12
           c -6 4, -10 -2, -16 2 c -5 3, -9 -1, -14 2 c -4 2, -8 -1, -14 1 Z" />
  <path d="M 14 -18 L 14 -10 L 22 -10" />
  <path d="M -15 -4 q 6 -3 12 0 t 12 0" />
  <path d="M -15 5 q 5 -3 11 0 t 9 0" />
</g>
```
Draw-in: body → fold → línea1 → línea2, ~120ms. Anchor `(96,108)`. El borde rasgado inferior mata la lectura clipart.

### 2b · "La propuesta" — sobre abierto + papel asomando + swoosh, tilt +3°
```
<g transform="rotate(3)">
  <path d="M -22 -6 L 20 -8 L 23 16 L -20 18 Z" />
  <path d="M -22 -6 L 1 6 L 24 -8" />
  <path d="M -8 -10 L -6 -28 L 12 -26 L 11 -9" />
  <path d="M -4 -22 h 11   M -3 -17 h 10" />
</g>
<path d="M -30 4 h 7   M -34 11 h 5   M -30 18 h 6"
      stroke="var(--color-support)" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
```
Draw-in: body → flap → sheet → ticks → swoosh (200ms tras sheet). Anchor `(268,210)`.

### 2c · "El reloj" (Marta · 12 días) — cara oval, manecillas 10:10, ticks de tensión, tilt -2°
```
<g transform="rotate(-2)">
  <path d="M 0 -17
           C 11 -17, 19 -9, 19 1
           C 19 11, 10 17, 0 17
           C -11 17, -19 10, -19 0
           C -19 -10, -10 -17, 0 -17
           C 4 -17, 7 -16, 9 -15" />
  <path d="M 0 0 L -7 -8" />
  <path d="M 0 0 L 9 -4" />
  <circle cx="0" cy="0" r="1.4" fill="var(--color-text-primary)"/>
  <path d="M 16 -16 q 3 -2 5 -1   M 19 -10 q 3 -1 4 1" stroke-width="1.5" opacity="0.7"/>
</g>
```
Anchor `(356,392)`. Draw-in: cara (overshoot al final) → manecillas → hub → ticks. Es el moment que CAE y se recupera.

### 2d · "El brote" / SEED — 4º moment fugaz opcional (`188,158`)
Brote de 2 hojas (lo más quieto posible de "algo crece"). Aparece ~3.0s; es lo PRIMERO que se atenúa levemente en la caída (la tensión cruza la escena).
```
<g transform="rotate(-6)">
  <path d="M 0 6 C 0 -1, 0 -4, 0 -8" />
  <path d="M 0 -2 C -7 -4, -9 -10, -7 -13 C -2 -12, 0 -7, 0 -2 Z" />
  <path d="M 0 -4 C 6 -7, 9 -11, 8 -15 C 3 -13, 1 -9, 0 -4 Z" />
</g>
```
`stroke 1.7`, ~26px. Si la composición se aprieta, eliminarlo (una-idea-por-pieza).
NOTA del score: en iter-B el fugaz alterna a "nota nueva" (punto+línea) — derivar variante mínima del mismo tamaño.

## 3. El rescate — círculo Órbita + check

Centrado en CLOCK `(356,392)`. Sustituye el doble-curl del v1.

**Arco (primero, support, ~270-330° abierto arriba-derecha):**
```
M 372 374
C 392 384, 398 410, 384 426
C 370 442, 342 442, 328 426
C 314 410, 318 384, 338 374
```
`stroke: var(--color-support)`, `width: 2`, round, `dashoffset 1→0` con gap visible.

**Segmento de cierre (path SEPARADO, con cola de overshoot):**
```
M 338 374 C 350 369, 362 369, 374 374 C 378 376, 380 375, 382 372
```
La cola final de 4px es lo que lo hace "cerrado por una persona". Draw ~250ms tras el arco.

**El check (firma):**
```
M 346 392 l 6 7 l 13 -16
```
`width: 2.6`, round, draw tras el cierre. SIN badge circular detrás (clipart tell).

## 4. Chips ambient (Constelación)

Colocación en espacio negativo: `(70,300)`, `(420,140)`, `(150,440)`.
```
<g opacity="0.12">
  <circle cx="0" cy="0" r="13" stroke="var(--color-border-strong)" stroke-width="1.25" fill="none"/>
  <text x="0" y="4.5" text-anchor="middle"
        font-family="var(--font-display)" font-size="12" font-weight="600"
        fill="var(--color-text-tertiary)">A</text>
</g>
```
Letras `A`, `M`, `J` (+ L/R para el que se aleja según iteración). Opacity `0.08→0.16` (cap absoluto .18-.22 según score). r 11-14px variado. Reduced-motion: quietos a 0.12.

## 5. Subrayador (buttermilk bajo "Retomar")

- `<motion.span>` absoluto DETRÁS del texto, `bg-highlight`.
- `inset-x: -2px` (sobresale como pasada de marcador), `top: 0.32em`, `bottom: 0.04em`.
- `border-radius: 3px 6px 5px 8px / 6px 4px 7px 5px` (extremos irregulares, ni pill ni rect).
- `rotate(-2.2deg)` SOLO en el span (el texto queda recto).
- `transform-origin: left center`, `scaleX 0→1`, expo-out ~600ms.

## 6. Tabla de lenguaje de trazo (UNA mano)

| Elemento | Token | Width | Caps | Dash | Opacity |
|---|---|---|---|---|---|
| Ruta (main) | text-primary | 2.75 | round | dashoffset 1→0 | 1 |
| Ink-bleed | text-primary | 4 | round | estático | 0.05 |
| Nib | text-primary (fill) | r 3.2 | — | offset-path | 1→0 |
| Glyphs moments | text-primary | 1.9 | round | stagger opcional | reveal 0→1 |
| Detalles hairline (ticks, hub) | text-primary | 1.5 | round | — | 0.7 |
| Send swoosh | support | 1.6 | round | — | 0.5 |
| Arco rescate | support | 2 | round | dashoffset | 0→1 |
| Cierre + cola | support | 2 | round | dashoffset | 0→1 |
| Check | support | 2.6 | round | dashoffset | 0→1 |
| Chip ring | border-strong | 1.25 | — | — | .08–.16 |
| Chip letra | text-tertiary (fill) | — | — | — | .08–.16 |
| Subrayador | highlight (fill) | — | radius irregular | scaleX 0→1 | 1 |

Regla: **ink = estructura, support = rescate+check+swoosh ÚNICAMENTE, highlight = subrayador text-bg ÚNICAMENTE.** Widths agrupados (1.5/1.9/2.0/2.6/2.75) = una sola pluma.

## 7. Guardarraíles anti-kitsch (NO hacer)

1. **Sin caras.** El reloj no tiene ojos ni sonrisa ni gotas de sudor. La tensión es la pose 10:10 + dos worry ticks.
2. **Sin sparkles/estrellas/polvo mágico** en la recuperación. El check + círculo cerrado SON el payoff.
3. **Sin drop shadows ni glows en glyphs/strokes.** Única profundidad: el halo ink-bleed al 5%.
4. **Sin gradientes ni multicolor.** Tres tokens, flat. El swoosh es el único toque support dentro de un moment.
5. **Sin geometría perfecta en la capa narrativa.** Cada forma cerrada lleva UNA imperfección intencional (tilt, overshoot, borde rasgado). Un `<circle>`/`<rect>` perfecto narrativo = el clipart tell. (Excepción deliberada: los chips ambient — son textura, el ring perfecto lee "sistema".)

**Notas de implementación:** viewBox 440→480×520: re-derivar anchors xPct/yPct de las nuevas constantes. El timeline, el single useMotionValue, in-view parking y reduced-motion se conservan — solo cambian `d` data, nib, capas textura/ambient y geometría del subrayador. El stagger de sub-paths es polish opcional.
