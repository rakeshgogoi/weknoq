/**
 * Converts a video title to a URL-safe slug.
 * e.g. "How to Cook Pasta (2024) — Gordon Ramsay" → "how-to-cook-pasta-2024-gordon-ramsay"
 */
export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ") // strip non-alphanumeric (except hyphens)
    .trim()
    .replace(/\s+/g, "-")          // spaces → hyphens
    .replace(/-+/g, "-")           // collapse repeated hyphens
    .slice(0, 100)                 // cap length
    .replace(/-$/, "");            // strip trailing hyphen
}
