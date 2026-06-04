import type { ReactNode } from "react";

/**
 * Waitlist: the page's CLOSING beat — the final section before the footer.
 *
 * Funnel rationale (placement): classic conversion funnel — pricing -> social
 * proof -> objections (FAQ) -> ask. The closing CTA collects the email AFTER
 * trust has been built, so this section lives last, right before <Footer/>. It
 * keeps id="waitlist" because the hero CTAs anchor here.
 *
 * Composition decision (centered, single raised paper card): every other
 * section on the page is left-aligned. This one is deliberately CENTERED — the
 * ONE centered section on the page reads as the closing emphasis, the "ask"
 * moment. The heading, lead and form share a single centered axis so alignment
 * stays disciplined (design principle: hierarchy by weight + space, one clear
 * axis). Line lengths are tuned (lead at ~52ch) so the larger type stays
 * comfortable.
 *
 * Expressive vocabulary (restraint — ONE accent): the form is wrapped in a
 * "nota viva" — the page's signature raised paper card (surface-raised +
 * shadow-note + a slight resting tilt), with a single rotated mono eyebrow
 * badge ("ACCESO ANTICIPADO") tucked over its top edge, echoing the rotated
 * badge idiom used in Pricing / journey-stages. Per the wow-budget + eyebrow
 * rules we pick exactly ONE expressive device: NO hand-drawn underline is
 * stacked on top of the badged paper card. Success stays green inside
 * SubscribeForm (--color-success) per design.md REGLA DURA — never teal.
 *
 * This is NOT a <Section>: like TestimonialsCork, it owns its own <h2> and
 * anchor so it can break to a centered composition (Section's header is
 * left-aligned and not overridable). It reuses the exact Section idioms
 * (max-w-[1280px] container, py-16 + divider pt, the top hairline seam, the
 * section-reveal scroll entrance) so there is no visual or behavioural drift.
 *
 * Server Component: static framing only. The form is the shared SubscribeForm
 * client island (Server Action + Turnstile), passed in as `children` so each
 * page keeps owning its dynamic() code-split import — this component never
 * imports SubscribeForm directly and so never pulls it into the static bundle.
 * The form's logic is untouched.
 */
export function Waitlist({
  heading,
  lead,
  children,
}: {
  heading: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <section id="waitlist" className="relative w-full bg-surface py-16 pt-24 md:pt-28">
      {/* Same honest top hairline seam as <Section divider>. Decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border-hairline"
      />

      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8">
        {/* section-reveal: the whole closing beat rises in as one block, same as
            every other section (CSS scroll-driven, globals.css). */}
        <div className="section-reveal flex flex-col items-center text-center">
          <h2 className="font-heading text-h2 text-text-primary">{heading}</h2>

          {/* Bigger lead type (body-lg, not body-sm) per the closing emphasis;
              centered on the shared axis, line length tuned for comfort. */}
          <p className="mt-5 max-w-[52ch] text-body-lg text-text-secondary">
            {lead}
          </p>

          {/* The nota viva: raised paper card holding the form. Slight resting
              tilt + shadow-note is the brand signature; straightens on the form
              axis via a centered max-width. The rotated mono badge is the single
              expressive accent. */}
          <div className="relative mt-12 w-full max-w-md">
            <span
              className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 -rotate-2 rounded-full border border-border-strong bg-surface-raised px-3 py-1 font-mono text-meta uppercase tracking-[0.18em] text-text-secondary shadow-flat"
            >
              Acceso anticipado
            </span>

            <div className="rotate-[-0.6deg] rounded-xl border border-border-hairline bg-surface-raised p-6 shadow-note sm:p-8">
              {/* Counter-rotate the contents so the form/inputs read perfectly
                  upright while the paper card keeps its hand-pinned tilt. */}
              <div className="rotate-[0.6deg] text-left">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
