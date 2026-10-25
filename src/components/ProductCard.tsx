import { Link } from "react-router-dom";
import { asset, priceLabel, type Product, type School } from "../lib/shopify";

export function ProductCard({ p, school }: { p: Product; school?: School }) {
  const img = p.images[0];
  return (
    <Link to={`/products/${p.handle}`} className="lift group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white border border-line">
        {img ? (
          <img src={asset(img)} alt={p.title} loading="lazy" className="h-full w-full object-contain p-3" />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center" style={{ background: school?.tint ?? "#eef0f3" }}>
            <span className="text-sm font-medium" style={{ color: school?.colour ?? "#3b4559" }}>{p.productType}<br /><span className="text-ink/50">Photo coming soon</span></span>
          </div>
        )}
        {p.logoItem && school && <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-xs font-semibold" style={{ color: school.colour }}>{school.short}</span>}
        {!p.available && <span className="absolute right-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink/70">Out of stock online</span>}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold leading-tight group-hover:underline">{p.title}</h3>
          <p className="text-sm text-ink/55">{p.sizes.length > 1 ? `${p.sizes.length} sizes` : p.productType}</p>
        </div>
        <span className="shrink-0 font-semibold">{priceLabel(p)}</span>
      </div>
    </Link>
  );
}
