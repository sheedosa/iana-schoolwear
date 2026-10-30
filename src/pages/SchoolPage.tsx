import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../lib/cart";
import { asset, formatPrice, storefront, type Product, type School } from "../lib/shopify";
import { Seo, breadcrumbs } from "../components/Seo";

export function sortSizes(list: string[]) {
  const key = (s: string) => { const m = s.match(/\d+/); return m ? Number(m[0]) : 999; };
  return [...list].sort((a, b) => key(a) - key(b) || a.localeCompare(b));
}

const ESSENTIAL_TYPES = ["Sweatshirts", "Knitwear", "Polo shirts", "PE kit"]; // the logo items most parents start with; schools confirm their own list

export function SchoolPage() {
  const { slug = "" } = useParams();
  const [school, setSchool] = useState<School | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [plain, setPlain] = useState<Product[]>([]);
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
    for (const t of ESSENTIAL_TYPES) {
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
      <Seo title={`${school.name} uniform`} description={`${school.name} school uniform: embroidered sweatshirts, cardigans, PE kit and bags, plus plain basics. Supplied and embroidered by I&A in Tooting. Pay in 3 with Klarna.`} path={`/schools/${school.slug}`} image={school.tile ?? undefined} jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Schools", path: "/schools" }, { name: school.short, path: `/schools/${school.slug}` }])} />
      <section style={{ background: school.tint }}>
        <div className="wrap grid items-center gap-8 py-12 lg:grid-cols-[1fr_380px] lg:py-16">
          <div className="border-l-4 pl-5" style={{ borderColor: school.colour }}>
            <p className="font-medium" style={{ color: school.colour }}>{school.area}</p>
            <h1 className="display mt-2 text-4xl sm:text-5xl lg:text-6xl">{school.name}</h1>
            <p className="mt-4 max-w-lg text-ink/70">
              {products.length ? `${products.length} ${school.short} items, embroidered with the school crest in our Tooting shop.` : `${school.short} uniform is coming online soon; everything is in store on Mitcham Road now.`} Can't see a size? Call us and we'll stitch it.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              <span className="pill">Embroidered in house</span>
              <span className="pill">Pay in 3 with Klarna</span>
              <span className="pill">Click and collect</span>
            </div>
          </div>
          {school.tile && <img src={asset(school.tile)} alt="" className="hidden lg:block aspect-square w-full rounded-md object-cover" />}
        </div>
      </section>

      {compulsory.length > 0 && (
        <section className="wrap mt-12">
          <div className="grid gap-6 rounded-md border border-line bg-white p-6 lg:grid-cols-[1fr_320px] lg:p-8">
            <div>
              <h2 className="text-3xl font-extrabold">The essentials, one tap</h2>
              <p className="mt-1 text-ink/60">The {compulsory.length} logo items most {school.short} parents start with. Pick a size and add all three; change anything in the basket. Your school's own list says what's required.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {compulsory.map((p) => (
                  <Link key={p.handle} to={`/products/${p.handle}`} className="flex gap-3 rounded-md border border-line p-3 hover:border-ink">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded bg-white">
                      {p.images[0] && <img src={asset(p.images[0])} alt="" className="h-full w-full object-contain p-1" />}
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 font-medium leading-tight">{p.title}</p>
                      <p className="text-sm text-ink/55">{formatPrice(p.priceMin)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="order-first rounded-md bg-chalk p-5 lg:order-none">
              <label className="block text-sm font-medium">Size</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {(sizes.length ? sizes : ["One size"]).map((s) => (
                  <button key={s} type="button" onClick={() => setSize(s)} className={`min-h-11 min-w-11 rounded-pill border px-3.5 py-1.5 text-sm ${size === s ? "border-ink bg-ink text-white" : "border-line bg-white"}`}>{s}</button>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink/55">Between two sizes? Go up; children grow into it by spring.</p>
              <div className="mt-5 flex items-baseline justify-between">
                <span className="text-ink/60">Essentials total</span>
                <span className="text-2xl font-extrabold">{formatPrice(kitTotal)}</span>
              </div>
              <button type="button" disabled={adding || (!!sizes.length && !size)} onClick={addKit} className="btn btn-primary mt-3 w-full disabled:opacity-50">{adding ? "Adding…" : "Add the essentials"}</button>
              <Link to="/size-guide" className="mt-1 flex min-h-11 w-full items-center justify-center text-sm underline">Open the size guide</Link>
            </div>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="wrap mt-14">
          <h2 className="text-3xl font-extrabold">More {school.short} uniform</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {rest.map((p) => <ProductCard key={p.handle} p={p} school={school} />)}
          </div>
        </section>
      )}

      <section className="wrap mt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold">Plain basics that go with it</h2>
            <p className="mt-1 text-ink/60">Trousers, shirts and knitwear: any school, no logo.</p>
          </div>
          <Link to="/collections/all" className="font-medium underline">All basics</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {plain.slice(0, 4).map((p) => <ProductCard key={p.handle} p={p} />)}
        </div>
      </section>
    </>
  );
}
