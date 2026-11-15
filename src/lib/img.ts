import { asset } from "./shopify";

// Sized copies of a product photo. Local photos are cut by scripts/images.mjs into public/img/products/w/;
// photos served by Shopify are asked for at the width through the CDN's own `width` parameter.
// Keep WIDTHS in step with scripts/images.mjs.
const WIDTHS = [128, 192, 320, 640] as const;
type Width = (typeof WIDTHS)[number];

const LOCAL = /^\/img\/products\/([^/]+)\.(?:webp|png|jpe?g)$/i;

/** One photo at one width. Anything that is neither a local product photo nor a Shopify file is returned as it is. */
export function sized(src: string, w: Width): string {
  const local = LOCAL.exec(src);
  if (local) return asset(`/img/products/w/${local[1]}-${w}.webp`);
  if (/^https:\/\/cdn\.shopify\.com\//.test(src)) {
    try { const u = new URL(src); u.searchParams.set("width", String(w)); return u.toString(); } catch { /* fall through */ }
  }
  return asset(src);
}

const set = (src: string, widths: readonly Width[]) => widths.map((w) => `${sized(src, w)} ${w}w`).join(", ");

/** A picture in a small square: the 64px row picture, a school's mark, a gallery key. `box` is its width in CSS px. */
export const smallImg = (src: string, box: number) => ({ src: sized(src, 128), srcSet: set(src, [128, 192]), sizes: `${box}px`, width: box, height: box, decoding: "async" as const });

/** The product page picture: 320px at most, narrower on a small phone. */
export const largeImg = (src: string) => ({ src: sized(src, 640), srcSet: set(src, [320, 640]), sizes: "(max-width: 352px) calc(100vw - 2rem), 320px", width: 320, height: 320, decoding: "async" as const });
