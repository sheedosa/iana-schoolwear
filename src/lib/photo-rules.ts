// Which of a product's photos the site shows, and which one leads. The catalogue (and later the Shopify store) keeps
// every file in the order it was uploaded; this is the display layer on top of it, used everywhere a picture is chosen:
// the row picture, the product page and its gallery, a school's mark, the Product JSON-LD and the share cards
// (`cards-iana-schoolwear.mjs` imports this file). Photos are matched by file name without the extension, so a rule
// holds for the local files and for a Shopify CDN copy uploaded under the same name.
//
// Self-contained on purpose (no imports, erasable TypeScript only) so Node can load it directly for the card script.

/** Never shown: supplier model shots with a child's face (CLAUDE.md rule 4: no children's faces). The flat cut-outs
    of the same garments lead instead; a product left with no photo gets the garment outline. */
export const HIDDEN = new Set<string>([
  "avon-corded-gingham-dress-1",
  "ayr-button-front-corded-gingham-dress-1",
  "davenport-knife-pleat-skirt-1",
  "thornton-skirt-1",
  "speedo-junior-eco-endurance-medalist-swimsuit-1",
  "speedo-junior-eco-endurance-medalist-swimsuit-2",
  "speedo-junior-eco-endurance-medalist-swimsuit-3",
]);

/** Crest and detail close-ups. In a 64px square row a landscape close-up reads as a blue slab, so a product never
    leads with one while it has a frame of the whole garment; the rest keep their order (the close-up comes second).
    A product whose photos are all close-ups keeps its own order. */
export const CLOSE_UPS = new Set<string>([
  "allen-edwards-bookbag-1-2",
  "allen-edwards-cardigan-1",
  "allen-edwards-cardigan-2",
  "allen-edwards-infant-backpack-2",
  "allen-edwards-junior-backpack-2",
  "allen-edwards-pe-t-shirt-2",
  "allen-edwards-sweatshirt-2",
  "fircroft-backpack-2",
  "fircroft-bookbag-2",
  "heathbrook-cardigan-2",
  "heathbrook-hard-deluxe-bookbag-3",
  "heathbrook-infant-backpack-2",
  "heathbrook-junior-backpack-2",
  "heathbrook-sweatshirt-1",
  "heathbrook-sweatshirt-3",
  "st-anne-s-bookbag-2",
  "st-annes-backpack-3",
  "trinity-st-mary-s-unisex-blazer-2",
]);

/** "/img/products/thornton-skirt-1.webp" or "https://cdn.shopify.com/.../thornton-skirt-1.webp?v=1" -> "thornton-skirt-1". */
export function photoName(src: string): string {
  const file = src.split(/[?#]/)[0].split("/").pop() ?? "";
  return file.replace(/\.[a-z0-9]+$/i, "").toLowerCase();
}

/** The photos to show for a product, in the order to show them. Use this, never `product.images`, to pick a picture. */
export function photos(p: { images: readonly string[] }): string[] {
  const shown = p.images.filter((src) => !HIDDEN.has(photoName(src)));
  const lead = shown.findIndex((src) => !CLOSE_UPS.has(photoName(src)));
  if (lead <= 0) return shown;
  return [shown[lead], ...shown.slice(0, lead), ...shown.slice(lead + 1)];
}

/** The picture a product leads with, or undefined when it has none to show. */
export const firstPhoto = (p: { images: readonly string[] }): string | undefined => photos(p)[0];
