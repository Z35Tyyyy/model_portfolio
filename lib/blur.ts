import blurMap from "@/lib/blur-map.json";

const map = blurMap as Record<string, string>;

/**
 * Blur placeholder lookup, keyed by bare filename so it works for both local
 * paths (/images/hero.jpg) and CDN URLs (…/palak-portfolio/hero.jpg?…).
 * Undefined for assets without an entry — the image simply loads without blur.
 */
export function getBlur(src: string): string | undefined {
  const file = src.split("/").pop()?.split("?")[0] ?? "";
  return map[file];
}
