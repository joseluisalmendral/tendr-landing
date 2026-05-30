# Design System · Tendr

> Spec versionado del sistema visual. Lock para todas las fases de construcción. Cualquier desviación es bug, no creatividad.

**Versión:** 1.0. **Última actualización:** TODO. **Producto:** Tendr (landing pública).

---

## 1. Voz

TODO: 3-5 líneas. Tono, registro, palabras prohibidas, palabras canónicas.

Ejemplo:
- Confiable, ágil, sin corporativismo.
- Sin jerga ("synergy", "leverage", "empower").
- Frases cortas. Verbos directos. Cero adjetivos huecos.
- Sentence case en títulos. Title case prohibido.

---

## 2. Tokens

### 2.1 Color

Notación: oklch. AA contra body bg como mínimo en cualquier combinación texto + fondo.

| Token | Valor | Justificación (1 línea) |
|---|---|---|
| `--bg` | TODO | Body background, fondo dominante |
| `--fg` | TODO | Foreground, texto principal |
| `--muted` | TODO | Texto secundario, captions |
| `--accent` | TODO | Acento crítico, CTAs primarios |
| `--accent-fg` | TODO | Texto sobre acento |
| `--surface` | TODO | Cards, paneles |
| `--border` | TODO | Bordes 1px |
| `--success` | TODO | Confirmaciones |
| `--danger` | TODO | Errores, destructivos |

### 2.2 Tipografía

| Rol | Familia | Peso | Origen |
|---|---|---|---|
| Display | TODO | TODO | Google Fonts / @fontsource |
| Body | TODO | TODO | Google Fonts / @fontsource |
| Mono | TODO | TODO | Google Fonts / @fontsource |

Restricciones tipográficas:
- Ningún tipo con licencia comercial restrictiva.
- Display y body de la misma familia o de familias visualmente coherentes.

### 2.3 Escala tipográfica

Base 16px. Ratio TODO (1.2 / 1.25 / 1.333).

| Nivel | Tamaño | Line-height | Letter-spacing |
|---|---|---|---|
| `display-xl` | TODO | TODO | TODO |
| `display-lg` | TODO | TODO | TODO |
| `h1` | TODO | TODO | TODO |
| `h2` | TODO | TODO | TODO |
| `h3` | TODO | TODO | TODO |
| `body-lg` | TODO | TODO | TODO |
| `body` | TODO | TODO | TODO |
| `body-sm` | TODO | TODO | TODO |
| `caption` | TODO | TODO | TODO |

### 2.4 Espacio

Base 4pt. Escala TODO.

| Token | Valor |
|---|---|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-12` | 48px |
| `space-16` | 64px |
| `space-24` | 96px |

### 2.5 Radii

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | TODO | Inputs, small buttons |
| `radius-md` | TODO | Cards, dialogs |
| `radius-lg` | TODO | Hero blocks, large surfaces |
| `radius-full` | 9999px | Pills, avatars |

### 2.6 Sombras

| Token | Valor | Uso |
|---|---|---|
| `shadow-sm` | TODO | Cards en reposo |
| `shadow-md` | TODO | Cards en hover |
| `shadow-lg` | TODO | Dialogs, popovers |

### 2.7 Movimiento

| Token | Valor | Uso |
|---|---|---|
| `duration-fast` | 150ms | Micro-interactions (hover) |
| `duration-base` | 250ms | Transitions de UI |
| `duration-slow` | 400ms | Reveals on scroll |
| `easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default |
| `easing-emphasis` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Reveals |

---

## 3. Componentes destacados

TODO: lista de componentes propios que requieren cuidado especial (Hero, PricingCard, FAQ accordion, etc.) con notas de comportamiento y restricciones.

---

## 4. Animaciones recurrentes

5-7 patrones que se usan en la landing. Por cada uno: descripción, duración, easing, trigger, librería.

| Patrón | Descripción | Duración | Easing | Trigger | Librería |
|---|---|---|---|---|---|
| TODO | TODO | TODO | TODO | TODO | TODO |

---

## 5. Principios

TODO: 5-8 principios accionables.

Ejemplo:
- Jerarquía con peso tipográfico, no con tamaño desbordado.
- Espacio blanco generoso entre secciones (mínimo `space-16`).
- Motion sutil, nunca protagónico.
- Densidad informativa alta en above-the-fold; baja en footer.
- Asymmetric grids permitidos solo en hero y testimonios.

---

## 6. Restricciones (negative instructions)

5-8 cosas que NO se hacen. Cada una con motivo de una línea.

- TODO: restricción. **Motivo:** TODO.
- TODO: restricción. **Motivo:** TODO.

Ejemplo:
- No usar Inter. **Motivo:** overused en SaaS landings 2026, debilita carácter.
- No glassmorphism. **Motivo:** dating fast, perjudica accesibilidad y contraste.
- No 3 columnas de features con iconos arriba. **Motivo:** patrón saturado, lectura de tutorial.
- No gradient sobre texto del hero. **Motivo:** baja AA y se ve generado por IA.

---

## 7. Sugerencias premium (catálogo 2026)

5-10 componentes de Aceternity, Skiper, Magic UI, Motion Primitives, Animata.
Máximo 3 librerías combinadas para no diluir el sistema.

| Componente | Librería | URL | Qué aporta | Dónde usarlo en Tendr |
|---|---|---|---|---|
| TODO | TODO | TODO | TODO | TODO |

---

## 8. Cómo validar este `design.md`

Criterios objetivos verificables. La Skill de auditoría de F8 los chequea.

- [ ] Lighthouse Performance ≥ 95 en mobile.
- [ ] CLS < 0.1 medido en producción.
- [ ] Accesibilidad AA en todos los componentes interactivos.
- [ ] Tokens del sistema usados al 100% (cero hex hardcoded en componentes).
- [ ] Ningún patrón de la sección Restricciones presente en código.

---

## 9. Referencias

Sites del pipeline de F2 citados con respeto (qué se aprendió de cada uno).

- TODO: site referencia. Qué se destiló: TODO.
- TODO: site referencia. Qué se destiló: TODO.

---

*Spec vivo. Cambios significativos requieren commit con prefijo `docs(design): ...` y bump de versión en cabecera.*
