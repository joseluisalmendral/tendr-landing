import type { PricingCardProps } from "@/components/landing/types";

/**
 * Pricing tiers dataset (single source of truth for the home Pricing section,
 * the /pricing page and the SoftwareApplication `APP_OFFERS` JSON-LD).
 *
 * Extracted to its own module (mirrors `testimonials.data.ts`) so the same tier
 * values feed both the page-level structured data and the visible cards without
 * being duplicated inline. Do NOT fork these values per page: prices are derived
 * from here so the schema price stays in sync with what users see.
 *
 * TODO(F6): copy provisional. Las variantes finales de copy se definen en F6.
 */
export const PRICING: PricingCardProps[] = [
  {
    tier: "Free",
    price: "0",
    priceCurrency: "EUR",
    period: "/mes",
    forWho: "Para empezar",
    features: ["3 clientes", "1 proyecto", "Soporte de la comunidad"],
    cta: { label: "Empezar gratis", href: "#" },
    productName: "Tendr Free",
    productDescription: "Plan gratuito para empezar a ordenar tu cartera.",
  },
  {
    tier: "Pro",
    price: "9",
    priceCurrency: "EUR",
    period: "/mes",
    forWho: "Para freelances",
    features: [
      "Clientes ilimitados",
      "Proyectos ilimitados",
      "Reportes automáticos",
      "Soporte por email",
    ],
    cta: { label: "Probar 14 días", href: "#" },
    highlighted: true,
    productName: "Tendr Pro",
    productDescription: "Para profesionalizar tu seguimiento con IA.",
  },
  {
    tier: "Team",
    price: "29",
    priceCurrency: "EUR",
    period: "/mes",
    forWho: "Para equipos",
    badge: "Próximamente",
    features: [
      "Todo lo de Pro",
      "Multi-usuario",
      "Permisos por rol",
      "Workspace de equipo",
    ],
    cta: { label: "Apuntarse a waitlist", href: "#" },
    productName: "Tendr Team",
    productDescription: "Para equipos pequeños que comparten cartera.",
  },
];
