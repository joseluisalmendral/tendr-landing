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
  },
};

export default nextConfig;
