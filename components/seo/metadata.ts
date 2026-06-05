import type { Metadata } from "next";

/**
 * SEO metadata helpers for the Next.js 16 Metadata API.
 *
 * `baseMetadata()` is meant for the root layout; it sets `metadataBase`, the
 * title template, robots, and the OpenGraph/Twitter defaults (including the
 * fallback OG image). `pageMetadata()` produces per-route metadata that
 * inherits the brand title template from the layout but re-injects the OG
 * defaults, because Next.js does NOT deep-merge `openGraph` across segments.
 */

const SITE_NAME = "Tendr";
const DEFAULT_TITLE = "Tendr · tu mini-CRM de clientes";
const DEFAULT_DESCRIPTION =
  "Tendr organiza tu cartera de clientes, te recuerda a quién seguir y la IA te avisa qué cliente está en riesgo. El CRM ágil para freelancers y perfiles junior.";
const DEFAULT_OG_PATH = "/og.png";
const OG_DIMENSIONS = { width: 1200, height: 630 } as const;

// Same convention used across the course material (robots-txt, sitemap).
// `metadataBase` needs a URL object; build it once at module scope so it is
// not reconstructed on every helper call.
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tendr.app",
);

/**
 * Builds an absolute URL for `og:image`. Defaults to the static `/og.png`
 * fallback; pass a different path (e.g. a dynamic `/api/og?...` route) to
 * override per page.
 */
export function ogImage(path: string = DEFAULT_OG_PATH): string {
  return new URL(path, siteUrl).toString();
}

/**
 * Shared defaults for the whole site. Use it in the root layout:
 *
 * @example
 * // app/layout.tsx
 * export const metadata = baseMetadata();
 */
export function baseMetadata(): Metadata {
  return {
    metadataBase: siteUrl,
    applicationName: SITE_NAME,
    title: {
      default: DEFAULT_TITLE,
      template: `%s · ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    alternates: {
      canonical: "/",
    },
    // Search Console ownership proof. Lives in baseMetadata so every page
    // ships the google-site-verification meta tag from the root layout.
    verification: {
      google: "UBRfiQ4IKCWq_VeOs_1UUaxulYbHD4xkS2HU28NsSsU",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "es_ES",
      url: "/",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: ogImage(),
          ...OG_DIMENSIONS,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: [ogImage()],
    },
  };
}

type PageMetadataInput = {
  title: string;
  description: string;
  /** Route path, e.g. "/precios". Resolved to absolute via `metadataBase`. */
  path: string;
};

/**
 * Per-route metadata. The bare `title` string activates the layout's title
 * template (`"Precios"` becomes `"Precios · Tendr"`). `canonical` and
 * `openGraph.url` are relative paths that `metadataBase` (set in the layout)
 * resolves to absolute URLs. OG/Twitter defaults are re-applied because
 * Next.js replaces, not deep-merges, the `openGraph` object per segment.
 *
 * @example
 * // Static route
 * export const metadata = pageMetadata({
 *   title: "Precios",
 *   description: "Planes de Tendr.",
 *   path: "/precios",
 * });
 *
 * @example
 * // Dynamic route: params are async in Next.js 16, await before reading.
 * export async function generateMetadata(
 *   { params }: { params: Promise<{ slug: string }> },
 * ): Promise<Metadata> {
 *   const { slug } = await params;
 *   return pageMetadata({
 *     title: slug,
 *     description: `Detalle de ${slug}.`,
 *     path: `/recursos/${slug}`,
 *   });
 * }
 */
export function pageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const base = baseMetadata();

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      ...base.openGraph,
      title,
      description,
      url: path,
    },
    twitter: {
      ...base.twitter,
      title,
      description,
    },
  };
}
