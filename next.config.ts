import type { NextConfig } from "next";

/**
 * Two build modes.
 *
 * NORMAL (default): a full Next.js server. API routes work, so photo upload,
 * the checkout handoff and the enquiry forms all function. This is what you
 * deploy for the real site.
 *
 * STATIC DEMO (`STATIC_EXPORT=true`): a folder of plain HTML for GitHub Pages,
 * so the client can browse the design from a link. GitHub Pages serves files
 * only, it cannot run a server, so this build has **no API routes**. The
 * workflow that produces it removes them and sets NEXT_PUBLIC_DEMO_MODE, which
 * makes the uploader preview photos in the browser instead of sending them and
 * says so on screen. Never point a real customer at this build.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";

/** Project Pages live under /<repo>, so assets need that prefix. */
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isStaticExport && {
    output: "export",
    basePath,
    // Trailing slashes keep deep links working on a plain file host.
    trailingSlash: true,
    images: {
      // No image optimiser exists on a static host.
      unoptimized: true,
    },
  }),
};

export default nextConfig;
