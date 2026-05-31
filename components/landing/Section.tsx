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
export function Section({ id, heading, eyebrow, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full bg-surface",
        // Vertical section rhythm (design §2.4): space-16 between sections.
        "py-16",
      )}
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8">
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
    </section>
  );
}
