# Prompts para Stitch 2.0 · validación de dirección visual

> F2 · apoyo a Etapa 3 (vibe-design §4.3: "usar Stitch para visualizar 2-3 direcciones antes de elegir").
> 3 prompts multi-screen (Hero + Pricing + Features) para las direcciones finalistas:
> **#3 Papel anotado**, **#4 Keynote cálida**, **#5 Producto-vivo cálido** (ver `direcciones.md`).
> Objetivo: visualizar y decidir. El código de Stitch NO se copia al proyecto (brief C2): es referencia.

## Cómo sacarles el máximo (buenas prácticas Stitch 2.0, mar-2026)

1. **Pegá el prompt completo de una sola vez** para la primera pasada (genera las 3 pantallas conectadas con design system compartido). Stitch 2.0 genera hasta 5 pantallas enlazadas por prompt.
2. **Usá el modo de mayor calidad** (experimental/agent) si tu cuenta lo ofrece: respeta mejor el detalle.
3. **Iterá de a UN cambio** después ("oscurecé el header", "mové el tier Pro al centro"). NO digas "arreglá todo".
4. **Para forzar consistencia entre pantallas:** seleccioná las 3 con shift-click y aplicá el bloque PALETA+TIPOGRAFÍA como theme prompt. (Opcional avanzado: pegá el bloque de tokens como `DESIGN.md` en el workspace.)
5. Los hex son el objetivo visual (derivados de los OKLCH de `direcciones.md`). Las fuentes llevan **fallback de Google Fonts** por si Stitch no tiene la principal.

---

## PROMPT 1 — Dirección #3 "Papel anotado" (Brutal cálido)

```text
Diseña una landing B2B de 3 pantallas conectadas (mismo design system) para "Tendr",
un mini-CRM con IA para perfiles junior de B2B (customer success, account managers,
consultores). Voz de marca: confiable, ágil, cercana, SIN jerga corporativa.
Copy en español. Pantallas: 1) Hero, 2) Features, 3) Pricing.

ESTÉTICA: "Editorial Brutalism cálido / blueprint anotado" estilo Stripe Press +
Syllabus.io. Sensación de papel imprenta, esquinas duras y anotaciones a mano que
guían al usuario como si fuera un manual premium.

PALETA (hex, con rol):
- Fondo (papel cream): #FAF6EC
- Texto principal (tinta cálida casi negra): #211A13
- CTA primario (amber glow con borde tinta de 1px): #F4C24A
- Acento (terracota, para borders-left de jerarquía): #C4623A
- Estado OK / datos del producto (teal): #2F6B65

TIPOGRAFÍA:
- Titulares: fuente sans pesada y de carácter tipo "Clash Display" (fallback:
  "Space Grotesk" 700). Tracking apretado (-0.02em).
- Cuerpo: "Hanken Grotesk" 400, tamaño grande 20px, line-height 1.6.
- Metadata / labels: "JetBrains Mono" en MAYÚSCULAS, tracking suelto.

LAYOUT POR PANTALLA:
- HERO: titular pesado a la izquierda + una LISTA NUMERADA editorial (01, 02, 03 en
  caja mono) con los beneficios, NO tarjetas. A la derecha, un faux-UI del CRM
  (pipeline de clientes en columnas) con HARD SHADOW de 4px 4px SIN blur y esquinas
  de 0px. Una flecha SVG dibujada a mano (estilo Excalidraw) apunta desde una nota
  al margen hacia el CTA amber.
- FEATURES: bloques editoriales apilados separados por hairline de 1px y border-left
  terracota, cada uno con un mini faux-UI a un lado y una anotación hand-drawn
  (círculo o subrayado sketched) sobre el detalle clave. Ritmo variado, no repetido.
- PRICING: 3 tiers en columnas con esquinas 0px y hard shadow. Free (3 clientes),
  Pro 9€/mes (clientes ilimitados + IA), Team 29€/mes con badge "Próximamente". El
  tier Pro va destacado con border-left terracota más grueso.

CARACTERÍSTICO (no lo pierdas): esquinas 0px en todo (solo 4px en el CTA), hard drop
shadows sin blur, listas numeradas editoriales en vez de grids de cards, anotaciones
hand-drawn que enseñan, labels en mono uppercase, body grande de 20px.

NO HAGAS (negative instructions): sin glassmorphism ni blur; sin grid de 3 columnas
con iconos arriba; sin gradientes morados ni azul-violeta de IA; sin tipografía Inter;
sin sombras negras con blur; sin emojis como iconos; sin datos perfectos falsos
(usa cifras realistas); sin em-dashes en el copy.
```

---

## PROMPT 2 — Dirección #4 "Keynote cálida" (Tech vibrante)

```text
Diseña una landing B2B de 3 pantallas conectadas (mismo design system) para "Tendr",
un mini-CRM con IA para perfiles junior de B2B. Voz: confiable, ágil, con energía,
SIN jerga corporativa. Copy en español. Pantallas: 1) Hero, 2) Features, 3) Pricing.

ESTÉTICA: "Dark Editorial con momento Aurora cálido" estilo Linear + Vercel pero con
un hero de energía de keynote. Base oscura premium, UN gran momento de gradiente vivo
cálido. Disruptivo pero profesional, nunca hype frío.

PALETA (hex, con rol):
- Fondo (carbón cálido, NO negro puro): #1A160F
- Texto principal (off-white cálido, NO blanco puro): #EFECE4
- CTA primario (coral vivo): #EE6A3C
- Glow / acento luminoso (amber): #F6C244
- Tercer color SOLO para el gradiente del hero (rosa-magenta cálido): #E85F74

TIPOGRAFÍA:
- Titulares: sans geométrica con carácter tipo "General Sans" 700 (fallback:
  "Space Grotesk"). 
- Cuerpo: "Geist" 400 (fallback: "Figtree" 400).
- Metadata / badges: "JetBrains Mono".

LAYOUT POR PANTALLA:
- HERO: fondo carbón con un GRADIENTE MESH animado/fluido que barre coral -> amber ->
  rosa cálido (jamás morado) detrás del titular off-white. A la derecha, faux-UI del
  pipeline del CRM con edge-glow coral sutil en los bordes activos. Incluye un contador
  de métrica "en vivo" como prueba social (ej. "12.480 clientes gestionados"). CTA
  coral sólido + secundario outline. Pensado para que al scrollear el hero se quede
  fijo y se desvanezca mientras la sección siguiente emerge desde atrás (transición de
  profundidad).
- FEATURES: BENTO GRID asimétrico (celdas de distinto tamaño, NO columnas iguales).
  Cada celda muestra un mini faux-UI del producto (pipeline, IA que marca un cliente
  en riesgo, reporte) con un sutil glow en hover. Una celda full-width rompe el ritmo.
- PRICING: 3 tiers sobre carbón. Free (3 clientes), Pro 9€/mes (ilimitado + IA),
  Team 29€/mes con badge "Próximamente". El tier Pro destacado con borde coral
  luminoso y leve glow.

CARACTERÍSTICO (no lo pierdas): el gradiente vivo cálido como firma del hero,
edge-glow en elementos activos, contador en vivo, bento asimétrico con demos del
producto dentro de las celdas, transición de profundidad entre hero y sección 2.

NO HAGAS (negative instructions): sin glassmorphism ni frosted blur; sin grid de 3
columnas iguales con iconos arriba; sin gradiente morado / violeta / azul-IA (solo
cálidos); sin tipografía Inter; sin negro puro #000 ni blanco puro #FFF; sin emojis
como iconos; sin cifras perfectas falsas; sin em-dashes en el copy.
```

---

## PROMPT 3 — Dirección #5 "Producto-vivo cálido" (Híbrida)

```text
Diseña una landing B2B de 3 pantallas conectadas (mismo design system) para "Tendr",
un mini-CRM con IA para perfiles junior de B2B. Voz: confiable, ágil, cálida, SIN
jerga corporativa. Copy en español. Pantallas: 1) Hero, 2) Features, 3) Pricing.
Genera la versión en MODO CLARO CÁLIDO (el sistema tiene un gemelo oscuro espejado).

ESTÉTICA: "Producto-vivo cálido". Cruce de papel premium editorial (cálido, legible)
con la nitidez de Linear, donde el HÉROE VISUAL es una ilustración del pipeline del
CRM que cuenta el producto sin tour ni screenshot. Disruptivo pero profesional.

PALETA (hex, con rol, modo claro):
- Fondo (cream cálido): #F9F5EC
- Texto principal (tinta cálida): #241C14
- CTA primario (coral/ember, constante en claro y oscuro): #DF6A40
- Glow / acento (amber): #F0BD4C
- Estado OK / datos del pipeline (teal apagado): #3A7D76
- (Gemelo oscuro de referencia: fondo #1B160F, texto #ECE7DF, mismo coral)

TIPOGRAFÍA:
- Titulares: sans de carácter tipo "Clash Display" 600 (fallback: "Space Grotesk").
- Cuerpo: "Hanken Grotesk" 400/500.
- Metadata / labels del pipeline: "JetBrains Mono".

LAYOUT POR PANTALLA:
- HERO: cream con titular Clash a la izquierda y un blob de gradiente coral/amber muy
  sutil de fondo (ambiente, no protagonista). A la derecha, el faux-UI del PIPELINE
  del CRM mostrado CASI VACÍO (1-2 clientes), como punto de partida de una narrativa.
  CTA coral sólido + secundario outline.
- FEATURES: bento con ritmo (mezcla celda full-width + celdas asimétricas, nunca 3
  iguales). El hilo conductor es el MISMO pipeline del hero pero ahora POBLÁNDOSE:
  una card de cliente se mueve de columna ("Nuevo" -> "En seguimiento"), la IA resalta
  un cliente "en riesgo" con un badge teal, aparece un mini-reporte. Cada celda avanza
  el estado del pipeline (sensación de que el producto cobra vida al bajar).
- PRICING: 3 tiers sobre cream, esquinas suaves consistentes. Free (3 clientes),
  Pro 9€/mes (ilimitado + IA), Team 29€/mes con badge "Próximamente". Pro destacado
  con borde coral y leve elevación.

CARACTERÍSTICO (no lo pierdas): el PIPELINE como protagonista que evoluciona de vacío
(hero) a lleno (features), card que cambia de columna, IA marcando cliente en riesgo,
acento coral constante en ambos modos, calidez de papel + nitidez de producto.

NO HAGAS (negative instructions): sin glassmorphism ni blur; sin grid de 3 columnas
iguales con iconos arriba; sin gradientes morados / violeta / azul-IA; sin tipografía
Inter ni serifs tipo Fraunces; sin negro/blanco puros; sin emojis como iconos; sin
cifras perfectas falsas; sin em-dashes en el copy.
```

---

## Después de generar

1. Captura el Hero de cada dirección y pégalo en `docs/moodboard/` (ej. `stitch-dir3-hero.png`).
2. Compará las 3 con criterio: ¿cuál encaja mejor con "confiable, ágil, sin corporativismo" Y tu deseo de disruptivo-premium?
3. La elección final va a `exploration/decision.md` (firma humana, brief C2). Después destilo a `design.md` (F3).

Sources de buenas prácticas Stitch 2.0:
- [Stitch Prompt Guide · Google AI Developers Forum](https://discuss.ai.google.dev/t/stitch-prompt-guide/83844)
- [Google Stitch multi-screen · Pash](https://heypash.com/blog/google-stitch-multi-screen-wireframing-job)
- [Stop Generating AI Slop: Developer's Guide to Google Stitch · DEV](https://dev.to/seifalmotaz/stop-generating-ai-slop-the-developers-guide-to-google-stitch-jen)
- [What Is Google Stitch's DESIGN.md File · MindStudio](https://www.mindstudio.ai/blog/what-is-google-stitch-design-md-file)
