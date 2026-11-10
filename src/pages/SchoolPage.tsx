import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard, garmentName } from "../components/ProductCard";
import { SchoolTile } from "../components/SchoolFinder";
import { StickyBar } from "../components/StickyBar";
import { scrollBehaviour } from "../components/VLink";
import { useCart } from "../lib/cart";
import { asset, formatPrice, inStoreOnly, sortSizes, storefront, StorefrontError, type Product, type School } from "../lib/shopify";
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
  const [err, setErr] = useState<string | null>(null);
  const [addBtn, setAddBtn] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSize(""); setErr(null);
    storefront.school(slug).then(setSchool);
    storefront.products({ school: slug }).then(setProducts);
    storefront.products().then((ps) => setPlain(pickBasics(ps, slug)));
    window.scrollTo(0, 0);
  }, [slug]);

  // The one-tap bundle: priced, photographed crested garments, and only sizes every one of them comes in.
  const bundle = useMemo(() => {
    const picked: Product[] = [];
    const ok = (p: Product) => p.priceMin > 0 && p.images.length > 0 && p.available;
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
    setAdding(true); setErr(null);
    try { for (const p of bundle) await add(p.handle, p.sizes.length ? size : null); }
    catch (e) { setErr(e instanceof StorefrontError ? e.message : "Couldn't add those to your basket. Please try again."); }
    finally { setAdding(false); }
  };

  const needSize = sizes.length > 0 && !size;
  const count = words[bundle.length] || String(bundle.length);
  const allWord = bundle.length === 2 ? "both" : `all ${count}`;
  const addOrAsk = () => {
    if (needSize) { document.getElementById("bundle-size")?.scrollIntoView({ behavior: scrollBehaviour(), block: "start" }); return; }
    void addKit();
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
        <section className="wrap mt-10 lg:mt-14" aria-labelledby="bundle-h">
          <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <div>
              <h2 id="bundle-h">The essentials, one tap</h2>
              <p className="measure mt-2 text-ink/75">The {count} logo items most {school.short} parents start with. Pick the size once and add {allWord}; change anything in the basket.</p>
              {sizes.length > 0 && (
                <fieldset className="mt-6 scroll-mt-32" id="bundle-size">
                  <legend className="t-h3 font-medium">Size, for {allWord}</legend>
                  <div className="sizes mt-3">
                    {sizes.map((s) => (
                      <button key={s} type="button" aria-pressed={size === s} onClick={() => { setSize(s); setErr(null); }} className="pill">{s}</button>
                    ))}
                  </div>
                  <p className="mt-3 text-ink/75">Between two sizes? Go up; children grow into it by spring. <Link to="/size-guide" className="underline underline-offset-4">Size guide</Link></p>
                </fieldset>
              )}
            </div>
            <div>
              <ul className="packing" aria-label={`${school.short} essentials`}>
                {bundle.map((p) => (
                  <li key={p.handle} className="packing-line">
                    <img src={asset(p.images[0])} alt="" className="h-16 w-14 rounded-[3px] border border-line bg-white object-contain p-0.5" />
                    <div className="min-w-0">
                      <Link to={`/products/${p.handle}`} className="font-medium leading-tight underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{garmentName(p, school)}</Link>
                      <p className={`mt-0.5 ${p.sizes.length && !size ? "text-ink/65" : ""}`} aria-live="polite">{!p.sizes.length ? "One size" : size ? `Size ${size}` : "Size to choose"}</p>
                    </div>
                    <span className="font-medium">{formatPrice(p.priceMin)}</span>
                  </li>
                ))}
              </ul>
              <div className="packing-total">
                <span className="font-medium">Essentials total</span>
                <span className="figure text-[2rem]">{formatPrice(kitTotal)}</span>
              </div>
              <button ref={setAddBtn} type="button" disabled={adding} aria-disabled={needSize} onClick={addOrAsk} className="btn btn-primary mt-4 w-full py-4 text-[0.9375rem] disabled:opacity-60">{adding ? "Adding…" : needSize ? "Choose a size to add" : `Add ${allWord} to basket`}</button>
              {err && <p role="alert" className="mt-2 font-medium">{err} Call <a href={`tel:${SITE.phoneIntl}`} className="underline">{SITE.phone}</a> if it keeps happening.</p>}
            </div>
          </div>
          <StickyBar target={addBtn} label="Add the essentials">
            <div className="min-w-0 flex-1 leading-tight"><p className="truncate font-medium">{count[0].toUpperCase() + count.slice(1)} essentials, {formatPrice(kitTotal)}</p><p className="t-small truncate text-ink/75">{needSize ? "Size to choose" : size ? `Size ${size}` : "One size"}</p></div>
            <button type="button" disabled={adding} onClick={addOrAsk} className="btn btn-primary shrink-0 disabled:opacity-60">{adding ? "Adding…" : needSize ? "Choose size" : "Add all"}</button>
          </StickyBar>
        </section>
      )}

      <section className="wrap mt-16 lg:mt-20" aria-labelledby="list-h">
        <h2 id="list-h">From the school's uniform list</h2>
        <p className="measure mt-2 text-ink/75">The school's uniform leaflet shows which items are compulsory. Not sure? Call us on {SITE.phone} and we'll tell you.</p>
        {products.length > 0 && (
          <div className="mt-8">
            <h3 className="t-h3 flex items-baseline justify-between gap-3 border-b border-ink pb-2"><span>With the school crest</span><span className="text-base font-normal text-ink/65">{plural(products.length, "item")}</span></h3>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
              {products.map((p) => <ProductCard key={p.handle} p={p} school={school} />)}
            </div>
          </div>
        )}
        <Basics plain={plain} nested />
      </section>
    </>
  );
}

function SchoolHero({ school, children }: { school: School; children: React.ReactNode }) {
  return (
    <section className="bg-sage-soft">
      <div className="wrap grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-4 py-6 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-x-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-12 lg:py-14">
        {/* The school's tile in its own colour: the only page it appears on. It is the tile the finder carried here. */}
        <SchoolTile school={school} on shared className="lg:col-start-2 lg:row-span-2 lg:row-start-1" />
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <h1>{school.name}</h1>
          <p className="mt-1.5 font-medium lg:mt-3">{school.area}{inStoreOnly(school) ? ", in store only" : ""}</p>
        </div>
        <p className="measure col-span-2 text-ink/75 lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:self-start">{children}</p>
      </div>
    </section>
  );
}

function Basics({ plain, nested = false }: { plain: Product[]; nested?: boolean }) {
  if (!plain.length) return null;
  const grid = (
    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
      {plain.map((p) => <ProductCard key={p.handle} p={p} />)}
    </div>
  );
  if (nested) return (
    <div className="mt-12">
      <h3 className="t-h3 border-b border-ink pb-2">Plain items to go with it</h3>
      <p className="mt-3 text-ink/70">Trousers, shirts, skirts and knitwear: any school, no logo. <Link to="/collections/all" className="font-medium underline underline-offset-4">All plain uniform</Link></p>
      {grid}
    </div>
  );
  return (
    <section className="wrap mt-16 lg:mt-20">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2>Plain items to go with it</h2>
          <p className="mt-1 text-ink/75">Trousers, shirts, skirts and knitwear: any school, no logo.</p>
        </div>
        <Link to="/collections/all" className="inline-flex min-h-11 items-center font-medium underline">All plain uniform</Link>
      </div>
      {grid}
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
      <section className="wrap mt-10 grid gap-x-16 gap-y-8 lg:mt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          <h2>Come to the shop</h2>
          <dl className="mt-5 divide-y divide-line border-y border-ink">
            <div className="grid gap-1 py-4 sm:grid-cols-[120px_1fr]"><dt className="label text-ink/65">Address</dt><dd>{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}</dd></div>
            <div className="grid gap-1 py-4 sm:grid-cols-[120px_1fr]"><dt className="label text-ink/65">Hours</dt><dd>{SITE.hours}</dd></div>
            <div className="grid gap-1 py-4 sm:grid-cols-[120px_1fr]"><dt className="label text-ink/65">Phone</dt><dd><a href={`tel:${SITE.phoneIntl}`} className="underline">{SITE.phone}</a></dd></div>
          </dl>
          <a href={`tel:${SITE.phoneIntl}`} className="btn btn-primary mt-6">Call the shop</a>
        </div>
        <div className="on-dark self-start rounded-[3px] bg-blue p-6 text-white sm:p-8">
          <h2 className="t-h3">By Tooting Broadway</h2>
          <p className="mt-3">Look for the blue shopfront on Mitcham Road. Bring your child and we'll measure them for the right size.</p>
          {products.length > 0 && (
            <>
              <h3 className="mt-6 border-t border-white/40 pt-4">Online now</h3>
              <ul className="mt-1">{products.map((p) => <li key={p.handle}><Link to={`/products/${p.handle}`} className="inline-flex min-h-11 items-center underline underline-offset-4">{p.title}</Link></li>)}</ul>
            </>
          )}
        </div>
      </section>
      <Basics plain={plain} />
    </>
  );
}
