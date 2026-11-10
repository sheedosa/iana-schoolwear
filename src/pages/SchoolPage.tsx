import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductRows, Thumb, garmentName } from "../components/ProductRow";
import { SchoolMark } from "../components/SchoolFinder";
import { useCart } from "../lib/cart";
import { useSchools } from "../lib/school";
import { formatPrice, inStoreOnly, sortSizes, storefront, StorefrontError, type Product, type School } from "../lib/shopify";
import { Seo, breadcrumbs } from "../components/Seo";
import { SITE, money } from "../data/site";

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
  const { choose } = useSchools();
  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [nudge, setNudge] = useState(false);

  useEffect(() => {
    setSize(""); setErr(null); setNudge(false);
    storefront.school(slug).then((s) => { setSchool(s); if (s) choose(s.slug); }); // opening a school's page chooses it
    storefront.products({ school: slug }).then(setProducts);
    storefront.products().then((ps) => setPlain(pickBasics(ps, slug)));
    window.scrollTo(0, 0);
  }, [slug, choose]);

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
    if (needSize) {
      setNudge(true);
      const el = document.getElementById("bundle-size");
      el?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      el?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
      return;
    }
    void addKit();
  };

  if (!school) return <div className="wrap py-16 text-mute">Loading school…</div>;
  const crumbs = breadcrumbs([{ name: "Home", path: "/" }, { name: "Schools", path: "/schools" }, { name: school.short, path: `/schools/${school.slug}` }]);
  const photo = products.find((p) => p.images[0])?.images[0];

  if (inStoreOnly(school)) return <InStoreSchool school={school} products={products} plain={plain} crumbs={crumbs} />;

  return (
    <div className="wrap py-6 lg:py-8">
      <Seo title={`${school.name} uniform`} description={`${school.name} school uniform: embroidered sweatshirts, cardigans, PE kit and bags, plus plain basics. Supplied and embroidered by I&A in Tooting. Pay in 3 with Klarna.`} path={`/schools/${school.slug}`} image={photo} jsonLd={crumbs} />
      <SchoolTitle school={school}>{school.area}. {plural(products.length, "item")} with the {school.short} crest online.</SchoolTitle>

      <div className="mt-8 grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        <div className="min-w-0 space-y-12">
          {showBundle && (
            <section aria-labelledby="bundle-h">
              <h2 id="bundle-h">The essentials</h2>
              <p className="mt-1 text-mute">The {count} crested {school.short} items to start with. {sizes.length > 0 ? `Choose one size for ${allWord}, then add them together.` : "Add them together."}</p>
              {sizes.length > 0 && (
                <fieldset className="mt-4" id="bundle-size">
                  <legend className="flex w-full items-center justify-between gap-4 font-semibold">
                    <span aria-live="polite">{size ? `Size ${size}, for ${allWord}` : `Size, for ${allWord}`}</span>
                    <Link to="/size-guide" className="link tap font-normal">Size guide</Link>
                  </legend>
                  <div className="keys">
                    {sizes.map((s) => (
                      <button key={s} type="button" aria-pressed={size === s} onClick={() => { setSize(s); setErr(null); setNudge(false); }} className="key">{s}</button>
                    ))}
                  </div>
                </fieldset>
              )}
              <ul className="sheet mt-5" aria-label={`${school.short} essentials`}>
                {bundle.map((p) => (
                  <li key={p.handle} className="item-line sm:!grid-cols-[4rem_minmax(0,1fr)_auto]">
                    <Thumb p={p} />
                    <div className="row-text min-w-0">
                      <Link to={`/products/${p.handle}`} className="row-link font-semibold leading-tight underline decoration-line decoration-2 underline-offset-4 hover:decoration-blue">{garmentName(p, school)}</Link>
                      <p className="t-small mt-0.5 text-mute">{!p.sizes.length ? "One size" : size ? `Size ${size}` : "Size to choose"}</p>
                    </div>
                    <span className="num font-medium">{formatPrice(p.priceMin)}</span>
                  </li>
                ))}
              </ul>
              <div className="order-foot">
                <p className="flex items-baseline justify-between gap-4 pb-2.5"><span className="font-semibold">Essentials total</span><span className="num text-xl font-semibold">{formatPrice(kitTotal)}</span></p>
                {nudge && needSize && <p role="alert" className="mb-2 font-medium">Choose the size first, then add.</p>}
                <button type="button" disabled={adding} aria-disabled={needSize} onClick={addOrAsk} className="btn btn-buy w-full">{adding ? "Adding…" : `Add ${allWord} to basket, ${formatPrice(kitTotal)}`}</button>
                {err && <p role="alert" className="mt-2 font-medium">{err} Call <a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a> if it keeps happening.</p>}
              </div>
            </section>
          )}

          <section aria-labelledby="list-h">
            <h2 id="list-h">From the school's uniform list</h2>
            <p className="measure mt-1 text-mute">The school's uniform leaflet shows which items are compulsory. Not sure? Call {SITE.phone} and we'll tell you.</p>
            {products.length > 0 && (
              <div className="mt-6">
                <div className="group-head"><h3>With the school crest</h3><span className="num text-mute">{plural(products.length, "item")}</span></div>
                <div className="[&>.sheet]:border-t-0"><ProductRows products={products} school={school} /></div>
              </div>
            )}
            <Basics plain={plain} />
          </section>
        </div>
        <Aside crested />
      </div>
    </div>
  );
}

function SchoolTitle({ school, children }: { school: School; children: React.ReactNode }) {
  return (
    <>
      <p className="t-small"><Link to="/schools" className="link tap">Schools</Link> <span className="text-mute">/ {school.short}</span></p>
      <div className="mt-1 flex items-center gap-4">
        <SchoolMark school={school} size="mark-lg" shared />
        <div className="min-w-0">
          <h1>{school.name}</h1>
          <p className="mt-1 text-mute">{children}</p>
        </div>
      </div>
    </>
  );
}

function Basics({ plain }: { plain: Product[] }) {
  if (!plain.length) return null;
  return (
    <div className="mt-10">
      <div className="group-head"><h3>Plain items to go with it</h3><Link to="/collections/plain" className="link tap -my-2.5">All plain basics</Link></div>
      <div className="[&>.sheet]:border-t-0"><ProductRows products={plain} /></div>
    </div>
  );
}

/** The facts a parent checks before ordering, from SITE. */
function Aside({ crested = false }: { crested?: boolean }) {
  const d = SITE.delivery;
  return (
    <aside className="space-y-7 lg:sticky lg:top-[calc(var(--head)+1.5rem)] lg:self-start" aria-label="Before you order">
      <section>
        <h2>Sizes</h2>
        <p className="mt-1.5">Between two sizes, go up. The <Link to="/size-guide" className="link">size guide</Link> has the measurements. Or bring your child to the shop and we measure them: no appointment needed.</p>
      </section>
      <section>
        <h2>Delivery</h2>
        <p className="mt-1.5">Drop-off to your child's school is £{d.schoolDropOff}. Standard {money(d.standard.price)}, express {money(d.express.price)}, free on orders of £{d.freeOver} and over. {d.collect}. <Link to="/delivery" className="link">Delivery and returns</Link></p>
      </section>
      {crested && (
        <section>
          <h2>Exchanges</h2>
          <p className="mt-1.5">{SITE.returns.embroidered}</p>
        </section>
      )}
    </aside>
  );
}

function InStoreSchool({ school, products, plain, crumbs }: { school: School; products: Product[]; plain: Product[]; crumbs: Record<string, unknown> }) {
  return (
    <div className="wrap py-6 lg:py-8">
      <Seo title={`${school.name} uniform, in store`} description={`${school.name} uniform is available in store at I&A, 84 Mitcham Road, Tooting. Open ${SITE.hours}. Call ${SITE.phone}.`} path={`/schools/${school.slug}`} jsonLd={crumbs} />
      <SchoolTitle school={school}>{school.area}. In store only.</SchoolTitle>
      <div className="mt-8 grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        <div className="min-w-0">
          <section aria-labelledby="visit-h">
            <h2 id="visit-h">Buy {school.short} uniform in the shop</h2>
            <p className="measure mt-1 text-mute">{school.short} uniform is on Mitcham Road and not online yet. Come in, or call and we check your sizes. Bring your child and we measure them.</p>
            <dl className="facts mt-4 border-t-2 border-blue">
              <div><dt>Address</dt><dd>{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}</dd></div>
              <div><dt>Hours</dt><dd>{SITE.hours}</dd></div>
              <div><dt>Phone</dt><dd><a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a></dd></div>
            </dl>
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-line mt-5">Call the shop</a>
          </section>
          {products.length > 0 && (
            <div className="mt-10">
              <div className="group-head"><h3>Online now</h3><span className="num text-mute">{plural(products.length, "item")}</span></div>
              <div className="[&>.sheet]:border-t-0"><ProductRows products={products} school={school} /></div>
            </div>
          )}
          <Basics plain={plain} />
        </div>
        <Aside />
      </div>
    </div>
  );
}
