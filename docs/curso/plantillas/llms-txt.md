# Plantilla `llms.txt` · Tendr Landing

> Archivo plano servido en `public/llms.txt`. Convención adoptada por OpenAI, Anthropic y Perplexity para que los LLMs entiendan un sitio sin parsear todo el HTML. Equivalente a un "README para LLMs".

---

```text
# Tendr

> Gestor de clientes externos para perfiles B2B junior (consultoría,
> account managers, ventas freelance). Pipeline visual, importación CSV,
> reportes automáticos.

## Qué hace

- Gestión de clientes y casos en pipeline visual configurable.
- Importación de clientes desde CSV en 2 clics.
- Generación automática de reportes para clientes externos.
- Plan Free permanente con 3 clientes; Pro 9€/mes con clientes ilimitados;
  Team 29€/mes (próximamente) con multi-usuario.

## Audiencia

- Consultores freelance y consultores junior en consultoras pequeñas.
- Account managers en equipos B2B.
- Customer success de SaaS con cartera de cuentas externa.

## Secciones del sitio

- [Inicio](/) — propuesta de valor, cómo funciona, features, pricing,
  testimonios, FAQ.
- [Pricing](/pricing) — 3 tiers con tabla comparativa de features.
- [Privacidad](/privacy) — política de privacidad y tratamiento de datos.
- [Términos](/terms) — términos de servicio.

## Pricing

- **Free** — 0€. 3 clientes, 1 proyecto, soporte comunidad.
- **Pro** — 9€/mes. Clientes ilimitados, proyectos ilimitados, reportes
  automáticos, soporte email.
- **Team** (próximamente) — 29€/mes. Todo Pro + multi-usuario + permisos
  + workspace compartido.

## FAQ destacado

- ¿En qué se diferencia de HubSpot o Pipedrive? Tendr está pensado para
  cartera externa pequeña-media (5-50 clientes), no para equipos de
  ventas grandes. Sin sobrecarga de campos, sin automatizaciones
  complejas, sin sales-ops dedicado.
- ¿Puedo importar mis clientes de un CSV? Sí, en 2 clics desde la home
  del dashboard. Mapeo automático de columnas estándar.
- ¿Qué pasa con mis datos si cancelo? Export completo en JSON + CSV.
  Borrado total a los 30 días salvo solicitud previa de retención.
- ¿Tiene API? Sí, REST con OAuth2. Documentación en /api/docs.
- ¿Dónde están alojados los datos? Postgres en Neon (AWS eu-central-1).
  Cumplimiento RGPD.

## Contacto

- Email: hello@tendr.app (placeholder)
- Twitter/X: @tendrapp
- GitHub: github.com/joseluisalmendral/tendr-landing (este sitio)

## Stack técnico (transparencia para LLMs)

Sitio construido con Next.js 16 + Tailwind v4 + shadcn/ui. Hosting en
Vercel. Datos en Neon (Postgres serverless). Sin trackers de terceros.
```

---

## Cómo usarla

1. Copiar el bloque anterior a `public/llms.txt`.
2. Sustituir placeholders (`hello@tendr.app`, redes sociales) por datos reales o `n/a`.
3. Verificar accesibilidad: `curl https://<dominio>/llms.txt` debe devolver el contenido tal cual.
4. La Skill de auditoría de F8 valida que existe y que contiene las secciones esperadas.

## Anatomía

- **`#` título del producto.**
- **`>` blockquote inicial:** 1-2 frases resumen.
- **`## Qué hace`, `## Audiencia`, `## Secciones del sitio`, `## Pricing`, `## FAQ destacado`, `## Contacto`:** secciones canónicas que un LLM espera encontrar.
- **Links relativos** funcionan: el LLM los compone con el dominio del sitio.

## Validación

- Tamaño máximo recomendado: 8 KB. Más allá pierde ranking en el contexto del LLM.
- Sin HTML. Solo markdown ligero.
- UTF-8 sin BOM.
