# Pipeline de extracción premium · técnica avanzada del módulo 5

> ⚠️ **AVISO DE RUTA.** Este documento describe **técnica forense profunda** (Playwright + bundle sniffing + dembrandt + rrweb). Es la opción rigurosa pero **no es la ruta principal** del curso para alcanzar resultado premium. La ruta principal es **`vibe-design-referencias.md`** (vibe design con referencias visuales, 2-4 h, lo que hacen los expertos en 2026). Usa este pipeline cuando:
>
> - Vas a auditar a un competidor con rigor forense.
> - Estás migrando un design system legacy y necesitas tokens exactos.
> - Querés aprender la técnica de extracción rigurosamente como ejercicio pedagógico.
> - El análisis visual de la ruta principal te dejó dudas concretas que solo se resuelven con tokens computados.

Documento compartido del equipo. Define el método para destripar webs premium de referencia y destilar un `design.md` propio con resultado fiable, adaptable y replicable. Lo usan **opcionalmente** las fases F2 (exploración visual) y F3 (destilación a `design.md`) de L16, y opcionalmente las fases de inspiración visual de L17.

**Audiencia:** sénior preparando la lección + alumno siguiéndola en producción real.
**Objetivo:** que el alumno NO produzca un sitio con look-and-feel de "tutorial genérico de IA". Que tenga resultado premium con criterio, no por suerte, y que pueda **replicar o reconstruir** los efectos que le gustan con componentes concretos de su stack.

**Identificador:** `M5-COMPARTIDO-PIPELINE-EXTRACCION-PREMIUM`.

**Modelo de trabajo:** 90% agente, 10% alumno. El alumno orquesta y verifica; el agente extrae, analiza y propone. Detalle en §3.

---

## 1. Por qué este pipeline existe

Pedirle al agente "investiga `pomelo.la` y dime cómo está hecho" produce respuestas vagas. El HTML estático que llega del servidor revela poco; lo que da el carácter premium vive en el runtime, no en el markup.

### 1.1 Las tres razones técnicas por las que el HTML solo no basta

1. **Hidratación cliente.** El HTML del servidor es esqueleto; el resto se inyecta tras `hydrate()`. Pomelo.la corre Next.js + Prismic: el HTML solo revela `_next/image` y URLs de assets. Cero pista de GSAP, Three.js, Lenis, Motion, aunque las use.
2. **Reveals on scroll.** ScrollTrigger (GSAP), Intersection Observer y Framer Motion materializan estilos y elementos cuando entran a viewport. Sin scroll real, esos estados nunca aparecen en el DOM.
3. **Estado de interacción.** Hovers, focus, abre-menús, parallax, canvas WebGL, Lottie. Nada de eso vive en el markup inicial. Sólo aparece cuando hay interacción humana o simulada.

### 1.2 Qué resuelve este pipeline

- Captura tokens reales (color, tipografía, escala, radii, sombras) computados, no inferidos.
- Identifica librerías cliente con alta confianza vía bundle sniffing (GSAP, Lenis, Motion, Three.js, Lottie, Spline).
- Mapa de animaciones por scroll-Y: qué se revela, con qué duración, qué easing.
- Estados de interacción documentados (hover, focus).
- Estructura para combinar 3-5 referencias por intersección y producir un `design.md` propio.
- **Mapeo de "efecto observado → componente concreto en tu stack"** para que el alumno pueda replicar sin reinventar.

### 1.3 Qué NO resuelve

- No copia código fuente. Esto es análisis, no clonado.
- No replica tipografías con licencia comercial. Las identifica y sustituye por equivalentes open-source.
- No extrae contenido vectorial de WebGL/Canvas. Identifica el efecto; la implementación es tuya con referencia concreta.
- No vence anti-bot agresivo de forma garantizada. Tres de cinco sites premium pueden bloquearte algo; lo documentas.

---

## 2. Resultado esperado

Aplicado a un site referencia produce un **dossier** local:

```
extractos/
└── <dominio-sin-tld>/
    ├── README.md                  ← qué se extrajo y cuándo (timestamp + commit SHA local)
    ├── stack-detect.md            ← libs detectadas por bundle sniffing + Wappalyzer
    ├── bundle-signatures.json     ← firmas raw de librerías encontradas en el bundle
    ├── tokens.json                ← W3C Design Tokens (DTCG) de design-extract o dembrandt
    ├── tokens.css                 ← CSS custom properties listas
    ├── DESIGN.md                  ← borrador inicial generado por dembrandt
    ├── animations.json            ← inventario de Web Animations capturado
    ├── reveals-map.md             ← qué aparece a qué scroll-Y, con qué timing
    ├── interactions.md            ← estados hover/focus capturados
    ├── fonts.md                   ← fuentes cargadas + carácter + equivalentes open-source
    ├── replicacion.md             ← efecto observado → componente concreto a usar/construir
    ├── screenshots/
    │   ├── 0000-viewport-top.png
    │   ├── 0001-scroll-600.png
    │   └── ... (uno por parada de scroll)
    ├── full-page.png              ← screenshot full-page
    └── network.har                ← HAR completo
```

Aplicado a 3-5 sites referencia y combinado con el brief del producto, produce el artefacto canon de F3:

```
docs/design.md       ← propio, destilado, validado, con identidad propia + mapa de replicación
```

---

## 3. Reparto de trabajo IA vs alumno

El pipeline está diseñado para que el agente haga el trabajo pesado y el alumno orqueste, verifique y aporte criterio. Esta tabla es contrato: si una tarea del agente exige más del alumno, está mal diseñada.

| Acción | Quién | Por qué |
|---|---|---|
| Decidir qué 3-5 sites referencia entran al análisis | Alumno | Criterio editorial, no automatizable |
| Mirar cada site 2 min como humano y anotar 3 sensaciones | Alumno | El agente no tiene gusto |
| Pegar al chat output de Wappalyzer y screenshot de CSS Stats (opcional, 30s) | Alumno | Dos clicks le ahorran al agente una llamada de red |
| Ejecutar comandos del pipeline (Playwright, design-extract) | Alumno | Son 3 comandos. El agente NO ejecuta procesos largos para no quemar tokens |
| Bundle sniffing (curl + análisis de chunks) | **Agente** | Determinista, gratis, identifica librerías con confianza alta |
| Leer screenshots generados y describir lo que ve | **Agente** | Claude tiene visión; la lectura es gratis dentro del contexto normal |
| Analizar `animations.json`, `tokens.json`, `fonts.json` | **Agente** | Texto estructurado, su terreno |
| Cruzar 3-5 dossiers e identificar patrones por intersección | **Agente** | Lo hace mucho mejor que el alumno bajo presión de tiempo |
| Proponer paleta nueva, sustitutos tipográficos, negative instructions | **Agente** | Aplica reglas del §8 y §9 |
| Mapear "efecto observado → componente concreto" del catálogo §10 | **Agente** | Conocimiento estructurado del catálogo |
| Validar el `design.md` final contra el brief | Alumno | Decisión de producto |

**Lo que el alumno NUNCA delega:**

1. Elegir qué sites referencia entran al análisis.
2. Validar que el `design.md` final encaja con el brief y el vertical.
3. Decidir qué componentes del mapa de replicación se construyen primero.

**Lo que el agente NUNCA hace solo:**

1. Ejecutar el script Playwright (es proceso largo, headful, consume crédito si fallara en bucle). El alumno lanza el comando.
2. Instalar dependencias globales sin confirmación.
3. Decidir el dominio del producto.

---

## 4. Las 7 etapas del pipeline

### 4.1 Etapa 1 · Stack-detect rápido (alumno opcional, 0-2 min)

Saber si el target usa GSAP, Framer Motion, Lenis, Three.js, Spline, Lottie cambia cómo lo extraes. Hay dos rutas que se complementan:

**Ruta A · Alumno pega contexto al chat (opcional, 30s):**

- Abre el site con extensión **Wappalyzer** instalada. Screenshot del panel. Pega al chat.
- Opcional: `cssstats.com/?url=<url>` → screenshot del histograma. Pega al chat.

**Ruta B · Agente hace bundle sniffing (Etapa 2). Siempre se ejecuta.**

Si el alumno aporta Ruta A, el agente la usa como hipótesis inicial. Si no, arranca directo en Etapa 2.

**Output:** `extractos/<dominio>/stack-detect.md` con tabla de libs detectadas + cómo se detectaron (Wappalyzer / bundle signature / window object) + qué implica para la extracción.

### 4.2 Etapa 2 · Bundle sniffing por el agente (1-3 min, gratis)

Esto es la pieza nueva 2026 y reemplaza la dependencia ciega de Wappalyzer. El agente identifica librerías con confianza alta sin depender de que estén expuestas en `window`.

**Procedimiento (lo ejecuta el agente vía Bash):**

```bash
URL="https://pomelo.la/en"
DOMAIN="pomelo"
mkdir -p "extractos/$DOMAIN/bundle"

# 1. HTML inicial
curl -sL "$URL" -o "extractos/$DOMAIN/bundle/index.html"

# 2. Extraer URLs de scripts del HTML
rg -o 'src="[^"]+\.js[^"]*"' "extractos/$DOMAIN/bundle/index.html" \
  | sed 's/src="//;s/"//' \
  | sort -u > "extractos/$DOMAIN/bundle/scripts.txt"

# 3. Descargar los chunks principales (los 8 más grandes)
# El agente itera scripts.txt, resuelve URLs relativas, descarga con curl

# 4. Buscar firmas de librerías conocidas
rg --no-heading -l "gsap|ScrollTrigger|@gsap" "extractos/$DOMAIN/bundle/"
rg --no-heading -l "lenis|@studio-freight/lenis" "extractos/$DOMAIN/bundle/"
rg --no-heading -l "framer-motion|motion/react" "extractos/$DOMAIN/bundle/"
rg --no-heading -l "three|THREE\.|@react-three" "extractos/$DOMAIN/bundle/"
rg --no-heading -l "splinetool|@splinetool" "extractos/$DOMAIN/bundle/"
rg --no-heading -l "lottie-web|@lottiefiles" "extractos/$DOMAIN/bundle/"
rg --no-heading -l "motion\.dev|\"motion\"" "extractos/$DOMAIN/bundle/"
```

**Firmas canónicas a buscar:**

| Librería | Firma en bundle (rg pattern) | Señal complementaria |
|---|---|---|
| GSAP | `gsap\|ScrollTrigger\|TweenLite\|TimelineMax` | Clases `gsap-*` en HTML |
| Lenis | `lenis\|@studio-freight/lenis` | `transform: matrix3d` cambiando en `<html>` |
| Framer Motion | `framer-motion\|projection-id` | Atributos `data-projection-id` |
| Motion (motion.dev) | `motion\.dev\|"motion"` (cuidado con falsos positivos) | `data-motion-*` |
| Three.js | `THREE\.\|three/src` | `<canvas>` con contexto `webgl` |
| React Three Fiber | `@react-three/fiber\|react-three` | Convive con Three |
| Spline | `splinetool\|@splinetool/runtime` | `<canvas data-engine="spline">` |
| Lottie | `lottie-web\|@lottiefiles` | `<lottie-player>` o `<dotlottie-player>` |
| Tailwind | `tw-\|tailwindcss` (en CSS, no JS) | Clases utilitarias en HTML |
| shadcn | clases tipo `data-[state=open]:` | Combinado con Radix |
| Radix | `@radix-ui` | Atributos `data-radix-*` |

**Output:** `extractos/<dominio>/bundle-signatures.json` con `{lib, confidence, evidence}` por librería detectada. El agente lo redacta en humano dentro de `stack-detect.md`.

### 4.3 Etapa 3 · Extracción de tokens (alumno ejecuta, 5-15 min)

Tres herramientas open-source automatizan extracción de tokens con Playwright. Recomendación en orden de preferencia operativa:

| Herramienta | Qué da | Cuándo usar |
|---|---|---|
| **design-extract** (`Manavarya09/design-extract`) | Tokens DTCG (semantic + primitive + composite), audit CSS, WCAG, emisores para Tailwind v4 + shadcn + Figma. Trae MCP server. | Primera opción siempre. |
| **dembrandt** (`dembrandt/dembrandt`) | Tokens W3C DTCG + `DESIGN.md` que sigue draft de Google. Output más limpio para borradores. | Segunda opinión cuando dudas de la inferencia de tokens. |
| **Extract Design System Skill** (`arvindrk/extract-design-system`) | Skill nativa de Claude Code. Computed styles → tokens + CSS vars. | Cuando trabajas dentro de Claude Code y no quieres salir. |

**Comando canónico (lo ejecuta el alumno, 30 segundos):**

```bash
URL="https://pomelo.la/en"
DOMAIN="pomelo"
mkdir -p "extractos/$DOMAIN"

pnpm dlx @designlang/extract "$URL" \
  --out "extractos/$DOMAIN" \
  --emit tokens.json,tokens.css,DESIGN.md,audit.json
```

Segunda opinión opcional con dembrandt si los tokens del primero parecen incompletos:

```bash
pnpm dlx dembrandt "$URL" --out "extractos/$DOMAIN/_dembrandt"
```

El agente lee ambos outputs y reconcilia en el `DESIGN.md` del dossier.

### 4.4 Etapa 4 · Captura runtime con scroll progresivo (alumno ejecuta, 15-30 min)

Las herramientas de Etapa 3 no capturan bien el comportamiento dinámico (qué aparece en qué scroll, con qué animación). Aquí entra un script Playwright propio. Vive en `_compartido/operacion/_assets/extract-runtime.mjs` y es reusable. Código completo en §5.

**Lo que captura:**

- Screenshots del viewport en cada parada de scroll (cada 600px).
- HTML snapshot al cargar y al final del scroll.
- `document.getAnimations()` activas en cada momento.
- Estados de hover y focus sobre `button`, `a[href]`, `[role=button]`.
- Lista de elementos visibles por parada (heurística IO).
- HAR completo (network + headers + bodies).
- `fonts.json` con todas las fuentes cargadas.

**Comando que ejecuta el alumno:**

```bash
node _compartido/operacion/_assets/extract-runtime.mjs \
  "$URL" "extractos/$DOMAIN"
```

**Antes de ejecutar:** si el bundle sniffing detectó Lenis, el agente edita el script y sube `STEP_WAIT_MS` de 800 a 1200 para dejar que el smooth-scroll termine el ease. Si detectó Cloudflare en `stack-detect`, el agente añade el patch de stealth (§6).

**Lectura por el agente después:** el agente abre con Read los screenshots clave (top, mid, footer, full-page) y describe lo que ve. Lee `animations.json` y `reveals.json` como texto. Produce `reveals-map.md` legible.

### 4.5 Etapa 5 · Análisis de animaciones por el agente

Con `animations.json` + screenshots + bundle signatures, el agente clasifica cada animación detectada:

```js
// Lo que captura el script en cada parada (recordatorio):
document.getAnimations().map(a => ({
  target: cssPathOf(a.effect.target),
  keyframes: a.effect.getKeyframes(),
  duration: a.effect.getTiming().duration,
  easing: a.effect.getTiming().easing,
  delay: a.effect.getTiming().delay,
  iterationCount: a.effect.getTiming().iterations,
  playState: a.playState,
}));
```

`document.getAnimations()` cubre CSS animations + Web Animations API + algunas integraciones de Motion. **No cubre GSAP** si no expone `gsap` en `window`. Para eso, el agente combina:

| Tipo de animación | Cómo se detecta | Cómo se documenta |
|---|---|---|
| CSS / WAAPI | `animations.json` directo | Duración + easing + target |
| Framer Motion | `data-projection-id` + estilos computed | Patrón: "scroll-reveal con stagger 80ms" |
| GSAP (no expuesto) | Bundle signature + diff de screenshots consecutivos | "scrub on scroll de hero, 1.2s timeline" |
| Lenis | Bundle + `transform` en `<html>` mutando | "smooth-scroll global, ease ~1.2s" |
| Three.js / WebGL | `<canvas>` + bundle | Identificado el efecto, contenido no extraíble |
| Lottie | `<lottie-player>` en DOM | Capturable como JSON si está expuesto |

**Output:** `extractos/<dominio>/reveals-map.md` con tabla `scrollY → qué aparece → cómo (lib + duración + easing)`.

### 4.6 Etapa 6 · Destilación a `design.md` propio

Repetir Etapas 1-5 con **3-5 sites de referencia premium** distintos (no solo Pomelo). Por qué 3-5:

- 1 referencia → mimetismo, copias.
- 2 referencias → tensión, no hay patrón claro.
- 3-5 referencias → emergen convenciones por intersección. Eso es el lenguaje premium real.
- Más de 5 → ruido, parálisis por análisis.

Con los dossiers en `extractos/<dominio-1>/`, `extractos/<dominio-2>/`, etc., el agente destila a `docs/design.md` propio. Prompt completo en §9.

### 4.7 Etapa 7 · Mapa de replicación (componentes concretos)

Esta etapa cierra el círculo de "ver → entender → replicar". Sin ella el `design.md` es teórico.

Por cada efecto destacado del `design.md`, el agente mapea:

| Campo | Ejemplo |
|---|---|
| Efecto observado | "Cards de feature con gradient mesh animado que reacciona al cursor" |
| Detectado en | `extractos/pomelo/`, `extractos/linear/` |
| Lib origen probable | GSAP + Canvas o WebGL custom |
| Replicación en tu stack | Aceternity UI · `<HeroHighlight>` o `<CanvasRevealEffect>` |
| URL del componente | `ui.aceternity.com/components/hero-highlight` |
| Esfuerzo estimado | Bajo (copy-paste) / Medio (adaptar) / Alto (reconstruir) |
| Alternativa si no encaja | Construir con Motion + `<canvas>` simple, ~80 líneas |

Output: `docs/design.md §Sugerencias premium` (canon) y opcionalmente `extractos/<dominio>/replicacion.md` por site (granular).

El catálogo de librerías que el agente consulta vive en §10.

---

## 5. Script Playwright de referencia

Vive en `_compartido/operacion/_assets/extract-runtime.mjs`. Reusable para cualquier site cambiando solo la URL.

```javascript
// _compartido/operacion/_assets/extract-runtime.mjs
// Uso: node extract-runtime.mjs <url> <output-dir>
// Ej:  node extract-runtime.mjs https://pomelo.la/en extractos/pomelo

import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const [,, url, outDir] = process.argv;
if (!url || !outDir) {
  console.error('Uso: node extract-runtime.mjs <url> <output-dir>');
  process.exit(1);
}

const VIEWPORT = { width: 1440, height: 900 };
const SCROLL_STEP = 600;
const STEP_WAIT_MS = 800;        // Subir a 1200 si el site usa Lenis
const FINAL_SETTLE_MS = 2000;

await mkdir(resolve(outDir, 'screenshots'), { recursive: true });

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({
  viewport: VIEWPORT,
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  recordHar: { path: resolve(outDir, 'network.har') },
});

const page = await context.newPage();

// 1. Navegar y esperar a que todo esté listo
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(FINAL_SETTLE_MS);

// 2. Snapshot inicial
await page.screenshot({
  path: resolve(outDir, 'screenshots', '0000-viewport-top.png'),
});
await writeFile(
  resolve(outDir, 'html-initial.html'),
  await page.content()
);

// 3. Fuentes cargadas
const fonts = await page.evaluate(async () => {
  await document.fonts.ready;
  return Array.from(document.fonts).map(f => ({
    family: f.family,
    style: f.style,
    weight: f.weight,
    display: f.display,
    status: f.status,
  }));
});
await writeFile(
  resolve(outDir, 'fonts.json'),
  JSON.stringify(fonts, null, 2)
);

// 4. Bucle de scroll progresivo
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
const steps = Math.ceil(totalHeight / SCROLL_STEP);
const animationsLog = [];
const revealsLog = [];

for (let i = 1; i <= steps; i++) {
  const targetY = i * SCROLL_STEP;
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), targetY);
  await page.waitForTimeout(STEP_WAIT_MS);

  await page.screenshot({
    path: resolve(outDir, 'screenshots', `${String(i).padStart(4, '0')}-scroll-${targetY}.png`),
  });

  const anims = await page.evaluate(() =>
    document.getAnimations().map(a => ({
      target: a.effect?.target ? cssPath(a.effect.target) : null,
      keyframes: a.effect?.getKeyframes?.() ?? [],
      timing: a.effect?.getTiming?.() ?? {},
      playState: a.playState,
    }))
  );
  animationsLog.push({ scrollY: targetY, animations: anims });

  const reveals = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    return all
      .filter(el => {
        const r = el.getBoundingClientRect();
        return r.top > 0 && r.top < window.innerHeight && r.height > 0;
      })
      .slice(0, 20)
      .map(el => ({
        tag: el.tagName,
        cls: el.className?.toString().slice(0, 80),
        text: el.textContent?.slice(0, 60),
      }));
  });
  revealsLog.push({ scrollY: targetY, visible: reveals });
}

await page.addInitScript(() => {
  window.cssPath = el => {
    if (!el) return null;
    const parts = [];
    while (el && el.nodeType === 1 && parts.length < 6) {
      let s = el.tagName.toLowerCase();
      if (el.id) { s += `#${el.id}`; parts.unshift(s); break; }
      if (el.className) s += `.${el.className.toString().split(' ').slice(0, 2).join('.')}`;
      parts.unshift(s);
      el = el.parentElement;
    }
    return parts.join(' > ');
  };
});

await writeFile(
  resolve(outDir, 'animations.json'),
  JSON.stringify(animationsLog, null, 2)
);
await writeFile(
  resolve(outDir, 'reveals.json'),
  JSON.stringify(revealsLog, null, 2)
);

// 5. Screenshot full-page final
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await page.screenshot({
  path: resolve(outDir, 'full-page.png'),
  fullPage: true,
});

// 6. Estados de interacción (primeros 10 botones/links visibles)
const interactive = await page.$$eval(
  'button, a[href], [role="button"]',
  els => els.slice(0, 10).map((el, i) => ({ idx: i, tag: el.tagName }))
);
const interactionsLog = [];
for (const { idx } of interactive) {
  try {
    const handle = page.locator('button, a[href], [role="button"]').nth(idx);
    await handle.scrollIntoViewIfNeeded();
    await handle.hover({ trial: false });
    await page.waitForTimeout(400);
    const computed = await handle.evaluate(el => {
      const s = getComputedStyle(el);
      return {
        color: s.color,
        background: s.backgroundColor,
        boxShadow: s.boxShadow,
        transform: s.transform,
        transition: s.transition,
        cursor: s.cursor,
      };
    });
    interactionsLog.push({ idx, hover: computed });
  } catch (e) {
    // ignorar elementos que no responden a hover
  }
}
await writeFile(
  resolve(outDir, 'interactions.json'),
  JSON.stringify(interactionsLog, null, 2)
);

await context.close();
await browser.close();
console.log('OK ·', outDir);
```

**Uso:**

```bash
node _compartido/operacion/_assets/extract-runtime.mjs \
  https://pomelo.la/en \
  extractos/pomelo
```

**Cuándo subir el `STEP_WAIT_MS` a 1200:** cuando el bundle sniffing detectó Lenis o smooth-scroll JS pesado. El agente lo edita antes de pasar el comando al alumno.

---

## 6. Configuración para anti-bot

Tres de cada cinco sites premium tienen alguna defensa anti-bot (Cloudflare, hCaptcha, Datadome). Playwright vainilla se detecta y te bloquean. Solución estándar 2026:

```bash
pnpm add -D playwright-extra puppeteer-extra-plugin-stealth
```

Modifica el script de §5 cambiando el import inicial:

```js
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
chromium.use(stealth());
```

**User-agent**: usar uno realista y actual. Cambia cada 6 meses; verifica con `whatismybrowser.com` antes de ejecutar.

**Viewport humano**: 1440x900 o 1536x960 (resoluciones reales de MacBook). Evitar 1920x1080 sin más.

**Comportamiento humano**: pausas variables (`STEP_WAIT_MS + Math.random() * 400`), scrolls no perfectos (ligero offset), movimientos del cursor antes de hover.

**Si aún así te bloquean**: el script registra `network.har` y screenshots hasta el punto del bloqueo. Documenta el bloqueo en `stack-detect.md` y pasa al siguiente site.

---

## 7. Manejo de WebGL, Canvas, 3D

WebGL/Canvas son ciudadanos opacos: el navegador no expone "qué se está renderizando". Lo que puedes hacer:

| Qué quieres | Cómo |
|---|---|
| Saber que hay WebGL | Bundle sniffing (§4.2) + `<canvas>` con contexto `webgl`/`webgl2` |
| Capturar el aspecto visual | Screenshots del canvas (el script ya los toma) |
| Capturar la animación de canvas | rrweb con `recordCanvas: true` (§16.1, herramienta humana) |
| Extraer shaders custom | `rg "x-shader/x-fragment"` en el HTML; si están inline, sí |
| Identificar la librería | Bundle sniffing (`three`, `splinetool`, `ogl`, `@react-three`) |

**Regla práctica:** documentas el efecto en `reveals-map.md` como `"hero: blob 3D de ~60% del viewport, reacciona al cursor con delay ~80ms, color shift suave en degradado naranja→rosa"`. La implementación es tuya con referencia concreta en `replicacion.md` (ej: "Aceternity `<BackgroundBeams>` o Spline embed propio").

---

## 8. Manejo de tipografías comerciales

Pomelo, Stripe, Linear, Vercel usan tipos con licencia comercial restrictiva (a veces propietaria). **No se replican.** Se identifican y se sustituyen.

### 8.1 Cómo identificarlas

El script de §5 ya emite `fonts.json` con todas las fuentes cargadas. Para cada una, el agente identifica el **carácter** (no la fuente exacta):

- Geometric sans humanista (caja x grande, terminaciones limpias).
- Geometric sans neutral (geometría perfecta, frío).
- Humanist sans (modulación visible, contraste medio).
- Display contrast alto (titulares con contraste muy alto, no apta para body).
- Mono variable (monoespaciada con peso variable).

### 8.2 Equivalentes open-source 2026

| Carácter detectado | Comercial típico | Equivalente open-source |
|---|---|---|
| Geometric humanist | GT America, Söhne, Aktiv Grotesk | **Inter Display**, **Geist**, **Manrope** |
| Geometric neutral frío | Neue Haas Grotesk, Helvetica Now | **Geist**, **Public Sans** |
| Humanist sans cálido | Tiempos Headline, Domaine | **Newsreader**, **Source Serif 4** |
| Display contrast alto | Editorial New, GT Sectra | **Fraunces**, **Bricolage Grotesque** |
| Mono variable | Berkeley Mono, JetBrains Mono | **JetBrains Mono**, **Geist Mono**, **Commit Mono** |
| Serif moderno | Söhne Mono, Reckless | **Instrument Serif**, **DM Serif Display** |

Todas vienen en Google Fonts o como paquete npm (`@fontsource/...`). El alumno NO instala fuentes piratas.

---

## 8B. Ilustraciones, iconos y assets visuales

Las ilustraciones son la otra mitad del look-and-feel premium. Sin ellas el site se ve "vacío de Tailwind". Con ellas mal elegidas se ve genérico. Aquí está el método para identificar el estilo, replicarlo y elegir fuente legítima.

### 8B.1 Tipos de ilustración que verás en sites premium

| Estilo | Ejemplos en la industria | Cómo se reconoce |
|---|---|---|
| **3D clay / iso** | Stripe, Linear, Vercel | Renders 3D con materiales mate, paleta limitada, sombras suaves |
| **Geometric flat** | Pomelo, fintech latam | Formas geométricas planas, gradientes sutiles, paleta 3-4 tonos |
| **Outline / line art** | Notion, Linear (docs) | Trazo fino, sin relleno o muy ligero, alto contraste |
| **Gradient mesh / abstract** | Stripe, Anthropic | Manchas de color suaves, blur, sin formas reconocibles |
| **Editorial / collage** | Webflow, Figma marketing | Mezcla de fotografía + tipografía + formas |
| **Glassmorphism / aurora** | Vercel, Resend | Capas translúcidas, blur, gradientes saturados |
| **Hand-drawn / sketch** | Excalidraw, Tldraw | Trazo orgánico, imperfecciones intencionales |
| **Lottie animations** | Cualquier site con micro-animaciones | JSON animado, vector, loops cortos |
| **3D scenes interactivas** | Spline showcases, Apple | WebGL con interacción a cursor |

### 8B.2 Cómo el agente identifica el estilo

Procedimiento, sin coste extra de tokens:

1. **Inspección del DOM** vía el script de §5 ya captura los `<svg>` inline en el HTML. El agente busca:

   ```bash
   rg -o '<svg[^>]*>[\s\S]*?</svg>' extractos/<dominio>/html-initial.html \
     > extractos/<dominio>/svgs-raw.txt
   ```

2. **Lectura visual** de los screenshots del dossier. El agente abre con Read los frames del hero, features, footer y describe el estilo aplicando la taxonomía de §8B.1.

3. **Detección de Lottie** vía bundle signature (`lottie-web`, `@lottiefiles`, `@dotlottie`). Si aparece, busca `<lottie-player>` o atributos `data-lottie-*` en el HTML.

4. **Detección de Spline** vía `<canvas data-engine="spline">` o iframe de `spline.design`. Si aparece, el agente registra "scene 3D externa, fuente: Spline".

5. **Detección de imágenes raster** clasificadas como ilustración: el agente analiza `network.har` y separa fotos (JPG, dimensiones grandes) de ilustraciones (PNG con transparencia, SVG, WebP de tamaño moderado).

Output: `extractos/<dominio>/illustrations.md` con tabla `tipo de asset → ejemplo (path) → estilo detectado`.

### 8B.3 Fuentes legítimas para tu site (catálogo 2026)

El alumno NO descarga SVGs del site referencia. Identifica el estilo y elige de fuentes con licencia abierta o asequible.

**SVG e ilustraciones 2D (gratis o freemium):**

| Fuente | Estilo dominante | Licencia | URL |
|---|---|---|---|
| **unDraw** | Geometric flat, paleta editable a 1 color | CC0 | `undraw.co` |
| **Open Doodles** | Hand-drawn, expresivo | CC0 | `opendoodles.com` |
| **Humaaans** (Pablo Stanley) | Personas modulares, flat | CC | `humaaans.com` |
| **Blush** | Colecciones estilo variado, mix & match | Freemium | `blush.design` |
| **Storyset** (Freepik) | Geometric flat, animables Lottie | Free con atribución | `storyset.com` |
| **DrawKit** | Flat + isométrico, profesional | Free + premium | `drawkit.com` |
| **IRA Design** | Iso illustrations modulares | Free | `iradesign.io` |
| **Lukaszadam** | Outline, minimal | CC | `lukaszadam.com` |
| **Ouch!** (Icons8) | Variedad de packs por estilo | Free con atribución / premium | `icons8.com/illustrations` |
| **Manypixels** | Flat illustrations | CC0 | `manypixels.co` |
| **Absurd Design** | Surreal hand-drawn, distintivo | Free + premium | `absurd.design` |

**3D illustrations (clay, iso, abstract):**

| Fuente | Estilo | Licencia | URL |
|---|---|---|---|
| **3dicons** | Clay 3D icons modulares | Free | `3dicons.co` |
| **Shapefest** | 3D shapes abstractas | Free con email | `shapefest.com` |
| **Iconscout 3D** | Library 3D, lottie, iconos | Freemium | `iconscout.com` |
| **Free3D** | Modelos 3D varios | Mixto, revisar cada uno | `free3d.com` |
| **Spline community** | Scenes 3D interactivas remixables | Variable | `spline.design/community` |

**Iconos (sets coherentes, NO mezclar):**

| Set | Estilo | URL |
|---|---|---|
| **Lucide** | Outline 1.5px, ultra-completo | `lucide.dev` |
| **Phosphor** | 6 pesos, muy versátil | `phosphoricons.com` |
| **Tabler** | Outline 2px, técnico | `tabler.io/icons` |
| **Heroicons** | Tailwind oficial, outline + solid | `heroicons.com` |
| **Radix Icons** | Minimalista, va con shadcn | `radix-ui.com/icons` |
| **Iconoir** | Outline limpio | `iconoir.com` |
| **Remix Icon** | 2000+ iconos varios estilos | `remixicon.com` |

**Lottie animations (gratis):**

| Fuente | Licencia | URL |
|---|---|---|
| **LottieFiles Free** | Variable, filtrar por "Free" | `lottiefiles.com/featured-free-animations` |
| **IconScout Lottie** | Freemium | `iconscout.com/lottie-animations` |
| **Useanimations** | Microinteracciones | `useanimations.com` |

**Imágenes / fotografía premium (gratis):**

- Unsplash, Pexels, Pixabay para foto general.
- Para foto con personas reales que no parezca stock: **Generated Photos** (`generated.photos`, IA), **This Person Does Not Exist** (cuidado con licencia).

### 8B.4 Cuándo generar ilustraciones con IA en lugar de buscar

Si el estilo detectado es muy específico (ej. "personajes flat con paleta de la marca, ángulo isométrico 30°, sombra única"), el catálogo abierto no va a tener exactamente lo que necesitas. Ahí entra generación con IA.

Herramientas 2026 con resultado utilizable:

| Herramienta | Fuerte en | Cuándo |
|---|---|---|
| **Midjourney v7 / v8** | Estilos editoriales, surreal, mood premium | Hero images, headers diferenciados |
| **Recraft v3** | Vector SVG editable directo, estilos consistentes | Cuando necesitas SVG editable, no raster |
| **Ideogram v3** | Tipografía dentro de imagen, posters | Cuando la ilustración lleva texto |
| **Flux Pro / Schnell** | Realismo y abstracto fotográfico | Backgrounds, hero abstract |
| **Stable Diffusion + ControlNet** | Control fino con sketches | Iteración con prompt + referencia visual |
| **DALL-E 3** | Coherencia narrativa, prompt-following | Series de ilustraciones consistentes |
| **Adobe Firefly 3** | Licencia commercial limpia, integración Adobe | Stack Adobe / cliente exige licencia clara |

**Regla operativa para coherencia:** generar TODO el pack en la misma sesión con el mismo prompt base, variando solo el sujeto. Si las ilustraciones del site provienen de generaciones distintas con prompts distintos, se nota a la legua.

**Prompt base ejemplo (que el agente puede iterar contigo):**

```text
Style: isometric flat illustration, 3-color palette (#1A1A2E primary,
#FF6B35 accent, #FFFFFF background), soft drop shadow at 135°, no outline,
geometric shapes, minimal detail, consistent across the series. Subject: <X>.
Aspect: 1:1. Background: transparent or solid #FFFFFF.
```

### 8B.5 Cómo replicar una ilustración 3D / Spline / WebGL

Para escenas 3D del tipo Stripe, Vercel, Anthropic: el HTML no las trae como asset descargable. Tres rutas:

1. **Spline community**: buscar una scene similar en `spline.design/community`, remixarla, embedearla con `<spline-viewer>` o `@splinetool/react-spline`. Esfuerzo bajo.
2. **3dicons + composición**: combinar 3D icons de `3dicons.co` o `shapefest.com` con CSS / Motion para construir la escena. Esfuerzo medio.
3. **Three.js + React Three Fiber custom**: construir desde cero. Esfuerzo alto. Recomendado solo si la escena es el corazón del producto.

El agente lo registra en `replicacion.md` con la ruta elegida.

### 8B.6 Aspectos legales

- **Nunca descargar SVGs del site referencia y usarlos como propios.** Es plagio de asset, distinto del análisis de patrones.
- **Verificar licencia** en cada source del §8B.3 antes de usar. CC0 (sin atribución) es lo más seguro; CC-BY exige citar; freemium tiene tier comercial aparte.
- **Generación con IA**: licencias cambian. Midjourney da derechos comerciales a plan Pro+; Adobe Firefly comercial limpio; Stable Diffusion según modelo. Documentar la fuente y licencia en `extractos/<dominio>/illustrations.md` y luego en `docs/design.md`.

### 8B.7 Output esperado para este eje

Por cada dossier:

```
extractos/<dominio>/
├── svgs-raw.txt          ← SVGs inline extraídos del HTML
├── illustrations.md      ← tipo de asset + ejemplo + estilo detectado
```

Y en `docs/design.md` final, sección "Ilustraciones y assets":

```markdown
## Ilustraciones y assets visuales

**Estilo definido:** isometric flat, paleta de 3 colores, sombras suaves.

**Fuentes elegidas:**
- Personajes: Humaaans (CC) + customización de paleta a tokens propios.
- Iconografía UI: Lucide (outline 1.5px).
- 3D hero: Spline community remix + assets propios de 3dicons.
- Animaciones loop: LottieFiles Free filtradas por "isometric".

**Generación IA:** banco de 12 ilustraciones de feature generadas con
Midjourney v8 (plan Pro, licencia comercial). Prompt base versionado en
`docs/assets/midjourney-prompt-base.md`.

**Negative:** evitar 3D clay realista (no encaja con el resto), iconos
mixtos de sets distintos, ilustraciones con personajes muy detallados.
```

---

## 9. Prompt de destilación a `design.md`

Este es el prompt canónico que el alumno pasa al agente cuando tiene 3-5 dossiers extraídos. Produce el `design.md` propio **incluyendo el mapa de replicación**.

```text
He extraído tokens, fuentes, animaciones, screenshots y bundle signatures
de N sites premium de referencia. Están en extractos/<dominio-1>/,
extractos/<dominio-2>/, ...
Mi producto es <Nombre> (ver ./brief.md) y mi vertical es <vertical>.
Mi stack es: <Next.js + Tailwind + shadcn + Motion + Lenis> (ajustar).

Genera docs/design.md siguiendo estas reglas:

1. INTERSECCIÓN. Identifica patrones que aparecen en ≥3 de los N sites
   (tokens, espaciado, ritmo de animación, jerarquía tipográfica). Esos son
   "convenciones premium" y entran al design.md como principios cerrados.

2. ÚNICOS CON MOTIVO. Identifica patrones únicos de un site solo. Esos los
   señalas como "opcionales con motivo" en una sección aparte, no como canon.

3. TIPOGRAFÍA. NO sugieras tipos comerciales con licencia restrictiva.
   Lee fonts.json de cada extracto, identifica el carácter, y propón
   equivalentes open-source de la tabla de §8.2.

4. COLOR. NO copies paletas literal. Extrae la lógica (saturación baja,
   neutros cálidos, un acento crítico). Propón paleta NUEVA coherente con
   mi vertical y brief. Justifica cada token de color en una línea.

5. ANIMACIONES. Lee animations.json + reveals-map.md + bundle-signatures.json
   de cada extracto. Lista 5-7 patrones recurrentes (fade-in con offset,
   scale-on-enter, parallax suave, stagger en lista, scrub on scroll). Por
   cada uno: descripción, duración típica, easing recomendado, trigger,
   librería sugerida en mi stack.

6. NEGATIVE INSTRUCTIONS. Lista 5-8 cosas que VISTE en los extractos pero
   NO debo usar porque no encajan con mi vertical o brief. Justifica cada
   una con una frase (audiencia, tono, performance, contexto B2B).

7. MAPA DE REPLICACIÓN (etapa 7 del pipeline). Por cada efecto destacado
   del design.md, genera una entrada con:
   - Efecto observado (frase)
   - Detectado en (lista de dossiers)
   - Lib origen probable (según bundle signatures)
   - Replicación en mi stack: componente concreto del catálogo §10
     (Aceternity, Skiper, Magic UI, Motion Primitives, Animata, React Bits)
   - URL del componente
   - Esfuerzo (Bajo / Medio / Alto)
   - Alternativa si el componente no encaja: cómo construirlo desde cero
     en 50-100 líneas con mi stack
   Mínimo 8 entradas. Estas componen la sección "Sugerencias premium" del
   design.md y son lo que el alumno usa después para construir.

7B. ILUSTRACIONES Y ASSETS (sección §8B del pipeline). Lee illustrations.md
   y svgs-raw.txt de cada dossier. Identifica:
   - Estilo dominante en los referentes según la taxonomía de §8B.1
     (3D clay, geometric flat, outline, gradient mesh, etc.).
   - Si hay Lottie / Spline / WebGL custom, regístralo.
   Luego propone EN MI design.md:
   - Estilo elegido para mi producto (uno solo, coherente con mi vertical).
   - Fuente legítima por categoría: personajes, iconos, 3D hero, animaciones
     loop. Toma del catálogo §8B.3. NUNCA propongas descargar SVGs de los
     sites referencia.
   - Si el estilo requiere generación IA, propón herramienta del §8B.4 y
     un prompt base versionado.
   - Negative explícito: qué estilos NO mezclar (ej. clay realista con flat).

8. VALIDACIÓN. Al final, añade una sección "Cómo validar este design.md"
   con 5 criterios objetivos (Lighthouse Performance, CLS, a11y AA,
   coherencia con tokens, ausencia de patrones de la lista negative).

Output: docs/design.md con secciones en este orden: Voz, Tokens (Color,
Tipografía, Escala, Espacio, Radii, Sombras, Movimiento), Componentes
destacados, Animaciones recurrentes, Ilustraciones y assets visuales,
Principios, Restricciones (negative instructions), Sugerencias premium
(mapa de replicación), Validación, Referencias.

Antes de escribir, RESUME en 5 líneas los patrones de intersección que
detectaste, para que yo valide tu lectura. Después escribes el design.md.
```

Notar el último párrafo: **pausa de validación** antes de escribir el output completo. Da al alumno control y evita reescritura.

---

## 10. Catálogo de librerías de componentes premium 2026

Estas librerías encajan con el lenguaje visual premium 2026. El alumno NO las usa todas: el `design.md` (Etapa 7) decide cuáles entran según el sistema destilado.

| Librería | Stack | Fuerte en | Cuándo usar | URL |
|---|---|---|---|---|
| **Aceternity UI** | shadcn + Framer Motion | 200+ componentes con motion: glare cards, canvas cards, parallax blocks, text reveal, bento grids | Hero, features con wow, secciones diferenciadoras | `ui.aceternity.com` |
| **Skiper UI** | shadcn + Motion | Smooth-scroll, interactive cards, micro-interactions, formularios distintivos, 3D premium | Componentes que ni Magic ni Aceternity cubren bien | `skiper-ui.com` |
| **Magic UI** | React + Tailwind + Framer Motion | Landings animadas, bento, gradient cards, pricing animados | Pricing, testimonials, secciones marketing | `magicui.design` |
| **Motion Primitives** | Motion (motion.dev) | Animation primitives sobre Motion, building blocks | Construir patterns propios sin reinventar | `motion-primitives.com` |
| **Animata** | Tailwind + React | Effects copy-paste open-source, sin instalar lib | Rellenar huecos puntuales | `animata.design` |
| **React Bits** | React | Componentes animados ligeros, sin Framer Motion forzado | Cuando quieres animación pero menos overhead | `reactbits.dev` |
| **Origin UI** | shadcn | Primitives admin avanzadas, formularios complejos | Principalmente L17 | `originui.com` |
| **shadcn/ui** | Radix + Tailwind | Base accesible y customizable | Cimientos siempre | `ui.shadcn.com` |

**Regla operativa:** combinar como máximo 2-3 librerías por proyecto. Más se nota a la legua porque cada una tiene su acento.

---

## 10B. Magic MCP (21st.dev) como meta-buscador del catálogo

El catálogo §10 es la fuente de verdad. **Magic MCP de 21st.dev** se añade encima como acelerador: búsqueda semántica sobre miles de componentes indexados de varios ecosistemas, con preview visual. Plan gratis suficiente para el uso del pipeline.

### 10B.1 Qué da el plan gratis (verificado 2026-05-25)

| Feature | Plan gratis | Para qué lo usamos |
|---|---|---|
| **Inspiration Search** (búsqueda semántica componentes) | Ilimitado | Etapa 7: "card con glare y parallax" → candidatos con código |
| **SVG Logo Search** (vía svgl) | Ilimitado | §8B iconografía de marca |
| **Magic Generate** (5 variantes UI con preview) | 100 créditos/mes | Cuando el catálogo §10 no tiene lo que buscas |
| **Magic Chat + Magic MCP IDE integration** | Incluido | Integración con Claude Code |
| Site Clone | Solo Pro ($20/mes) | No lo usamos (no clonamos, analizamos) |

Inspiration Search y SVG Search NO consumen créditos. Los 100 créditos/mes se gastan en Magic Generate.

**Pricing puede cambiar** (Magic Agent estaba en beta a fecha de redacción). Verificar `help.21st.dev/magic-chat/pricing` antes de usar.

### 10B.2 Setup

Instalar el MCP server en Claude Code con API key de `21st.dev`:

```bash
# Sign-up en 21st.dev, copiar API key
# Añadir a la config MCP del proyecto (.mcp.json o config global)

{
  "mcpServers": {
    "magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest"],
      "env": { "API_KEY": "tu-api-key" }
    }
  }
}
```

Repo de referencia: `github.com/21st-dev/magic-mcp`.

### 10B.3 Cuándo usar qué

| Necesidad | Primera opción | Por qué |
|---|---|---|
| Identificar componente para efecto observado en Etapa 7 | **Magic MCP > Inspiration Search** | Búsqueda semántica gana al browsing manual del §10 |
| Componente conocido de Aceternity / Skiper / Magic UI | Catálogo §10 + WebFetch a la página oficial | Cobertura completa del ecosistema propio; Magic puede no indexar todo |
| Icono de marca (logo de empresa) | **Magic MCP > SVG Search** | Centralizado, ilimitado, sin abrir Brandfetch |
| Iconografía UI (flechas, menu, close) | Lucide / Phosphor / Tabler vía import | Set coherente; Magic search es para logos, no iconos UI genéricos |
| Generar variantes desde cero (no hay match en catálogos) | **Magic Generate** (gasta crédito) | Preview visual rápido; mejor que pedirle a Claude "5 variantes" sin preview |
| Adaptar componente existente al `design.md` | Claude + código del componente | Lo que ya hacías; el pipeline está pensado para esto |

### 10B.4 Workflow integrado en Etapa 7

Reemplaza el paso de "elegir componente del catálogo §10" por:

```text
Para cada efecto destacado del design.md:

1. Magic MCP > Inspiration Search con frase descriptiva del efecto.
   Devolveme los 3 mejores candidatos con preview y código.

2. Si alguno encaja:
   → Registralo en replicacion.md con: efecto, candidato (Magic),
     URL, esfuerzo de adaptación.
   → Si necesito adaptarlo a mis tokens, abre el código y propón
     los cambios mínimos para que cumpla docs/design.md.

3. Si ninguno encaja, fallback al catálogo §10 (Aceternity, Skiper,
   Magic UI, Motion Primitives, Animata, React Bits) consultando
   sus páginas oficiales con WebFetch.

4. Si tampoco hay, propóneme usar Magic Generate (gasta 1 crédito).
   Antes, confírmalo conmigo.

5. Última opción: construir desde cero con Motion + Tailwind, 50-100 líneas.
```

### 10B.5 Lo que Magic MCP NO sustituye

- **Bundle sniffing (§4.2):** Magic no analiza sites externos.
- **Script Playwright (§5):** Magic no extrae runtime de URLs.
- **Catálogo §10:** Magic indexa muchos componentes pero la cobertura de Aceternity/Skiper/Motion Primitives es parcial. El catálogo curado sigue siendo el mapa.
- **`design.md`:** Magic propone componentes; el sistema de diseño sigue siendo tuyo.

### 10B.6 Friction real

- API key y cuenta de 21st.dev adicionales.
- Otro MCP más en el `.mcp.json` del proyecto (cuidado con saturación; ver política MCP del módulo).
- Beta: pricing va a cambiar. Documentar fecha de verificación cada vez que el `design.md` cite Magic como fuente de componente.
- Cobertura parcial: si Magic devuelve un componente, verificar que su librería origen tenga licencia compatible con tu uso.

---

## 11. Niveles de profundidad según presupuesto de tiempo

El pipeline completo es exigente. Tres niveles según cuánto puede invertir el alumno:

### 11.1 Mínimo viable (1 hora total)

- Etapa 1 + 2: bundle sniffing del agente (5 min).
- Etapa 3: `pnpm dlx @designlang/extract <url>` (10 min).
- Etapa 6 + 7: prompt de destilación con UN solo dossier (45 min).

**Output:** un `design.md` decente pero con poca riqueza de patrones. Mapa de replicación parcial.

### 11.2 Estándar para L16 (medio día por site × 3 sites)

- Etapas 1-5 completas por site.
- Etapa 6 con 3 dossiers.
- Etapa 7 con mapa de replicación completo.

**Output:** `design.md` robusto con patrones por intersección y mapa de replicación de 8-12 componentes. Es lo que recomendamos para Tendr.

### 11.3 Premium completo (día entero × 5 sites)

- Todas las etapas + rrweb (§16.1) en sites con transiciones complejas.
- Análisis manual añadido sobre canvas/WebGL.
- Mapa de replicación cruzado con benchmarks de performance.

**Output:** `design.md` de nivel agencia. Excesivo para el curso pero útil documentarlo como techo.

---

## 12. Limitaciones honestas

| Limitación | Realidad | Mitigación |
|---|---|---|
| Anti-bot agresivo | 1-2 de 5 sites te bloquean total | Stealth + documentar el bloqueo y seguir |
| WebGL contenido | No extraíble | Identificar el efecto y replicarlo con componente del §10 |
| Tipos con licencia | No replicables | Sustituir por equivalente open-source (§8) |
| Cambios del site | El extracto es snapshot en el tiempo | Guardar timestamp + commit en `README.md` del dossier |
| Tiempo real | Promedio 1-3 h por site con análisis | Plan acorde, no prometer "5 min y listo" |
| Falsos positivos en intersección | Tres sites pueden coincidir por azar | Pasada humana sobre la lista de "convenciones" antes de canonizar |
| Falsos positivos en bundle sniffing | Strings como `motion` pueden aparecer en libs no relacionadas | El agente reporta `confidence` y cruza con señales DOM (data-attrs, window) |

---

## 13. Reglas legales y éticas

- **Análisis de patrones está permitido.** Identificar uso de paleta, tipografía, ritmo, animación es práctica estándar de la industria.
- **Replicar HTML/CSS literal NO.** Si el `design.md` propone usar el mismo blob 3D de Pomelo con la misma paleta y los mismos textos, el alumno está copiando, no inspirándose.
- **Tipografías con licencia NO replicarlas.** Identificar carácter y sustituir por equivalente open-source es legítimo.
- **Assets (imágenes, vídeos, modelos 3D) NO extraerlos como fuente.** Son derechos de terceros.
- **Robots.txt y términos del sitio.** Si el `robots.txt` prohíbe scraping intenso, respetarlo. Para análisis manual con un par de visitas de Playwright no suele aplicar, pero documentar en `stack-detect.md` que se revisó.
- **Atribución.** El `design.md` final cita los sites referencia en la sección "Referencias" con respeto, explicando qué te inspiró de cada uno.

---

## 14. Cómo lo invocan F2 y F3 de L16

### 14.1 F2 · Exploración visual con IA (ampliada)

F2 tiene tres bloques. Este pipeline cubre el bloque B.

| Bloque | Qué cubre | Referencia |
|---|---|---|
| A · Generación | Stitch 2.0 produce 3-5 direcciones generativas (sin MCP). | `_planificacion/plan.md §5.2` |
| **B · Extracción** | **Pipeline de este documento aplicado a 3-5 sites premium.** Dossiers en `extractos/`. | **Este doc, §3 al §10.** |
| C · Comparación | El alumno coteja generativas vs referencias. Elige dirección por intersección. | Decisión documentada en `docs/decisions/002-direccion-visual.md`. |

### 14.2 F3 · `design.md` como destilación (ampliada)

F3 tiene dos bloques.

| Bloque | Qué cubre | Referencia |
|---|---|---|
| A · Tokens y principios | Estructura clásica de `design.md`. | `_planificacion/plan.md §5.3` |
| **B · Negative + mapa de replicación** | **Prompt de destilación de §9 aplicado a los dossiers de F2.** Etapa 7 produce el mapa de replicación con catálogo del §10. | **Este doc, §4.7, §9 y §10.** |

---

## 15. Cómo validar el resultado

Al cerrar F3 con `design.md` producido, validas que el pipeline cumplió su función. Seis criterios objetivos:

- [ ] **Patrones por intersección documentados.** El `design.md` tiene una sección "Convenciones premium" con los patrones que aparecen en ≥3 de los N sites referencia.
- [ ] **Negative instructions con motivo.** Hay 5-8 negative instructions, cada una con justificación de una línea.
- [ ] **Tipografía sustituida, no copiada.** Ninguna fuente comercial con licencia restrictiva aparece. Las open-source elegidas mantienen el carácter detectado.
- [ ] **Paleta nueva, no replicada.** La paleta propia es coherente con la lógica observada (saturación, neutros, acento) pero diferenciable visualmente de los referentes.
- [ ] **Mapa de replicación accionable.** Sección "Sugerencias premium" lista 8+ entradas con: efecto, componente concreto, URL, esfuerzo, alternativa de reconstrucción.
- [ ] **Bundle signatures coherentes con animaciones.** Si el `design.md` propone "scrub on scroll con GSAP", el bundle sniffing de al menos un dossier confirma GSAP. Sin invenciones.
- [ ] **Ilustraciones con fuente legítima y licencia documentada.** La sección "Ilustraciones y assets" identifica el estilo, declara un estilo elegido único, lista la fuente por categoría (personajes, iconos, 3D, Lottie) tomada del §8B.3, y documenta licencia. Ningún SVG descargado de los sites referencia.

Si alguno falla, repasar el dossier correspondiente o re-correr el prompt de destilación con más restricciones.

---

## 16. Apéndice · herramientas humanas opcionales y MCP

Estas piezas NO están en el pipeline canónico. Se usan cuando un caso lo justifica.

### 16.1 rrweb · grabación reproducible (humana)

rrweb graba todas las mutaciones del DOM + scroll + canvas + estilos en un stream JSON. Luego se reproduce en un iframe pixel-perfect con `rrweb-player`. Es lo más cercano a tener al diseñador del site explicándotelo en cámara.

**Por qué NO está en el pipeline canónico:** el output (`session.rrweb.json`) pesa megas y es una serialización de eventos del navegador, no texto interpretable. El agente no lo consume de forma útil; gastarías 50k-200k tokens leyendo eventos crudos para sacar info que ya tienes en screenshots + `animations.json`.

**Por qué SÍ existe esta sección:** cuando el site tiene transiciones complejas que no entiendes solo con screenshots (transitions de página, morph entre estados, secuencias largas de scroll-scrub), tú lo grabas, tú lo reproduces, tú entiendes, y pasas al agente 2-3 screenshots del player en momentos clave + una descripción en texto.

**Cómo activarlo (manual):**

```js
// Añadir al script de §5 ANTES del bucle de scroll
await page.addInitScript({ path: 'node_modules/rrweb/dist/rrweb.min.js' });
await page.evaluate(() => {
  window.__events = [];
  window.rrweb.record({
    emit: e => window.__events.push(e),
    recordCanvas: true,
    inlineStylesheet: true,
  });
});
// ... ejecutar scrolls e interacciones ...
const events = await page.evaluate(() => window.__events);
await writeFile(
  resolve(outDir, 'session.rrweb.json'),
  JSON.stringify(events)
);
```

**Reproducir:**

```bash
pnpm dlx rrweb-player extractos/pomelo/session.rrweb.json
```

Abre un viewer local. Pausas, mueves el timeline, inspeccionas DOM real. **Para tus ojos, no para el agente.**

### 16.2 Playwright MCP · follow-up exploratorio (no sustituye al script)

`playwright` como CLI **no resuelve nada del pipeline**: su CLI sirve para instalar navegadores y `codegen`, no para "haz X en una web". El control real es por código (script de §5) o por MCP.

**El script de §5 es el canon.** Es reproducible, versionable, gratis en tokens por acción. La "memoria del procedimiento" vive ahí.

**Playwright MCP** (Microsoft) sirve para una cosa concreta y distinta: **exploración interactiva post-extracción**. Casos legítimos:

- "Agente, haz hover sobre el botón principal del hero de Pomelo y devuélveme los computed styles. Quiero entender un detalle que el script no capturó."
- "Abre pomelo.la y haz click en el menú móvil. Captura el estado abierto."
- "Mové el cursor sobre la card de Pricing y describime la animación frame a frame."

**Cuándo NO usar MCP:** como reemplazo del script. Si lo usas para hacer el pipeline entero, vas a quemar miles de tokens en algo que un script resuelve en 30 segundos y deja artefactos en disco.

**Regla:** script para el pipeline. MCP para preguntar cosas puntuales después.

### 16.3 Comando rápido para arrancar el pipeline de cero

```bash
# Setup una vez por máquina
pnpm add -D playwright playwright-extra puppeteer-extra-plugin-stealth
pnpm exec playwright install chromium

# Por site, una sola pasada del nivel estándar
URL="https://pomelo.la/en"
DOMAIN=$(echo "$URL" | awk -F[/:] '{print $4}' | sed 's/\./-/g')
mkdir -p "extractos/$DOMAIN"

# Etapa 2: bundle sniffing lo hace el agente vía Bash, no es comando único.

# Etapa 3: tokens
pnpm dlx @designlang/extract "$URL" \
  --out "extractos/$DOMAIN" \
  --emit tokens.json,tokens.css,DESIGN.md,audit.json

# Etapa 4: runtime
node _compartido/operacion/_assets/extract-runtime.mjs \
  "$URL" "extractos/$DOMAIN"
```

### 16.4 Estructura final del dossier (recordatorio)

```
extractos/<dominio>/
├── README.md             ← qué se extrajo + timestamp + URL
├── stack-detect.md       ← lectura humana del stack (bundle + Wappalyzer)
├── bundle-signatures.json ← firmas raw del bundle sniffing
├── tokens.json           ← DTCG
├── tokens.css            ← CSS custom properties
├── DESIGN.md             ← draft generado por design-extract / dembrandt
├── audit.json            ← WCAG + health audit
├── animations.json       ← Web Animations capturadas por scroll-Y
├── reveals.json          ← elementos visibles por scroll-Y
├── reveals-map.md        ← lectura humana de reveals + animaciones
├── interactions.json     ← estados hover/focus
├── fonts.json            ← fuentes cargadas
├── network.har           ← HAR completo
├── full-page.png         ← screenshot full-page
├── screenshots/          ← screenshots por parada de scroll
├── replicacion.md        ← efecto → componente concreto (granular por site)
└── session.rrweb.json    ← opcional, sesión reproducible (§16.1)
```

### 16.5 Referencias canónicas

- design-extract repo: `github.com/Manavarya09/design-extract`
- dembrandt repo: `github.com/dembrandt/dembrandt`
- rrweb repo: `github.com/rrweb-io/rrweb`
- Playwright docs: `playwright.dev`
- Playwright MCP: `github.com/microsoft/playwright-mcp`
- W3C Design Tokens spec (DTCG): `tr.designtokens.org`

---

*Documento vivo. Última actualización 2026-05-25. Cambios significativos se documentan en commit con `docs(m5): pipeline-extraccion <descripción>`.*
