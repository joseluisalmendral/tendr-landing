# Acto II · "Constelación" — contrato de implementación

> ACTO II del tríptico hero. Recibe los chips de la ruta disuelta de Acto I y los entrega alineados como espina de timeline a Acto III. Extiende PARTE 2 del director's cut (tabla de trazo, construcción de chip, guardarraíles anti-kitsch). Tokens en `docs/design.md`. **No reinventar — extender.**

---

## 1. Concepto en una frase

Tu cartera es una constelación que flota tranquila; un cliente empieza a alejarse, **la IA lo detecta y vos lo traés de vuelta** — nada se cae porque hay una mano (la tuya) sobre el sistema.

## 2. Timeline ms-precisa

Duración del acto: **6 600 ms + 600 ms de handoff** (total 7 200 ms). Reloj propio `t ∈ [0,1]` para el acto; el drift ambiente corre en loops separados (períodos primos). Easings heredados: `EXPO_OUT` `cubic-bezier(0.16,1,0.3,1)`, `EMPHASIS` `cubic-bezier(0.2,0.8,0.2,1)`, `STANDARD` `cubic-bezier(0.4,0,0.2,1)`. Drag = spring (no bezier).

| # | Beat | Elemento | Qué pasa | Transform / opacity | Rango ms | Easing |
|---|---|---|---|---|---|---|
| 1 | Catch | 5-6 chips dispersos (de Acto I) | Llegan volando desde fuera, frenan en formación | `x,y scatter→pos`, `opacity .0→tier`, `scale 1.15→tier` | 0–800 | EXPO_OUT |
| 2 | Settle | Constelación | Micro-asentamiento, drift ambiente arranca | overshoot ~3% → reposo; loops drift `.start()` | 800–1 200 | EMPHASIS |
| 3 | Vida | Constelación | Drift anti-gravedad desfasado, respira | loops períodos 7s/11s/13s/17s (primos) | 1 200–2 600 | yoyo ease-in-out |
| 4 | Deriva | Chip "Lucía" (at-risk) | Se aleja hacia fuera + se atenúa | `x →+34px`, `y →-12px`, `opacity tier→.28`, `scale →.82` | 2 600–3 600 | STANDARD (lento, pesado) |
| 5 | IA aparece | Pill `✦ IA` | Fade-in anclado cerca de Lucía, sin glow | `opacity 0→1`, `y 8→0` | 3 400–3 700 | EMPHASIS |
| 6 | IA escribe | Burbuja sugerencia | Texto write-on "Lucía se está enfriando ✦" | typing 32 ms/char (~860 ms) | 3 700–4 560 | STANDARD |
| 7 | Cursor entra | Cursor `tú` | Spring-in desde fuera hacia la burbuja, micro-pausa | spring stiffness 220 damping 26 | 4 500–5 000 | spring |
| 8 | Agarre | Cursor + chip Lucía | Click-ring discreto; chip se inclina 2° | ring `scale .4→1.4 opacity .6→0` 250ms; chip `rotate 0→2°` | 5 000–5 250 | STANDARD |
| 9 | Arrastre | Chip Lucía sigue al cursor | Cursor vuelve a la constelación; chip lo sigue con lag | spring (chip persigue cursor, ver §5) | 5 250–5 950 | spring lag |
| 10 | Suelta | Chip Lucía | Release: re-brilla, vuelve a su tier, destilt | `opacity .28→tier`, `scale →tier`, `rotate 2°→0` | 5 950–6 200 | EMPHASIS |
| 11 | Alivio | Trazo support | Subrayado/tick hand-drawn draw-in bajo Lucía + check | `strokeDashoffset 1→0`, `opacity 0→1` | 6 100–6 500 | EXPO_OUT |
| 12 | Re-settle | Constelación | Vuelve armónica; IA pill+burbuja fade-out; cursor sale | pill/burbuja `opacity→0`; líneas hairline opcionales (§3) | 6 300–6 600 | STANDARD |
| 13 | **Handoff OUT** | Todos los chips | Alinean a columna vertical izquierda → spine de Acto III | ver §4-out | 6 600–7 200 | EXPO_OUT |

## 3. Layout de la constelación (viewBox 480×520)

Coordenadas aproximadas de reposo (centro del chip). Tres tiers de profundidad por scale/opacity/blur — heredan jerarquía ambient del director's cut (cap visual bajo, pero **estos SÍ son protagonistas**, no ambient de fondo: cap más alto).

| Chip | Monograma | Label | Coord (x,y) | Tier | scale | opacity | blur |
|---|---|---|---|---|---|---|---|
| Marcos | M | "Marcos" | (130, 150) | front | 1.0 | 1.0 | 0 |
| Ana | A | "Ana" | (330, 120) | front | 1.0 | 1.0 | 0 |
| **Lucía** | L | "Lucía" | (300, 300) | front (at-risk) | 1.0→.82 | 1.0→.28 | 0→1 |
| Jorge | J | "Jorge" | (90, 320) | mid | 0.9 | 0.82 | 0.3px |
| Sofía | S | "Sofía" | (390, 360) | mid | 0.9 | 0.82 | 0.3px |
| Rubén | R | "Rubén" | (200, 430) | back | 0.8 | 0.62 | 0.6px |

- **Tiers**: front (3-4 chips, nítidos), mid (scale .9, opacity .82, blur .3px), back (scale .8, opacity .62, blur .6px). Da profundidad sin sombras (prohibidas).
- **Lucía** es front (protagonista del drama) pero deriva al cuadrante inferior-derecho, hacia espacio negativo, para que la IA pill quepa anclada cerca a (370, 300).
- **Hand-placed feel**: ninguna coord en grid regular; cada chip con micro-rotación de reposo ±1.5° (estática) y label desplazado a un lado distinto por chip (ver §5).
- **Líneas constelación (opcional, beat 12)**: hairlines `--color-border-strong` width 1, opacity 0→.18, conectan 3-4 chips front+mid en el re-settle, draw-in 300ms, **se quedan tenues**. JUICIO: solo si NO compiten con los labels — si la composición se aprieta, OMITIR (una-idea-por-pieza: el héroe es el rescate, no la red). Default: **incluir muy tenues** porque cierran la lectura "constelación".

## 4. Secuencia IA-detecta → cursor-arrastra → suelta → alivio (corazón del acto)

Este es el beat que justifica el acto. Detállalo así:

**(a) Deriva (2 600–3 600).** Lucía se separa SOLA, lenta, pesada (STANDARD, no expo — no debe parecer un wow, debe inquietar). Se atenúa y encoge: lee "se está enfriando" sin texto. El resto sigue su drift normal — el contraste es la señal.

**(b) IA detecta (3 400–4 560).** La pill `✦ IA` aparece anclada a ~(370, 300), a la derecha de Lucía (beat 5). Construcción exacta en §5. Luego la burbuja de sugerencia (white, hairline, `radius-md`, `shadow-soft`) hace **write-on** del texto "Lucía se está enfriando ✦" a 32 ms/char (ghost-text/streaming, patrón Copilot validado en research §2). **UN solo ✦** total entre pill y texto — el de la pill. Si el texto lleva ✦ al final, la pill NO lo lleva (elegir uno; default: ✦ en la pill, texto sin ✦ extra → reescribir burbuja a "Lucía se está enfriando" para no duplicar). Sin glow, sin gradiente, sin pulso. La IA *señala*, no *decora*.

**(c) Cursor arrastra (4 500–5 950).** El cursor `tú` (ink arrow + chip "tú") hace spring-in desde fuera-derecha hacia Lucía, micro-pausa de lectura (~120ms) sobre el chip. Click-feedback: **un anillo discreto** (`scale .4→1.4`, `opacity .6→0`, 250ms, ink) — NO ripple de color. Al agarrar, **el chip se inclina ~2°**. Luego el cursor viaja de vuelta al hueco de Lucía en la constelación, y **el chip lo sigue con lag de spring** (física en §5): el chip va detrás del cursor, no pegado — eso lee "arrastre con peso".

**(d) Suelta + alivio (5 950–6 500).** Release: el chip se asienta en su tier original (`opacity→1`, `scale→1`, `rotate 2°→0`, EMPHASIS con micro-overshoot). Disparado por el release, un **trazo de alivio hand-drawn** (support, draw-in EXPO_OUT) dibuja un subrayado-tick corto bajo el label de Lucía + el **check firma**. Reutiliza geometría del check del director's cut (`stroke 2.6`, round, sin badge). El cursor sale (fade) tras el release. Pill+burbuja IA fade-out. La constelación re-settlea armónica: la mano arregló lo que la IA detectó.

## 5. Assets nuevos

### 5a · Client chip completo (extiende ambient-chip §4 director's cut)

```
<g class="client-chip">                    <!-- wrapper anima x,y,scale,opacity,rotate -->
  <circle cx="0" cy="0" r="18"             <!-- 36px Ø; ambient era r13/28px -->
          stroke="var(--color-border-strong)" stroke-width="1.5" fill="none"/>
  <text x="0" y="6" text-anchor="middle"
        font-family="var(--font-display)" font-size="17" font-weight="600"
        fill="var(--color-text-secondary)">L</text>   <!-- monograma Bricolage -->
</g>
<!-- Label HTML real, NO en el SVG: <span> en Geist Mono 11px text-tertiary,
     posicionado al lado del chip (off-chip), lado alterno por chip:
     Marcos→derecha, Ana→izquierda, Lucía→abajo, Jorge→derecha, Sofía→izquierda, Rubén→abajo.
     gap 6px desde el borde del ring. Da el "hand-placed" feel. -->
```
- Ring 36px (front), 32px (mid/back vía scale). Stroke `1.5` (entre el `1.25` ambient y la pluma narrativa — agrupa con la mano).
- Monograma `--color-text-secondary` (más presente que el `tertiary` del ambient: estos son protagonistas).
- Label fuera del chip, seleccionable, AA. Nunca dentro del círculo.
- **El ring perfecto está permitido** (excepción ambient del guardarraíl §5 anti-kitsch: el círculo lee "sistema/contacto", no clipart narrativo).

### 5b · Cursor "tú" (furniture compartida — usar EXACTO)

- Flecha ink sólida (`--color-text-primary`/#101010) + chip nombre "tú" en Geist Mono 11px, fondo white, hairline border (`--color-border-hairline`), `radius-full`.
- Movimiento **spring** (stiffness 220, damping 26) entre keyframes — nunca teletransporte.
- Click-feedback: anillo único `scale .4→1.4 opacity .6→0` 250ms STANDARD, ink. Drag-feedback: el chip arrastrado se inclina ~2° mientras dura el drag.

### 5c · AI chip (furniture compartida — usar EXACTO)

- Pill `✦ IA`: ✦ + texto `IA` en support `#B23A86`, fondo white, hairline border, `radius-full`. **Una sola ✦ en todo el acto.**
- Burbuja sugerencia: white, hairline border, `radius-md`, `shadow-soft`, texto que se escribe (ghost-text). Anclada bajo/junto a la pill, cerca de Lucía.

### 5d · Físicas del drag con spring

```
// El chip persigue al cursor con lag (no pegado) → lee "peso".
cursorPos = spring(target, { stiffness: 220, damping: 26 })   // el cursor lidera
chipPos   = spring(cursorPos, { stiffness: 170, damping: 22 }) // el chip persigue al cursor
chipRotate = 2°                                                 // tilt mientras drag activo
// Al release: chipRotate→0, chip cae a su pos de tier con EMPHASIS + overshoot ~4%.
```
- El doble-spring encadenado (cursor→chip) crea el lag físico: el chip nunca alcanza al cursor hasta que este se detiene. Damping del chip < cursor → el chip "cuelga".
- Determinista: targets son keyframes scriptados, no el mouse del visitante (research §1: el cursor es actor, no reacciona al usuario).

## 6. Reduced-motion (frame estático exacto)

- Constelación **asentada** en posiciones de reposo, los 6 chips visibles a su tier (sin drift, sin breath).
- Lucía **recuperada** (front, opacity 1, scale 1) — el drama ya resuelto.
- Pill `✦ IA` + burbuja con texto **completo** (sin typing), visibles junto a Lucía.
- Cursor `tú` **presente** sobre Lucía (sin movimiento).
- Trazo de alivio (subrayado-tick + check) **dibujado**.
- Líneas constelación opcionales: si se incluyen, **estáticas a opacity .18**.
- Una sola foto: constelación a salvo, IA detectó, mano resolvió.

## 7. Mobile (<lg)

- viewBox recompuesto vertical (~360×440); constelación más apretada en columna.
- Chips: **4, no 6** (eliminar Rubén-back y Sofía-mid; quedan Marcos, Ana, Lucía, Jorge). En ≤480px: **3** (Marcos, Ana, Lucía).
- Tiers: solo front + 1 mid. Drift ±4px, períodos 7s/11s.
- Secuencia IA→cursor→drag→alivio: **intacta** (es el corazón, no se recorta). Burbuja IA se ancla arriba de Lucía (no a la derecha) por ancho.
- Labels: pueden ir debajo del chip de forma uniforme en mobile (el espacio lateral no da para alternar lados).
- Handoff OUT a columna: idéntico (la columna ya es vertical, encaja natural).

## 8. Handoff contract (preciso)

**ACT IN (de Acto I, 0–800ms):** se reciben 5-6 chips dispersos saliendo de la ruta disuelta (morph-out de Acto I). Cada chip entra desde su posición de scatter con `scale 1.15→tier`, `opacity 0→tier`, frena en su coord de §3 con EXPO_OUT. Los primeros 800ms son el "catch & settle": el overshoot de ~3% (beat 2) vende el "atrapar". El drift ambiente NO arranca hasta beat 3 (1 200ms) — primero asentar, luego respirar.

**ACT OUT (a Acto III, 6 600–7 200ms):** tras el alivio, los chips **alinean a columna vertical** en el lado izquierdo (se vuelven filas de timeline):
- Cada chip glide a `x≈40` (columna izquierda), `y` redistribuido equiespaciado (p.ej. 90, 165, 240, 315, 390, 465), ordenados por su `y` actual (estable, sin cruces bruscos).
- Shrink `scale → 24px Ø` (de 36px front → 24px uniforme). Todos a opacity 1, blur 0 (salen de tiers, entran a filas iguales).
- En paralelo, un **eje vertical hairline** (`--color-border-strong`, width 1.5) draw-in con `strokeDashoffset 1→0` a la izquierda de la columna (x≈40, de y=70 a y=480) — **esa columna + eje ES la spine de la timeline de Acto III**.
- Labels Geist Mono 11px viajan con su chip, se alinean a la derecha de cada fila (quedan como nombre de cada row de timeline).
- Easing EXPO_OUT, 600ms, stagger sutil 40ms por chip (la columna "se arma" de arriba a abajo). Lucía mantiene su identidad (no se pierde el cliente rescatado: llega a la timeline como una fila más, sana).

## 9. Tres criterios de calidad auditables

1. **El rescate se lee como ALIVIO humano, no automático:** la IA SOLO detecta (pill + burbuja, sin tocar el chip); es el cursor `tú` quien arrastra y suelta. Si la IA "mueve" el chip, o si el cursor no tiene lag de spring (chip pegado, sin peso) = FALLA. El check+subrayado disparan en el release (±100ms), no antes.
2. **Disciplina de IA y color:** UNA sola ✦ en todo el acto (en la pill). Cero glow/gradiente/pulso en la pill o burbuja. Único support = pill `✦ IA` + trazo de alivio + check. Una segunda ✦ o cualquier morado = FALLA.
3. **Continuidad del tríptico (catch & align):** en t=0 los chips ya entran (nunca lienzo vacío tras Acto I); en t=1 los 6 chips están en columna izquierda con eje hairline dibujado, shrunk a 24px, listos como spine de Acto III. Un chip que se pierde, no alinea, o un frame vacío en cualquiera de los dos handoffs = FALLA.
