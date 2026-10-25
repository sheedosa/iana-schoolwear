import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../lib/cart";
import { asset, formatPrice, storefront, type Product, type School } from "../lib/shopify";

export function sortSizes(list: string[]) {
  const key = (s: string) => { const m = s.match(/\d+/); return m ? Number(m[0]) : 999; };
  return [...list].sort((a, b) => key(a) - key(b) || a.localeCompare(b));
}

const YEAR_GROUPS = ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"];
const COMPULSORY_TYPES = ["Sweatshirts", "Knitwear", "Polo shirts", "PE kit"]; // the 2026 cap: 3 branded items at primary

export function SchoolPage() {
  const { slug = "" } = useParams();
  const [school, setSchool] = useState<School | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [plain, setPlain] = useState<Product[]>([]);
  const [year, setYear] = useState(YEAR_GROUPS[2]);
  const [size, setSize] = useState("");
  const { add } = useCart();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    storefront.school(slug).then(setSchool);
    storefront.products({ school: slug }).then(setProducts);
    storefront.products().then((ps) => setPlain(ps.filter((p) => !p.logoItem && p.images.length).slice(0, 8)));
    window.scrollTo(0, 0);
  }, [slug]);

  const compulsory = useMemo(() => {
    const picked: Product[] = [];
    for (const t of COMPULSORY_TYPES) {
      const p = products.find((x) => x.productType === t && !picked.includes(x));
      if (p) picked.push(p);
      if (picked.length === 3) break;
    }
    return picked;
  }, [products]);
  const rest = products.filter((p) => !compulsory.includes(p));
  const sizes = useMemo(() => sortSizes(Array.from(new Set(compulsory.flatMap((p) => p.sizes)))).slice(0, 12), [compulsory]);
  const kitTotal = compulsory.reduce((a, p) => a + p.priceMin, 0);

  const addKit = async () => {
    setAdding(true);
    for (const p of compulsory) await add(p.handle, p.sizes.includes(size) ? size : p.sizes[0] ?? null);
    setAdding(false);
  };

  if (!school) return <div className="wrap py-20 text-ink/60">Loading school…</div>;

  return (
    <>
      <section style={{ background: school.tint }}>
        <div className="wrap grid items-center gap-8 py-12 lg:grid-cols-[1fr_380px] lg:py-16">
          <div className="border-l-4 pl-5" style={{ borderColor: school.colour }}>
            <p className="font-semibold" style={{ color: school.colour }}>{school.area} · Official supplier</p>
            <h1 className="display mt-2 text-4xl sm:text-5xl lg:text-6xl">{school.name}</h1>
            <p className="mt-4 max-w-lg text-ink/70">
              {products.length ? `${products.length} items on the ${school.short} list.` : `${school.short} uniform is coming online soon. Everything is in store now.`} Logo items are embroidered here in Stockwell, so sizes you can't find online are usually two days away.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              <span className="pill">Free size exchanges</span>
              <span className="pill">Next-day London delivery</span>
              <span className="pill">Collect in store</span>
            </div>
          </div>
          {school.tile && <img src={asset(school.tile)} alt="" className="hidden lg:block aspect-square w-full rounded-3xl object-cover" />}
        </div>
      </section>

      {compulsory.length > 0 && (
        <section className="wrap mt-12">
          <div className="grid gap-6 rounded-3xl border border-line bg-white p-6 lg:grid-cols-[1fr_320px] lg:p-8">
            <div>
              <h2 className="text-2xl font-extrabold">The full kit, one tap</h2>
              <p className="mt-1 text-ink/60">The {compulsory.length} branded items {school.short} asks for. Pick a year group and size; change anything in the basket.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {compulsory.map((p) => (
                  <Link key={p.handle} to={`/products/${p.handle}`} className="flex gap-3 rounded-2xl border border-line p-3 hover:border-ink">
                    <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg" style={{ background: school.tint }}>
                      {p.images[0] && <img src={asset(p.images[0])} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 font-semibold leading-tight">{p.title}</p>
                      <p className="text-sm text-ink/55">{formatPrice(p.priceMin)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-chalk p-5">
              <label className="block text-sm font-semibold">Year group</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5">
                {YEAR_GROUPS.map((y) => <option key={y}>{y}</option>)}
              </select>
              <label className="mt-4 block text-sm font-semibold">Size</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {(sizes.length ? sizes : ["One size"]).map((s) => (
                  <button key={s} type="button" onClick={() => setSize(s)} className={`min-h-11 rounded-pill border px-3.5 py-1.5 text-sm ${size === s ? "border-ink bg-ink text-white" : "border-line bg-white"}`}>{s}</button>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink/55">Between two sizes? Go up. Exchanges are free.</p>
              <div className="mt-5 flex items-baseline justify-between">
                <span className="text-ink/60">Kit total</span>
                <span className="text-2xl font-extrabold">{formatPrice(kitTotal)}</span>
              </div>
              <button type="button" disabled={adding || (!!sizes.length && !size)} onClick={addKit} className="btn btn-primary mt-3 w-full disabled:opacity-50">{adding ? "Adding…" : "Add the full kit"}</button>
              <Link to="/size-guide" className="mt-3 block text-center text-sm underline">Open the size guide</Link>
            </div>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="wrap mt-14">
          <h2 className="text-2xl font-extrabold">Everything else on the {school.short} list</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {rest.map((p) => <ProductCard key={p.handle} p={p} school={school} />)}
          </div>
        </section>
      )}

      <section className="wrap mt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">Plain basics that go with it</h2>
            <p className="mt-1 text-ink/60">Trousers, shirts, socks and shoes: any school, no logo.</p>
          </div>
          <Link to="/collections/all" className="font-semibold underline">All basics</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {plain.slice(0, 4).map((p) => <ProductCard key={p.handle} p={p} />)}
        </div>
      </section>
    </>
  );
}
