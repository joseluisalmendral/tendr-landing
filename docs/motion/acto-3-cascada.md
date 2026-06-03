# Acto III — "El día, de un vistazo" (Time-cascade)

> Tercer acto del tríptico hero de Tendr. Cierra el loop: entrega al Acto I.
> Extiende el lenguaje visual de `hero-hilo-directors-cut.md` PARTE 2 (mismo viewBox **480×520**, mismos easings, misma "una sola mano"). Tokens en `docs/design.md`. NO reinventa furniture.
> Duración: **~6 600 ms de cuerpo + 600 ms de handoff** al Acto I.

---

## 1. Concepto en una frase

Tu día se escribe solo como una **línea de tiempo tipográfica** sobre un eje hairline, y la **IA la cierra** diciéndote qué toca mañana: vos hacés un clic, el día queda planificado, y ese punto vuelve a ser la nib que arranca el Acto I (el día empieza de nuevo).

Verdad de producto: **Tendr lee tu día y te deja servido el mañana.** El cierre no es un reset, es un exhale.

---

## 2. Timeline ms-precisa

Easings (idénticos al Acto I): `EXPO_OUT` `cubic-bezier(0.16,1,0.3,1)` · `EMPHASIS` `cubic-bezier(0.2,0.8,0.2,1)` · `STANDARD` `cubic-bezier(0.4,0,0.2,1)`. Un solo `useMotionValue(t)` linear; todo vía `useTransform`. Write-on = `useWriteOn(t, start)` → `clip-path inset(0 100%→0 0)` (la misma variante del Acto I).

| # | Elemento | Qué pasa | Transform / opacity | Inicio→fin (ms) | Easing | Stagger |
|---|---|---|---|---|---|---|
| 0 | **ACT IN** (recibido) | Eje hairline ya dibujado + 5 chips A/M/D/L/+IA ya alineados en columna (fade-up de 120ms para asentar continuidad) | `opacity .0→1`, `y 6→0` | 0–260 | STANDARD | — |
| 1 | **Fila 1 · timestamp** `9:12` (mono) | Write-on corto | `clip-path →0`, `opacity 0→1` | 300–650 | EMPHASIS | base |
| 2 | **Fila 1 · evento** `escribiste a Ana` (Jakarta) | Write-on, gota a gota | `clip-path →0`, `opacity 0→1` | 420–960 | EMPHASIS | +120 vs ts |
| 3 | **Fila 2 · ts** `11:40` | Write-on | `clip-path →0` | 670–1 020 | EMPHASIS | +370 |
| 4 | **Fila 2 · evento** `propuesta enviada` | Write-on | `clip-path →0` | 790–1 360 | EMPHASIS | +370 |
| 5 | **Check de apoyo** (support, hand-drawn) | Se dibuja el ✓ al final de la fila 2 | `strokeDashoffset 1→0`, `opacity 0→1` | 1 380–1 760 | EXPO_OUT | tras evento 2 |
| 6 | **Fila 3 · ts** `13:05` | Write-on | `clip-path →0` | 1 040–1 390 | EMPHASIS | +370 |
| 7 | **Fila 3 · evento** `nota añadida a Diego` | Write-on | `clip-path →0` | 1 160–1 720 | EMPHASIS | +370 |
| 8 | **Fila 4 · ts** `16:20` | Write-on | `clip-path →0` | 1 410–1 760 | EMPHASIS | +370 |
| 9 | **Fila 4 · evento** `Lucía respondió` | Write-on | `clip-path →0` | 1 530–2 090 | EMPHASIS | +370 |
| 10 | *Hold respira* | Las 4 filas asentadas; micro-breath del grupo | `scale 1→1.004→1` | 2 090–2 800 | STANDARD | — |
| 11 | **Chip IA "✦ IA"** entra | Slide-up + fade en la fila 5 (base del eje) | `y 12→0`, `opacity 0→1` | 2 800–3 150 | EMPHASIS | — |
| 12 | **Burbuja IA** aparece | Burbuja blanca hairline radius-md shadow-soft crece junto al chip | `scale .92→1`, `opacity 0→1` | 3 100–3 450 | EMPHASIS | +150 |
| 13 | **Texto IA escribiéndose** `Mañana: retomar a Marta ✦` | Streaming carácter a carácter (~34ms/char), text-secondary, ✦ support al final | `clip-path →0` (typing) | 3 400–4 700 | linear | tras burbuja |
| 14 | **Bracket hand-drawn** bajo el texto IA (opcional, sparing) | Mini-corchete/subrayado support que abraza la sugerencia | `strokeDashoffset 1→0`, `opacity 0→.9` | 4 600–4 950 | EXPO_OUT | tras typing |
| 15 | **Cursor "tú"** entra | Flecha ink + chip "tú" llega con spring desde fuera-derecha hacia el botón | `x,y` spring (stiff~180, damp~26) | 4 800–5 500 | spring | — |
| 16 | **Botón "Planificar"** (ink) visible | Pequeño botón ink dentro/junto a la burbuja, ya presente; el cursor se posa | `opacity 1` (estaba a .85→1 al hover) | 5 400–5 550 | STANDARD | — |
| 17 | **Click ring** | Anillo único que se expande y desvanece en el botón (ink) | `scale .4→1.6`, `opacity .5→0` | 5 550–5 800 | STANDARD | — |
| 18 | **Subrayador buttermilk** | Sweep L→R bajo `retomar a Marta` (único highlight del acto) | `scaleX 0→1` origin-left | 5 800–6 350 | EXPO_OUT | tras click |
| 19 | *Coda — premio en pantalla* | Día completo + IA resuelta + subrayador; breath sostenido | `scale 1→1.005→1` | 6 350–6 600 | STANDARD | — |
| — | **ACT OUT** → Órbita + condensación → nib | Ver §5 | — | 6 600–7 200 | EXPO_OUT / EMPHASIS | solape 200ms |

---

## 3. Layout de las filas (viewBox 480×520)

- **Eje vertical hairline** (recibido del Acto II): `x=96`, de `y=72` a `y=452`. `stroke: var(--color-border-strong)`, `width 1.25`. Cada fila cuelga de un nodo-punto en el eje (`r=2.5`, ink, opacity .5).
- **Leading generoso:** filas cada **76px** (la ley de legibilidad: las filas respiran). Máx **5 filas** (4 evento + 1 IA).
- **Anchor de chip cliente:** centro en `(96, yFila)` — el chip 24px se monta SOBRE el nodo del eje (ring hairline `--color-border-strong` 1.25, monograma `--color-text-tertiary`, consistente con Acto II). El eje pasa por detrás del chip.
- **Timestamp (Geist Mono, tertiary, 12px):** `x=128`, baseline alineada al centro del chip. Ancho reservado ~46px.
- **Evento (Jakarta, body-sm 15px, primary):** `x=180`, hasta `x≈452`. **El texto NUNCA cruza el eje** (arranca a 84px del eje, holgado).

Coordenadas Y por fila:

| Fila | Chip | y centro | ts | evento |
|---|---|---|---|---|
| 1 | A | 108 | `9:12` | escribiste a Ana |
| 2 | M | 184 | `11:40` | propuesta enviada ✓ |
| 3 | D | 260 | `13:05` | nota añadida a Diego |
| 4 | L | 336 | `16:20` | Lucía respondió |
| 5 | ✦ IA | 420 | — | (burbuja, ver §4) |

- **Check fila 2:** a la derecha de "enviada", anchor `(372,184)`. Path `M 0 0 l 5 6 l 11 -14`, `support`, width 2.4, round, draw-in. Sin badge detrás (clipart tell).

---

## 4. El beat IA-resumen → cursor-click → subrayador (corazón)

Secuencia emocional (es el clímax del acto, equivalente al "cierre del círculo" del Acto I):

1. **Chip "✦ IA"** (#11): pill blanca, hairline border, `radius-full`. UN solo ✦ en `support #B23A86` + texto "IA" en ink. Anclado en la fila 5, `x=96`. Es la única firma support de la zona-texto junto al check.
2. **Burbuja** (#12): blanca, hairline, `radius-md`, `shadow-soft`. Nace pegada al chip (`x≈128, y=420`), crece con `scale .92→1` desde origin-left. Es Inline Suggestion anclada, NO panel flotante (patrón validado en research §2).
3. **Typing** (#13): "Mañana: retomar a Marta ✦" se escribe carácter a carácter (~34ms/char) en `text-secondary` (ghost-text feel Copilot). El ✦ final aparece de golpe al terminar, support. Sin glow, sin gradiente.
4. **Bracket hand-drawn** (#14, opcional sparing): un corchete fino `[` o subrayado tenue support bajo el texto IA — refuerza que es anotación humana sobre la sugerencia. Draw-in 350ms. Si la composición se aprieta, se omite (una-idea-por-pieza).
5. **Cursor "tú"** (#15): flecha ink sólida + chip "tú" (Geist Mono 11px, bg blanco, hairline, `radius-full`). Entra con **spring** (no ease, un cursor no frena), micro-pausa ~150ms antes de clicar.
6. **Botón "Planificar"** (#16): pequeño botón ink (`radius-md`, `--color-accent-fg`) dentro de la burbuja a la derecha. El único elemento de acción.
7. **Click ring** (#17): un único anillo ink que se expande y desvanece (~250ms, STANDARD). NO ripple de color.
8. **Subrayador buttermilk** (#18): sweep `scaleX 0→1` origin-left bajo `retomar a Marta`. `bg-highlight`, `inset-x -2px`, `top .32em / bottom .04em`, `border-radius 3px 6px 5px 8px / 6px 4px 7px 5px`, `rotate(-2.2deg)` solo en el span. **Único highlight del acto.** Es el "sí, planificado".

> Lectura del beat: la IA habla (typing) → la mano lo valida (bracket) → vos decidís (click) → queda hecho (subrayador). La IA propone, el humano dispara.

---

## 5. El cierre Órbita + condensación → nib (handoff al Acto I)

El loop se cierra como **exhale**, no como reset. Tres fases encadenadas (6 600→7 200ms, solape 200ms con el arranque del Acto I):

**Fase A · Condensación (6 600–6 900, EMPHASIS):**
Las filas se desvanecen **ascendiendo** (la 4 primero, luego 3, 2, 1; stagger ~60ms) — `y 0→-10`, `opacity 1→0`. La burbuja IA + chip + subrayador hacen fade simultáneo. El eje hairline **se retrae** de abajo hacia arriba (`scaleY 1→0` origin-top, o `clip-path` que sube) hasta colapsar en un **único punto de tinta** en `(96,108)` (la posición de la fila 1 = el origen natural del Acto I).

**Fase B · Órbita (6 850–7 100, EXPO_OUT):**
Mientras el punto se forma, un **trazo support** dibuja una **casi-circunferencia veloz y elegante** alrededor del punto (~330°, radio ~14), `strokeDashoffset 1→.06` dejando gap, y **lo cierra** (segmento de cierre con cola de 3px, EMPHASIS) — *cerrar el círculo = el ciclo del día cerrado*. Mismo gesto-firma del rescate del Acto I, pero diminuto y veloz: aquí no es alivio, es "día cerrado, todo guardado". El círculo se desvanece (`opacity 1→0`, 150ms) justo tras cerrarse, dejando solo el punto.

**Fase C · Nib launch (7 050–7 200, EXPO_OUT, solapado):**
El punto de tinta **se convierte en la nib** (`r 2.5→3.2`, ink) y **arranca a moverse** por el inicio del `MAIN_PATH` del Acto I (`offset-distance 0%→~6%`) — el trazo del nuevo día ya empieza a dibujarse ANTES de que el Acto III termine de desvanecerse. **Nunca lienzo en blanco.**

> El contrato de handoff: el Acto III ENTREGA al Acto I un punto de tinta vivo en `(96,108)` que ya es la nib en movimiento. El Acto I lo recibe y completa el trazo. El círculo Órbita es la respiración entre dos días.

Disciplina de color en el cierre: el círculo Órbita es el **único support** del cierre; el punto/nib es ink. Sin amarillo aquí (el subrayador ya hizo su trabajo y se desvaneció en Fase A).

---

## 6. Reduced-motion (frame estático exacto)

Una sola foto del día resuelto, sin movimiento:
- Eje hairline **completo**, 4 nodos + 4 chips A/M/D/L asentados.
- Las 4 filas **completas** (ts + evento, sin write-on), legibles.
- **Check** de la fila 2 **dibujado**.
- Chip "✦ IA" + burbuja con el texto **completo** "Mañana: retomar a Marta ✦" (sin typing).
- **Subrayador buttermilk pintado** bajo "retomar a Marta". Botón "Planificar" visible, sin click ring.
- Bracket hand-drawn: **omitido** (reduce ruido en estático).
- Sin cursor, sin Órbita, sin condensación. El día, cerrado y a salvo, de un vistazo.

---

## 7. Mobile (<lg)

- viewBox recompuesto vertical (~`360×460`), escena bajo el headline.
- Eje hairline en `x=72`, filas cada **64px**. **4 filas máx → reducir a 3 eventos + IA** (se elimina la fila "Diego", igual que el FUGAZ del Acto I cae en mobile). Chips 22px.
- Timestamp `x=98`, evento `x=140`. Texto sigue sin cruzar el eje (holgura 68px).
- Beat IA, check, click y subrayador: **intactos** (son la narrativa).
- Cursor "tú": entra desde abajo-derecha, trayecto más corto.
- Órbita + condensación + nib: **intactas** (cierran el loop). Radio Órbita ~11.
- En ≤480px: chips ambient del Acto I no aplican aquí; el acto ya es denso, no añadir nada.

---

## 8. Tres criterios de calidad auditables

1. **La cascada tiene RITMO, no aparece en bloque:** cada par ts+evento entra con stagger ≥250ms respecto al anterior (gota a gota). Si las 4 filas aparecen juntas o con fade plano = FALLA.
2. **El texto NUNCA cruza el eje y las filas respiran:** medir que ningún glifo de evento entre en `x<180` (desktop) / `x<140` (mobile), y que el leading entre filas ≥72px desktop. Texto pisando el eje o filas apretadas = FALLA.
3. **El cierre es un exhale que entrega nib viva, sin frame en blanco:** pausando en cualquier ms del rango 6 600–7 200, debe verse o el círculo Órbita cerrándose o la nib ya en movimiento sobre el path del Acto I; el círculo cierra con gap-previo (no nace cerrado). Un frame vacío entre actos, o un círculo-garabato sin cierre limpio = FALLA. (Disciplina de color: único support = check + chip-✦ + Órbita; único highlight = subrayador.)
