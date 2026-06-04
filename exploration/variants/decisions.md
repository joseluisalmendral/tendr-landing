# Variantes · Decisiones (F6.5)

> Resultado del tanteo guiado de la fase 6.5. Define qué variantes se construyen, por qué, y cómo se mide su éxito. Fuentes: `docs/product.md` (audiencia, JTBD, diferencial, pricing) y `docs/design.md` (voz). Cerrado en conversación el 2026-06-04.

**Contexto que condiciona los criterios:** Tendr no ha lanzado todavía. El tráfico esperado es bajo, así que los criterios usan deltas relativos y muestras mínimas como umbral de decisión honesto, no significancia estadística formal.

---

## 1. Variantes A/B del hero

Se eligen dos hipótesis, cada una sobre una palanca distinta. Se descartó una tercera (posicionamiento por contraste explícito vs Salesforce) por riesgo de meter ruido enterprise en un público junior.

### H1 — Dolor vs. aspiración (palanca: ángulo del headline)

- **Variante A (actual):** headline anclado al dolor del JTBD — "no se te caen oportunidades ni tareas".
- **Variante B:** headline anclado a la identidad profesional aspiracional — proyectar al usuario al rol que quiere tener (estilo "trabaja tus clientes como un account manager senior, sin serlo todavía").
- **Motivo:** la audiencia junior puede responder más a resolver el caos de hoy o a proyectarse al rol deseado. El resultado define el ángulo de todo el copy futuro, no solo el hero.
- **Qué aprenderíamos:** qué ángulo de mensaje (dolor presente vs. aspiración de rol) mueve a esta audiencia.
- **Criterio de éxito:**
  - Métrica: click-through del CTA primario del hero (clicks / visitas que ven el hero).
  - Delta: B gana con ≥ +20% relativo sobre A, con mínimo 100 visitas por variante.
  - Empate o muestra insuficiente → se mantiene A (dolor).

### H2 — Nivel de compromiso del CTA (palanca: fricción)

- **Variante A (actual):** CTA primario "Empieza gratis" directo.
- **Variante B:** CTA primario "Mira cómo funciona" (scroll/demo) con el registro como CTA secundario.
- **Motivo:** un perfil junior que quizá nunca usó un CRM puede necesitar ver el producto antes de comprometerse con un registro.
- **Qué aprenderíamos:** en qué etapa de madurez llega el tráfico (listo para registrarse vs. necesita prueba previa).
- **Criterio de éxito:**
  - Métrica primaria: conversión end-to-end a registro/waitlist por variante (el click del CTA no es comparable entre variantes por diseño).
  - Métrica secundaria: scroll-depth hasta "Cómo funciona".
  - Delta: B gana con conversión final ≥ +15% relativa. Si B sube el scroll pero baja el registro, pierde — el scroll solo no paga.

### Desviación documentada — fila de logos en Variante B (regla de 4 elementos del hero)

> Añadido al implementar las variantes A/B del hero (componentes `Hero.tsx` con `variant="centered"` y `HeroWithSocialProof.tsx`). No reescribe las hipótesis H1/H2 anteriores: las complementa con la regla visual que B incumple a propósito.

- **Qué es la desviación:** el hero base respeta el límite de 4 elementos de texto (titular, subhead, 2 CTAs; sin trust-strip ni tagline — design-spec-visual §1). La **Variante B** añade una **fila de logos (eyebrow) ANTES del titular**, lo que la convierte en un 5.º elemento por encima del tope.
- **Cómo se acota el incumplimiento:** la fila es **solo logos** (marcas monograma placeholder, sin etiquetas de categoría ni texto suelto), decorativa (`aria-hidden`) con una única línea `sr-only` que aclara que son marcas ilustrativas previas al lanzamiento (Tendr no tiene clientes reales que citar). No es un trust-strip de microcopy ni una tagline bajo los CTAs.
- **Motivo:** la audiencia junior B2B puede no conocer Tendr; mostrar credibilidad antes de la propuesta de valor podría "calentar" al lector antes de que llegue al titular. Esa palanca solo se puede testear si la prueba social va **primera**, por encima del titular — de ahí el 5.º elemento.
- **Hipótesis:** anteponer prueba social al titular sube la confianza percibida y, con ella, el click-through del CTA primario respecto a un hero sin prueba social sobre el pliegue (Variante A, que la omite deliberadamente).
- **A descartar si:** la fila de logos baja el click-through del CTA (la prueba social placeholder pre-lanzamiento resta credibilidad en vez de sumarla) o introduce ruido visual que distrae del titular. En ese caso, se vuelve al hero de 4 elementos.

### ✅ CIERRE F6.5 — decisión final del hero (2026-06-04)

> Subsección de cierre añadida al promover el hero a producción. No reescribe las hipótesis H1/H2 ni los criterios de arriba: los conserva como referencia para cuando exista tráfico.

- **Elegida:** **Variante B "Social proof primero"** (`components/landing/HeroWithSocialProof.tsx`) — promovida a `/` al cierre de F6.5. Es el hero de producción de la landing principal.
- **Descartada:** **Variante A "CTA central directo"** (la rama `variant="centered"` de `Hero.tsx`). Su código se **eliminó por completo**: se quitaron la rama centrada y la prop `variant` de `Hero.tsx`, el tipo `HeroVariant` de `types.ts`, y las rutas dev-only de previsualización A/B (`app/variants/`). `Hero.tsx` permanece porque `/agencias` lo sigue usando con copy de la vertical.
- **Cómo se tomó la decisión — honestidad:** la elección se hizo **por criterio, pre-lanzamiento**. **No corrió tráfico real** contra los criterios H1/H2 documentados arriba (Tendr aún no ha lanzado). Esos criterios A/B quedan **documentados a propósito** para ejecutarse cuando exista tráfico; hoy son la pauta de medición futura, no la base de esta decisión.
- **Estado de producción:** la **desviación documentada de 4 elementos** de la Variante B (la fila de logos eyebrow ANTES del titular, que la lleva a un 5.º elemento) es ahora el **estado de producción** del hero principal, acotada como se describe arriba (solo marcas monograma placeholder, decorativas `aria-hidden`, con la línea `sr-only` que aclara que son ilustrativas previas al lanzamiento).

---

## 2. Variante de vertical

### Elegida: agencias pequeñas / estudios (2-5 personas)

- **Motivo:** Tendr no ha lanzado; la variante sirve como experimento de validación de demanda del plan Team (29€/mes, hoy "próximamente") antes de construirlo. Se prioriza la señal de negocio sobre la entregabilidad inmediata.
- **Giro de copy:** de "tu cartera de clientes" a "los clientes del estudio". Énfasis en visibilidad compartida: que todo el equipo sepa en qué punto está cada cliente sin preguntar en Slack.
- **Features a destacar:** kanban global como tablero de equipo, plantillas con marca del estudio, plan Team como protagonista del pitch.
- **Riesgo asumido:** el plan Team aún no existe; la vertical empuja hacia algo no entregable hoy. Se acepta porque la validación pre-construcción es el objetivo.
- **Descartada:** account managers / CS junior in-house (CRM personal del empleado). Pitch 100% entregable hoy, pero roza el anti-scope ("no integra con Salesforce") y no aporta señal de validación nueva.
- **Criterio de éxito:**
  - Métrica primaria: interés explícito en Team — clicks en "avísame cuando salga Team" (o equivalente) en la página de la vertical.
  - Métrica guardrail: conversión general de la vertical no inferior a -20% vs. la landing base.
  - Umbral de decisión: ≥ 10 interesados en Team sobre las primeras ~200 visitas = demanda suficiente para priorizar construir el plan Team.

---

*Documento de decisiones de la fase 6.5. Si una variante cambia de hipótesis o criterio, actualizar aquí antes de tocar código.*
