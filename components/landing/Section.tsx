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
        "relative w-full bg-surface",
        // Vertical section rhythm (design §2.4): space-16 between sections.
        "py-16",
        // Sections that open with a seam get extra breathing room up top so the
        // heading sits clearly below the boundary, not glued to the edge.
        divider && "pt-24 md:pt-28",
        className,
      )}
    >
      {/* Section seam (v2 taming): the v1 warm "fold shadow" (shadow-tint) was a
          dead token on the new near-white surface — near-invisible and dirty
          against the clean base, and the page already earns its big boundaries
          from the two wow transitions + the whiteboard frame. So the soft fold
          is simplified to a single honest hairline at the top edge, in line with
          the design principle "hairlines for structure". Decorative, no layout. */}
      {divider ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border-hairline"
        />
      ) : null}

      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8">
        {/* Content reveals on scroll-enter (CSS scroll-driven, globals.css).
            Wraps header + body so the whole block rises in as one beat. */}
        <div className="section-reveal">
          <header className="flex flex-col gap-3">
            {eyebrow ? (
              <span
                className={cn(
                  "inline-flex w-fit items-center rounded-full",
                  "border border-border-strong px-3 py-1",
                  "font-mono text-meta uppercase text-text-secondary",
                )}
              >
                {eyebrow}
              </span>
            ) : null}
            <h2 className="font-heading text-h2 text-text-primary">{heading}</h2>
            {/* Firma rule: a short wisp underline that grows in under the
                heading as the section enters (scroll-driven scaleX in
                globals.css). v2: repointed to the support "firma" hue (wisp,
                5.4:1 vs surface) — one small brand mark per section, the role
                contract's firma beat, not a dense adjacent run. Decorative;
                fallback / reduced-motion = full width. */}
            <span
              aria-hidden="true"
              className="section-rule block h-[3px] w-16 origin-left rounded-full bg-support"
            />
          </header>
          {/* Internal rhythm (design §2.4): space-12 between heading and body. */}
          <div className="mt-12">{children}</div>
        </div>
      </div>
    </section>
  );
}
