import dynamic from "next/dynamic";

import { SkipLink } from "@/components/a11y/SkipLink";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Section } from "@/components/landing/Section";
import { PRICING_AGENCIAS } from "@/components/landing/agencias/pricing-agencias.data";
import { TESTIMONIALS_AGENCIAS } from "@/components/landing/agencias/testimonials-agencias.data";
import { FAQ } from "@/components/landing/FAQ";
import { Waitlist } from "@/components/landing/Waitlist";
import { Footer } from "@/components/landing/Footer";

// PERF (bundle-dynamic-imports): mirror the base page exactly — the
// below-the-fold client components are code-split into lazy chunks (ssr stays
// true so HTML is server-rendered: no CLS, no lost SEO content) while the Hero
// (LCP) and its wow stay statically imported. This is the SAME infrastructure
// as app/page.tsx; only the copy/data differ for the agencies vertical.
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
const SubscribeForm = dynamic(() =>
  import("@/components/landing/SubscribeForm").then((m) => m.SubscribeForm),
);
import { JsonLd } from "@/components/seo/JsonLd";
import { ogImage, pageMetadata, siteUrl } from "@/components/seo/metadata";
import type { FaqItem, PricingCardProps } from "@/components/landing/types";

/**
 * /agencias — "Tendr para agencias" (F6.5 vertical variant).
 *
 * This is a PRESENTATION emphasis shift of the SAME product (not a new product,
 * not a new data model). It reuses the base infrastructure wholesale:
 *  - SAME shell (SkipLink + Header + main + Footer), SAME wow choreography
 *    (WOW #1 Hero→Cómo funciona overlap, WOW #2 Funciones→Pricing page-peel),
 *    SAME section components.
 *  - SAME SEO/GEO infra: the metadata helper, the SoftwareApplication JSON-LD
 *    shape, the Product/FAQPage/Organization JSON-LD emitted by the reused
 *    components. robots.ts / sitemap.ts / llms.txt are NOT duplicated or
 *    extended for this route (hard rule §1) — /agencias is indexable like the
 *    base via the default robots `allow: '/'`.
 *
 * What differs (the vertical emphasis): Hero copy (agencies of 5-20 people,
 * client portfolios per account manager), Pricing (Team highlighted, Free framed
 * as evaluation, waitlist-honest CTAs), Testimonials (3 agency personas), FAQ
 * (2 vertical questions added, 2 freelance-specific removed). The features
 * re-prioritisation (multi-user/permissions above CSV import) is expressed in
 * the pricing card feature ordering (PRICING_AGENCIAS), since the FeatureShowcase
 * panels are the shared core product capabilities.
 */

export const metadata = pageMetadata({
  title: "Tendr para agencias · el mini-CRM del estudio",
  description:
    "Tendr da a tu estudio una vista compartida de cada cliente: cada account manager lleva su cartera y tú ves la foto completa. Pensado para agencias de 5 a 20 personas.",
  path: "/agencias",
});

// FAQ for the agencies vertical. Derived from the base FAQ (app/page.tsx):
//  - KEPT: qué es / diferencia con HubSpot / cuánto cuesta / IA aparte / datos
//    seguros / exportar datos / dónde se alojan / self-hosted.
//  - ADDED (brief §5): "¿cómo gestiono múltiples account managers?" and
//    "¿hay descuento por volumen para equipos de 10+?", answered honestly and
//    grounded in docs/product.md (Team próximamente; volume discount not yet
//    defined — an honest "tell us" answer, no invented commitment).
//  - REMOVED (brief §5): the two MOST freelance-specific base sub-queries:
//    (1) "¿Cómo se compara con mi CRM casero en Notion o Airtable?" — a solo
//        builder's concern; an agency evaluates against a shared team CRM, not a
//        personal Notion board.
//    (2) "¿Necesito tarjeta para el plan Free? ¿Puedo cancelar cuando quiera?" —
//        an individual low-commitment friction question; for a studio the
//        decision moment is the team plan and shared visibility, not solo
//        no-card sign-up.
const FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Qué es Tendr y para qué le sirve a una agencia?",
    answer:
      "Tendr es un mini-CRM para estudios y agencias pequeñas que gestionan carteras de clientes externos. Reúne clientes, casos y notas en un solo sitio, con la estructura de un CRM ya hecha pero sin la complejidad ni el precio de Salesforce. Pensado para equipos de 5 a 20 personas que quieren ver en qué punto está cada cliente sin preguntar en Slack.",
  },
  {
    question: "¿En qué se diferencia de HubSpot o Salesforce?",
    answer:
      "Tendr está pensado para un estudio pequeño, no para grandes departamentos de ventas. Arranca gratis y se usa el primer día, sin semanas de configuración ni administradores. HubSpot y Salesforce resuelven la empresa grande; Tendr resuelve la cartera del estudio sin esa carga.",
  },
  {
    question: "¿Cómo gestiono varios account managers en Tendr?",
    answer:
      "Hoy cada persona usa su propio Tendr (planes Free y Pro) para llevar su cartera. La gestión compartida del estudio (multi-usuario hasta 10, permisos por rol y un workspace común donde cada account manager ve lo suyo y tú la foto completa) llega con el plan Team, que está próximamente. Puedes dejarnos tu interés desde la sección de precios para avisarte en cuanto salga.",
  },
  {
    question: "¿Hay descuento por volumen para equipos de 10 o más?",
    answer:
      "Todavía no está definido. El plan Team (próximamente) cubre hasta 10 colaboradores a 29€ al mes; para estudios más grandes aún no hemos cerrado precios por volumen. Si sois 10 o más, dínoslo apuntándote al aviso de Team y lo tendremos en cuenta al definirlos. Preferimos no prometer un descuento que aún no existe.",
  },
  {
    question: "¿Cuánto cuesta?",
    answer:
      "Tendr arranca gratis. El plan Free cubre lo básico para evaluarlo, Pro cuesta 9€ al mes por persona con uso ilimitado, y Team llega a 29€ al mes para el estudio (multi-usuario hasta 10), próximamente. Puedes empezar sin compromiso y pasar a Team cuando esté disponible.",
  },
  {
    question: "¿Tenemos que pagar la IA aparte?",
    answer:
      "No pagáis la IA a Tendr. Usáis vuestra propia clave de API (OpenAI, Anthropic, Gemini, DeepSeek o Kimi) y abonáis solo el consumo real a vuestro proveedor. La clave viaja cifrada con envelope encryption, así que el coste de IA queda bajo vuestro control, sin sorpresas en la factura.",
  },
  {
    question: "¿Los datos del estudio están seguros?",
    answer:
      "Sí. Vuestros datos viven en Postgres gestionado en Neon con Row-Level Security activada desde el primer día, así que cada usuario solo ve los suyos. Las claves de API se guardan cifradas con envelope encryption AES-256-GCM. La seguridad es parte del diseño, no un añadido posterior.",
  },
  {
    question: "¿Podemos exportar los datos si dejamos de usarlo?",
    answer:
      "Sí, cuando queráis. Podéis exportar clientes, casos y notas a CSV en cualquier momento, sin pedir permiso ni esperar. Vuestros datos son vuestros: Tendr no los retiene si decidís iros a otra herramienta.",
  },
  {
    question: "¿Dónde se alojan nuestros datos?",
    answer:
      "Vuestros datos viven en una base de datos gestionada en la nube, con Row-Level Security activada desde el primer día: cada usuario accede solo a los suyos, aislado del resto. Las claves de API se guardan cifradas con envelope encryption AES-256-GCM, y podéis exportar o borrar vuestros datos cuando queráis.",
  },
  {
    question: "¿Hay versión self-hosted?",
    answer:
      "No. Tendr es un servicio gestionado (SaaS): os registráis y empezáis, sin servidores que mantener ni nada que instalar por vuestra cuenta. No hay versión self-hosted en esta etapa, así que la operación y las actualizaciones corren de nuestra parte.",
  },
];

// Public offers for the SoftwareApplication schema: only the purchasable Free
// and Pro tiers, derived from PRICING_AGENCIAS so the price stays a single
// source of truth (Team is "próximamente", so it is not advertised as an active
// offer). SAME shape as the base page — no new GEO infra.
const APP_OFFERS = [
  PRICING_AGENCIAS.find((tier) => tier.tier === "Free"),
  PRICING_AGENCIAS.find((tier) => tier.tier === "Pro"),
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

export default function AgenciasPage() {
  return (
    <>
      {/* GEO/SEO: SoftwareApplication structured data, SAME shape as the base
          page (no new JSON-LD type, no duplicated GEO infra). Description leans
          into the agencies emphasis; prices come from PRICING_AGENCIAS; rating is
          intentionally omitted until real reviews exist (no invented numbers). */}
      <JsonLd
        type="SoftwareApplication"
        data={{
          name: "Tendr para agencias",
          description:
            "Mini-CRM con IA para estudios y agencias pequeñas: una vista compartida de la cartera de clientes, casos y seguimientos en un pipeline visual.",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: new URL("/agencias", siteUrl).toString(),
          screenshot: ogImage(),
          offers: APP_OFFERS,
          author: ORGANIZATION,
          publisher: ORGANIZATION,
        }}
      />

      <SkipLink />
      <Header anchorBase="/agencias" />

      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        {/* WOW #1: identical sticky overlap Hero -> "Cómo funciona" as the base
            page. Same .wow-overlap-group / .wow-hero-pin / .wow-hero-fade hooks,
            same CSS scroll-driven choreography (app/globals.css), same
            prefers-reduced-motion gating. Only the Hero COPY differs. */}
        <div className="wow-overlap-group">
          <div className="wow-hero-pin">
          <div className="wow-hero-fade">
            <Hero
              title="Mira de un vistazo en qué punto está cada cliente del estudio"
              subtitle="Cada account manager lleva su cartera y tú ves la foto completa, sin preguntar en Slack. Pensado para estudios y agencias de 5 a 20 personas."
              ctaPrimary={{ label: "Quiero acceso para el estudio", href: "#waitlist" }}
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

        {/* WOW #2: identical page-peel Funciones -> Pricing as the base page.
            Same .wow-peel-group / .wow-peel-pin / .wow-peel-leaf / .wow-peel-cover
            hooks and view-timeline. Only the section heading copy is tuned to the
            agencies emphasis. */}
        <div className="wow-peel-group">
          <div className="wow-peel-pin">
            <div className="wow-peel-leaf">
              <Section
                id="funciones"
                heading="Un CRM con todo lo que necesita el estudio"
                divider
              >
                <FeatureShowcase />
              </Section>
            </div>
          </div>

          <Section
            id="precios"
            heading="Un plan para cada momento del estudio"
            className="wow-peel-cover pt-24 md:pt-28"
          >
            {/* Team is highlighted via PRICING_AGENCIAS (data-driven); the moving
                recommender opens on Team via defaultWork="equipo". The selector
                stays interactive. The single waitlist CTA carries the Team-angle
                label since Team is the protagonist of the agencies vertical. */}
            <Pricing
              tiers={PRICING_AGENCIAS}
              defaultWork="equipo"
              ctaLabel="Avísame cuando salga Team"
            />
          </Section>
        </div>

        {/* Testimonios: SAME full-bleed cork-board island as the base, with the 3
            agency placeholder personas. The component owns its own heading/anchor
            and motion; we only swap the data. */}
        <TestimonialsCork testimonials={TESTIMONIALS_AGENCIAS} />

        <Section id="faq" heading="Preguntas frecuentes" divider>
          <FAQ items={FAQ_ITEMS} />
        </Section>

        {/* Waitlist: SAME shared Waitlist composition as the base page, moved to
            close the page after the FAQ (funnel: pricing -> social proof ->
            objections -> ask). Only the framing copy shifts to the studio/team
            angle; the SubscribeForm stays the page-owned dynamic() import passed
            in as children so the code-split is preserved. */}
        <Waitlist
          heading="Apúntate a la waitlist"
          lead="El plan Team aún no está abierto. Déjanos el email del estudio y seréis de los primeros en probarlo cuando abramos el acceso: un único correo con vuestra invitación, sin newsletters ni spam."
        >
          <SubscribeForm />
        </Waitlist>
      </main>

      <Footer anchorBase="/agencias" />
    </>
  );
}
