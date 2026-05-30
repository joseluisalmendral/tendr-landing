# Vibe design con referencias · método práctico para landing premium

> Documento compartido del equipo. Define el flujo **PRINCIPAL** (recomendado) para producir un `design.md` y un spec visual ejecutable que lleven a una landing premium **sin sobre-ingeniería**. Lo usan F2 (exploración + análisis visual) y F3 (destilación + spec visual) de L16. Para técnica forense profunda (Playwright + extracción runtime + bundle sniffing + dembrandt + rrweb), ver `pipeline-extraccion-premium.md` como aside avanzado opcional.

**Audiencia:** sénior preparando la lección + alumno siguiéndola en producción real.
**Objetivo:** alcanzar resultado premium con criterio en **2-4 h totales** (no 2-3 días). Aplicar el patrón "vibe design" 2026: curar referencias, analizar visualmente con LLM, decidir direcciones, construir con componentes premium del ecosistema (21st.dev Magic MCP + Aceternity + Skiper + shadcn).

**Identificador:** `M5-COMPARTIDO-VIBE-DESIGN-REFERENCIAS`.

**Modelo de trabajo:** 80% agente, 20% alumno. El alumno cura referencias, valida direcciones y aporta criterio editorial; el agente analiza, propone y mapea a componentes concretos del catálogo.

---

## 1. Por qué este método existe

### 1.1 Vibe design vs técnica forense

En 2026 los expertos NO destripan competidores para inspirarse. Lo que hacen los buenos diseñadores y design engineers cuando arrancan una landing premium:

1. Curan 3-7 referencias visuales (URLs o screenshots).
2. Las pegan a Claude/v0/Lovable como moodboard con descripción del producto.
3. La IA propone direcciones con constraints tipo "en el estilo de Stripe marketing" o "tipografía Swiss International Style".
4. Generan en batch (5-10 opciones por dirección), seleccionan 3, refinan.
5. Construyen con componentes premium ya hechos (21st.dev Magic MCP + Aceternity + shadcn).

El pipeline forense profundo (Playwright + bundle sniffing + dembrandt) es excelente pedagógicamente y para auditar competidores con rigor, pero **no es necesario** para alcanzar resultado premium en una landing propia.

### 1.2 Lo que NO se logra con prompts genéricos a Claude

Pedirle a Claude "diseña una landing premium para mi SaaS" produce resultado genérico de IA. Lo que diferencia un resultado premium de uno mediocre:

- **Tipografía con criterio**, no la default de Tailwind.
- **Paleta con lógica observable**, no 5 colores aleatorios.
- **Micro-interactions intencionales**, no animaciones decorativas.
- **Jerarquía clara y contraste alto** entre secciones, no scroll uniforme.
- **Motion con propósito**, no para todo.
- **Componentes con detalle**, no shadcn base sin tocar.

Para conseguir esto necesitas **constraints concretos** sacados de referencias reales + componentes premium curados + criterio del alumno validando cada paso.

### 1.3 Cuánto método basta

Este flujo se ejecuta entero en 2-4 h. Si el alumno quiere más rigor (auditar tokens computados, mapear animaciones runtime con timestamps), puede subir al pipeline forense. La mayoría no lo necesita.

---

## 2. Resultado esperado

Al completar el método, el alumno tiene tres artefactos:

```
docs/
├── moodboard/
│   └── referencias.md          ← 3-7 refs curadas con screenshots + por qué cada una
├── design.md                   ← tokens, voz, principios, negative instructions
└── design-spec-visual.md       ← componente concreto + motion level por sección
```

Listo para empezar a construir componentes en F4.

---

## 3. Reparto IA vs alumno

| Acción | Quién | Por qué |
|---|---|---|
| Decidir qué 3-7 sites referencia entran al moodboard | Alumno | Criterio editorial, no automatizable |
| Tomar screenshots o anotar URLs | Alumno | 5 min de copia-pega, no merece gasto de tokens |
| Por cada referencia, anotar 3 cosas que te gustan | Alumno | El agente no tiene gusto subjetivo |
| Analizar cada referencia visualmente (paleta, tipo, jerarquía, motion percibido) | **Agente** | Claude tiene visión; lectura estructurada es su terreno |
| Cruzar 3-7 análisis e identificar patrones por intersección | **Agente** | Lo hace mucho mejor que el alumno bajo presión |
| Proponer 5 direcciones visuales en batch | **Agente** | Generación divergente es su fuerte |
| Elegir una dirección y aportar matices | Alumno | Decisión de producto |
| Destilar a `design.md` con tokens, voz, principios | **Agente** | Aplica reglas del catálogo (§7) y de sustitución tipográfica |
| Mapear sección a sección a componente concreto del catálogo + motion level | **Agente** | Conocimiento estructurado del catálogo + 21st.dev Magic MCP |
| Validar cada sección del spec visual antes de construir | Alumno | Decisión de producto |

**Lo que el alumno NUNCA delega:**

1. Elegir qué referencias entran al moodboard.
2. Decidir la dirección final cuando el agente propone 5.
3. Validar el `design-spec-visual.md` sección a sección.

**Lo que el agente NUNCA hace solo:**

1. Decidir el dominio o el tono del producto.
2. Sustituir referencias del alumno por sus propias sugerencias sin avisar.
3. Saltarse la validación humana entre direcciones.

---

## 4. Las 5 etapas del método

### 4.1 Etapa 1 · Curaduría de referencias (alumno, 20-40 min)

Elegir 3-7 sites referencia. Menos de 3 lleva a mimetismo. Más de 7 a parálisis.

**Fuentes recomendadas (verificadas 2026-05):**

| Fuente | Foco | URL |
|---|---|---|
| **Godly.website** | Sites curados con look premium | `godly.website` |
| **Lapa Ninja** | Landings con motion y diseño moderno | `lapa.ninja` |
| **Mobbin** | Apps móviles + web premium curadas | `mobbin.com` |
| **Curated.design** | Selección editorial diaria | `curated.design` |
| **SiteInspire** | Galería curada con filtros temáticos | `siteinspire.com` |
| **Land-book** | Landings exclusivamente | `land-book.com` |
| **Awwwards SOTD** | Site of the Day (cuidado, mucho efecto sobre función) | `awwwards.com` |
| **Savee.it** | Moodboards de diseñadores top | `savee.it` |
| **Figma Community Libraries** | UI kits, design systems abiertos y templates Figma para estudiar cómo se estructuran tokens, variants y naming (Untitled UI, Material 3, Apple HIG, Geist…) | `figma.com/community/libraries` |

**Referencias direct URL conocidas (atajos confiables):**

- `linear.app`, `vercel.com`, `cal.com`, `stripe.com`, `pomelo.la`, `attio.com`, `tella.tv`, `mintlify.com`, `arc.net`, `pitch.com`, `notion.so`.

> **Live vs Figma kits.** Las galerías Godly/Lapa/Mobbin/Curated muestran sites en vivo; estudias cómo se ven y comportan. Figma Community Libraries son archivos Figma remixables; estudias cómo se construye el sistema por dentro (escala tipográfica, variants de componentes, naming). Cuando dudes de cuánta profundidad de tokens necesitas en tu `design.md`, bajar a una Library de Figma te da una vara clara.

**Por cada referencia, el alumno anota en `docs/moodboard/referencias.md`:**

```markdown
## <Nombre del site>

- URL: <url>
- Screenshot: <archivo.png en la misma carpeta>
- Lo que me gusta (3 bullets, 1 línea cada uno):
  - …
  - …
  - …
- Lo que NO quiero copiar (opcional, 1-2 líneas si aplica):
  - …
```

Sin scraping. Solo screenshot + texto del alumno.

### 4.2 Etapa 2 · Análisis visual con LLM (agente, 10-15 min)

El alumno pega al chat los screenshots curados (uno por referencia) + el contenido de `moodboard/referencias.md` + el `brief.md` del producto.

El agente analiza cada referencia con visión y produce un análisis estructurado por referencia + síntesis transversal. **No usa Playwright, no descarga assets.** Solo lectura visual con su capacidad multimodal.

Output del agente: `moodboard/analisis.md` con secciones por referencia y una final de síntesis.

El prompt canónico está en §6.1.

### 4.3 Etapa 3 · Propuesta de direcciones visuales en batch (agente, 20-30 min)

A partir del análisis transversal + el brief + las negative instructions del alumno, el agente propone **5 direcciones distintas** en una sola pasada. Cada una con:

- Nombre (ej. "Editorial sobrio", "Tech vibrante", "Documentary", "Brutalismo cálido", "Glass premium").
- Paleta tentativa (3-5 colores con valores OKLCH).
- Type pair (display + body, ambos open-source con justificación del carácter elegido).
- Motion level (none / sutil / medio / wow).
- Vibe en una frase ("documental serio con micro-detalles", "marketing energético con scroll-jacking suave").
- Sección hero descrita en 2 frases para que el alumno visualice.
- Referencias del moodboard que la inspiran.

El alumno **elige una** y opcionalmente combina elementos de otra. El prompt canónico vive en §6.3.

Opcional aquí: usar **Stitch 2.0** para visualizar 2-3 direcciones antes de elegir. Genera mock visual sin código, ayuda al alumno a decidir cuando duda entre 2 direcciones.

### 4.4 Etapa 4 · Destilación a `design.md` (agente, 30-45 min)

Con la dirección elegida + el moodboard + el brief, el agente destila a `docs/design.md`. Aplica reglas del catálogo §7 y de sustitución tipográfica (referenciada al pipeline forense §8 si existe equivalente más detallado).

`design.md` contiene: voz, tokens (color, tipografía, escala, espacio, radii, sombras, movimiento), principios, negative instructions, referencias.

Pausa de validación: antes de escribir el `design.md` completo, el agente resume en 5 líneas los patrones por intersección que detectó, para que el alumno valide la lectura.

El prompt canónico vive en §6.4.

### 4.5 Etapa 5 · Spec visual ejecutable por sección (agente, 30-45 min)

Aquí entra la pieza nueva. Con `design.md` cerrado + el brief, el agente produce `docs/design-spec-visual.md` que mapea **sección a sección** de la landing a componentes concretos del ecosistema + nivel de motion + animación trigger.

**Estructura del spec visual por sección:**

```markdown
## Hero

- **Componente base**: 21st.dev `<HeroSpotlight>` (búsqueda Magic MCP) o Aceternity `<HeroHighlight>`
- **Motion level**: medio
- **Animation trigger**: on-load con fade-in + stagger en CTA después
- **Por qué este**: encaja con dirección "Tech vibrante" del design.md, motion medio que da carácter sin distraer del CTA principal
- **Alternativas si el primero no encaja**: Skiper UI `<HeroLargeShowcase>` o construcción custom sobre shadcn
- **Tokens aplicables**: --color-bg, --color-fg, --color-accent, --type-display, --space-section

## Cómo funciona

- **Componente base**: Magic UI `<BentoGrid>` (3 columnas en desktop, stack en mobile)
- **Motion level**: sutil
- **Animation trigger**: on-scroll con Intersection Observer (fade-in + slide-up 20px)
- **Por qué este**: bento permite jerarquía visual sin texto excesivo, motion sutil para no robar atención
- **Tokens aplicables**: --space-grid, --radius-card, --shadow-soft

## Features
... (etc por cada sección de la landing)
```

El agente usa el **21st.dev Magic MCP** para buscar componentes semánticamente cuando no tiene uno claro del catálogo curado. Si Magic MCP no devuelve match útil, cae al catálogo curado (§7).

El alumno **valida sección a sección** antes de empezar a construir en F4. Si una propuesta no convence, el agente vuelve a proponer alternativas para esa sección sin tocar el resto.

El prompt canónico vive en §6.5.

---

## 5. Fuentes de referencias premium 2026

Ya las vimos en §4.1. Resumen rápido para tener a mano:

| Fuente | Cuándo usar |
|---|---|
| Godly, Lapa, Curated, SiteInspire, Land-book | Curación general por categoría |
| Mobbin | Si quieres mirar patterns mobile + web premium |
| Awwwards | Solo SOTD, evitar el resto (mucho efecto sobre función) |
| Direct URLs (Linear, Stripe, Cal, Pomelo) | Atajos cuando sabes que el site referencia es bueno |
| Savee.it | Moodboards ya hechos por diseñadores reconocidos |
| Figma Community Libraries | Cuando quieres estudiar cómo se construye un design system completo por dentro (tokens, variants, naming) y no solo cómo se ve por fuera |

**Regla de oro:** que las referencias tengan motivo de negocio similar al tuyo (B2B SaaS para B2B SaaS, etc.). Inspirarse de un site de portfolio de fotógrafo para un CRM es ruido.

---

## 6. Prompts canónicos

### 6.1 Análisis visual de UNA referencia (con screenshot pegado)

```text
Te paso el screenshot de un site referencia que estoy usando para inspirar mi
landing. URL: <url>. Tres cosas que me gustan según mi anotación: <bullets>.

Analiza VISUALMENTE el screenshot y produce un análisis estructurado:

1. Paleta percibida: 3-5 colores principales en OKLCH aproximado. Distingue
   neutro / primario / acento / fondo. Comenta saturación general (alta /
   media / baja) y temperatura (cálida / fría / neutra).
2. Tipografía percibida: display vs body. Carácter de cada uno (geometric
   sans humanista / neutral / humanist sans / display contrast alto /
   editorial serif). Tamaño relativo del display vs body.
3. Jerarquía y ritmo: contraste entre secciones (alto / medio / bajo).
   Espacio negativo (denso / generoso / extremo).
4. Motion percibido (deducción razonable): hay reveals on scroll? hay
   parallax? hay 3D o canvas? Indica solo lo que se puede inferir de
   estática + tu conocimiento de patrones premium 2026.
5. Componente o pattern destacable: 1-2 cosas que harían que este site
   destacara en un moodboard.
6. Equivalentes open-source de la tipografía detectada (si parece
   comercial). Aplica la tabla del pipeline forense §8.2 si la conoces.

Salida: bloque markdown estructurado, máximo 250 palabras.
```

### 6.2 Síntesis transversal (cuando hay 3-7 análisis hechos)

```text
Tengo N análisis visuales (uno por referencia) en moodboard/analisis.md.
Mi producto es <Tendr Landing, ver brief.md>. Mi vertical es <mini-CRM B2B
junior>.

Produce una síntesis transversal:

1. INTERSECCIÓN. Patrones que aparecen en ≥3 de las N referencias. Por
   cada uno: descripción + cómo se adapta a mi vertical.
2. ÚNICOS CON MOTIVO. Patrones únicos a una sola referencia que recomiendas
   incorporar igualmente. Explica por qué encajan con mi vertical aunque
   sean menos comunes.
3. NEGATIVE INSTRUCTIONS. 5-8 patrones que vi en las referencias pero NO
   debo usar porque NO encajan con mi vertical. Justifica cada uno.
4. RECOMENDACIÓN DE TONO. En una frase, qué tono visual encaja con mi
   producto entre los detectados (ej. "documental editorial con detalles
   tech", "marketing energético con micro-interacciones cálidas").

Salida: bloque markdown estructurado.
```

### 6.3 Propuesta de 5 direcciones en batch

```text
Con la síntesis transversal de moodboard/analisis.md + brief.md, propón
5 direcciones visuales distintas para mi landing. NO iteres una a una;
genera las 5 en una pasada.

Por cada dirección:

- Nombre evocador (2-3 palabras).
- Paleta: 4-5 colores en OKLCH con rol (neutro fondo, neutro fg, primario,
  acento, opcional 5to).
- Type pair: display + body, ambos open-source. Justifica el carácter.
- Motion level: none / sutil / medio / wow.
- Vibe en una frase.
- Sección hero descrita en 2 frases para que pueda visualizarla.
- Qué referencias del moodboard la inspiran (citar por nombre).

Reglas:
- Que las 5 sean realmente distintas, no variantes de la misma.
- 2 deben ser conservadoras (Editorial sobrio, Documental); 2 deben ser
  arriesgadas (Brutalismo cálido, Tech vibrante con motion wow); 1 puede
  ser híbrida.
- Ninguna debe sentirse "genérica de IA". Cada una debe tener un
  carácter declarado.

Salida: 5 bloques markdown.
```

### 6.4 Destilación a `design.md`

```text
Elegí la dirección "<nombre>" de la propuesta. Quiero que destiles a
docs/design.md aplicando estas reglas:

1. Voz: 3-5 bullets sobre cómo habla el producto visualmente.
2. Tokens en OKLCH (color), escala tipográfica (modular 1.250 por defecto),
   espacio (4/8/16/24/32/48/64/96), radii, sombras, movimiento (duración
   típica por categoría: micro, transición, énfasis).
3. Principios (3-5).
4. Negative instructions (las del análisis transversal + 2-3 nuevas si
   aplican a mi vertical).
5. Referencias (URLs del moodboard con qué inspiró cada una).

Antes de escribir, RESUME en 5 líneas los patrones por intersección que
detectaste, para que valide tu lectura. Después de mi confirmación,
escribes el design.md completo.

Para tipografía: usa exclusivamente fuentes open-source. Si la dirección
implicaba un tipo comercial, sustituye por equivalente open-source
(referencia tabla pipeline forense §8.2).
```

### 6.5 Spec visual ejecutable por sección

```text
Con docs/design.md cerrado, genera docs/design-spec-visual.md mapeando
sección a sección de mi landing a componentes concretos.

Secciones de mi landing (de plan.md o brief.md):
- Hero
- Cómo funciona
- Features
- Pricing (3 tiers)
- Testimonials
- FAQ
- Footer

Por cada sección, propón:

1. Componente base: con nombre exacto + librería (preferencia: 21st.dev
   Magic MCP → Aceternity → Skiper → Magic UI → Motion Primitives →
   construcción custom sobre shadcn). Usa Magic MCP para buscar
   semánticamente cuando no tengas uno claro del catálogo curado.
2. Motion level: ninguno / sutil / medio / wow. Coherente con el design.md.
3. Animation trigger: on-load / on-scroll / on-hover / on-focus. Y la
   técnica concreta (Intersection Observer, Motion variants, etc.).
4. Por qué este componente y no otro: 1-2 frases con motivo.
5. Alternativas si el primario no encaja: 1-2 fallbacks.
6. Tokens del design.md que aplica esta sección.

Reglas:
- Máximo 3 librerías distintas en total entre todas las secciones (sino
  se nota a la legua que es un Frankenstein).
- Sección hero puede tener motion wow; el resto debe ser ≤ medio.
- Footer siempre simple (motion none o sutil).
- Si Magic MCP no devuelve match útil para una sección, fallback al
  catálogo curado (§7 de este doc).

Salida: bloque markdown por sección, con la estructura de arriba.
Después espera mi validación sección a sección antes de cerrar el doc.
```

---

## 7. Catálogo de componentes premium (referencia rápida)

Versión condensada del catálogo. Detalle completo en `pipeline-extraccion-premium.md §10`.

| Librería | Fuerte en | Cuándo usar primero | URL |
|---|---|---|---|
| **21st.dev Magic MCP** | Búsqueda semántica + generación de 5 variantes pulidas | **Primera opción siempre** que el catálogo no tenga uno claro | `21st.dev/magic` |
| **Aceternity UI** | 200+ componentes con motion, glare cards, parallax | Hero, features con wow | `ui.aceternity.com` |
| **Skiper UI** | Smooth-scroll, interactive cards, micro-interactions | Cuando Aceternity y Magic no cubren | `skiper-ui.com` |
| **Magic UI** | Landings animadas, bento, gradient cards | Pricing, testimonials | `magicui.design` |
| **Motion Primitives** | Primitives sobre Motion (motion.dev) | Construir patterns propios | `motion-primitives.com` |
| **Animata** | Effects copy-paste open-source | Huecos puntuales sin instalar lib | `animata.design` |
| **shadcn/ui** | Base accesible | Cimientos siempre | `ui.shadcn.com` |

**Regla operativa:** máximo 3 librerías distintas en un proyecto. Más se nota a la legua porque cada una tiene su acento.

---

## 8. Cuándo subir al pipeline forense profundo

El flujo de este doc cubre 90% de los casos. Subir a `pipeline-extraccion-premium.md` cuando:

1. **El análisis visual te dejó dudas concretas que solo se resuelven con tokens computados.** Ej. "no estoy seguro de la saturación exacta del acento de Pomelo". Etapa 2 del forense te lo da.
2. **Vas a auditar un competidor para reverse-engineering**. Necesitás rigor forense, no inspiración.
3. **Estás migrando un design system legacy** y quieres extraer tokens exactos del sistema viejo.
4. **Querés aprender la técnica forense rigurosamente** como ejercicio pedagógico. Útil para portfolio o para casos futuros donde sí haga falta.

En todos los otros casos, este doc basta.

---

## 9. Validación del resultado

Checklist antes de cerrar F3 y pasar a F4:

- [ ] `docs/moodboard/referencias.md` con 3-7 refs documentadas (URL + screenshot + 3 cosas que me gustan).
- [ ] `moodboard/analisis.md` con análisis por referencia + síntesis transversal.
- [ ] `docs/design.md` con voz + tokens + principios + 5-8 negative instructions + referencias.
- [ ] Tipografía: ninguna fuente comercial con licencia restrictiva. Las elegidas mantienen el carácter detectado en el análisis.
- [ ] Paleta: nueva, no replicada literal, coherente con la lógica de saturación/temperatura observada.
- [ ] `docs/design-spec-visual.md` con componente concreto + motion level + trigger por cada sección, validado sección a sección.
- [ ] 21st.dev Magic MCP cargado y verificado (`claude mcp list`).
- [ ] Máximo 3 librerías distintas en el spec visual.

Si alguno falla, no se cierra F3.

---

## 10. Apéndice

### 10.1 Comparación vibe design vs forense

| Eje | Vibe design (este doc) | Forense (pipeline-extraccion-premium) |
|---|---|---|
| Tiempo total | 2-4 h | 1-3 días |
| Herramientas | Screenshots + Claude + Stitch opcional | Playwright + dembrandt + bundle sniff + rrweb |
| Output mínimo | `design.md` + `design-spec-visual.md` | Lo anterior + dossier completo por site |
| Rigor de tokens | Estimado visualmente | Computado del navegador |
| Cuándo es suficiente | Tu propia landing | Auditar a competidor o migrar legacy |
| Qué aprende el alumno | Vibe design 2026 + uso de catálogo | Técnica forense rigurosa |

Ambos son válidos. Este doc gana cuando el objetivo es producto propio.

### 10.2 Recursos rápidos

- 21st.dev Magic MCP: `github.com/21st-dev/magic-mcp`
- Catálogo curado completo: `pipeline-extraccion-premium.md §10`
- Sustitución tipográfica: `pipeline-extraccion-premium.md §8.2`
- Prompt de destilación detallado (versión profunda con dossiers): `pipeline-extraccion-premium.md §9`

---

*Documento vivo. Última actualización 2026-05-25. Cambios significativos se documentan en commit con `docs(m5): vibe-design <descripción>`.*
