import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../lib/cart";
import { asset, formatPrice, inStoreOnly, sortSizes, storefront, type Product, type School } from "../lib/shopify";
import { Seo, breadcrumbs } from "../components/Seo";
import { SITE } from "../data/site";

export { sortSizes };

const ESSENTIAL_TYPES = ["Sweatshirts", "Knitwear", "Polo shirts", "PE kit"]; // the order parents usually start in
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const words = ["", "one", "two", "three", "four"];

// Plain basics that go with a school: pick by the garment types the school's list leaves to parents.
const BASIC_TYPES = ["Trousers & shorts", "Shirts", "Skirts & dresses", "Knitwear", "Blazers", "PE kit"];
function pickBasics(all: Product[], slug: string): Product[] {
  const plain = all.filter((p) => !p.logoItem && p.images.length && p.available);
  const seed = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const out: Product[] = [];
  for (const t of BASIC_TYPES) {
    const ofType = plain.filter((p) => p.productType === t);
    if (ofType.length) out.push(ofType[seed % ofType.length]);
    if (out.length === 4) break;
  }
  return out;
}

export function SchoolPage() {
  const { slug = "" } = useParams();
  const [school, setSchool] = useState<School | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [plain, setPlain] = useState<Product[]>([]);
  const [size, setSize] = useState("");
  const { add } = useCart();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setSize("");
    storefront.school(slug).then(setSchool);
    storefront.products({ school: slug }).then(setProducts);
    storefront.products().then((ps) => setPlain(pickBasics(ps, slug)));
    window.scrollTo(0, 0);
  }, [slug]);

  const compulsory = products.filter((p) => p.list !== "optional");
  const optional = products.filter((p) => p.list === "optional");

  // The one-tap bundle: priced, photographed garments from the compulsory group, and only sizes every one of them comes in.
  const bundle = useMemo(() => {
    const picked: Product[] = [];
    const ok = (p: Product) => p.priceMin > 0 && p.images.length > 0 && p.available && p.list !== "optional";
    for (const t of ESSENTIAL_TYPES) {
      const p = products.find((x) => x.productType === t && ok(x) && !picked.includes(x));
      if (p) picked.push(p);
      if (picked.length === 3) break;
    }
    return picked;
  }, [products]);
  const sizes = useMemo(() => {
    const sized = bundle.filter((p) => p.sizes.length);
    if (!sized.length) return [];
    return sortSizes(sized[0].sizes.filter((s) => sized.every((p) => p.sizes.includes(s))));
  }, [bundle]);
  const showBundle = bundle.length >= 2 && (sizes.length > 0 || bundle.every((p) => !p.sizes.length));
  const kitTotal = bundle.reduce((a, p) => a + p.priceMin, 0);

  const addKit = async () => {
    setAdding(true);
    for (const p of bundle) await add(p.handle, p.sizes.length ? size : null);
    setAdding(false);
  };

  if (!school) return <div className="wrap py-20 text-ink/60">Loading school…</div>;
  const crumbs = breadcrumbs([{ name: "Home", path: "/" }, { name: "Schools", path: "/schools" }, { name: school.short, path: `/schools/${school.slug}` }]);

  if (inStoreOnly(school)) return <InStoreSchool school={school} products={products} plain={plain} crumbs={crumbs} />;

  return (
    <>
      <Seo title={`${school.name} uniform`} description={`${school.name} school uniform: embroidered sweatshirts, cardigans, PE kit and bags, plus plain basics. Supplied and embroidered by I&A in Tooting. Pay in 3 with Klarna.`} path={`/schools/${school.slug}`} image={school.tile ?? undefined} jsonLd={crumbs} />
      <SchoolHero school={school}>
        {plural(products.length, `${school.short} item`)}, embroidered with the school crest in our Tooting shop. Can't see a size? Call us on <a href={`tel:${SITE.phoneIntl}`} className="underline">{SITE.phone}</a>.
      </SchoolHero>

      {showBundle && (
        <section className="wrap mt-12" aria-labelledby="bundle-h">
          <h2 id="bundle-h" className="text-3xl font-extrabold">The essentials, one tap</h2>
          <p className="mt-1 max-w-[60ch] text-ink/65">The {words[bundle.length] ?? bundle.length} logo items most {school.short} parents start with. Pick a size and add {bundle.length === 2 ? "both" : `all ${words[bundle.length] ?? bundle.length}`}; change anything in the basket.</p>
          <div className="mt-5 grid gap-6 rounded-md border border-line bg-white p-5 sm:p-6 lg:grid-cols-[1fr_340px] lg:p-8">
            <ul className="grid content-start gap-3 sm:grid-cols-2">
              {bundle.map((p) => (
                <li key={p.handle}>
                  <Link to={`/products/${p.handle}`} className="flex gap-3 rounded-md border border-line p-3 hover:border-ink">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded bg-white">
                      <img src={asset(p.images[0])} alt="" className="h-full w-full object-contain p-1" />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 font-medium leading-tight">{p.title}</p>
                      <p className="mt-1 text-ink/65">{formatPrice(p.priceMin)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="rounded-md bg-sage-soft p-5">
              {sizes.length > 0 && (
                <fieldset>
                  <legend className="font-medium">Size</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)} className="pill min-w-11 justify-center">{s}</button>
                    ))}
                  </div>
                  <p className="mt-2 text-ink/65">Between two sizes? Go up; children grow into it by spring.</p>
                </fieldset>
              )}
              <div className="mt-5 flex items-baseline justify-between">
                <span className="text-ink/65">Essentials total</span>
                <span className="text-2xl font-medium">{formatPrice(kitTotal)}</span>
              </div>
              <button type="button" disabled={adding || (sizes.length > 0 && !size)} onClick={addKit} className="btn btn-primary mt-3 w-full disabled:opacity-50">{adding ? "Adding…" : sizes.length > 0 && !size ? "Choose a size first" : "Add the essentials"}</button>
              <Link to="/size-guide" className="mt-1 flex min-h-11 w-full items-center justify-center underline">Open the size guide</Link>
            </div>
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="wrap mt-14" aria-labelledby="list-h">
          <p className="label text-ink/65">From the school's uniform list</p>
          <h2 id="list-h" className="mt-2 text-3xl font-extrabold">Everything for {school.short}</h2>
          <p className="mt-2 max-w-[62ch] text-ink/65">Ask to see the school's uniform leaflet in the shop; we're adding each school's leaflet here.</p>
          {compulsory.length > 0 && (
            <div className="mt-8">
              <h3 className="flex items-baseline gap-3 border-b border-ink pb-2 text-xl"><span>Compulsory</span><span className="label text-ink/65">{plural(compulsory.length, "item")}</span></h3>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
                {compulsory.map((p) => <ProductCard key={p.handle} p={p} school={school} />)}
              </div>
            </div>
          )}
          {optional.length > 0 && (
            <div className="mt-12">
              <h3 className="flex items-baseline gap-3 border-b border-line pb-2 text-xl"><span>Optional</span><span className="label text-ink/65">{plural(optional.length, "item")}</span></h3>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
                {optional.map((p) => <ProductCard key={p.handle} p={p} school={school} />)}
              </div>
            </div>
          )}
        </section>
      )}

      <Basics plain={plain} />
    </>
  );
}

function SchoolHero({ school, children }: { school: School; children: React.ReactNode }) {
  return (
    <section className="bg-sage-soft">
      <div className="wrap grid items-stretch gap-6 py-10 lg:grid-cols-[1fr_360px] lg:gap-10 lg:py-14">
        <div className="flex flex-col justify-center">
          <p className="label text-ink/70">{school.area}{inStoreOnly(school) ? " · In store" : ""}</p>
          <h1 className="display mt-2 text-4xl sm:text-5xl lg:text-6xl">{school.name}</h1>
          <p className="mt-4 max-w-lg text-ink/75">{children}</p>
        </div>
        {/* The school's colour as a solid tile: the only place on the site it appears. */}
        <div className="hidden overflow-hidden rounded-md lg:block" style={{ background: school.colour }}>
          {school.tile ? (
            <img src={asset(school.tile)} alt="" className="aspect-square h-full w-full object-cover mix-blend-normal" />
          ) : (
            <div className="flex aspect-square flex-col items-center justify-center gap-3 p-8 text-center text-white">
              {school.crest ? <img src={asset(school.crest)} alt="" className="h-28 w-28" /> : <span className="display text-6xl">{school.short.replace(/[^A-Z]/g, "").slice(0, 2)}</span>}
              <span className="label">{school.short}</span>
            </div>
          )}
        </div>
        <div className="h-2 rounded-[3px] lg:hidden" style={{ background: school.colour }} aria-hidden />
      </div>
    </section>
  );
}

function Basics({ plain }: { plain: Product[] }) {
  if (!plain.length) return null;
  return (
    <section className="wrap mt-16">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-3xl font-extrabold">Plain basics that go with it</h2>
          <p className="mt-1 text-ink/65">Trousers, shirts, skirts and knitwear: any school, no logo.</p>
        </div>
        <Link to="/collections/all" className="inline-flex min-h-11 items-center font-medium underline">All basics</Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {plain.map((p) => <ProductCard key={p.handle} p={p} />)}
      </div>
    </section>
  );
}

function InStoreSchool({ school, products, plain, crumbs }: { school: School; products: Product[]; plain: Product[]; crumbs: Record<string, unknown> }) {
  return (
    <>
      <Seo title={`${school.name} uniform, in store`} description={`${school.name} uniform is available in store at I&A, 84 Mitcham Road, Tooting. Open ${SITE.hours}. Call ${SITE.phone}.`} path={`/schools/${school.slug}`} jsonLd={crumbs} />
      <SchoolHero school={school}>
        {school.short} uniform is in the shop on Mitcham Road. It isn't online yet, so come in or call and we'll check your sizes.
      </SchoolHero>
      <section className="wrap mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-3xl font-extrabold">Come to the shop</h2>
          <dl className="mt-5 divide-y divide-line border-y border-line">
            <div className="grid gap-1 py-4 sm:grid-cols-[120px_1fr]"><dt className="label text-ink/65">Address</dt><dd>{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}</dd></div>
            <div className="grid gap-1 py-4 sm:grid-cols-[120px_1fr]"><dt className="label text-ink/65">Hours</dt><dd>{SITE.hours}</dd></div>
            <div className="grid gap-1 py-4 sm:grid-cols-[120px_1fr]"><dt className="label text-ink/65">Phone</dt><dd><a href={`tel:${SITE.phoneIntl}`} className="underline">{SITE.phone}</a></dd></div>
          </dl>
          <a href={`tel:${SITE.phoneIntl}`} className="btn btn-primary mt-6">Call the shop</a>
        </div>
        <div className="rounded-md bg-blue p-7 text-white">
          <p className="label">Two minutes from Tooting Broadway</p>
          <p className="mt-3">Look for the blue shopfront on Mitcham Road. Bring your child and we'll measure them for the right size.</p>
          {products.length > 0 && (
            <>
              <p className="label mt-6">Online now</p>
              <ul className="mt-2">{products.map((p) => <li key={p.handle}><Link to={`/products/${p.handle}`} className="inline-flex min-h-11 items-center underline">{p.title}</Link></li>)}</ul>
            </>
          )}
        </div>
      </section>
      <Basics plain={plain} />
    </>
  );
}
