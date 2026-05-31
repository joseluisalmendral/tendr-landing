import Image from "next/image";
import Link from "next/link";

import type { FeatureProps } from "@/components/landing/types";

/**
 * Feature: the SIMPLE reusable primitive. A single capability rendered as a
 * leading visual (Phosphor icon OR next/image), an <h3> title, a description
 * and an optional navigating link.
 *
 * This is NOT the "Cómo funciona" numbered list and NOT the "Features" bento;
 * those are bespoke F5 compositions. Feature only knows how to render one item;
 * the stack / asymmetric grid that arranges many Features lives elsewhere.
 *
 * Server Component (F4 static, CLS 0). The discriminated `visual` union decides
 * icon vs image at the type level, so the caller cannot pass an ambiguous shape.
 */
export function Feature({ title, description, visual, link }: FeatureProps) {
  return (
    <article className="flex flex-col gap-3">
      {visual.kind === "icon" ? (
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-none border border-border bg-surface-raised text-accent-secondary">
          <visual.icon size={28} weight="duotone" aria-hidden="true" />
        </span>
      ) : (
        <Image
          src={visual.src}
          alt={visual.alt}
          width={visual.width}
          height={visual.height}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="rounded-none"
        />
      )}

      <h3 className="text-h3 text-text-primary">{title}</h3>

      <p className="text-body text-text-secondary">{description}</p>

      {link ? (
        <Link
          href={link.href}
          className="text-body-sm font-medium text-accent-secondary underline-offset-4 hover:underline"
        >
          {link.label}
        </Link>
      ) : null}
    </article>
  );
}
