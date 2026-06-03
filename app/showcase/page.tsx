import { notFound } from "next/navigation";
import { ChartLineUp } from "@phosphor-icons/react/dist/ssr";

import { Hero } from "@/components/landing/Hero";
import { Section } from "@/components/landing/Section";
import { Feature } from "@/components/landing/Feature";
import { PricingCard } from "@/components/landing/PricingCard";
import { TestimonialCard } from "@/components/landing/TestimonialCard";
import { FAQ } from "@/components/landing/FAQ";
import { SkipLink } from "@/components/a11y/SkipLink";
import { cn } from "@/lib/utils";

/**
 * DEV-ONLY component gallery for the Tendr landing library.
 *
 * Not a product page: it renders every base landing component grouped by type,
 * plus the real SkipLink, so the team can eyeball the components in isolation.
 * The v2 token authority + WCAG audit lives in the dedicated playground at
 * `/showcase/design`; this page is purely the component gallery (the v1 token
 * swatch grid and the PaperGrain comparison strip were retired in the v2 token
 * migration — both were v1-only archaeology).
 *
 * Server Component, zero client JS of its own, token utilities only (no
 * hardcoded hex), suave-medio radii (design.md §2.5).
 *
 * Production gate: this route returns 404 in any non-development build, so it
 * never ships. The gate is the FIRST thing the component does.
 */
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
        {/* A11y: the real SkipLink + a static :focus-visible preview.       */}
        {/* ---------------------------------------------------------------- */}
        <Section heading="Accesibilidad · SkipLink">
          <div className="flex flex-col gap-8">
            <p className="max-w-[65ch] text-body text-text-secondary">
              El SkipLink real ya está montado al principio de la página (es el
              primer elemento enfocable). Está oculto con{" "}
              <span className="font-mono">sr-only</span> hasta que lo enfocas con
              el teclado: pulsa la tecla Tab al cargar la página y aparecerá
              arriba a la izquierda.
            </p>

            <div className="flex flex-col gap-3">
              <span className="font-mono text-meta uppercase text-text-tertiary">
                Preview del estado :focus-visible
              </span>
              <p className="max-w-[65ch] text-body-sm text-text-secondary">
                Esto es una reproducción visual estática del SkipLink ya enfocado
                (no es el componente real, solo muestra cómo se ve el estilo
                :focus-visible sin tener que tabular).
              </p>
              {/* Static visual replica of the SkipLink focus-visible styles
                  (v2: flat surface + hairline + ink focus ring, suave-medio). */}
              <span
                className={cn(
                  "inline-flex w-fit items-center justify-center",
                  "rounded-md border border-border-strong bg-surface-raised px-4 py-2",
                  "text-body-sm font-medium text-text-primary",
                  "focus-ring",
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
