# ACTO I · "El Hilo" REFINED — spec de motion (tríptico hero)

> Acto 1 de 3 (El Hilo → Constelación → Time-cascade). SPEC, no código.
> Hereda PARTE 2 del director's cut (`hero-hilo-directors-cut.md`): ruta master, viñetas con carácter, tabla de trazo, anti-kitsch. Tokens en `docs/design.md`.
> Fecha: 2026-06-03. Cambia el **finale** (verdad de producto: IA sugiere, humano actúa) y **reposiciona todos los labels FUERA de la línea**.

---

## 1. Concepto en una frase

Tu cartera es un hilo vivo: cuando un cliente se enfría la **IA lo detecta y sugiere**, pero sos **vos quien hace clic en "Retomar"** — la IA propone, la mano acciona.

---

## 2. Timeline ms-precisa (~6 600ms + handoff 600ms = 7 200ms)

Easings (idénticos al sistema): `EXPO_OUT cubic-bezier(.16,1,.3,1)` (wow: draw, cierre, subrayador) · `EMPHASIS cubic-bezier(.2,.8,.2,1)` (reveals, recuperación) · `STANDARD cubic-bezier(.4,0,.2,1)` (micro, caída, fades). Master clock único `t∈[0,1]` sobre 7 200ms, linear; todo es `useTransform`.

| # | Elemento | Beat | Transform / opacity | Inicio→fin (ms) | Easing |
|---|---|---|---|---|---|
| 1 | Nib (punta tinta r3.2) | Intro | `offsetDistance 0→100%`, `opacity 0→1` (0–80) | 0–1 900 | EXPO_OUT |
| 2 | Trazo principal (ink) | Intro | `strokeDashoffset 1→0` | 0–1 900 | EXPO_OUT |
| 3 | Nib fade | Intro→Build | `opacity 1→0`, `scale 1→.6` | 1 900–2 100 | STANDARD |
| 4 | Moment NOTE | Build | `opacity 0→1`, `y 10→0`, `blur 6→0` | 1 800–2 200 | EMPHASIS |
| 5 | Label "9:12 · Ana" | Build | callout write-on (clip inset R→0) | 2 050–2 400 | EMPHASIS |
| 6 | Moment ENVELOPE | Build | `opacity 0→1`, `y 10→0`, `blur 6→0` | 2 350–2 750 | EMPHASIS |
| 7 | Label "propuesta" | Build | callout write-on | 2 600–2 950 | EMPHASIS |
| 8 | Moment CLOCK (sano) | Build | `opacity 0→1`, `y 10→0`, `blur 6→0` | 2 900–3 300 | EMPHASIS |
| 9 | Label "Marta · 12 días" | Build | callout write-on (queda para la tensión) | 3 150–3 500 | EMPHASIS |
| 10 | *Hold cascada* (breath sutil) | Build→Tension | — | 3 500–3 900 | — |
| 11 | **CLOCK cae** | Tension | `y 0→16`, `opacity 1→.34`, `blur 0→1.5` | 3 900–4 700 | STANDARD (caída pesada) |
| 12 | Label "Marta" cae con el reloj | Tension | `y 0→16`, `opacity 1→.42` | 3 900–4 700 | STANDARD |
| 13 | *Hold tensión* (silencio) | Tension | — | 4 700–4 900 | — |
| 14 | **AI chip "✦ IA" aparece** | IA | `opacity 0→1`, `scale .92→1`, `y 6→0` (entra junto al CLOCK) | 4 900–5 150 | EMPHASIS |
| 15 | **Burbuja sugerencia + texto que TIPEA** | IA | card `opacity 0→1`,`y 4→0` (4 950–5 150); luego streaming de texto | 4 950–5 950 | STANDARD (card) + step (texto) |
| 16 | **Subrayador hand-drawn bajo la sugerencia** (support) | IA | `strokeDashoffset 1→0` — la mano subraya lo que la IA dice | 5 700–6 050 | EXPO_OUT |
| 17 | **Cursor "tú" entra off-canvas → botón** | Cursor | spring x/y a "Retomar" con leve overshoot | 5 900–6 250 | spring (stiff 220, damp 26) |
| 18 | **CLICK ring** (un anillo hairline) | Cursor | `scale .3→1.6`, `opacity .9→0` | 6 250–6 500 | STANDARD |
| 19 | Botón "Retomar" press | Cursor | `scale 1→.96→1` | 6 250–6 380 | STANDARD |
| 20 | **CLOCK sube + recupera** (disparado por click) | Resol. | `y 16→0`, `opacity .34→1`, `blur 1.5→0` | 6 300–6 750 | EMPHASIS |
| 21 | Label "Marta" recupera | Resol. | `y 16→0`, `opacity .42→1` | 6 300–6 750 | EMPHASIS |
| 22 | **Check (firma, support)** sobre el reloj | Resol. | `strokeDashoffset 1→0`, `opacity 0→1` | 6 500–6 750 | EXPO_OUT |
| 23 | AI chip + burbuja salida | Resol. | `opacity 1→0`, `y 0→-4` (cumplió su rol) | 6 450–6 600 | STANDARD |
| 24 | Cursor "tú" sale | Resol. | spring fuera de canvas | 6 550–6 750 | spring |
| — | **HANDOFF → Acto II** (disolución a chips) | Handoff | ver §4 final | 6 600–7 200 | EMPHASIS |

**Lectura rítmica:** Intro acelera → Build pulsa (3 moments en cascada staccato, stagger ~550ms) → Tension frena y cae (el vacío hace que duela) → **IA detecta** (entra serena) → **cursor acciona** (click discreto) → Resolución sube (alivio) → handoff disuelve. Tensión-y-suelta, nunca monótono.

---

## 3. Posicionamiento de labels (regla anti-pisar-línea · viewBox 480×520)

**Regla dura:** ningún label toca el trazo ink. Cada uno es un **callout offset** con un **tick líder hairline** (1px, `--color-border-strong`, ~10–14px) que lo ancla a su moment SIN cruzar la línea. El tick parte del moment hacia el label, nunca al revés. El label vive en espacio negativo (lado opuesto a la curva).

| Label | Moment (anchor) | Lado del callout | Coord aprox. label (x,y) | Tick líder |
|---|---|---|---|---|
| "9:12 · Ana" (mono) | NOTE (96,108) | **arriba-izquierda** | (60, 78) | de (90,96) ↖ a label |
| "propuesta" (jakarta) | ENVELOPE (268,210) | **derecha**, fuera de la curva | (322, 196) | de (294,206) → a label |
| "Marta · 12 días" (mono) | CLOCK (356,392) | **izquierda**, lejos del cierre | (250, 372) | de (332,388) ← a label |
| sugerencia IA (burbuja) | CLOCK + AI chip | **arriba-derecha del reloj** | card en (372–470, 320–366) | la propia pill ✦ IA ancla |
| "Retomar" (botón) | CLOCK | **abajo-derecha** | botón centro (392, 452) | sin tick (es UI accionable) |

> Los labels mono usan `--color-text-tertiary`; "propuesta" usa `--color-text-secondary`. El tick líder es el único elemento nuevo de anclaje y es hairline (no compite). Verificar en mobile que ningún callout se salga del viewBox (§7).

---

## 4. La secuencia IA → cursor → click → resolución (corazón del acto)

Reemplaza el "círculo de rescate" del v1 (confuso) por la **verdad de producto**. Orden estricto:

1. **El reloj cae** (beat #11): "Marta · 12 días" sin contacto. Silencio (#13). NO hay rescate automático aún — el vacío debe leerse.
2. **La IA detecta** (#14): aparece la **pill "✦ IA"** anclada arriba-derecha del reloj. El ✦ y la palabra "IA" en `--color-support` (#B23A86), fondo `--color-surface-raised`, hairline border, `radius-full`. UNA sola ✦, sin glow, sin violeta.
3. **La burbuja sugiere** (#15): card blanca (hairline, `radius-md`, `shadow-soft`) pegada bajo la pill, con texto que **TIPEA** (streaming carácter a carácter, ~32ms/char): `"Marta lleva 12 días · ¿retomamos?"`. Mezcla Jakarta (frase) + mono para el "12 días" si se quiere acento de dato. Ghost-feel: el texto entra en `text-secondary` y asienta a `text-primary` al cerrar.
4. **La mano humana subraya** (#16): un **trazo hand-drawn support** (`--color-support`, width 2, round, `dashoffset 1→0`) subraya la frase de la sugerencia — el contrapunto cálido ON the moment (no aleatorio), exactamente cuando la IA termina de tipear. Regla research §4: la mano refuerza lo que el software señala.
5. **El cursor "tú" entra** (#17): desde off-canvas (esquina inferior-derecha), spring a la posición del botón "Retomar" con leve overshoot. Nunca teletransporta. Chip de nombre "tú" lo acompaña.
6. **CLICK** (#18–19): UN anillo hairline (`scale .3→1.6`, `opacity .9→0`, ~250ms) + el botón "Retomar" hace press (`scale 1→.96→1`). Sin neón, sin ripple de color.
7. **Resolución** (#20–22): disparado por el click, el reloj **sube y revive** (`y 16→0`, opacity full, blur→0) y se dibuja el **check** support sobre él. AI chip + burbuja salen (#23, ya cumplieron). El cursor sale (#24).

**Punto emocional:** la IA no resuelve sola — pone la sugerencia delante; el humano hace el gesto. Ese reparto ES Tendr.

---

## 5. Assets nuevos necesarios

**a) Cursor "tú" (HTML sobre SVG, no dentro del SVG narrativo):**
- Flecha de puntero ink sólida (`--color-text-primary`), ~16px, `path` clásico de cursor (`M0 0 L0 16 L4 12 L7 18 L9 17 L6 11 L11 11 Z`), sin sombra.
- Chip de nombre adjunto abajo-derecha: texto "tú", Geist Mono 11px, `bg` blanco (`--color-surface-raised`), hairline border (`--color-border-hairline`), `radius-full`, padding 2px 6px.
- Movimiento: `motion` spring (stiffness ~220, damping ~26) entre keyframes; entra/actúa/sale, nunca persigue el mouse del visitante.
- Click: `<motion.span>` anillo, `border 1px var(--color-text-primary)`, `radius-full`, 20px, `scale .3→1.6` + `opacity .9→0`.

**b) AI chip "✦ IA" (HTML pill):**
- Pill `radius-full`, `bg` `--color-surface-raised`, hairline border, padding 3px 9px, `shadow-soft`.
- Glyph ✦ (SVG inline 4-puntas, ~10px) en `--color-support` + texto "IA" Geist Mono 11px también en `--color-support`. UNA ✦ exacta. Sin glow, sin gradiente, sin lila.

**c) Burbuja de sugerencia (HTML card):**
- Card blanca `--color-surface-raised`, hairline border, `radius-md`, `shadow-soft`, padding `space-3`, max-width ~150px, anclada bajo la pill (cola/conexión visual mínima o pegada).
- Texto que tipea: render incremental por índice (`substring(0, n)` con `n` derivado de `t` vía `useTransform` + `Math.floor`, paso discreto), o `steps()` sobre clip. Frase: `"Marta lleva 12 días · ¿retomamos?"`.

**d) Subrayador hand-drawn de la sugerencia (SVG, support):**
- Trazo bajo el texto de la burbuja, ligero arqueo a mano (no recto), `--color-support`, width 2, round caps, `dashoffset 1→0`. Ej: `M 4 38 q 70 6 140 0`.

> Reutiliza tal cual del director's cut: ruta master, NoteGlyph, EnvelopeGlyph, ClockGlyph, ink-bleed halo, chips ambient. NO se reinventan.

---

## 6. Reduced-motion (frame estático del acto)

Una sola foto, todo a salvo, sin movimiento:
- Trazo principal **completo** (sin nib).
- 3 moments **asentados** (NOTE, ENVELOPE, CLOCK).
- CLOCK **arriba y recuperado**, con **check dibujado**.
- Labels **completos** con sus ticks líderes (sin write-on).
- **AI chip "✦ IA" visible** + burbuja con la frase **completa** (sin tipeo) + subrayador hand-drawn **pintado**.
- Cursor "tú" **presente, apoyado en "Retomar"** (estático, sin click ring) — comunica el reparto IA/humano sin animar.
- Chips ambient: 2 quietos a opacity ~.14.
- Sin breath. La escena cuenta la historia completa en una imagen.

---

## 7. Mobile (<lg — qué sobrevive)

- viewBox vertical recompuesto (~360×420), igual que v1.
- Espina + nib: sí (ruta más vertical).
- Moments: **3** (NOTE, ENVELOPE, CLOCK) — sin fugaz.
- Labels: callouts **apilados** para no salirse; "Marta · 12 días" pasa **encima** del reloj (no a la izquierda) para caber. Ticks líderes más cortos (~8px).
- Caída + **AI chip + burbuja (compactada, una línea)** + **cursor + click** + recuperación + check: **intactos** (es el corazón, no se recorta).
- AI chip + burbuja: anclados **arriba** del reloj (más espacio vertical que horizontal). Burbuja max-width ~130px, texto puede romper a 2 líneas.
- Cursor entra desde **abajo**; botón "Retomar" bajo el reloj.
- Chips ambient: **1** (opacity ≤.16). En ≤480px: **0**.
- Loop mobile equivalente (~7 000ms). Breath `scale 1→1.004`.

---

## 8. Criterios de calidad auditables

1. **El reparto IA→humano se lee:** la pill "✦ IA" + burbuja aparecen ANTES que el cursor; el cursor hace el click y SOLO entonces el reloj sube. Si el reloj se recupera sin click humano, o el cursor actúa antes que la IA sugiera = **FALLA**.
2. **Ningún label pisa la línea:** todo label vive en espacio negativo con tick líder hairline que no cruza el trazo ink. Un label sobre la curva = **FALLA**.
3. **Disciplina de color y AI restringida:** UNA sola ✦, support solo en (✦ IA + texto IA + subrayador sugerencia + check + swoosh sobre); cero glow, cero lila, cero gradiente; click ring hairline ink, nunca neón. Una gota fuera = **FALLA**.

---

## 9. Handoff contract (integrador)

- **ACT IN** (desde Acto III / cold start): canvas solo con 2 chips ambient (opacity ~.12) + nada más. Acto I arranca con la nib + draw de la ruta (#1–2).
- **ACT OUT** (a Acto II, 6 600–7 200ms): tras el check + subrayador, la **ruta ink se DISUELVE EN CHIPS**:
  - El trazo principal se **rompe en 5–6 chips circulares de monograma** (los moments devienen clientes). Puntos de ruptura repartidos por la longitud del path; cada chip nace en su punto.
  - Glyphs de los moments: `opacity→0` + `scale→.7` (200ms, STANDARD) MIENTRAS los chips emergen (`scale 0→1`, `opacity 0→.9`, EMPHASIS).
  - Labels + ticks + AI chip + burbuja + cursor: **fade out** (150ms) — no persisten.
  - Los chips **se dispersan suave a posiciones anti-gravedad** (spring, leve drift) → ESTOS son la constelación de Acto II (shared-element morph, research §3-B).
  - **Persisten** al cruce: los chips (devienen Acto II) + los 2 chips ambient ya existentes (se integran a la constelación). El trazo ink, glyphs, check, subrayador, AI chip y cursor NO persisten.
  - Timing: ruptura+emergencia 6 600–6 950; dispersión 6 950–7 200 (`EMPHASIS`, micro-crossfade de apoyo). Nunca lienzo en blanco entre actos.
