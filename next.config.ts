import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The landing uses local SVG placeholders (hero pipeline, monogram avatars)
    // served through next/image. SVG is disabled by default in next/image; we
    // opt in but neutralize it: force a download disposition and a strict CSP
    // that blocks any script execution inside the SVG payload.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Testimonial avatars are generated illustrations from dicebear. Allow the
    // host so next/image accepts the remote URL. The dicebear <Image> is marked
    // `unoptimized`, so the remote SVG is passed through as-is and never enters
    // the optimizer pipeline; the global SVG policy above is for local assets.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/9.x/notionists/svg",
      },
    ],
  },
};

export default nextConfig;
