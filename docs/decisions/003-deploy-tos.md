# 003 · Plan de hosting y ToS de Vercel

**Estado:** propuesto (opciones documentadas; decisión pendiente).
**Fecha:** 2026-06-05.
**Revisión próxima recomendada:** 2027-06-05 (anual, o antes si Vercel cambia ToS/Fair Use).

---

## Contexto

Tendr es un producto que va a monetizar (Pro 9€/mes, Team 29€/mes próximamente).
La landing pública — desplegada en Vercel Hobby — es la puerta de entrada al
funnel comercial: muestra pricing con planes de pago y captura emails de waitlist.

Lectura crítica de las fuentes oficiales (consultadas 2026-06-05; docs con
`last_updated: 2026-02-27`):

### Uso comercial

El ToS es explícito:

> "You shall only use the Services under a Hobby plan for your personal or
> non-commercial use."
> — vercel.com/legal/terms, §4

Y las Fair Use Guidelines definen comercial de forma amplia:

> "Commercial usage is defined as any Deployment that is used for the purpose
> of financial gain of **anyone** involved in **any part of the production**
> of the project [...] Examples include: Any method of requesting or
> processing payment from visitors of the site; **Advertising the sale of a
> product or service**; Receiving payment to create, update, or host the site."
> — vercel.com/docs/limits/fair-use-guidelines#commercial-usage

**Implicación directa para Tendr:** la landing anuncia la venta de un producto
(página de pricing con tiers de pago, aunque digan "próximamente"). Bajo la
definición literal, esto **ya es uso comercial hoy**, sin necesidad de facturar.
No es una zona gris de tráfico o monetización futura: el criterio es la
*finalidad* del deployment, no sus ingresos actuales. Incluso pedir donaciones
cuenta como comercial según la misma página.

### Qué puede hacer Vercel (y con cuánto aviso)

Dos señales contradictorias que conviene tener documentadas juntas:

> "We may shut down and terminate projects or deployments using the Hobby plan
> **without notice for any reason or no reason**." — ToS §4

> "Where possible, we'll reach out to you ahead of any action we take to
> address unreasonable usage and work with you to correct it." — Fair Use

Es decir: la práctica habitual es avisar (el "te escribimos antes" de fair use),
pero el contrato les permite cortar sin aviso. El riesgo legal-operativo real de
la opción A es ese: cero garantía contractual.

### Límites cuantitativos del Hobby (mensuales)

| Recurso | Hobby | Pro |
|---|---|---|
| Fast Data Transfer (bandwidth) | 100 GB | 1 TB |
| Fast Origin Transfer | 10 GB | 100 GB |
| Function Invocations | 1.000.000 | — (PAYG) |
| Function Execution | 100 GB-Hrs | 1.000 GB-Hrs |
| Active CPU | 4 CPU-hrs | 16 CPU-hrs |
| Build Execution | 100 hrs (6.000 min) | 400 hrs (24.000 min) |
| Function max duration | 10s (config. hasta 60s) | 15s (config. hasta 300s) |
| Deployments por día | 100 | 6.000 |

**Qué pasa al exceder límites en Hobby:** no hay overage de pago — la feature
se pausa hasta que pasen 30 días ("you will have to wait until 30 days have
passed before you can use the feature again", docs/plans/hobby). Para una
landing con form de captura, exceder invocations/execution = **form muerto
hasta el reset**, sin opción de pagar el exceso.

### Qué triggerea el upgrade forzado a Pro

1. **Uso comercial detectado** — el trigger que aplica a Tendr: "All commercial
   usage of the platform requires either a Pro or Enterprise plan."
2. **Uso atípico de recursos** — "We will notify you if your usage is an
   outlier"; primero contacto, luego acción.
3. **Carga sobre infraestructura / incidentes** — ToS §4 permite apagar
   proyectos Hobby ante problemas de rendimiento, con o sin aviso.
4. **Eludir límites** — "Circumventing or otherwise misusing Vercel's limits
   [...] is a violation of our fair use guidelines."

Para los números actuales de la landing (~6 KB SSR por página, sin imágenes
pesadas, un Server Action por signup), los límites cuantitativos quedan
lejísimos. El riesgo de Tendr no es de volumen: es **cualitativo** (cláusula
comercial).

## Decisión

Se documentan las tres opciones SIN decidir todavía. La decisión se tomará
antes del lanzamiento público del producto (L17).

### Opción A · Mantener en Hobby (riesgo asumido) — 0 €/mes

- Coste cero mientras el producto no está lanzado ni factura.
- Riesgo: la landing ya encaja en la definición de uso comercial (advertising
  de planes de pago). Vercel puede exigir upgrade o cortar; la práctica
  documentada es avisar primero, el contrato no lo garantiza.
- Mitigación parcial mientras dure: el repo tiene CI + integración Git — migrar
  o upgradear es cuestión de horas, no días. El form puede pausarse sin tirar
  la landing (la captura degrada con mensaje de error, la página sigue arriba).
- Encaje: fase actual pre-lanzamiento, validación de la waitlist.

### Opción B · Upgrade a Pro — 20 $/mes (~18 €/mes)

- Uso comercial explícitamente permitido: elimina el riesgo cualitativo entero.
- Sube todos los límites (1 TB bandwidth, 1.000 GB-Hrs functions, 24.000 build
  minutes) y añade pay-as-you-go para excesos — el form nunca se pausa 30 días.
- Extras útiles para producto: password protection en previews, log retention
  1 día, email support, spend management.
- Encaje: en cuanto el producto facture o la waitlist demuestre tracción; 20$/mes
  se justifica contra el primer cliente Pro (9€/mes × 3).

### Opción C · Migrar a alternativa — 0 €/mes

Candidatos 2026 (a verificar en detalle ANTES de decidir; los ToS de terceros
cambian igual que el de Vercel):

- **Cloudflare Pages / Workers (free):** bandwidth ilimitado en estático,
  builds limitados. Next.js vía `@opennextjs/cloudflare` (el adapter actual;
  el viejo `next-on-pages` está superado). Functions → Workers (límites
  propios). Sin restricción comercial en el free tier.
- **Netlify (free):** ToS más permisivo con uso comercial pequeño; runtime
  Next.js propio. 100 GB bandwidth/mes.
- **Render (static free):** 100 GB bandwidth/mes, sin restricción comercial;
  pero el Server Action de subscribe necesitaría un service de pago o rediseño.

- Tradeoff común: Next.js 16 (App Router + Server Actions + PPR) tiene su mejor
  soporte en Vercel; cualquier alternativa añade un adapter con su propia
  matriz de compatibilidad y sus propios gotchas de runtime.

**Decisión del alumno (rellenar):**

[Opción elegida + 2-3 líneas de razonamiento personal según contexto del
proyecto y presupuesto.]

## Tradeoffs aceptados

Mientras el estado sea "propuesto", el statu quo es la Opción A de facto, y se
aceptan conscientemente estos tradeoffs:

- La landing opera en contra de la letra del ToS (advertising de producto de
  pago en Hobby); se asume el riesgo de aviso/corte mientras no haya tracción.
- Sin pay-as-you-go: un pico viral podría pausar funciones (form caído) hasta
  30 días.
- El coste de salida está minimizado (CI, IaC ligera, ADRs): migrar o upgradear
  es una operación de horas.

## Consecuencias

- Documentar este ADR en el README (disclaimer ToS) — hecho en F9.
- Revisar esta decisión al cerrar L17 (producto real) o ante el primer email
  de Vercel sobre uso, lo que llegue antes.
- Si A→B: setup billing en el dashboard (Settings → Billing → Upgrade); los
  deploys y env vars no cambian.
- Si A→C: provisionar adapter (`@opennextjs/cloudflare` o runtime Netlify),
  migrar env vars y smoke test completo antes de cambiar DNS.
- Recordatorio anual en calendario: el ToS de Vercel cambia 2-3 veces al año.

## Referencias

- Vercel ToS, §4 (Hobby): <https://vercel.com/legal/terms> (consultado 2026-06-05).
- Vercel Fair Use Guidelines (definición de commercial usage + usage
  guidelines): <https://vercel.com/docs/limits/fair-use-guidelines>
  (consultado 2026-06-05; last_updated 2026-02-27).
- Vercel Hobby plan (límites y billing cycle):
  <https://vercel.com/docs/plans/hobby> (consultado 2026-06-05).
- Cloudflare adapter: <https://opennext.js.org/cloudflare>.
- Netlify Next.js runtime: <https://docs.netlify.com/frameworks/next-js/overview/>.
