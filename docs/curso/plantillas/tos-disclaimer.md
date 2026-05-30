# Plantilla `docs/decisions/003-deploy-tos.md` · Tendr Landing

> ADR ligero documentando la lectura crítica del ToS de Vercel Hobby y la decisión del alumno sobre plan de hosting. Fecha de revisión obligatoria al pie.

---

```markdown
# 003 · Plan de hosting y ToS de Vercel

**Estado:** propuesto / aceptado / superado.
**Fecha:** 2026-MM-DD.
**Revisión próxima recomendada:** 2027-MM-DD (anual o cuando Vercel cambie ToS).

---

## Contexto

Tendr es un producto que va a monetizar (Pro 9€/mes, Team 29€/mes próximamente).
La landing pública es la puerta de entrada al funnel comercial.

El plan **Vercel Hobby** (free tier) tiene letra pequeña relevante:

> "Hobby accounts are intended for personal, non-commercial use. Commercial
> use requires upgrading to Pro or higher."
> — vercel.com/docs/pricing

Aunque "non-commercial" no se define con líneas concretas, Vercel ha bloqueado
en el pasado proyectos Hobby que servían:

- Aplicaciones con autenticación de usuarios pagantes.
- Sitios con tráfico mensual > 100K visits.
- Endpoints API monetizados.

Para Tendr, la landing en sí misma no factura, pero captura emails para un
producto que sí factura. La frontera es ambigua.

## Decisión

Elegir UNA opción y justificar:

### Opción A · Mantener en Hobby (riesgo asumido)

- Coste: 0€/mes.
- Riesgo: si Vercel detecta uso comercial, puede limitar o bloquear el proyecto.
  Generalmente avisan antes (email + 7-14 días para upgrade o move out).
- Aplicable: en fase pre-validación de producto, sin tracción real todavía.

### Opción B · Upgrade a Pro

- Coste: 20$/mes (~18€/mes).
- Garantía: uso comercial explícitamente permitido en ToS.
- Beneficios añadidos: 1TB bandwidth, function execution más largo,
  team members, analytics avanzado, password protection para previews.
- Aplicable: cuando hay tracción real y el coste se justifica con ARR.

### Opción C · Migrar a alternativa

- Candidatos viables 2026:
  - **Netlify Free**: similar a Vercel Hobby, ToS más permisivo con uso
    comercial pequeño.
  - **Cloudflare Pages Free**: 500 builds/mes, bandwidth ilimitado.
    Buen ajuste para landings estáticas + edge functions.
  - **Render Static**: 100GB bandwidth/mes free, sin restricción comercial.
- Coste: 0€ en free tiers respectivos.
- Tradeoff: menos integración nativa con Next.js que Vercel. Build adapters
  varían en madurez (Cloudflare Pages requiere `@cloudflare/next-on-pages`).

**Decisión del alumno (rellenar):**

[Opción elegida + 2-3 líneas de razonamiento personal según contexto del
proyecto y presupuesto.]

## Tradeoffs aceptados

- [Listar 2-4 tradeoffs concretos según la opción elegida.]

## Consecuencias

- [Acciones operativas derivadas: setup billing si A→B, migración de
  configuración si C, etc.]

## Referencias

- Vercel ToS: <https://vercel.com/legal/terms> (consultado YYYY-MM-DD).
- Vercel Pricing: <https://vercel.com/docs/pricing> (consultado YYYY-MM-DD).
- Vercel Fair Use Policy: <https://vercel.com/docs/limits/fair-use-guidelines>
  (consultado YYYY-MM-DD).
- Comparativa Netlify vs Vercel 2026: [link blog reciente].
- Cloudflare Pages docs: <https://developers.cloudflare.com/pages/>
  (consultado YYYY-MM-DD).
```

---

## Cómo usar la plantilla

1. Copiar el bloque markdown a `docs/decisions/003-deploy-tos.md`.
2. Rellenar fecha, revisión próxima, decisión del alumno con razonamiento real.
3. Verificar cada URL de la sección Referencias antes de commitear (los enlaces de Vercel suelen cambiar de path).
4. Commit con prefijo `docs(L16-F9): ADR sobre plan de hosting y ToS`.
5. Añadir entrada a `CHANGELOG-CURSO.md` si existe.

## Refresco anual

Poner recordatorio en calendario un año desde la fecha. El ToS de Vercel cambia de media 2-3 veces al año. Si la opción A está activa, monitorizar email de Vercel.
