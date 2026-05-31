import { notFound } from "next/navigation";
import {
  ChartLineUp,
  Sparkle,
  Keyboard,
} from "@phosphor-icons/react/dist/ssr";

import { Hero } from "@/components/landing/Hero";
import { Section } from "@/components/landing/Section";
import { Feature } from "@/components/landing/Feature";
import { PricingCard } from "@/components/landing/PricingCard";
import { TestimonialCard } from "@/components/landing/TestimonialCard";
import { FAQ } from "@/components/landing/FAQ";
import { SkipLink } from "@/components/a11y/SkipLink";
import { cn } from "@/lib/utils";

/**
 * DEV-ONLY component showcase for the Tendr landing library.
 *
 * Not a product page: it renders every base landing component grouped by type,
 * a full token swatch grid (design.md §2.1) and the real SkipLink, so the team
 * can eyeball the system in isolation. Server Component, zero client JS of its
 * own, token utilities only (no hardcoded hex), radius 0 except the primary CTA.
 *
 * Production gate: this route returns 404 in any non-development build, so it
 * never ships. The gate is the FIRST thing the component does.
 */

/** A single token swatch: a box filled with the token's bg utility + a label. */
type Swatch = {
  /** Tailwind bg utility generated from the @theme color token. */
  bg: string;
  /** Human-facing token name shown under the chip. */
  token: string;
  /** Short role note from design.md §2.1. */
  note?: string;
  /** Render the chip text in light ink when the fill is dark. */
  onDark?: boolean;
};

/** Swatch groups mirror the design.md §2.1 token table, one chip per color. */
const swatchGroups: { group: string; swatches: Swatch[] }[] = [
  {
    group: "Superficies",
    swatches: [
      { bg: "bg-surface", token: "surface", note: "papel cream, fondo dominante" },
      { bg: "bg-surface-raised", token: "surface-raised", note: "superficie elevada" },
      { bg: "bg-surface-sunken", token: "surface-sunken", note: "zonas hundidas" },
    ],
  },
  {
    group: "Tintas de texto",
    swatches: [
      { bg: "bg-text-primary", token: "text-primary", note: "tinta casi negra", onDark: true },
      { bg: "bg-text-secondary", token: "text-secondary", note: "subtexto", onDark: true },
      { bg: "bg-text-muted", token: "text-muted", note: "metadata, labels", onDark: true },
    ],
  },
  {
    group: "Acento primario (amber = acción)",
    swatches: [
      { bg: "bg-accent-primary", token: "accent-primary", note: "CTA en reposo" },
      { bg: "bg-accent-primary-hover", token: "accent-primary-hover", note: "hover del CTA" },
      { bg: "bg-accent-primary-active", token: "accent-primary-active", note: ":active del CTA" },
      { bg: "bg-on-accent", token: "on-accent", note: "texto sobre amber", onDark: true },
    ],
  },
  {
    group: "Acento secundario (clay = atención)",
    swatches: [
      { bg: "bg-accent-secondary", token: "accent-secondary", note: "anotaciones, border-left", onDark: true },
      { bg: "bg-accent-secondary-soft", token: "accent-secondary-soft", note: "highlight tenue" },
    ],
  },
  {
    group: "Estados funcionales",
    swatches: [
      { bg: "bg-success", token: "success", note: "teal OK / datos", onDark: true },
      { bg: "bg-success-soft", token: "success-soft", note: "badge positivo" },
      { bg: "bg-warning", token: "warning", note: "aviso tostado" },
      { bg: "bg-danger", token: "danger", note: "error / destructivo", onDark: true },
      // Nota: design.md §2.1 no define un token danger-soft. No existe utilidad
      // bg-danger-soft generada; si se necesita, hay que agregarlo al @theme.
    ],
  },
  {
    group: "Bordes y focus",
    swatches: [
      // El hairline se expone como --color-border (mapea --border-hairline), no
      // como --color-border-hairline. La utilidad correcta es bg-border.
      { bg: "bg-border", token: "border (hairline)", note: "borde 1px diluido" },
      { bg: "bg-border-strong", token: "border-strong", note: "borde de tinta plena", onDark: true },
      { bg: "bg-focus-ring", token: "focus-ring", note: "anillo de foco clay", onDark: true },
    ],
  },
  {
    group: "Washes del hero",
    swatches: [
      { bg: "bg-wash-from", token: "wash-from", note: "inicio del wash (amber)" },
      { bg: "bg-wash-to", token: "wash-to", note: "fin del wash (clay)" },
    ],
  },
  {
    group: "Tinte de sombra y deshabilitado",
    swatches: [
      { bg: "bg-shadow-tint", token: "shadow-tint", note: "tinte del hard shadow", onDark: true },
      { bg: "bg-disabled-bg", token: "disabled-bg", note: "fondo deshabilitado" },
      { bg: "bg-disabled-fg", token: "disabled-fg", note: "texto deshabilitado" },
    ],
  },
];

export default function ShowcasePage() {
  // Production gate: never render this route outside development.
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <>
      <SkipLink />

      <main id="main" tabIndex={-1} className="bg-surface text-text-primary">
        {/* ---------------------------------------------------------------- */}
        {/* Hero: owns the page's single <h1>. We render exactly one.        */}
        {/* ---------------------------------------------------------------- */}
        <Hero
          title="Tu pipeline de clientes, sin la hoja de cálculo"
          subtitle="Tendr ordena tus clientes y te dice a quién seguir hoy. Pensado para freelancers junior que recién arrancan."
          ctaPrimary={{ label: "Empezar gratis", href: "/registro" }}
          ctaSecondary={{ label: "Ver cómo funciona", href: "/demo" }}
          image={{
            src: "/hero-pipeline-empty.svg",
            alt: "Pipeline de clientes vacío listo para llenar",
            width: 640,
            height: 480,
          }}
        />

        {/* ---------------------------------------------------------------- */}
        {/* Section: with eyebrow and without eyebrow.                       */}
        {/* ---------------------------------------------------------------- */}
        <Section
          eyebrow="Componente · Section"
          heading="Section con eyebrow"
        >
          <p className="max-w-[65ch] text-body text-text-secondary">
            Bloque vertical con pill mono opcional encima del título. El
            presupuesto de un eyebrow cada tres secciones lo controla quien
            compone la página, no el componente.
          </p>
        </Section>

        <Section heading="Section sin eyebrow">
          <p className="max-w-[65ch] text-body text-text-secondary">
            La misma sección sin el pill. El título solo ya ubica el bloque y
            evita el ritmo templado de un eyebrow en cada encabezado.
          </p>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Feature: one icon variant, one image variant.                    */}
        {/* ---------------------------------------------------------------- */}
        <Section heading="Feature (icono e imagen)">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Feature
              title="Seguimientos al día"
              description="Tendr marca a quién escribir hoy según cuándo hablaste por última vez, así ningún cliente se enfría en el olvido."
              visual={{ kind: "icon", icon: ChartLineUp }}
              link={{ label: "Ver seguimientos", href: "/seguimientos" }}
            />
            <Feature
              title="Pipeline visual"
              description="Arrastra cada cliente entre etapas. El tablero arranca vacío y se llena a medida que sumas trabajo."
              visual={{
                kind: "image",
                src: "/hero-pipeline-empty.svg",
                alt: "Tablero de pipeline con tres columnas vacías",
                width: 640,
                height: 480,
              }}
            />
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* PricingCard: normal + highlighted side by side.                  */}
        {/* ---------------------------------------------------------------- */}
        <Section heading="PricingCard (normal y destacada)">
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
            <PricingCard
              tier="Gratis"
              price="0"
              priceCurrency="EUR"
              period="/mes"
              features={[
                "Hasta 25 clientes",
                "Pipeline visual con 3 etapas",
                "Recordatorios de seguimiento",
              ]}
              cta={{ label: "Empezar gratis", href: "/registro" }}
              productName="Tendr Gratis"
              productDescription="Plan inicial para freelancers que recién empiezan a ordenar clientes."
            />
            <PricingCard
              highlighted
              tier="Pro"
              price="12"
              priceCurrency="EUR"
              period="/mes"
              features={[
                "Clientes ilimitados",
                "Sugerencias de seguimiento con IA",
                "Importar clientes por CSV",
                "Informe mensual de actividad",
              ]}
              cta={{ label: "Probar Pro", href: "/registro?plan=pro" }}
              productName="Tendr Pro"
              productDescription="Para freelancers que ya viven de sus clientes y quieren no perder ninguno."
            />
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* TestimonialCard: realistic Spanish freelancer attributions.      */}
        {/* ---------------------------------------------------------------- */}
        <Section heading="TestimonialCard">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <TestimonialCard
              name="Martina Cabrera"
              role="Diseñadora freelance"
              company="estudio propio"
              quote="Antes llevaba a mis clientes en una hoja de cálculo que nunca abría. Ahora abro Tendr y sé a quién escribir hoy."
              avatar={{ src: "/avatars/martina-c.svg", width: 64, height: 64 }}
            />
            <TestimonialCard
              name="Bruno Quiroga"
              role="Consultor de marketing"
              company="independiente"
              quote="Lo que más me sirvió fue dejar de perder seguimientos. Sumar un cliente nuevo me lleva diez segundos."
              avatar={{ src: "/avatars/bruno-q.svg", width: 64, height: 64 }}
            />
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* FAQ: realistic sub-query questions.                              */}
        {/* ---------------------------------------------------------------- */}
        <Section heading="FAQ">
          <FAQ
            items={[
              {
                question: "¿En qué se diferencia de HubSpot?",
                answer:
                  "HubSpot está pensado para equipos de ventas grandes. Tendr es un mini-CRM para una sola persona: menos campos, menos configuración y foco en a quién seguir hoy.",
              },
              {
                question: "¿Puedo importar mis clientes por CSV?",
                answer:
                  "Sí. En el plan Pro subes un CSV con nombre, email y etapa, y Tendr crea las fichas de cliente automáticamente.",
              },
              {
                question: "¿Necesito tarjeta para empezar?",
                answer:
                  "No. El plan Gratis no pide tarjeta y te deja gestionar hasta 25 clientes sin límite de tiempo.",
              },
              {
                question: "¿Mis datos quedan privados?",
                answer:
                  "Tus clientes solo los ves vos. No compartimos ni vendemos tus datos, y puedes exportarlos o borrarlos cuando quieras.",
              },
            ]}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Tokens: one swatch per color from design.md §2.1.                */}
        {/* ---------------------------------------------------------------- */}
        <Section heading="Tokens de color (design.md §2.1)">
          <div className="flex flex-col gap-12">
            {swatchGroups.map((groupBlock) => (
              <div key={groupBlock.group} className="flex flex-col gap-4">
                <h3 className="font-heading text-h3 text-text-primary">
                  {groupBlock.group}
                </h3>
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {groupBlock.swatches.map((swatch) => (
                    <li
                      key={swatch.token}
                      className="flex flex-col overflow-hidden border border-border-strong bg-surface-raised"
                    >
                      {/* The chip itself is the token utility in action. */}
                      <div
                        className={cn(
                          "flex h-20 items-end p-2",
                          swatch.bg,
                          swatch.onDark ? "text-surface" : "text-text-primary",
                        )}
                      >
                        <span className="font-mono text-meta uppercase">
                          {swatch.bg}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 p-3">
                        <span className="font-mono text-body-sm text-text-primary">
                          {swatch.token}
                        </span>
                        {swatch.note ? (
                          <span className="text-caption text-text-secondary">
                            {swatch.note}
                          </span>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="max-w-[65ch] text-body-sm text-text-secondary">
              Nota: el hairline se expone como{" "}
              <span className="font-mono">--color-border</span> (utilidad{" "}
              <span className="font-mono">bg-border</span>), no como{" "}
              <span className="font-mono">--color-border-hairline</span>. Y no
              existe un token <span className="font-mono">danger-soft</span> en
              design.md §2.1, asi que no hay utilidad{" "}
              <span className="font-mono">bg-danger-soft</span> generada.
            </p>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* A11y: the real SkipLink + a static :focus-visible preview.       */}
        {/* ---------------------------------------------------------------- */}
        <Section heading="Accesibilidad · SkipLink">
          <div className="flex flex-col gap-8">
            <p className="max-w-[65ch] text-body text-text-secondary">
              El SkipLink real ya esta montado al principio de la pagina (es el
              primer elemento enfocable). Esta oculto con{" "}
              <span className="font-mono">sr-only</span> hasta que lo enfocas con
              el teclado: pulsa la tecla Tab al cargar la pagina y aparecera
              arriba a la izquierda.
            </p>

            <div className="flex flex-col gap-3">
              <span className="font-mono text-meta uppercase text-text-muted">
                Preview del estado :focus-visible
              </span>
              <p className="max-w-[65ch] text-body-sm text-text-secondary">
                Esto es una reproduccion visual estatica del SkipLink ya enfocado
                (no es el componente real, solo muestra como se ve el estilo
                :focus-visible sin tener que tabular).
              </p>
              {/* Static visual replica of the SkipLink focus-visible styles. */}
              <span
                className={cn(
                  "inline-flex w-fit items-center justify-center",
                  "border border-border-strong bg-background px-4 py-2",
                  "text-body-sm font-medium text-foreground",
                  "shadow-hard ring-2 ring-ring ring-offset-2",
                )}
              >
                Saltar al contenido
              </span>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
