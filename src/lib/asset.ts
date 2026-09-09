/**
 * Builds a URL for a file in /public.
 *
 * WHY THIS EXISTS. When the site is exported statically under a basePath (the
 * GitHub Pages preview lives at /rk-memory-studio), Next rewrites script and
 * stylesheet URLs but leaves `next/image` sources untouched once images are
 * `unoptimized`. The result is a src of `/images/logo.png` on a site rooted at
 * `/rk-memory-studio/`, which 404s. This prefixes it explicitly.
 *
 * In a normal deployment NEXT_PUBLIC_BASE_PATH is empty, so this is a no-op.
 * Always route public asset paths through it rather than hard-coding a leading
 * slash, or the asset will break the next time the site is served from a
 * subdirectory.
 */

const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export function asset(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${clean}`;
}
