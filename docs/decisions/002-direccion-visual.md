# ADR-002 · Dirección visual

- **Estado:** Aceptado
- **Fecha:** 2026-05-31
- **Fase:** F2 (Clase 2)

## Contexto

F2 es la exploración visual de Tendr (landing de un mini-CRM B2B con IA para
perfiles junior; voz confiable, ágil, sin corporativismo). Se curaron 5
referencias premium (`docs/moodboard/referencias.md`), se analizaron visualmente
(`docs/moodboard/analisis.md`) y se propusieron 5 direcciones
(`docs/moodboard/direcciones.md`), con opción de validar en Stitch 2.0
(`docs/moodboard/stitch-prompts.md`). El tono destilado del análisis fue
**"Producto-vivo cálido"**. Hay que fijar UNA dirección antes de destilar el
`design.md` en F3.

## Decisión

Se elige la **Dirección #3 "Papel anotado"** como base, con dos modificaciones
explícitas sobre la propuesta original. El criterio del usuario fue
deliberado: **hacer algo diferente** a lo esperado en el sector CRM.

### Base

**Editorial Brutalism / Paper Brutalism cálido** (catálogo §2.1) + anotaciones
**Notebook hand-drawn** (§2.10) — combinación testada A (§3.2): papel imprenta,
esquinas duras, listas numeradas editoriales y anotaciones a mano que guían al
usuario como un manual premium.

### Modificación 1 — Motion level: WOW

Sube de "medio" a **wow**, pero gobernado por el motion budget (§1.4): **1 solo
momento wow + 3-5 de carácter + resto micro**. El momento wow es un
**scrollytelling editorial** (sticky pin, §6.4): al entrar a la sección clave,
las anotaciones hand-drawn se **dibujan solas** (draw-in por `stroke-dashoffset`,
§6.2) y el faux-UI del pipeline del CRM **cobra vida** (card que cambia de
columna, IA marcando un cliente en riesgo) — la firma narrativa heredada de la
dirección #5. Es narrativa, no decoración.

### Modificación 2 — Toques visuales tipo Anthropic

Refinar el papel brutalist hacia la calidez editorial de **Anthropic**: cream
más suave (menos póster, más papel de libro), acento **clay/coral** alineado con
el naranja de Claude, y **washes de gradiente cálido ambient** sutiles (§6.10) en
lugar de blobs aurora fríos. Aporta refinamiento premium sin perder el carácter.

### Spec concreto

**Paleta (OKLCH, con rol):**
- `--color-surface` (cream papel): `oklch(0.97 0.015 90)`
- `--color-text-primary` (tinta cálida casi negra): `oklch(0.18 0.020 50)`
- `--color-accent-primary` (CTA amber glow, borde tinta 1px): `oklch(0.85 0.13 88)`
- `--color-accent-secondary` (clay/coral, borders-left y wash, tono Anthropic): `oklch(0.62 0.15 38)`
- `--color-success` (estado OK / datos del pipeline, teal): `oklch(0.48 0.07 185)`

**Tipografía** (reglas §1.5, todo open-source): display **Clash Display** 600/700
(fallback Space Grotesk), body **Hanken Grotesk** 400 @ 20px, mono **JetBrains
Mono** uppercase para metadata. Sin Inter, sin Fraunces/Instrument Serif.

**Easings** (definir en `globals.css`, §4.4): `--ease-out` reveals,
`--ease-snap` para pop-ins brutalist, `--ease-expo` para el único momento wow.
Todo bajo `prefers-reduced-motion`.

**Firmas estructurales:** esquinas 0px (4px solo en CTA), hard drop shadow
`4px 4px` sin blur dosificado en piezas clave, listas numeradas editoriales en
vez de grids de cards, anotaciones hand-drawn que enseñan.

## Tradeoffs

Una frase por dirección descartada (de `direcciones.md`):

- **#1 "Carbón con brasa":** descartada porque roza el registro oscuro/sobrio que
  el usuario rechazó explícitamente en el análisis.
- **#2 "Hoja de ruta":** descartada por leer demasiado segura y plana, sin la
  firma diferencial que se busca.
- **#4 "Keynote cálida":** descartada como base por el riesgo declarado de
  "AI-hype" del gradiente, aunque se hereda su motion wow y el wash cálido.
- **#5 "Producto-vivo cálido":** descartada como base por ser la opción esperada
  del tono ya acordado, pero se hereda su firma del pipeline narrativo dentro
  del #3.

## Consecuencias

### Positivas

- Diferenciación real: casi ningún CRM va por papel editorial, y la calidez encaja
  con el público junior y la voz sin corporativismo.
- Recombina lo mejor de las descartadas: pipeline narrativo (#5), wash cálido (#4),
  sin sumar librerías ni romper el sistema.
- Los toques Anthropic dan refinamiento premium sin pelearse con el cream brutalist
  (comparten temperatura cálida y acento clay/coral).

### Costes y trade-offs

- La densidad editorial del Paper Brutalism pelea con mobile (§2.1 "cuándo no usar"):
  exige diseño mobile cuidado, no un downscale.
- Motion WOW sobre una estética serena de papel es una tensión: hay que dosificar
  (1 wow, §1.4) o rompe la calma; riesgo real de over-motion.
- Hard shadows brutalist vs suavidad Anthropic: hay que decidir dónde aplica cada
  uno y bloquear esa regla (shape/shadow consistency), no mezclar al azar.
- Las anotaciones hand-drawn mal hechas se ven amateur: se producen con criterio
  (pipeline de ilustración), no a mano alzada en SVG.
- Anthropic no estaba en el moodboard original: referencia añadida en la decisión,
  a validar al destilar el sistema.

### Seguimiento

- Destilar a `docs/design.md` + `docs/design-spec-visual.md` (F3, vibe-design §4.4–4.5).
- Definir tokens y easings en `app/globals.css` (Tailwind v4 `@theme`).
- Producir las anotaciones hand-drawn y el faux-UI del pipeline como piezas.
- (Opcional) visualizar en Stitch con el prompt #3 antes de cerrar el `design.md`.

## Referencias

URLs del moodboard con qué inspiró cada una (`referencias.md` + `analisis.md`):

- **Attio** — https://attio.com — faux-UI del producto como protagonista visual y
  la mecánica de reveal del hero; base del pipeline que cobra vida.
- **Linear** — https://linear.app — estilo de ilustración crafted, restraint y
  jerarquía por peso tipográfico.
- **Cal.com** — https://cal.com — step-cards numeradas con mini-ilustración y
  numeración editorial (entra en las listas numeradas del #3).
- **Notion** — https://notion.so — calidez de voz e ilustración hand-drawn cálida;
  el tono humano que ancla las anotaciones.
- **Stripe** — https://stripe.com — legibilidad y gradiente vivo, aquí reducido a
  un wash cálido ambient.
- **Anthropic** — https://anthropic.com — cream cálido refinado, acento clay/coral
  (naranja de Claude) y tipografía editorial. *Añadida en la decisión; no estaba en
  el moodboard.*

Artefactos internos: `docs/moodboard/analisis.md`, `docs/moodboard/referencias.md`,
`docs/moodboard/direcciones.md`. Catálogos del sénior: estilos §2.1, §2.10, §3.2(A);
motion §1.4, §6.2, §6.4, §6.10, §4.4.
