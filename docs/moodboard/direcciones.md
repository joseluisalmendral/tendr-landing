# 5 direcciones visuales · Tendr

> F2 · Etapa 3 (vibe-design §4.3, prompt §6.3). Input: `docs/moodboard/analisis.md` + `brief.md`.
> Vertical: mini-CRM B2B con IA para perfiles junior. Voz: confiable, ágil, sin corporativismo.
> Tono destilado en analisis.md: **"Producto-vivo cálido"**. Restricción del usuario:
> **disruptivo pero profesional y premium**.
>
> Reparto: 2 conservadoras · 2 arriesgadas · 1 híbrida. Cada combinación está validada
> contra la matrix de combinabilidad del catálogo del sénior (§3.1) y, cuando es una
> combinación testada, se cita por letra (§3.2). Paletas con rol = capa de tokens
> semánticos (§1.4). Tipografía bajo reglas §1.5 (máx. 2 familias + mono, 3 weights).
> Todas las fuentes son **open-source** (OFL / Fontshare). Nada de Inter, Fraunces ni
> Instrument Serif. Acentos **cálidos**, jamás AI-purple (THE LILA RULE).

---

## 1 · "Carbón con brasa" — CONSERVADORA

**Estilo:** Dark Editorial / Tech-Editorial (§2.7) + acento Aurora aislado (§2.6) → **combo testada B** (§3.2: Linear, Vercel, Anthropic, Stripe Sigma).

**Paleta (OKLCH con rol):**
- `--color-surface` (neutro fondo): `oklch(0.17 0.012 60)` — carbón **cálido**, no #000
- `--color-text-primary` (neutro fg): `oklch(0.93 0.008 80)` — off-white cálido, no #fff
- `--color-accent-primary` (primario/CTA): `oklch(0.70 0.15 42)` — coral brasa
- `--color-accent-secondary` (acento/glow): `oklch(0.84 0.12 85)` — amber
- `--color-success` (5to, data del pipeline): `oklch(0.62 0.07 190)` — teal apagado

**Type pair:** display **Hanken Grotesk** 600/700 + body **Geist Sans** 400/500 + mono **JetBrains Mono** (metadata). *Carácter:* Hanken aporta calidez humanista que rompe la frialdad de una grotesca pura; Geist mantiene el body neutro y legible. Mono = voz de ingeniería en labels.

**Motion level:** medio. Un único blob aurora a la deriva en el hero + reveals coreografiados (§7.2).

**Vibe:** *Linear con sangre cálida — oscuro premium pero con brasa, nunca grayscale muerto.*

**Hero:** Fondo carbón cálido con un solo blob aurora coral/amber derivando lento detrás del titular off-white. A la derecha, el faux-UI del pipeline flota con micro-motion "live" y reveal coreografiado on-load.

**Inspirada en:** Linear (restraint + ilustración), Stripe (gradiente vivo, aquí reducido a un blob aislado), Attio (faux-UI protagonista).

---

## 2 · "Hoja de ruta" — CONSERVADORA

**Estilo:** Swiss / International revival (§2.3) + Bento (§2.4) → **combo testada C** (§3.2: Vercel, Linear features, Stripe pricing). El polo claro y estructurado (contrapeso al #1 oscuro).

**Paleta (OKLCH con rol):**
- `--color-surface`: `oklch(0.98 0.004 85)` — papel neutro apenas cálido
- `--color-text-primary`: `oklch(0.22 0.010 60)` — tinta cálida
- `--color-accent-primary` (CTA): `oklch(0.22 0.010 60)` — tinta sólida (CTA negro cálido, estilo Cal/Attio)
- `--color-accent-secondary` (acento único Swiss): `oklch(0.68 0.16 40)` — coral
- `--color-border-hairline` (5to): `oklch(0.90 0.005 230)` — hairline gris-frío para el grid

**Type pair:** display **Geist Sans** 600 + body **Geist Sans** 400 + mono **JetBrains Mono** (números `01/02`, tabular-nums). *Carácter:* Swiss exige neutralidad grotesca precisa; una sola familia = disciplina. Geist es la grotesca neutra moderna por excelencia.

**Motion level:** sutil. Grid reveals + draw-in en flechas + **stagger por posición visual** (§7.6), nada estridente.

**Vibe:** *Claridad documental B2B — grid estricto, faux-UI como protagonista, calma legible.*

**Hero:** Titular grande alineado a la izquierda sobre grid 12-col; a la derecha, el faux-UI del pipeline dentro de una card bento. CTA tinta + secundario outline, reveal por posición visual.

**Inspirada en:** Attio (faux-UI + claridad), Cal (step-cards numeradas + nav pill), Linear (jerarquía por peso).

---

## 3 · "Papel anotado" — ARRIESGADA (Brutal cálido)

**Estilo:** Editorial Brutalism / Paper Brutalism (§2.1) + anotaciones Notebook hand-drawn (§2.10) → **combo testada A** (§3.2: Bartosz Ciechanowski, Maggie Appleton, Andy Matuschak). Ideal para producto que **enseña** a un junior.

**Paleta (OKLCH con rol):**
- `--color-surface`: `oklch(0.97 0.015 90)` — cream papel imprenta
- `--color-text-primary`: `oklch(0.18 0.020 50)` — ink cálido (el catálogo usa violeta-tinta; lo mantengo **cálido** para no leer AI-purple)
- `--color-accent-primary` (CTA glow): `oklch(0.85 0.13 88)` — amber con borde ink (.btn §2.1)
- `--color-accent-secondary`: `oklch(0.62 0.15 38)` — terracota/ember (border-left de jerarquía)
- `--color-success` (5to): `oklch(0.48 0.07 185)` — teal

**Type pair:** display **Clash Display** 600/700 + body **Hanken Grotesk** 400 @ 20px + mono **JetBrains Mono** uppercase (metadata). *Carácter:* Paper Brutalism pide sans heavy con peso de póster — Clash da ese golpe; body a 20px (no 16) para gravitas editorial cálido.

**Motion level:** medio con carácter. `ease-snap` en pop-ins, hard-shadow `4px 4px` on hover, **draw-in** en las flechas hand-drawn (§6.2).

**Vibe:** *Blueprint cálido tipo Syllabus / Stripe Press — papel, esquinas duras, y anotaciones a mano que guían al junior.*

**Hero:** Fondo cream con titular heavy y una lista numerada editorial (no grid de cards); el faux-UI del pipeline con hard-shadow de 4px y una **flecha SVG dibujada a mano** que apunta al CTA amber. 0px corners en todo.

**Inspirada en:** Attio (faux-UI + listas), Notion (calidez + tono humano + hand-drawn), Cal (numeración de pasos).

---

## 4 · "Keynote cálida" — ARRIESGADA (Tech vibrante)

**Estilo:** Aurora / Spectral Gradients (§2.6) + Bento (§2.4) sobre base Dark Editorial (§2.7) → combos B + F-ish (matrix: Aurora×Bento ✓, Dark Ed×Aurora ✓✓). La más disruptiva — entrega directo el "hero con fondo animado" que pediste.

**Paleta (OKLCH con rol):**
- `--color-surface`: `oklch(0.16 0.015 50)` — carbón cálido
- `--color-text-primary`: `oklch(0.94 0.006 80)` — off-white
- `--color-accent-primary` (CTA): `oklch(0.72 0.18 38)` — coral vivo
- `--color-accent-secondary` (glow neón-warm): `oklch(0.86 0.14 82)` — amber luminoso
- `--color-accent-tertiary` (5to, gradiente): `oklch(0.68 0.16 8)` — rosa-magenta **cálido** (jamás violeta)

**Type pair:** display **General Sans** 600/700 + body **Geist Sans** 400 + mono **JetBrains Mono**. *Carácter:* General Sans tiene energía geométrica con personalidad, sin la frialdad de una grotesca neutra — encaja con el momentum "tech vibrante".

**Motion level:** wow. Gradient mesh **animado** en el hero (§6.10.2) + bento con hover demos + la transición disruptiva hero→sección 2 (sticky+fade §7.4). Es la que más cumple "disruptivo".

**Vibe:** *Energía de keynote AI cálida — gradiente vivo coral/amber/rosa que respira, bento que reacciona, sin caer en el hype frío.*

**Hero:** Gradient mesh animado coral→amber→rosa cálido (NUNCA púrpura) detrás del titular; faux-UI del pipeline con edge-glow en hover. Al scrollear, sticky+fade revela la sección 2 desde atrás (el reveal de Attio).

**Inspirada en:** Stripe (gradiente vivo, aquí protagonista), Attio (tab→mockup + reveal), Linear (ilustración).

> ⚠ **Riesgo declarado (§2.6 "cuándo NO"):** Aurora en productos serios puede leer como "marketing AI hype". Mitigación: acentos **cálidos no-púrpura** + gradiente **solo en el hero**, Dark Editorial en el resto de la página.

---

## 5 · "Producto-vivo cálido" — HÍBRIDA

**Estilo:** Editorial Brutalism (light) ⟷ Dark Editorial (dark) → **combo testada E** (§3.2: Linear, Vercel, Read.cv, Pika — tokens espejados light/dark) + un acento Aurora en el hero (combo B). Es la **destilación directa del tono de `analisis.md`**.

**Paleta (OKLCH con rol — espejada light/dark, acentos constantes):**
- `--color-surface` light `oklch(0.97 0.012 88)` (cream) ⟷ dark `oklch(0.17 0.012 55)` (carbón cálido)
- `--color-text-primary` light `oklch(0.20 0.020 50)` (ink) ⟷ dark `oklch(0.93 0.008 80)` (off-white)
- `--color-accent-primary` (CTA, **constante**): `oklch(0.70 0.16 40)` — coral/ember
- `--color-accent-secondary` (glow): `oklch(0.84 0.13 86)` — amber
- `--color-success` (5to, pipeline data): `oklch(0.55 0.07 188)` — teal apagado

**Type pair:** display **Clash Display** 600 + body **Hanken Grotesk** 400/500 + mono **JetBrains Mono** (ya en el preset Lyra). *Carácter:* Clash = carácter disruptivo controlado; Hanken = calidez legible; mono = voz de ingeniería en la metadata del pipeline.

**Motion level:** medio-alto **dosificado** (respeta motion budget §1.4: 1 wow + 3-5 carácter). Wow = la transición hero→sección 2 + el **pipeline que cobra vida al scrollear** (la firma de analisis.md). Aurora blob ambient en hero + reveals coreografiados + bento hover.

**Vibe:** *La firma de Tendr — cálido y legible como papel premium, oscuro y nítido como Linear, con el pipeline que cobra vida al scrollear.*

**Hero:** Cream o carbón según modo, titular Clash con un blob aurora coral/amber sutil; el faux-UI del pipeline arranca **vacío** y se puebla a medida que scrolleás (la firma narrativa). CTA coral sólido + outline.

**Inspirada en:** todas — Linear + Stripe (dark + aurora), Attio (faux-UI + reveal + tabs), Cal (pasos numerados), Notion (calidez de voz).

---

## Cómo elegir (lectura del sénior, no decisión)

| # | Dirección | Riesgo | Más fuerte en | Tensión a vigilar |
|---|---|---|---|---|
| 1 | Carbón con brasa | Bajo | Premium oscuro con calidez | Cerca del "sobrio" que rechazaste |
| 2 | Hoja de ruta | Bajo | Claridad B2B estructurada | Puede leer plano sin la firma de motion |
| 3 | Papel anotado | Alto | Cercanía didáctica para junior | Densidad editorial pelea con mobile (§2.1) |
| 4 | Keynote cálida | Alto | Disrupción máxima en el hero | Riesgo AI-hype si no se contiene |
| 5 | Producto-vivo cálido | Medio | **Es el tono ya acordado en analisis.md** | Exige disciplina de motion budget |

La **#5** es la traducción literal del tono que destilamos juntos; la **#4** es la más disruptiva pura; la **#1** y **#2** son los anclas seguras. Decisión tuya — el agente propone, vos firmás (`exploration/decision.md` / brief C2).

*Siguiente paso (F3): elegida la dirección, destilo a `docs/design.md` + `docs/design-spec-visual.md` (vibe-design §4.4–4.5).*
