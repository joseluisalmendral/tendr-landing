import dynamic from "next/dynamic";

import { SkipLink } from "@/components/a11y/SkipLink";
import { Header } from "@/components/landing/Header";
import { HeroWithSocialProof } from "@/components/landing/HeroWithSocialProof";
import { Section } from "@/components/landing/Section";
import { PRICING } from "@/components/landing/pricing.data";
import { TESTIMONIALS } from "@/components/landing/testimonials.data";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

// PERF (bundle-dynamic-imports): the below-the-fold client components are the
// heavy hydration cost that competes with the Hero on the main thread during
// initial load (Motion-driven, scroll-hijack pan, FLIP, etc.). Code-split them
// into lazy chunks. `ssr` stays true (default) so their HTML is still
// server-rendered — no CLS, no lost SEO content — but their client JS hydrates
// in separate chunks instead of inflating the first-load bundle. The Hero (LCP)
// and its wow are imported statically and untouched.
const HowItWorks = dynamic(() =>
  import("@/components/landing/HowItWorks").then((m) => m.HowItWorks),
);
const FeatureShowcase = dynamic(() =>
  import("@/components/landing/FeatureShowcase").then((m) => m.FeatureShowcase),
);
const Pricing = dynamic(() =>
  import("@/components/landing/Pricing").then((m) => m.Pricing),
);
const TestimonialsCork = dynamic(() =>
  import("@/components/landing/TestimonialsCork").then(
    (m) => m.TestimonialsCork,
  ),
);
import { JsonLd } from "@/components/seo/JsonLd";
import { ogImage, pageMetadata, siteUrl } from "@/components/seo/metadata";
import type { FaqItem, PricingCardProps } from "@/components/landing/types";

export const metadata = pageMetadata({
  title: "Tendr · mini-CRM con IA para freelancers y perfiles junior",
  description:
    "Tendr organiza tu cartera de clientes, casos y seguimientos. La IA te avisa qué cliente está en riesgo. Gratis para empezar.",
  path: "/",
});

// TODO(F6): copy provisional. Las variantes finales de copy se definen en F6.

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Qué es Tendr y para quién?",
    answer:
      "Tendr es un mini-CRM para perfiles B2B junior y freelances que gestionan clientes externos. Reúne tus clientes, casos y notas en un solo sitio, con la estructura de un CRM ya hecha pero sin la complejidad ni el precio de Salesforce. Pensado para una persona o un equipo pequeño.",
  },
  {
    question: "¿En qué se diferencia de HubSpot o Salesforce?",
    answer:
      "Tendr está pensado para una persona o un equipo pequeño, no para grandes departamentos de ventas. Arranca gratis y se usa el primer día, sin semanas de configuración ni administradores. HubSpot y Salesforce resuelven la empresa grande; Tendr resuelve tu cartera de clientes sin esa carga.",
  },
  {
    question: "¿Cuánto cuesta?",
    answer:
      "Tendr arranca gratis. El plan Free cubre lo básico para empezar, Pro cuesta 9€ al mes con uso ilimitado para profesionalizarte, y Team llega a 29€ al mes para equipos pequeños (próximamente). Puedes empezar sin compromiso y pasar a Pro cuando tu cartera crezca.",
  },
  {
    question: "¿Tengo que pagar la IA aparte?",
    answer:
      "No pagas la IA a Tendr. Usas tu propia clave de API (OpenAI, Anthropic, Gemini, DeepSeek o Kimi) y abonas solo el consumo real a tu proveedor. Tu clave viaja cifrada con envelope encryption, así que el coste de IA queda bajo tu control, sin sorpresas en la factura.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer:
      "Sí. Tus datos viven en Postgres gestionado en Neon con Row-Level Security activada desde el primer día, así que cada usuario solo ve los suyos. Las claves de API se guardan cifradas con envelope encryption AES-256-GCM. La seguridad es parte del diseño, no un añadido posterior.",
  },
  {
    question: "¿Puedo exportar mis datos si dejo de usarlo?",
    answer:
      "Sí, cuando quieras. Puedes exportar tus clientes, casos y notas a CSV en cualquier momento, sin pedir permiso ni esperar. Tus datos son tuyos: Tendr no los retiene si decides irte a otra herramienta.",
  },
  {
    question: "¿Cómo se compara con mi CRM casero en Notion o Airtable?",
    answer:
      "Tendr llega con el modelo de CRM ya hecho y funcionando: clientes, casos, kanban, plantillas e IA. Notion y Airtable son muy flexibles, pero te toca diseñar y mantener tu propio sistema desde cero. Con Tendr te ahorras ese montaje y empiezas a trabajar el primer día.",
  },
  {
    question: "¿Dónde se alojan mis datos?",
    answer:
      "Tus datos viven en una base de datos gestionada en la nube, con Row-Level Security activada desde el primer día: cada usuario accede solo a los suyos, aislado del resto. Las claves de API se guardan cifradas con envelope encryption AES-256-GCM, y puedes exportar o borrar tus datos cuando quieras.",
  },
  {
    question: "¿Hay versión self-hosted?",
    answer:
      "No. Tendr es un servicio gestionado (SaaS): te registras y empiezas, sin servidores que mantener ni nada que instalar por tu cuenta. No hay versión self-hosted en esta etapa, así que la operación y las actualizaciones corren de nuestra parte.",
  },
  {
    question: "¿Necesito tarjeta para el plan Free? ¿Puedo cancelar cuando quiera?",
    answer:
      "No necesitas tarjeta para usar el plan Free: te registras y empiezas a ordenar tu cartera sin compromiso. Si pasas a Pro o Team, puedes cancelar cuando quieras, sin permanencia ni penalización. Pruebas con calma y subes de plan solo si te aporta.",
  },
];

// Public offers for the SoftwareApplication schema: only the purchasable Free
// and Pro tiers, derived from PRICING so the price is a single source of truth
// (Team is "próximamente", so it is not advertised as an active offer).
const APP_OFFERS = [
  PRICING.find((tier) => tier.tier === "Free"),
  PRICING.find((tier) => tier.tier === "Pro"),
]
  .filter((tier): tier is PricingCardProps => Boolean(tier))
  .map((tier) => ({
    "@type": "Offer" as const,
    name: tier.tier,
    price: tier.price,
    priceCurrency: tier.priceCurrency,
  }));

const ORGANIZATION = {
  "@type": "Organization" as const,
  name: "Tendr",
  url: siteUrl.toString(),
};

export default function Home() {
  return (
    <>
      {/* GEO/SEO: SoftwareApplication structured data for answer engines and
          rich results. Sits before <main> so crawlers read the product schema
          up front. Prices come from PRICING; rating is intentionally omitted
          until real reviews exist (no invented numbers). */}
      <JsonLd
        type="SoftwareApplication"
        data={{
          name: "Tendr",
          description:
            "Mini-CRM con IA para freelancers y perfiles B2B junior: organiza tu cartera de clientes, casos y seguimientos en un pipeline visual.",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: siteUrl.toString(),
          screenshot: ogImage(),
          offers: APP_OFFERS,
          author: ORGANIZATION,
          publisher: ORGANIZATION,
        }}
      />

      <SkipLink />
      <Header />

      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        {/* WOW #1: sticky overlap Hero -> "Cómo funciona". El Hero queda
            fijado (.wow-hero-pin) y hace fade + scale-down (.wow-hero-fade)
            mientras la sección de abajo sube y lo cubre. El pin se ACOTA a
            .wow-overlap-group (Hero + esta sección): así el sticky deja de
            actuar al terminar "Cómo funciona" y el Hero atenuado no se solapa
            sobre el resto de la página. CSS scroll-driven en app/globals.css,
            gateado por prefers-reduced-motion + @supports. */}
        <div className="wow-overlap-group">
          <div className="wow-hero-pin">
          <div className="wow-hero-fade">
            <HeroWithSocialProof
              title="Mira de un vistazo qué toca con cada cliente hoy"
              subtitle="Organiza clientes, casos y notas en un solo sitio, sin la sobrecarga de Salesforce ni la rigidez de Notion. Pensado para perfiles B2B junior."
              ctaPrimary={{ label: "Quiero acceso anticipado", href: "#precios" }}
              ctaSecondary={{ label: "Ver cómo funciona ↓", href: "#como-funciona" }}
            />
          </div>
        </div>

        <Section
          id="como-funciona"
          heading="Cómo funciona"
          className="wow-overlap-section"
        >
          <HowItWorks />
        </Section>
        </div>

        {/* WOW #2: page-peel Funciones -> Pricing. "Funciones" queda fijada
            (.wow-peel-pin) y su hoja (.wow-peel-leaf) se inclina hacia atrás
            (perspective + rotateX, origen arriba) como una página que se levanta,
            mientras "Pricing" (.wow-peel-cover) sube y la cubre. Driven por un
            view-timeline con nombre (--peel) compartido vía timeline-scope en el
            grupo. CSS scroll-driven en globals.css, gateado por
            prefers-reduced-motion + @supports: sin soporte/reduced-motion las dos
            secciones van en flujo normal apiladas. */}
        <div className="wow-peel-group">
          <div className="wow-peel-pin">
            <div className="wow-peel-leaf">
              <Section
                id="funciones"
                heading="Un CRM con todo lo que necesitas"
                divider
              >
                <FeatureShowcase />
              </Section>
            </div>
          </div>

          <Section
            id="precios"
            heading="Un plan para cada momento"
            className="wow-peel-cover pt-24 md:pt-28"
          >
            <Pricing tiers={PRICING} />
          </Section>
        </div>

        {/* Testimonios: tablero de CORCHO a sangre completa con marco de madera
            visible (v2.2). En desktop con motion, el scroll vertical conduce un
            PAN lateral cinematográfico sobre 7 notas clavadas (scroll-hijack
            con spacer dimensionado -> CLS 0); cada nota entra con su variante y
            la chincheta se clava con overshoot. Con reduced-motion o por debajo
            de md cae a una grilla estática legible (nada oculto, sin secuestrar
            el scroll). La isla TestimonialsCork es dueña de su propio
            <h2 id="testimonios-title"> y del id="testimonios" para el ancla; NO
            usa <Section> (no puede romper a sangre completa) y SIN divider: el
            marco de madera es el límite de la sección. */}
        <TestimonialsCork testimonials={TESTIMONIALS} />

        <Section id="faq" heading="Preguntas frecuentes" divider>
          <FAQ items={FAQ_ITEMS} />
        </Section>
      </main>

      <Footer />
    </>
  );
}
