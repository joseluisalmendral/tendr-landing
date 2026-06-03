# Hero Tríptico · MASTER SCORE (partitura unificada)

> **Dirección integradora.** Esta es la fuente de verdad de orden superior para el hero de Tendr en 3 actos. Un implementador construye SOLO con este archivo + los tres specs de acto + `design.md`. Este archivo NO repite el detalle interno de cada acto: lo **referencia** y posee lo transversal — arquitectura global, juntas (handoffs), canon de mobiliario compartido, disciplina de color a lo largo del loop, reduced-motion único, mobile, quality bar y notas de implementación.
>
> Fecha: 2026-06-03. viewBox canónico **480×520** (desktop) en los tres actos. Tokens en `docs/design.md`. Lenguaje de trazo (la "una sola mano") en `hero-hilo-directors-cut.md` PARTE 2.
>
> **Specs de acto (detalle interno, no repetido aquí):**
> - Acto I "El Hilo" → `acto-1-hilo.md`
> - Acto II "Constelación" → `acto-2-constelacion.md`
> - Acto III "El día, de un vistazo" → `acto-3-cascada.md`
> - Research (cadencias, IA, cursor, transición shared-element) → `research-hero-actos.md`

---

## 0. Concepto del tríptico en una frase

Un día de tu cartera, en bucle: **El Hilo** la dibuja viva → **la Constelación** la sostiene flotando → **la Cascada** la cierra como timeline y la IA te deja servido el mañana → ese punto vuelve a ser la nib que arranca el día siguiente. La IA siempre **detecta y sugiere**; **vos (el cursor "tú") siempre accionás**. Ese reparto IA→humano es el latido idéntico de los tres actos.

---

## 1. Arquitectura global (reloj maestro, ciclo, indicador)

### 1.1 Estrategia de reloj — UN controlador global, fase por acto

Decisión (resuelve el conflicto reloj-único de Acto I/III vs "reloj propio" de Acto II): **un solo `useMotionValue(T)` global, lineal sobre el CICLO COMPLETO**, y cada acto deriva su `t∈[0,1]` local por `useTransform` del segmento que le corresponde. NO se encadenan tres `animate()` separados (eso reintroduce el riesgo de lienzo en blanco entre actos y desincroniza los solapes de handoff).

```
T ∈ [0,1] sobre CYCLE_MS, linear, repeat: Infinity     // el único reloj narrativo
actI.t   = clamp( map(T, 0.000, 0.333) )               // 0      → 7 200ms
actII.t  = clamp( map(T, 0.333, 0.667) )               // 7 200  → 14 400ms
actIII.t = clamp( map(T, 0.667, 1.000) )               // 14 400 → 21 600ms
```

- Las **bandas de solape de handoff** (los últimos 600ms de cada acto) caen DENTRO del segmento del acto saliente Y se solapan 0–200ms con el arranque del entrante: el acto entrante ya empieza a renderizar sus primeros elementos mientras el saliente disuelve. Esto es lo que garantiza "nunca lienzo en blanco" (ver §2).
- **Loops ambientales** (drift de chips, breath, typing por pasos) corren en `animate()` SEPARADOS con períodos primos (7s/11s/13s/17s) y `repeat: Infinity`, NUNCA atados a `T`. Igual que en directors-cut §7.
- **Performance**: solo `transform / opacity / strokeDashoffset / clip-path`. Cero `useState` para valores continuos. La variancia A/B se lleva en `useRef` + `onRepeat` (ver §1.4).

### 1.2 Ciclo total

| Tramo | Duración | Fracción de T |
|---|---|---|
| Acto I (cuerpo 6 600 + handoff 600) | 7 200ms | 0.000–0.333 |
| Acto II (cuerpo 6 600 + handoff 600) | 7 200ms | 0.333–0.667 |
| Acto III (cuerpo 6 600 + handoff 600) | 7 200ms | 0.667–1.000 |
| **CICLO TOTAL** | **21 600ms** | — |

21.6s cae dentro del rango de research §3 (18–24s). Cada acto da 6.6s de lectura/acción (> 3s mínimo, < 8s aburrimiento). El handoff de 600ms está en el rango research (500–700ms).

> **Nota sobre el loop de 13 200ms del directors-cut:** ese loop era para Acto I como pieza autónoma. Al integrarse al tríptico, Acto I se **comprime a 7 200ms** (su timeline ms-precisa ya está reescrita en `acto-1-hilo.md` §2 a 6 600+600). El directors-cut se conserva como canon de **assets y lenguaje de trazo** (PARTE 2), NO como score temporal. Donde `acto-1-hilo.md` y el directors-cut difieran en ms, **manda `acto-1-hilo.md`**.

### 1.3 Indicador de acto (01 / 02 / 03)

Research §3: indicador mínimo, no barra de progreso ansiosa.

- **Forma**: tres marcas `01` `02` `03` en **Geist Mono `caption` (13px)**, `tracking 0.12em`, dispuestas horizontalmente con `gap space-3`. Ancladas **abajo-centro** de la escena (fuera del viewBox SVG, como HTML real, AA), o esquina inferior-izquierda si el layout del hero lo pide.
- **Estado inactivo**: numeral en `--color-text-tertiary`, con un **dot** de `--color-support` de 4px a opacity `.25` a la izquierda del numeral activo solamente.
- **Estado activo**: numeral en `--color-text-primary`; su dot `--color-support` a opacity `1` (uso permitido: support como elemento no-textual, design.md §2.1; highlight PROHIBIDO aquí). El cambio de activo es un crossfade de 250ms STANDARD que dispara en el handoff del acto (T cruza 0.333 / 0.667).
- **Restricción de color**: el dot support del indicador es **transversal al tríptico** y NO cuenta contra la regla "un gesto rosa por acto" (§4) — es chrome de orientación, no narrativa. Pero sigue siendo support, así que: un (1) dot activo a la vez, nunca tres dots encendidos.
- **Animación**: ninguna más allá del crossfade del activo. No pulsa, no rota, no llena barra.

### 1.4 Variancia A/B en el tríptico

Decisión (¿sobrevive al tríptico?): **SÍ pero acotada a Acto I**, y SIMPLIFICADA. La A/B del directors-cut (moment fugaz "visto"/"nota" + chip que se aleja "L"/"R") vive solo en Acto I, que es donde aporta sin tocar las juntas. Actos II y III son deterministas idénticos cada ciclo. Razón: la variancia entre actos multiplicaría los estados de handoff a auditar (riesgo alto, payoff bajo). Contador en `useRef`, bump en `onRepeat` del reloj global, default A para SSR. **El monograma del chip que se aleja en Acto I NO altera el set de 6 chips que se entrega a Acto II** (ver §3, junta J1): el chip "que se aleja" es ambient, distinto de los 6 protagonistas.

### 1.5 Pause offscreen

`useInView(rootRef, { amount: 0.3 })`. Fuera de vista: el reloj global `T` y TODOS los loops ambientales hacen `.stop()`; la escena queda aparcada en su frame actual (no resetea a 0). Igual que directors-cut §7.

---

## 2. Las tres juntas (handoffs) — contrato resuelto

Cada junta es un **shared-element morph** (research §3-B), NO un crossfade ni un corte. Lo que persiste se transforma; lo que muere hace fade ≤150ms. **Regla dura: en ningún ms de ninguna junta puede haber lienzo en blanco** (el entrante ya renderiza antes de que el saliente termine de disolverse).

### Junta J1 · Acto I OUT → Acto II IN (T≈0.305–0.355, ms 6 600–7 800 abs)

**Auditoría de mismatches encontrados y resueltos:**

| Mismatch | Acto I OUT decía | Acto II IN decía | DECISIÓN |
|---|---|---|---|
| Nº de chips | "5–6 chips circulares de monograma" | "5-6 chips dispersos" + 6 chips nombrados | **Exactamente 6 chips.** |
| Monogramas entregados | sin nombrar | M, A, L, J, S, R | **M A L J S R** (Marcos, Ana, Lucía, Jorge, Sofía, Rubén). I OUT debe nacer los 6 con ESTAS letras. |
| Posiciones de entrega | "anti-gravedad, leve drift" (scatter genérico) | catch hacia coords §3 de Acto II | **I OUT dispersa hacia 6 puntos de scatter que son los vectores de entrada de las 6 coords de reposo de Acto II** (no posiciones finales: posiciones de "vuelo entrante" desde fuera del viewBox, para que el catch&settle de Acto II tenga overshoot real). |
| Chips ambient previos | "los 2 ambient se integran a la constelación" | constelación de 6 (no menciona los 2 ambient) | **Los 2 chips ambient de Acto I (A, M) NO se suman como chips extra**: se reabsorben en los homónimos de la constelación (A→Ana, M→Marcos) con un micro-crossfade de opacity durante 6 600–6 950. Resultado neto a Acto II: 6 chips, ni 7 ni 8. |

**Mecánica de la junta (la dueña aquí es esta tabla; el detalle de easing por chip está en `acto-1-hilo.md` §9 y `acto-2-constelacion.md` §8):**
1. **6 600–6 950** (EMPHASIS): el trazo ink se rompe en 6 puntos repartidos por la longitud del path; cada punto **emerge como chip** (`scale 0→1`, `opacity 0→tier`). Glyphs de los moments hacen `opacity→0 + scale→.7`. Labels, ticks, AI chip, burbuja y cursor de Acto I hacen fade-out 150ms.
2. **6 950–7 200**: los 6 chips se dispersan hacia sus vectores de vuelo (fuera/borde del viewBox).
3. **7 200–7 800** (Acto II beats 1–2, EXPO_OUT→EMPHASIS): catch & settle — frenan en las coords de reposo de `acto-2-constelacion.md` §3 con overshoot ~3%.
- **Persisten al cruce**: los 6 chips (con su identidad M/A/L/J/S/R). **NO persisten**: trazo ink, glyphs, check, subrayador, AI chip, cursor.

### Junta J2 · Acto II OUT → Acto III IN (T≈0.638–0.688, ms 13 800–14 800 abs)

**Auditoría de mismatches encontrados y resueltos:**

| Mismatch | Acto II OUT decía | Acto III IN decía | DECISIÓN |
|---|---|---|---|
| x de la columna/eje | `x≈40` | eje `x=96` | **`x=96`** (manda Acto III: ahí el eje deja holgura para el texto del evento sin cruzarlo, §3 de Acto III). Acto II OUT debe alinear los chips a **x=96**, no a 40. |
| Tamaño de chip | shrink a 24px Ø | chip 24px sobre nodo | **24px Ø** — coinciden. ✔ |
| Nº de filas/chips | 6 chips → 6 filas (y=90,165,240,315,390,465) | 5 chips A/M/D/L/+IA, eje y=72→452, filas cada 76px | **5 filas máx** (manda Acto III: 4 evento + 1 IA, leading 76px es la ley de legibilidad). Acto II entrega 6 chips pero **uno se reabsorbe**: ver fila de reconciliación abajo. |
| Monogramas | M A L J S R (6) | A M D L (4 cliente) | **Reconciliación de identidad** abajo. |
| Eje (quién lo dibuja) | Acto II dibuja el eje hairline en el OUT | Acto III lo recibe "ya dibujado" | **Acto II dibuja el eje** durante su OUT (`x=96`, de `y=72` a `y=452`, `--color-border-strong` width 1.25). Acto III lo recibe completo. ✔ (se corrige el width 1.5→**1.25** para coincidir con Acto III §3). |

**Reconciliación de 6 chips (Acto II) → 4 filas-cliente (Acto III):** las 4 filas de Acto III son **A, M, D, L** (Ana, Marta/Marcos, Diego, Lucía — ver canon de monogramas §3-canon). De los 6 que trae Acto II (M A L J S R):
- **A (Ana), M (Marcos), L (Lucía)** → migran directo a las filas 1, 2, 4 (con M leído como Marta/Marcos, ver §canon).
- **D (Diego)**: Acto III necesita una fila "D" que Acto II no tiene. **DECISIÓN**: la fila 3 (Diego) **no migra de un chip de Acto II**; nace nueva en el ACT IN de Acto III (Acto III §2 beat 0 ya prevé "fade-up de 120ms para asentar continuidad" — Diego entra ahí, junto con el chip ✦IA de la fila 5). Los chips sobrantes de Acto II (**J Jorge, S Sofía, R Rubén**) hacen fade-out durante el OUT de Acto II (6 600–6 850 del segmento II) **antes** de la alineación a columna, dejando solo A/M/L para alinear. Así Acto II entrega 3 chips alineados + eje, y Acto III completa con D + ✦IA. Esto mantiene "5 filas máx" y evita una columna de 6 apretada.

> **Honestidad de la decisión**: el spec de Acto II §8 dice "Lucía mantiene su identidad… llega a la timeline como una fila más, sana", lo cual se respeta. Lo que se ajusta es que **no migran los 6**: 3 migran, 3 se despiden, y la timeline se completa con caras nuevas (D, IA). Es coherente con "es otro momento del mismo día": la cartera completa no cabe en la timeline de 5 filas, se muestran las relevantes del día.

**Mecánica:** ver `acto-2-constelacion.md` §8 (alineación a columna, eje draw-in) corregido con x=96 y width 1.25, + `acto-3-cascada.md` beat 0.

### Junta J3 · Acto III OUT → Acto I IN (T≈0.917–1.0 → 0, ms 20 400–21 600 → 0 abs)

**Auditoría:**

| Mismatch | Acto III OUT decía | Acto I IN decía | DECISIÓN |
|---|---|---|---|
| Qué se entrega | punto de tinta vivo en (96,108) que YA es la nib en movimiento sobre MAIN_PATH | "canvas solo con 2 chips ambient + nada más; arranca con nib+draw" | **Acto I NO arranca de cero ambient-only.** Recibe la nib viva en (96,108) ya en `offset-distance ~6%` y completa el trazo. La nota "ACT IN ambient-only" de `acto-1-hilo.md` §9 queda **derogada** para el contexto tríptico (era para cold-start standalone). En el loop, el draw de MAIN_PATH ya está en curso al cruzar T=1→0. |
| Chips ambient en el arranque | no menciona ambient | "2 chips ambient opacity ~.12" | **Los chips ambient (A, M) PERSISTEN a lo largo de todo el tríptico** como capa de fondo continua (ver §4.3). No "nacen" en Acto I: siempre están. En J3 ya están presentes mientras la Órbita cierra. |
| Posición de la nib | (96,108) | MAIN_PATH empieza en (40,64); (96,108) es ~6% del path | **Coherente.** (96,108) es el anchor NOTE y cae sobre MAIN_PATH a ~6% (el directors-cut PARTE 2 lo confirma). La nib se entrega ahí y retoma `offset-distance` desde ~6%, NO desde 0%. El tramo (40,64)→(96,108) ya se considera dibujado en el solape. |

**Mecánica:** las 3 fases de `acto-3-cascada.md` §5 (Condensación → Órbita → Nib launch) se conservan. La Órbita cierra (gesto-firma diminuto) → punto en (96,108) → se convierte en nib `r 2.5→3.2` → arranca por MAIN_PATH. El solape de 200ms (7 050–7 200 del segmento III = 20 850–21 600 abs) hace que el trazo de Acto I ya sea visible antes de que Acto III termine de desvanecer.

---

## 3. Canon de mobiliario compartido (UNA definición)

Estos elementos aparecen en ≥2 actos. Esta sección es su **única fuente de verdad**; los specs de acto deben deferir aquí donde difieran.

### 3-canon · Monogramas, nombres y reparto narrativo

**DECISIÓN de identidad (resuelve el lío M=Marta vs M=Marcos y la variedad Ana/Marta/Lucía/Diego):**

| Letra | Nombre canónico | Aparece en | Rol narrativo |
|---|---|---|---|
| **A** | **Ana** | I (label "9:12 · Ana"), II (chip front), III (fila 1) | cliente sano, recurrente. El "hilo" empieza con Ana. |
| **M** | **Marta** | I (cliente en riesgo, "Marta · 12 días"), III (fila 2 "propuesta enviada", texto IA "retomar a Marta") | **la cliente en riesgo del Acto I y la que la IA recuerda en Acto III.** En Acto II el chip "M" se lee igualmente **Marta** (NO Marcos). |
| **L** | **Lucía** | II (cliente en riesgo, "Lucía se está enfriando"), III (fila 4 "Lucía respondió") | **la cliente en riesgo del Acto II.** |
| **D** | **Diego** | III (fila 3 "nota añadida a Diego") | cliente sano, nace en Acto III. |
| J / S / R | Jorge / Sofía / Rubén | II (mid/back tiers) | cartera de fondo; se despiden en J2. |

> **Resolución del "Marcos vs Marta":** `acto-2-constelacion.md` §3 nombra el chip M como "Marcos". **Se corrige a "Marta"** para coherencia con I y III (la M es Marta en todo el tríptico). El label del chip en Acto II pasa de "Marcos" a **"Marta"**.
>
> **Resolución de la variedad de clientes en riesgo (la pregunta del brief):** se confirma el lean del director — **la variedad es buena y deliberada**: Acto I rescata a **Marta** (12 días sin contacto), Acto II rescata a **Lucía** (se enfría/deriva). Dos clientes distintos en riesgo en actos distintos refuerza "esto pasa todo el tiempo, con cualquiera". **Condición obligatoria de coherencia**: los textos de las burbujas IA nombran al cliente correcto de SU acto:
> - Acto I burbuja: **"Marta lleva 12 días · ¿retomamos?"** ✔ (ya correcto)
> - Acto II burbuja: **"Lucía se está enfriando"** ✔ (sin ✦ extra, ver §4.1)
> - Acto III burbuja: **"Mañana: retomar a Marta ✦"** ✔ — y AQUÍ Marta vuelve a escena: la timeline muestra que hoy ya pasaron cosas (Ana, propuesta, Diego, Lucía respondió) y la IA cierra el día recordando retomar a **Marta** mañana. Cierra el arco de Marta abierto en Acto I. **Intencional, no confusión.**

### 3a · Cursor "tú" (idéntico en los 3 actos)

- **Flecha**: puntero ink sólido (`--color-text-primary`), ~16px, path clásico `M0 0 L0 16 L4 12 L7 18 L9 17 L6 11 L11 11 Z`. Sin sombra, sin glow. **HTML/overlay sobre el SVG**, no dentro del SVG narrativo.
- **Chip de nombre "tú"**: Geist Mono 11px, `bg --color-surface-raised`, hairline border `--color-border-hairline`, `radius-full`, padding `2px 6px`, anclado abajo-derecha de la flecha.
- **Movimiento**: `motion` **spring**. **Stiffness 220, damping 26** en los 3 actos (Acto III §2 decía stiff~180 → **se unifica a 220**). Nunca teletransporta; entra desde fuera-derecha, micro-pausa ~120–150ms antes de accionar, sale tras actuar. Nunca persigue el mouse del visitante (research §1).
- **Click ring**: UN anillo hairline, `border 1px var(--color-text-primary)` (ink), `radius-full`. **`scale .3→1.6`, `opacity .9→0`, ~250ms, STANDARD.** (Acto II/III usaban `.4→1.4`/`.4→1.6` y opacity `.6/.5` → **se unifican a `.3→1.6` / `.9→0`**, geometría de Acto I.) NUNCA ripple de color, nunca neón.

### 3b · AI chip "✦ IA" + burbuja (idéntico en los 3 actos)

- **Pill ✦ IA**: `radius-full`, `bg --color-surface-raised`, hairline border, padding `3px 9px`, `shadow-soft`. Glyph **✦ 4-puntas ~10px en `--color-support` (#B23A86)** + texto **"IA" Geist Mono 11px**.
  - Color del texto "IA": **`--color-support`** (unificado con Acto I/II). Acto III §4 decía "texto IA en ink" → **se corrige a support** para que toda la pill sea una sola firma support coherente. La ✦ y "IA" comparten color support.
- **Una sola ✦ por acto, total** (ver §4). Sin glow, sin gradiente, sin lila, sin pulso.
- **Burbuja de sugerencia**: card `--color-surface-raised`, hairline border, `radius-md`, `shadow-soft`, padding `space-3`, max-width ~150px (desktop) / ~130px (mobile). Anclada bajo/junto a la pill.
- **Texto que tipea (ghost-text/streaming, patrón Copilot, research §2)**: render incremental por índice (`substring(0,n)`, `n` derivado de t vía `useTransform`+`Math.floor`, paso discreto). Entra en `--color-text-secondary` y **asienta a `--color-text-primary` al cerrar**. Velocidad **~32ms/char** en los 3 actos (Acto III §2 decía 34ms → **se unifica a 32ms**).
  - Textos por acto (ver §3-canon para nombres): I "Marta lleva 12 días · ¿retomamos?" · II "Lucía se está enfriando" · III "Mañana: retomar a Marta ✦".
  - **La ✦ dentro del texto SOLO existe en Acto III** (al final, de golpe, support). En I y II la única ✦ es la de la pill; el texto NO lleva ✦ (Acto II: regla anti-doble-✦ de su §4-b).

### 3c · Chips de cliente (tamaños por etapa)

UN chip, tres tamaños según la etapa del tríptico:

| Etapa | Ø ring | stroke ring | color ring | monograma fill | fuente monograma |
|---|---|---|---|---|---|
| **Ambient** (fondo, todo el tríptico) | 22–28px | 1.25 | `--color-border-strong` | `--color-text-tertiary` | Bricolage 600, 12px |
| **Constelación** (Acto II, protagonistas) | **36px** (front) / 32px (mid-back vía scale) | **1.5** | `--color-border-strong` | `--color-text-secondary` | Bricolage 600, 17px |
| **Timeline** (Acto III, sobre el eje) | **24px** | 1.25 | `--color-border-strong` | `--color-text-tertiary` | Bricolage 600, ~12px |

- El **ring perfecto está permitido** en los chips (excepción del guardarraíl anti-kitsch directors-cut §7-5: el círculo lee "sistema/contacto", no clipart narrativo).
- **Label del chip**: SIEMPRE HTML real fuera del círculo, Geist Mono 11px, seleccionable, AA. Nunca dentro del ring. Lado del label: en Acto II alterna por chip (hand-placed feel); en Acto III va a la derecha de la fila; en mobile va uniforme debajo.
- La transición de tamaño 36px→24px ocurre en J2 (shrink). De ambient a constelación (J1) el chip nace ya a 36px.

### 3d · Subrayador / trazos hand-drawn de apoyo (geometría canónica)

Tres gestos support distintos, una sola mano (round caps, support, width 2–2.6, draw-in `strokeDashoffset 1→0` EXPO_OUT):

- **Subrayador de burbuja IA** (I beat 16, II beat 11, III beat 14 "bracket"): trazo arqueado bajo el texto de la sugerencia, `--color-support`, width 2, round, ej. `M 4 38 q 70 6 140 0`. **Opcional/sparing** en II y III (omitir si la composición aprieta — una-idea-por-pieza). En Acto I es parte fija del beat.
- **Check (firma)**: `M 346 392 l 6 7 l 13 -16` (geometría directors-cut), width **2.6**, round, SIN badge detrás. Aparece en I (sobre el reloj), II (bajo Lucía), III (fila 2). Mismo trazo escalado/posicionado.
- **Órbita de cierre** (solo Acto III OUT, J3): casi-circunferencia ~330° + segmento de cierre con cola de 3–4px, support, width 2. Es el gesto-firma del rescate del Acto I, pero diminuto y veloz. Único support del cierre.

### 3e · Subrayador buttermilk (highlight — solo Acto I y Acto III)

`<motion.span>` DETRÁS del texto, `bg --color-highlight` (#FFF8BB). `inset-x -2px`, `top 0.32em`, `bottom 0.04em`, `border-radius 3px 6px 5px 8px / 6px 4px 7px 5px`, `rotate(-2.2deg)` solo en el span exterior, `scaleX 0→1` origin-left EXPO_OUT ~600ms.
- Acto I: bajo "Retomar". Acto III: bajo "retomar a Marta".
- **Acto II NO lleva highlight** (su payoff es el check + destilt del chip; no hay texto-CTA que subrayar). Esto es deliberado y correcto para la disciplina (§4).
- **REGLA DURA** (design.md): highlight es EXCLUSIVAMENTE fondo de texto. Jamás dot/borde/stripe.

---

## 4. Disciplina de color y capas (auditoría transversal)

### 4.1 Conteo de support y ✦ a lo largo del ciclo (la regla "un gesto rosa + un ✦ por acto")

| Acto | ✦ (uno máx) | Usos de support (firma rosa) permitidos | Highlight |
|---|---|---|---|
| **I** | 1 (pill ✦ IA) | pill ✦ IA + texto "IA" + subrayador burbuja + check + swoosh del sobre @0.5 | 1 (subrayador "Retomar") |
| **II** | 1 (pill ✦ IA) | pill ✦ IA + texto "IA" + subrayador de alivio + check | 0 |
| **III** | 1 (✦ final del texto IA) | chip ✦ IA + texto "IA" + ✦ del texto + check + (bracket opcional) + Órbita de cierre | 1 (subrayador "retomar a Marta") |

> **Conflicto resuelto sobre "un solo ✦":** la regla es **un ✦ POR ACTO**, no uno en todo el tríptico (3 actos × 1 ✦ = 3 ✦ totales, aceptable porque nunca coinciden en pantalla). Dentro de un acto: si la pill lleva ✦, el texto NO (I, II). En Acto III la ✦ está en el TEXTO (al final) y la pill "✦ IA" comparte ese único ✦ visual — **cuidado**: Acto III tiene "✦ IA" en la pill Y "✦" al final del texto = potencialmente DOS ✦. **DECISIÓN**: en Acto III la pill se rotula **"IA"** (sin ✦ en la pill; la ✦ vive solo al final del texto "…a Marta ✦"). Así Acto III mantiene UN solo ✦. Corrige `acto-3-cascada.md` §4-1 que ponía ✦ en la pill Y en el texto.
> - El **dot support del indicador de acto** (§1.3) es chrome transversal, NO cuenta en este conteo.
> - El **swoosh del sobre** (Acto I, EnvelopeGlyph, support @0.5) es la única gota de support dentro de un glyph; permitido por directors-cut §4.

**Cero**: glow, gradiente, lila/violeta, pulso luminoso, neón, multicolor. Click ring siempre ink. (research §2 + design.md §6.)

### 4.2 Z-layers globales (atrás→delante, idénticos en los 3 actos)

```
z0   Ambient        chips monograma de fondo (blur ≤0.6px, opacity ≤.22)
z10  Espina/estructura  trazo ink + nib (I) · eje hairline (III) · constelación base (II)
z20  Moments / chips protagonistas  glyphs ink (I) · chips constelación (II) · filas+chips (III)
z25  Apoyo support   arco/círculo rescate, subrayador burbuja, check, Órbita
z30  Tipografía narrativa  labels HTML reales sobre SVG (seleccionable, AA)
z31  Subrayador buttermilk  DETRÁS del texto (I, III)
z40  Chrome IA/cursor  pill ✦ IA, burbuja, cursor "tú", click ring (HTML overlay)
z50  Indicador de acto  01/02/03 (HTML, fuera del viewBox)
```

### 4.3 Chips ambient a lo largo de los actos

**DECISIÓN (resuelve "¿persisten? ¿se transforman en cast?"):** los chips ambient son una **capa de fondo continua y persistente durante TODO el tríptico** (z0), corriendo en sus propios loops de drift (períodos primos 9s/11s). NO se transforman en protagonistas; son la "cartera viva de fondo" constante. En Acto I son 2 (A, M) + el chip que se aleja (variancia A/B). En Acto II y III siguen ahí, tenues, detrás de los protagonistas (que son una capa distinta, z20). En J1, los 2 ambient (A, M) se **reabsorben visualmente** en los homónimos protagonistas para no duplicar (ver J1), pero la capa ambient como tal nunca desaparece — debajo de la constelación y de la timeline sigue habiendo drift tenue. Cap absoluto opacity **.22**, nunca sobre un glyph/chip protagonista.

### 4.4 Breathing

Grupo raíz `scale 1→1.006→1` (desktop) / `1→1.004→1` (mobile), período ~6s, loop propio yoyo, independiente de `T`. Activo en las codas/holds de cada acto. Se pausa offscreen con todo lo demás.

---

## 5. Reduced-motion — UNA composición estática para toda la pieza

**DECISIÓN (confirma el lean del director):** bajo `prefers-reduced-motion`, el tríptico NO cicla ni muestra los tres frames; muestra **una sola foto: el frame resuelto del Acto I** — porque carga la promesa completa (IA detecta → humano acciona → cliente a salvo) en la imagen más legible y autoconclusiva.

Composición estática exacta (de `acto-1-hilo.md` §6):
- Trazo principal **completo** (sin nib).
- 3 moments asentados: NOTE, ENVELOPE, CLOCK (sin fugaz, o fugaz en estado iter-A).
- CLOCK **arriba y recuperado**, con **check dibujado**.
- Labels completos con sus ticks líderes (sin write-on).
- **Pill ✦ IA visible + burbuja con la frase completa** "Marta lleva 12 días · ¿retomamos?" (sin tipeo) + subrayador hand-drawn pintado.
- **Cursor "tú" apoyado en "Retomar"** (estático, sin click ring) — comunica el reparto IA/humano sin animar.
- Subrayador buttermilk bajo "Retomar" **pintado**.
- Chips ambient: 2 quietos a opacity ~.14. El que se aleja, omitido.
- **Indicador de acto**: visible, con `01` activo (es el frame del Acto I). `02`/`03` inactivos.
- Sin breath.

> El reloj global `T` se fija a la fracción que produce este frame (≈0.27, el final del Acto I resuelto pre-handoff) y NO avanza. No hay loops ambientales. La escena cuenta la historia completa en una imagen.

---

## 6. Mobile (<lg) — decisión honesta

**DECISIÓN: Acto I completo + indicador de dots, NO el tríptico entero.**

Razón (juicio UX): tres actos encadenados en una columna estrecha bajo el headline, en loop, es demasiada carga cognitiva y demasiado alto/scroll en móvil; el riesgo de que ningún acto se lea bien en 3s es alto. **Acto I es el más autoconclusivo** (dibuja el hilo + muestra el reparto IA→humano + resuelve), así que en mobile se reproduce **solo Acto I** en su versión vertical, en loop corto, con el indicador `01·02·03` presente pero **estático** (señala que hay más actos en desktop sin reproducirlos).

Spec mobile (de `acto-1-hilo.md` §7 + directors-cut §6):
- viewBox vertical recompuesto **~360×420**.
- Espina + nib (ruta más vertical), 3 moments (NOTE, ENVELOPE, CLOCK — sin fugaz).
- Labels en callouts apilados; "Marta · 12 días" pasa ENCIMA del reloj; ticks líderes ~8px.
- Caída + AI chip + burbuja (1 línea, max-width ~130px) + cursor + click + recuperación + check: **intactos** (es el corazón).
- AI chip + burbuja anclados ARRIBA del reloj. Cursor entra desde abajo; botón "Retomar" bajo el reloj.
- Chips ambient: 1 (opacity ≤.16). En ≤480px: 0.
- **Loop mobile: 7 000ms** (solo Acto I; no hay handoff a otro acto, el reset solapa contra sí mismo como en directors-cut). Breath `scale 1→1.004`.
- Indicador `01·02·03`: visible, `01` siempre activo (mobile solo muestra acto I), sin animar el cambio.

> **Alternativa descartada**: tríptico recortado en mobile (cada acto 3–4s). Descartada por riesgo de ilegibilidad y por el coste de auditar 3 handoffs verticales. Si en el futuro se quiere "más" en mobile, la evolución natural es **scroll-driven** (un acto por pantalla al hacer scroll, research §3-A sticky-stack), no loop temporal.

---

## 7. Quality bar — 7 criterios auditables del tríptico

1. **Cada acto se entiende solo en 3s por un desconocido.** Mostrar a alguien un solo acto aislado: debe poder decir "una cartera de clientes / un cliente se enfría y lo retoman / un día que se planifica". Si necesita ver otro acto para entenderlo = FALLA.
2. **Los handoffs se leen como TRANSFORMACIÓN, no como reset.** En J1/J2/J3, el elemento compartido (hilo→chips→columna→nib) se ve mutar; nunca hay un corte ni un crossfade plano que parezca "otra animación". Un chip que se pierde sin destino, o un cambio que parece recargar = FALLA. (research §3-B.)
3. **Ningún label cruza un trazo/eje.** En I: ningún callout toca el ink (ticks líderes hairline). En III: ningún glifo de evento entra en `x<180` desktop / `x<140` mobile. Un label sobre la curva o el eje = FALLA.
4. **AA en todo el texto, incluido el texto de las burbujas IA.** Texto burbuja entra en `text-secondary` (≥AA sobre surface-raised) y asienta en `text-primary`; "IA" support sobre raised (5.4:1, pasa). Labels mono `text-tertiary` (5.21:1). Verificar contraste en el frame estático y en el peor frame del tipeo. Un texto < AA = FALLA.
5. **Nunca lienzo en blanco, JAMÁS.** Pausando en cualquier ms de cualquier junta (J1/J2/J3) o del solape de reset, hay al menos un elemento del acto entrante ya renderizado. Un frame vacío entre actos = FALLA.
6. **El ciclo es calmo, no ansioso.** 21.6s totales, 6.6s por acto, handoffs de 600ms; tensión-y-suelta dentro de cada acto (no monotonía, no frenesí). Si el loop "apura" o cansa en 2–3 repeticiones = FALLA. (research §3 cadencia.)
7. **Disciplina de color y axe cero.** Por acto: máx 1 ✦, 1 gesto rosa-narrativo (los usos de §4.1), 0 glow/lila/gradiente/neón. `axe-core` = 0 violaciones serias/críticas. El indicador es el único support transversal. Una gota de color fuera de contrato, o cualquier violación axe = FALLA. (design.md §6.)

---

## 8. Notas de implementación

### 8.1 Arquitectura de componentes

```
<HeroTriptych>                      // dueño del reloj global T, useInView, isMobile, parity A/B
  <ActIndicator activeAct={…} />    // 01/02/03, HTML, z50
  <svg viewBox="0 0 480 520">       // UN escenario SVG compartido (mismo viewBox los 3 actos)
    <AmbientLayer />                // z0, loops propios, persiste todo el tríptico
    <ActOne   t={actI.t}   .../>    // espina, moments, caída, rescate (deriva de T)
    <ActTwo   t={actII.t}  .../>    // constelación, deriva, drag
    <ActThree t={actIII.t} .../>    // timeline, IA-resumen, Órbita
  </svg>
  <NarrativeOverlay>                // z30+ HTML: labels, pill IA, burbuja, cursor, subrayador
    … por acto, montado/desmontado por banda de T (con solape en juntas)
  </NarrativeOverlay>
</HeroTriptych>
```

- **UN escenario SVG** (no tres SVGs apilados): garantiza que los shared-elements (chips) puedan morfear sin remount entre actos — clave para J1/J2 (research §3-B). Los actos son sub-grupos `<g>` cuya visibilidad/opacity se cruza en las bandas de handoff.
- Cada acto se monta cuando `T` entra en su banda **menos el solape** y se desmonta al salir **más el solape**, para cubrir el handoff. En la práctica: los tres actos pueden estar montados pero con opacity 0 fuera de su banda (más simple y SSR-estable que montar/desmontar).
- El cursor "tú", la pill IA y la burbuja son **componentes compartidos** (`<CursorTu>`, `<AiPill>`, `<AiBubble>`) instanciados por el acto activo con sus props de trayectoria/texto — NO se reimplementan por acto (canon §3a/3b).

### 8.2 Qué se reutiliza de `HeroThread.tsx` (existente)

`HeroThread.tsx` ya implementa Acto I como pieza autónoma (loop 13.2s). Migración:
- **Se conserva**: hooks `useMomentStyle`, `useWriteOn`; los glyphs (`NoteGlyph`, `EnvelopeGlyph`, `ClockGlyph`, `EyeGlyph`, `NewNoteGlyph`); `Moment`, `ThreadLabel`, `RetakeLabel`; `AmbientChip`; `MAIN_PATH`/`RESCUE_ARC`/`RESCUE_CLOSE`/`CHECK_PATH`; el patrón `makePhases(loopMs)`; el truco SSR de divisiones inline (no closures — ver comentario en el archivo sobre el bug de Turbopack); pause-offscreen con `useInView`; reduced-motion pin a frame.
- **Se refactoriza**: `LOOP_MS` 13200→ Acto I ahora es una **banda de un reloj global** (segmento [0,0.333] de `T` sobre 21600ms); `makePhases` se reescribe contra los ms de `acto-1-hilo.md` §2 (6 600+600), NO contra los 13.2s del directors-cut.
- **Se añade nuevo**: `<CursorTu>`, `<AiPill>`, `<AiBubble>` (canon §3a/3b — Acto I los necesita ahora; reemplazan el "círculo de rescate" del v1 que el spec ya derogó), `<ActTwo>`, `<ActThree>`, `<ActIndicator>`, `<AmbientLayer>` global, y la lógica de morph de juntas J1/J2/J3.
- **Se elimina/deroga**: el "círculo de rescate" como corazón de Acto I (sustituido por la secuencia IA→cursor→click, `acto-1-hilo.md` §4); el loop standalone de 13.2s.

### 8.3 Plan de test

**Vitest (lógica determinista, sin render de animación):**
- `makePhases`/mapeo de bandas: aserciones de que `actI.t`, `actII.t`, `actIII.t` clampan correctamente en los bordes 0.333/0.667 y que los solapes de handoff se solapan (no hay gap entre fin de banda N y arranque de banda N+1).
- Canon de monogramas: una constante `CLIENTS = { A:'Ana', M:'Marta', L:'Lucía', D:'Diego', … }` testeada para que los textos de burbuja nombren al cliente correcto por acto (asegura quality bar §3-canon).
- Conteo de support/✦: test que cuente, por acto, los nodos con `--color-support` activos en un frame dado ≤ contrato §4.1, y que `--color-highlight` solo aparezca como fondo de texto (nunca borde/dot).
- Reduced-motion: con `prefers-reduced-motion`, `T` fijo y un solo frame (Acto I resuelto); aserción de que pill/burbuja/cursor/check/subrayador están presentes y estáticos.

**Playwright (beats a screenshot — visual regression):**
- Por acto, screenshot en el ms del clímax: I@6 250 (click), II@5 250 (agarre), III@5 550 (click). Comparar contra baseline.
- **Juntas (el criterio más importante)**: screenshot en el punto medio de cada handoff — J1@7 200, J2@14 400, J3@21 600 — y aserción de que el canvas NO está vacío (presencia de ≥1 elemento del acto entrante). Cubre quality bar §5.
- Indicador de acto: screenshot en cada banda; aserción de que el dot activo coincide con el acto en pantalla.
- Mobile (<lg viewport): screenshot del frame resuelto de Acto I; aserción de viewBox ~360×420 y de que el indicador muestra `01` activo.
- `axe-core` (vía `@axe-core/playwright`) sobre el hero montado: 0 violaciones serias/críticas (quality bar §7).

---

## 9. Tabla maestra de "Decisiones de integración"

| # | Tema | Conflicto entre specs | DECISIÓN (autoridad del integrador) |
|---|---|---|---|
| D1 | Reloj maestro | I/III reloj único vs II "reloj propio" | UN `T` global sobre 21.6s; cada acto deriva `t` local por banda. |
| D2 | Ciclo total | directors-cut 13.2s (Acto I standalone) | 21.6s = 3×7.2s. Acto I se comprime a 7.2s; manda `acto-1-hilo.md`. |
| D3 | J1 nº chips | "5–6" (ambiguo) | Exactamente 6: M A L J S R. |
| D4 | J1 ambient | "2 ambient se integran" vs constelación de 6 | Los 2 ambient (A,M) se reabsorben en homónimos; entrega neta = 6, no 8. |
| D5 | J2 x columna | II `x≈40` vs III `x=96` | x=96 (manda III, holgura de texto). |
| D6 | J2 eje width | II 1.5 vs III 1.25 | 1.25. |
| D7 | J2 nº filas | II 6 chips vs III 5 filas | 5 máx: A/M/L migran, J/S/R se despiden, D + ✦IA nacen en III. |
| D8 | J3 cold start | III entrega nib viva vs I "ambient-only" | I recibe nib viva en (96,108) a ~6%; se deroga el ambient-only standalone. |
| D9 | Ambient persistencia | ¿persisten? ¿se transforman? | Capa de fondo continua todo el tríptico (z0); no devienen protagonistas. |
| D10 | Monograma M | II "Marcos" vs I/III "Marta" | Marta en todo el tríptico. |
| D11 | Clientes en riesgo | I=Marta, II=Lucía | Variedad deliberada (refuerza "pasa siempre"); burbujas nombran correcto. |
| D12 | Marta en Acto III | — | Intencional: la IA cierra el día recordando retomar a Marta (cierra arco de I). |
| D13 | Cursor spring | III stiff~180 vs I/II 220 | 220 / damping 26 en los 3 actos. |
| D14 | Click ring | II `.4→1.4`@.6, III `.4→1.6`@.5 vs I `.3→1.6`@.9 | `.3→1.6` / `opacity .9→0`, ink, 250ms STANDARD. |
| D15 | Texto "IA" color | III "ink" vs I/II "support" | Support, toda la pill coherente. |
| D16 | Typing speed | III 34ms vs I/II 32ms | 32ms/char. |
| D17 | ✦ en Acto III | pill ✦ IA + ✦ en texto = 2 | Pill rotula "IA" (sin ✦); única ✦ al final del texto. |
| D18 | "un solo ✦" alcance | ¿por acto o por tríptico? | Por acto (3 totales, nunca simultáneos). |
| D19 | Highlight en Acto II | — | Acto II SIN highlight (no hay texto-CTA que subrayar); correcto. |
| D20 | Indicador support | regla de color | Dot del indicador es chrome transversal; no cuenta contra "1 rosa/acto". |
| D21 | Variancia A/B | ¿sobrevive al tríptico? | Solo en Acto I, simplificada; II/III deterministas. |
| D22 | Reduced-motion | ¿qué frame? | Frame resuelto del Acto I (carga la promesa completa). |
| D23 | Mobile | ¿tríptico vs Acto I? | Solo Acto I vertical + indicador estático; loop 7s. Tríptico mobile descartado. |
| D24 | SVG stage | ¿3 SVG vs 1? | UN escenario SVG compartido (permite morph de chips sin remount). |
| D25 | Reset Acto I | "círculo de rescate" del v1 | Derogado; corazón = secuencia IA→cursor→click (canon §3a/3b). |

---

*Partitura viva. Cambios significativos: commit `docs(motion): …`. Esta partitura manda sobre los specs de acto en todo lo transversal (juntas, mobiliario compartido, color, reloj, ciclo, mobile, reduced-motion). Los specs de acto mandan en su detalle interno (timeline ms-precisa, layout de coords, geometría de glyphs).*
