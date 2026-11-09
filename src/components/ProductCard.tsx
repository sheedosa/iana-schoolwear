import { Link } from "react-router-dom";
import { asset, priceLabel, type Product, type School } from "../lib/shopify";

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

/** A designed tile for items not yet photographed: school colour (or Sage), the garment drawn in line, its name in caps. */
export function PhotoComing({ p, school, large = false }: { p: Product; school?: School; large?: boolean }) {
  const onColour = !!school;
  const fg = onColour ? "#ffffff" : "#45353a";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-5 text-center" style={{ background: school?.colour ?? "#d8e2dc", color: fg }}>
      {school?.crest ? (
        <img src={asset(school.crest)} alt="" className={large ? "h-24 w-24" : "h-14 w-14"} />
      ) : (
        <svg viewBox="0 0 100 100" className={large ? "h-32 w-32" : "h-16 w-16 sm:h-20 sm:w-20"} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" aria-hidden>
          <path d={PATHS[shapeFor(p)]} vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      <span className={`label ${large ? "text-sm" : "text-[0.6875rem] sm:text-xs"}`}>{garmentName(p, school)}</span>
      <span className={`${large ? "text-base" : "text-sm"} opacity-95`}>{large ? `Photo coming soon. In store now${school ? `, with the ${school.short} crest` : ""}.` : "Photo coming soon"}</span>
    </div>
  );
}

export function ProductCard({ p, school, showSchool = false }: { p: Product; school?: School; showSchool?: boolean }) {
  const img = p.images[0];
  return (
    <Link to={`/products/${p.handle}`} className="lift group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-line bg-white">
        {img ? (
          <img src={asset(img)} alt={p.title} loading="lazy" className="h-full w-full object-contain p-3" />
        ) : (
          <PhotoComing p={p} school={p.logoItem ? school : undefined} />
        )}
        {showSchool && p.logoItem && school && img && <span className="absolute left-3 top-3 rounded-pill bg-white px-2.5 py-1 text-xs font-medium" style={{ color: school.colour }}>{school.short}</span>}
        {!p.available && <span className="absolute right-3 top-3 rounded-pill bg-white px-2.5 py-1 text-xs font-medium text-ink/70">Out of stock online</span>}
      </div>
      <div className="mt-3">
        <h3 className="font-normal leading-tight group-hover:underline">{p.title}</h3>
        <p className="mt-1 font-medium">{priceLabel(p)}</p>
        <p className="label mt-0.5 text-[0.6875rem] text-ink/55">{[p.brand, p.sizes.length > 1 ? `${p.sizes.length} sizes` : p.productType].filter(Boolean).join(" · ")}</p>
      </div>
    </Link>
  );
}
