import { useState } from "react";
import { VLink, productVT } from "./VLink";
import { OrderTable } from "./OrderTable";
import { useCart } from "../lib/cart";
import { asset, priceLabel, sortSizes, StorefrontError, type Product, type School } from "../lib/shopify";

/** The garment name without the school in front: "St Anne's polo shirt" -> "Polo shirt". */
export function garmentName(p: Product, school?: School) {
  let t = p.title;
  if (school) {
    for (const n of [school.name, school.short, school.short.replace(/'s$/, "")]) {
      if (t.toLowerCase().startsWith(n.toLowerCase())) { t = t.slice(n.length).trim(); break; }
    }
  }
  return t ? t[0].toUpperCase() + t.slice(1) : p.productType;
}

/** "£12 to £14": the store's price label, with the range written as words. */
export const priceText = (p: Product) => priceLabel(p).replace(" – ", " to ");

/** "3–4 yrs to 13 yrs", "One size", or nothing when the product has no size option. */
export function sizeRange(p: Product) {
  if (!p.sizes.length) return "";
  const s = sortSizes(p.sizes);
  return s.length === 1 ? s[0] : `${s[0]} to ${s[s.length - 1]}`;
}

type Shape = "top" | "bag" | "tie" | "skirt" | "trousers" | "hat";
function shapeFor(p: Product): Shape {
  const t = `${p.title} ${p.productType}`.toLowerCase();
  if (/tie\b/.test(t)) return "tie";
  if (/bag|backpack/.test(t)) return "bag";
  if (/hat|cap\b/.test(t)) return "hat";
  if (/skirt|pinafore|dress/.test(t)) return "skirt";
  if (/trouser|shorts/.test(t)) return "trousers";
  return "top";
}
const PATHS: Record<Shape, string> = {
  top: "M34 18 L22 24 L10 46 L20 51 L28 38 L28 82 L72 82 L72 38 L80 51 L90 46 L78 24 L66 18 C62 26 38 26 34 18 Z",
  bag: "M24 34 L76 34 L80 84 L20 84 Z M38 34 C38 18 62 18 62 34",
  tie: "M44 14 L56 14 L58 22 L52 26 L62 72 L50 86 L38 72 L48 26 L42 22 Z",
  skirt: "M32 22 L68 22 L84 82 L16 82 Z M32 30 L68 30",
  trousers: "M28 14 L72 14 L76 86 L56 86 L50 36 L44 86 L24 86 Z",
  hat: "M30 58 C30 30 70 30 70 58 Z M16 58 L84 58 L84 64 L16 64 Z",
};

/** The 64px picture at the start of a line: the product's own photo, or an outline of the garment where there is none yet. */
export function Thumb({ p, shared = false }: { p: Product; shared?: boolean }) {
  const img = p.images[0];
  return (
    <span className="thumb" data-drawn={!img} style={shared ? productVT(p.handle) : undefined} aria-hidden>
      {img ? <img src={asset(img)} alt="" loading="lazy" /> : (
        <svg viewBox="0 0 100 100" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"><path d={PATHS[shapeFor(p)]} /></svg>
      )}
    </span>
  );
}

/** One product as one line: picture, name, sizes, price, Add. "Add" opens the size and quantity table under the line;
    a product with no size goes straight into the basket. */
export function ProductRow({ p, school, showSchool = false }: { p: Product; school?: School; showSchool?: boolean }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { add } = useCart();
  const name = school && !showSchool ? garmentName(p, school) : p.title;
  const meta = [sizeRange(p), p.brand ? `by ${p.brand}` : "", !p.images.length ? "no photo yet" : ""].filter(Boolean).join(", ");
  const direct = p.sizes.length <= 1; // nothing to choose: one tap adds one
  const panel = `sizes-${p.handle}`;

  const onAdd = async () => {
    if (!direct) { setOpen(!open); return; }
    setBusy(true); setErr(null);
    try { await add(p.handle, p.sizes[0] ?? null); }
    catch (e) { setErr(e instanceof StorefrontError ? e.message : "Couldn't add that to your basket. Please try again."); }
    finally { setBusy(false); }
  };

  return (
    <li>
      <div className="item-line" data-open={open}>
        <Thumb p={p} shared />
        <div className="row-text min-w-0">
          <VLink to={`/products/${p.handle}`} className="row-link font-semibold leading-tight underline decoration-line decoration-2 underline-offset-4 hover:decoration-blue">{name}</VLink>
          {meta && <p className="t-small mt-0.5 text-mute">{meta[0].toUpperCase() + meta.slice(1)}</p>}
          <p className="num mt-0.5 font-medium sm:hidden">{priceText(p)}</p>
        </div>
        <span className="num hidden font-medium sm:block">{priceText(p)}</span>
        {p.available ? (
          <button type="button" onClick={onAdd} disabled={busy} aria-expanded={direct ? undefined : open} aria-controls={direct ? undefined : panel} aria-label={`${open ? "Close sizes for" : "Add"} ${p.title}`} className="btn btn-line min-h-11 justify-self-end px-4">
            {busy ? "Adding…" : open ? "Close" : "Add"}
          </button>
        ) : (
          <span className="t-small justify-self-end text-right text-mute">Out of stock<br />online</span>
        )}
      </div>
      {err && <p role="alert" className="pb-3 font-medium">{err}</p>}
      {open && (
        <div id={panel} className="panel-in pb-4 sm:pl-[4.875rem]">
          <OrderTable p={p} idPrefix={p.handle} />
        </div>
      )}
    </li>
  );
}

/** A ruled list of product lines. */
export function ProductRows({ products, school, showSchool }: { products: Product[]; school?: School; showSchool?: boolean }) {
  return <ul className="sheet">{products.map((p) => <ProductRow key={p.handle} p={p} school={school} showSchool={showSchool} />)}</ul>;
}
