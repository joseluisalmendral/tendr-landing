import { cn } from "@/lib/utils";

type SkipLinkProps = {
  /** Target id to jump to. The element must exist and be focusable. */
  href?: string;
};

/**
 * Keyboard "skip to content" link. Visually hidden at rest, it appears at the
 * top-left only on keyboard focus, letting keyboard and screen-reader users
 * bypass the header and jump straight to the main content.
 *
 * Server Component: static markup, no client JS.
 *
 * Requirements on the target (wire these in the layout, not here):
 * - Render this as the FIRST focusable element inside <body>.
 * - The target must have a matching id, e.g. <main id="main">.
 * - The target must have tabIndex={-1} so focus (not just scroll) moves to it;
 *   without it some browsers scroll but leave keyboard focus behind.
 *
 * @example
 * // app/layout.tsx
 * <body>
 *   <SkipLink />
 *   <Header />
 *   <main id="main" tabIndex={-1}>{children}</main>
 * </body>
 */
export function SkipLink({ href = "#main" }: SkipLinkProps) {
  return (
    <a
      href={href}
      aria-label="Saltar al contenido principal"
      className={cn(
        // At rest: removed from the visual flow but reachable by Tab and SR.
        "sr-only",
        // On keyboard focus: pin top-left, above everything, fully visible.
        "focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50",
        "focus-visible:inline-flex focus-visible:items-center focus-visible:justify-center",
        // radius 0: brutalist default. rounded-cta is reserved for the primary CTA.
        "focus-visible:border focus-visible:border-border-strong",
        "focus-visible:bg-background focus-visible:px-4 focus-visible:py-2",
        "focus-visible:text-body-sm focus-visible:font-medium focus-visible:text-foreground",
        "focus-visible:shadow-hard focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
    >
      Saltar al contenido
    </a>
  );
}
