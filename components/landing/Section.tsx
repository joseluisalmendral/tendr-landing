import type { SectionProps } from "@/components/landing/types";
import { cn } from "@/lib/utils";

/**
 * Section: reusable semantic wrapper (Server Component).
 *
 * The box where F5 mounts landing sections 2-6: a <section> with a centered
 * max-w-[1280px] container, vertical rhythm per the design spacing scale, its
 * own <h2> heading, and an OPTIONAL mono eyebrow pill above the heading.
 *
 * The eyebrow is purely opt-in: the "max 1 eyebrow per 3 sections" rule is a
 * COMPOSE-TIME budget enforced by the caller (F5), not by this component.
 *
 * F4: fully static, no motion, CLS 0.
 */
export function Section({
  id,
  heading,
  eyebrow,
  divider = false,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full bg-surface",
        // Vertical section rhythm (design §2.4): space-16 between sections.
        "py-16",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8">
        {/* Stitched seam: a hand-drawn clay dashed wave that marks the boundary
            between sections so a fast scroll never feels like one long block.
            Decorative; the heading below carries the meaning. */}
        {divider ? (
          <div aria-hidden="true" className="mb-14 flex justify-center">
            <svg
              viewBox="0 0 1200 24"
              preserveAspectRatio="none"
              className="h-5 w-full max-w-[640px] text-accent-secondary"
            >
              <path
                d="M0 12 C 110 4, 210 20, 330 12 C 450 4, 560 20, 680 12 C 800 4, 910 20, 1030 12 C 1110 7, 1160 16, 1200 12"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="1 12"
              />
            </svg>
          </div>
        ) : null}

        {/* Content reveals on scroll-enter (CSS scroll-driven, globals.css).
            Wraps header + body so the whole block rises in as one beat. */}
        <div className="section-reveal">
          <header className="flex flex-col gap-3">
            {eyebrow ? (
              <span
                className={cn(
                  "inline-flex w-fit items-center rounded-full",
                  "border border-accent-secondary px-3 py-1",
                  "font-mono text-meta uppercase text-accent-secondary",
                )}
              >
                {eyebrow}
              </span>
            ) : null}
            <h2 className="font-heading text-h2 text-text-primary">{heading}</h2>
          </header>
          {/* Internal rhythm (design §2.4): space-12 between heading and body. */}
          <div className="mt-12">{children}</div>
        </div>
      </div>
    </section>
  );
}
