import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { SITE } from "../data/site";
import { ProductRows } from "../components/ProductRow";
import { COLLECTIONS, storefront, type Product } from "../lib/shopify";
import { Seo, breadcrumbs } from "../components/Seo";

/** Garment types in the order a parent works down a list. */
export const TYPE_ORDER = ["Trousers & shorts", "Shirts", "Polo shirts", "Sweatshirts", "Knitwear", "Skirts & dresses", "Blazers", "PE kit", "Bags", "Accessories"];
export const typeId = (t: string) => t.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

// "Plain basics" is every item without a school crest. It is a page of this site, not a store collection.
const PLAIN = { title: "Plain basics", blurb: "Uniform with no crest, for any school." };

export function Collection() {
  const { handle = "all" } = useParams();
  const isPlain = handle === "plain";
  const c = isPlain ? PLAIN : COLLECTIONS[handle] ?? COLLECTIONS.all;
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { hash } = useLocation();

  useEffect(() => {
    setLoaded(false); window.scrollTo(0, 0);
    storefront.products(isPlain ? {} : { collection: handle }).then((ps) => { setProducts(isPlain ? ps.filter((p) => !p.logoItem) : ps); setLoaded(true); });
  }, [handle, isPlain]);

  // Grouped by garment type; inside a group, plain items first, then crested ones.
  const groups = useMemo(() => {
    const types = [...TYPE_ORDER, ...Array.from(new Set(products.map((p) => p.productType))).filter((t) => !TYPE_ORDER.includes(t)).sort()];
    return types.map((t) => ({ t, items: products.filter((p) => p.productType === t).sort((a, b) => Number(a.logoItem) - Number(b.logoItem)) })).filter((g) => g.items.length);
  }, [products]);

  // A link such as /collections/plain#shirts lands on that group once the lines are on the page.
  useEffect(() => {
    if (!loaded || !hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [loaded, hash]);

  return (
    <section className="wrap py-8 lg:py-10">
      <Seo title={isPlain ? "Plain school uniform basics" : `${c.title} school uniform`} description={`${c.blurb} Plain and embroidered school uniform from I&A, Tooting. Pay in 3 with Klarna.`} path={`/collections/${handle}`} jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: c.title, path: `/collections/${handle}` }])} />
      <h1>{c.title}</h1>
      <p className="mt-2 text-mute">
        {loaded ? `${products.length} ${products.length === 1 ? "item" : "items"}. ` : "Loading… "}
        {isPlain ? <>Looking for the crest? <Link to="/schools" className="link">Choose your school</Link>.</> : <>Press Add on a line to set sizes and quantities.</>}
      </p>

      {groups.length > 1 && (
        <nav aria-label="Jump to a garment type" className="mt-4 flex flex-wrap gap-x-5 border-y border-line py-1">
          {groups.map((g) => <a key={g.t} href={`#${typeId(g.t)}`} onClick={(e) => { e.preventDefault(); document.getElementById(typeId(g.t))?.scrollIntoView({ block: "start" }); }} className="tap gap-1.5"><span className="link">{g.t}</span> <span className="num text-mute">{g.items.length}</span></a>)}
        </nav>
      )}

      <div className="mt-6 space-y-10">
        {groups.map((g) => (
          <section key={g.t} id={typeId(g.t)} aria-labelledby={`${typeId(g.t)}-h`} className="scroll-mt-[var(--head)]">
            <div className="group-head">
              <h2 id={`${typeId(g.t)}-h`}>{g.t}</h2>
              <span className="num text-mute">{g.items.length} {g.items.length === 1 ? "item" : "items"}</span>
            </div>
            <div className="[&>.sheet]:border-t-0"><ProductRows products={g.items} showSchool /></div>
          </section>
        ))}
      </div>

      {loaded && products.length === 0 && (
        <div className="measure mt-6">
          <p className="font-semibold">Nothing in this list is online yet.</p>
          <p className="mt-1 text-mute">It may be on the shelf in Tooting. Call <a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a>, or <Link to="/schools" className="link">choose your school</Link>.</p>
        </div>
      )}
      {!isPlain && loaded && products.some((p) => p.logoItem) && (
        <p className="mt-8 text-mute">Crested items are listed with their school's name. For one school's whole list, <Link to="/schools" className="link">choose your school</Link>.</p>
      )}
    </section>
  );
}
