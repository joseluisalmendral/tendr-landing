import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * PaperGrain · warm-tinted paper fiber texture (design.md §7 "Spotlight / Grain
 * Texture", §2.6 "sombras tintadas al hue del papel, nunca negro puro").
 *
 * Technique: an inline-SVG feTurbulence noise is composited (`feComposite in`)
 * onto a warm-filled rect, so the SVG renders sparse WARM fibers on a
 * transparent field. That SVG is used as a `background-image` data-URI on a
 * `mix-blend-mode: multiply` layer. opacity scales the effect directly.
 *
 * WHY background-image and not a mask: a luminance `mask-image` silently
 * resolves to ~0 alpha in some engines (the layer gets clipped to nothing), so
 * the grain was invisible at any opacity. Compositing the tint INSIDE the SVG
 * removes the mask-mode dependency entirely: the layer always paints.
 *
 * WHY warm, not gray: the rect fill is the system warm dark (= --shadow-tint,
 * the same hue the hard shadows use), expressed as oklch so it stays the paper
 * hue and is not a hardcoded hex. Gray noise on cream reads as dust; warm
 * fibers read as paper. The color lives in the SVG because a data-URI cannot
 * read a CSS custom property; it mirrors the token value 1:1.
 *
 * GPU-cheap and static: one absolutely-positioned composited layer, no JS, no
 * animation, pointer-events-none, aria-hidden. Filter ids live inside each
 * data-URI (a separate SVG document) so there is no duplicate-id in the host
 * DOM. Content sits in a higher stacking context and is never painted over.
 *
 * Server Component: static markup only, no client hooks, no client directive.
 */

type PaperGrainVariant = "fine" | "layered";

type PaperGrainProps = {
  /**
   * 'fine' = a single high-frequency fiber layer (paper tooth).
   * 'layered' = fine fibers + a low-frequency mottle for handmade unevenness.
   */
  variant?: PaperGrainVariant;
  /**
   * Layer opacity 0-1 (fiber density / strength). The mottle, when present,
   * rides at half this value. Default 0.5 (premium paper tooth; ~0.3 whisper,
   * ~0.8 pronounced).
   */
  intensity?: number;
  /** Positioning override (e.g. `fixed inset-0` for a page-wide wash). */
  className?: string;
};

/**
 * Warm fibers on transparent, as a data-URI background-image.
 * - feTurbulence → noise.
 * - feColorMatrix maps the noise to ALPHA only (rows R/G/B = 0): alpha =
 *   contrast·(R+G+B) + floor, so most of the field is transparent and only the
 *   bright peaks survive → sparse, defined fibers (not a flat veil).
 * - feComposite operator="in" keeps the warm rect where that alpha exists.
 * The rect fill is oklch (= --shadow-tint value), not a hex literal.
 */
function noiseDataUri({
  baseFrequency,
  numOctaves,
  contrast,
  floor,
  tile,
}: {
  baseFrequency: number;
  numOctaves: number;
  contrast: number;
  floor: number;
  tile: number;
}): string {
  const alphaRow = `${contrast} ${contrast} ${contrast} 0 ${floor}`;
  const matrix = `0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${alphaRow}`;
  // Warm dark = sRGB approximation of --shadow-tint (oklch 0.30 0.04 60).
  // rgb() (not hex, not oklch) renders reliably inside a data-URI SVG.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}"><filter id="g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${baseFrequency}" numOctaves="${numOctaves}" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="${matrix}" result="a"/><feComposite in="SourceGraphic" in2="a" operator="in"/></filter><rect width="100%" height="100%" fill="rgb(70,58,46)" filter="url(#g)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function GrainLayer({
  image,
  tileSize,
  opacity,
}: {
  image: string;
  tileSize: number;
  opacity: number;
}) {
  const style: CSSProperties = {
    opacity,
    mixBlendMode: "multiply",
    backgroundImage: image,
    backgroundRepeat: "repeat",
    backgroundSize: `${tileSize}px ${tileSize}px`,
  };
  return <div aria-hidden className="absolute inset-0" style={style} />;
}

// Fine fiber tile (paper tooth) + coarse mottle tile (handmade unevenness).
const FINE = noiseDataUri({ baseFrequency: 0.85, numOctaves: 2, contrast: 1.6, floor: -1.9, tile: 150 });
const MOTTLE = noiseDataUri({ baseFrequency: 0.02, numOctaves: 2, contrast: 1.4, floor: -1.7, tile: 520 });

export function PaperGrain({
  variant = "fine",
  intensity = 0.5,
  className,
}: PaperGrainProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <GrainLayer image={FINE} tileSize={150} opacity={intensity} />
      {variant === "layered" ? (
        <GrainLayer image={MOTTLE} tileSize={520} opacity={intensity * 0.5} />
      ) : null}
    </div>
  );
}
