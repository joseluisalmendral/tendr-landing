import type { PricingCardProps } from "@/components/landing/types";

/**
 * Pricing dataset for the /agencias vertical (F6.5 "Tendr para agencias").
 *
 * This is the SAME product and the SAME prices as the base landing — only the
 * emphasis shifts. The differences vs `pricing.data.ts` are:
 *
 *  1. TEAM is the highlighted/recommended tier (instead of Pro): agencies of
 *     5-20 people need shared visibility, so Team (multiusuario + permisos) is
 *     the natural fit. `highlighted: true` moves to Team.
 *  2. FREE is framed as "Para evaluar" — a way to try Tendr with one portfolio
 *     before bringing the team in, NOT the final destination.
 *  3. FEATURE RE-PRIORITISATION (brief §2): on the Team card, the multi-user /
 *     permissions capabilities surface ABOVE everything else, and the CSV import
 *     ("Importar clientes por CSV", a real Pro feature shown in the showcase)
 *     moves to the BOTTOM of the Pro card. Multi-user is the headline for an
 *     agency; bulk import is plumbing.
 *  4. HONESTY GUARD (brief §3 + docs/product.md): Team is "Próximamente" — it is
 *     NOT implemented. The badge stays, and its CTA is the interest-capture
 *     "Avísame cuando salga Team" (this click is the PRIMARY success metric in
 *     exploration/variants/decisions.md §2). No fake availability, no free-trial
 *     wording anywhere — CTAs are waitlist-honest (pre-launch).
 *
 * Prices are intentionally identical to `pricing.data.ts` (single product, one
 * source of truth for the number); only copy/order/emphasis differ.
 */
export const PRICING_AGENCIAS: PricingCardProps[] = [
  {
    tier: "Free",
    price: "0",
    priceCurrency: "EUR",
    period: "/mes",
    // Free is the evaluation step, not the destination, for an agency.
    forWho: "Para evaluar",
    features: ["3 clientes", "1 proyecto", "Soporte de la comunidad"],
    cta: { label: "Probar el estudio", href: "#precios" },
    productName: "Tendr Free",
    productDescription:
      "Plan gratuito para probar Tendr con una cartera antes de traer al equipo.",
  },
  {
    tier: "Pro",
    price: "9",
    priceCurrency: "EUR",
    period: "/mes",
    forWho: "Por persona del estudio",
    features: [
      "Clientes ilimitados",
      "Proyectos ilimitados",
      "Reportes automáticos",
      "Soporte por email",
      // CSV import moved to the BOTTOM (brief §2): bulk import is plumbing,
      // not the headline for an agency.
      "Importar clientes por CSV",
    ],
    cta: { label: "Unirse a la waitlist", href: "#precios" },
    productName: "Tendr Pro",
    productDescription:
      "Para cada account manager del estudio que profesionaliza su seguimiento con IA.",
  },
  {
    tier: "Team",
    price: "29",
    priceCurrency: "EUR",
    period: "/mes",
    forWho: "Para el estudio",
    badge: "Próximamente",
    highlighted: true,
    features: [
      // Multi-user / permissions surface ABOVE everything (brief §2): the
      // shared-visibility story is what sells Team to an agency.
      "Multi-usuario hasta 10",
      "Permisos por rol",
      "Workspace compartido del estudio",
      "Todo lo de Pro",
    ],
    // Interest-capture CTA: this click IS the primary success metric
    // (decisions.md §2). Honest about Team being "próximamente".
    cta: { label: "Avísame cuando salga Team", href: "#precios" },
    productName: "Tendr Team",
    productDescription:
      "Para estudios pequeños que comparten la cartera de clientes.",
  },
];
