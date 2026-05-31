import Image from "next/image";

import { cn } from "@/lib/utils";
import type { TestimonialCardProps } from "@/components/landing/types";

/**
 * TestimonialCard: a single attributed testimonial rendered as a paper card.
 *
 * Server Component (F4, fully static). The scroll-driven pushpin treatment is
 * deferred to F5 and wraps this figure from the outside, so this component stays
 * self-contained and behaviour-free.
 *
 * Structure: <figure> > <blockquote> (the quote, wrapped in typographic quotes)
 * + <figcaption> (attribution: name, role, company) + avatar via next/image.
 *
 * Tokens only (zero hex), radius 0 (rounded-none), Phosphor-free (no icons here).
 */
export function TestimonialCard({
  name,
  role,
  company,
  quote,
  avatar,
}: TestimonialCardProps) {
  // Avatar alt is derived deterministically from the attribution so screen
  // readers always announce who is pictured. Exact contract string.
  const avatarAlt = `Foto de ${name}, ${role} en ${company}`;

  return (
    <figure
      className={cn(
        "flex flex-col gap-6 rounded-none border border-border bg-surface-raised p-6",
      )}
    >
      <blockquote className="text-body text-text-primary">
        {/* Typographic quotation marks (« »); no straight ASCII quotes. */}
        {`«${quote}»`}
      </blockquote>

      <figcaption className="flex items-center gap-4">
        <Image
          src={avatar.src}
          alt={avatarAlt}
          width={avatar.width}
          height={avatar.height}
          sizes="64px"
          className="rounded-none border border-border object-cover"
        />
        <span className="flex flex-col">
          <span className="text-body text-text-primary">{name}</span>
          <span className="text-meta font-mono text-text-secondary">
            {role}
          </span>
          <span className="text-body-sm text-text-secondary">{company}</span>
        </span>
      </figcaption>
    </figure>
  );
}
