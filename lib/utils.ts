import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge does NOT know our custom type scale (defined in globals.css via
 * @theme: text-display-xl, text-h3, text-body-lg, text-meta, …). By default it
 * classifies an unknown `text-*` class as a TEXT-COLOR utility, so combining a
 * custom size with a color in the same cn() call — e.g.
 * `cn("text-body-lg text-text-secondary")` — makes twMerge think both belong to
 * the text-color group and DROP the size, leaving the element to inherit a
 * smaller inherited font-size (this is why the FAQ answers and the PricingCard
 * titles rendered tiny). Registering the scale in the `font-size` group makes
 * twMerge treat these as sizes, so size + color coexist as intended.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-xl",
            "display-lg",
            "h1",
            "h2",
            "h3",
            "body-lg",
            "body",
            "body-sm",
            "caption",
            "meta",
          ],
        },
      ],
      // Same footgun for our custom radius scale: an unknown `rounded-cta`
      // is not recognised as border-radius, so a base `rounded-none` (the
      // brutalist Button/Card default) wins and the CTA renders square even
      // though --radius-cta is 10px. Registering them lets `rounded-cta`
      // correctly override the base radius.
      rounded: [
        {
          rounded: ["cta", "control", "card", "input", "note"],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
