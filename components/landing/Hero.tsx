import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HeroProps } from "@/components/landing/types";

/**
 * Hero: the page's single above-the-fold value proposition.
 *
 * Bespoke layout (spec §1): asymmetric, text column left and the faux-UI of the
 * empty pipeline right. Nothing is centered. Contains the page's ONLY <h1>.
 *
 * Server Component (F4 static). No motion is implemented here: dimensions are
 * reserved and the layout is stable so F5 can attach reveal motion without
 * restructuring. The empty-pipeline image is rendered in its final empty state.
 */
export function Hero({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  image,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative isolate min-h-[100dvh] overflow-hidden",
        // Ambient wash background: amber -> clay, token-driven (zero hex).
        "bg-[linear-gradient(135deg,var(--color-wash-from),var(--color-wash-to))]",
      )}
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-6 pt-24 pb-16 lg:grid-cols-12 lg:gap-8">
        {/* Text column: left, asymmetric (does not span the full grid). */}
        <div className="flex flex-col items-start gap-6 lg:col-span-6 lg:pr-6">
          <h1 className="max-w-[18ch] text-balance font-display text-display-xl text-text-primary">
            {title}
          </h1>

          <p className="max-w-[46ch] text-body-lg text-text-secondary">
            {subtitle}
          </p>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
            <Button
              asChild
              className="rounded-cta bg-accent-primary border border-border-strong shadow-hard text-[length:var(--text-body)] text-on-accent h-auto px-6 py-3 transition-all hover:bg-accent-primary-hover active:translate-y-px active:shadow-hard-sm"
            >
              <Link href={ctaPrimary.href}>{ctaPrimary.label}</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-none border-border-strong bg-transparent text-[length:var(--text-body)] text-text-primary shadow-none h-auto px-6 py-3"
            >
              <Link href={ctaSecondary.href}>{ctaSecondary.label}</Link>
            </Button>
          </div>
        </div>

        {/* Faux-UI column: right, asymmetric. The empty pipeline, one idea per
            piece (senior-illustration). Real next/image asset, dimensions
            reserved for CLS 0. No div-based fake screenshot. */}
        <div className="lg:col-span-6 lg:pl-6">
          <div className="overflow-hidden border border-border-strong bg-surface-raised shadow-soft">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              preload
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
