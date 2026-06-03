import { Check, Minus } from "@phosphor-icons/react/dist/ssr";

import { SkipLink } from "@/components/a11y/SkipLink";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Pricing } from "@/components/landing/Pricing";
import { PRICING } from "@/components/landing/pricing.data";
import { pageMetadata } from "@/components/seo/metadata";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Precios",
  description:
    "Compara los planes de Tendr: Free para empezar, Pro para profesionalizar tu cartera y Team para equipos pequeños. Sin tarjeta, sin permanencia.",
  path: "/pricing",
});

/**
 * /pricing: extended pricing experience.
 *
 * Reuses the same <Pricing> recommender + cards from the home (consistency) and
 * adds a unified feature comparison table below it. The table is a real semantic
 * <table> with <caption>, scoped headers and text/icon cells (never color-only):
 * ✓ / — carry an sr-only label so the meaning is read out, not just seen.
 *
 * Shell matches the home and the legal pages: SkipLink + Header + main + Footer.
 */

type CellValue = boolean | string;

type FeatureRow = {
  /** Feature label (the row header, <th scope="row">). */
  feature: string;
  /** [Free, Pro, Team] cell values. true → included, false → not, string → a value. */
  cells: [CellValue, CellValue, CellValue];
};

// Unified matrix synthesised from the three tiers' `features`. Team columns are
// what the tier promises ("todo lo de Pro" + its own additions); Team is gated
// behind the "Próximamente" header, not faked as live.
const COLUMNS = ["Free", "Pro", "Team"] as const;

const COMPARISON: FeatureRow[] = [
  { feature: "Clientes", cells: ["3", "Ilimitados", "Ilimitados"] },
  { feature: "Proyectos", cells: ["1", "Ilimitados", "Ilimitados"] },
  { feature: "Reportes automáticos", cells: [false, true, true] },
  { feature: "Soporte de la comunidad", cells: [true, true, true] },
  { feature: "Soporte por email", cells: [false, true, true] },
  { feature: "Multi-usuario", cells: [false, false, true] },
  { feature: "Permisos por rol", cells: [false, false, true] },
  { feature: "Workspace de equipo", cells: [false, false, true] },
];

function ComparisonCell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center">
        <Check
          aria-hidden="true"
          weight="bold"
          className="size-5 text-accent-secondary"
        />
        <span className="sr-only">Incluido</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center">
        <Minus
          aria-hidden="true"
          weight="bold"
          className="size-5 text-text-tertiary"
        />
        <span className="sr-only">No incluido</span>
      </span>
    );
  }
  return <span className="text-body-sm text-text-primary">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <SkipLink />
      <Header />

      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-8 md:py-24">
          <header className="flex max-w-[60ch] flex-col gap-4">
            <h1 className="font-heading text-h1 text-text-primary">
              Un plan para cada momento
            </h1>
            <p className="text-body-lg text-text-secondary">
              Empieza gratis y sube de plan solo cuando tu cartera lo pida. Sin
              tarjeta para el plan Free y sin permanencia: cancelas cuando
              quieras.
            </p>
          </header>

          {/* Same recommender + 3 cards as the home, for a consistent decision
              moment before the detail table. */}
          <div className="mt-12">
            <Pricing tiers={PRICING} />
          </div>

          {/* Feature comparison table: a real semantic table styled with tokens
              so it reads as an intentional surface, not a default browser table. */}
          <section aria-labelledby="comparativa-title" className="mt-20">
            <h2
              id="comparativa-title"
              className="font-heading text-h2 text-text-primary"
            >
              Compara las funciones
            </h2>
            <span
              aria-hidden="true"
              className="mt-3 block h-[3px] w-16 rounded-full bg-accent-secondary"
            />

            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-left">
                <caption className="sr-only">
                  Comparativa de funciones de los planes Free, Pro y Team de
                  Tendr. El plan Team está marcado como próximamente.
                </caption>
                <thead>
                  <tr className="border-b border-border-strong">
                    <th
                      scope="col"
                      className="py-4 pr-4 font-mono text-meta uppercase text-text-tertiary"
                    >
                      Función
                    </th>
                    {COLUMNS.map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="px-4 py-4 text-center"
                      >
                        <span className="font-heading text-h3 text-text-primary">
                          {col}
                        </span>
                        {col === "Team" ? (
                          <span className="mt-1 block font-mono text-meta uppercase text-accent-secondary">
                            Próximamente
                          </span>
                        ) : null}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, rowIndex) => (
                    <tr
                      key={row.feature}
                      className={cn(
                        "border-b border-border",
                        rowIndex % 2 === 1 && "bg-surface-sunken/30",
                      )}
                    >
                      <th
                        scope="row"
                        className="py-4 pr-4 text-body-sm font-normal text-text-secondary"
                      >
                        {row.feature}
                      </th>
                      {row.cells.map((value, colIndex) => (
                        <td
                          key={COLUMNS[colIndex]}
                          className="px-4 py-4 text-center align-middle"
                        >
                          <ComparisonCell value={value} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
