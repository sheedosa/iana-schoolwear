import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SITE } from "../data/site";
import { ProductCard } from "../components/ProductCard";
import { asset, COLLECTIONS, storefront, type Product, type School } from "../lib/shopify";
import { Seo, breadcrumbs } from "../components/Seo";

export function Collection() {
  const { handle = "all" } = useParams();
  const c = COLLECTIONS[handle] ?? COLLECTIONS.all;
  const [products, setProducts] = useState<Product[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [type, setType] = useState("");
  const [schoolOnly, setSchoolOnly] = useState<"all" | "plain" | "logo">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    storefront.products({ collection: handle }).then((ps) => { setLoaded(true); setProducts(handle === "boys" || handle === "girls" ? [...ps].sort((a, b) => Number(!a.images.length) - Number(!b.images.length) || Number(a.logoItem) - Number(b.logoItem)) : ps); });
    storefront.schools().then(setSchools);
    setType(""); setSchoolOnly("all"); setFiltersOpen(false); window.scrollTo(0, 0);
  }, [handle]);

  const types = useMemo(() => Array.from(new Set(products.map((p) => p.productType))).sort(), [products]);
  const shown = products.filter((p) => (!type || p.productType === type) && (schoolOnly === "all" || (schoolOnly === "logo") === p.logoItem));
  const activeCount = Number(!!type) + Number(schoolOnly !== "all");
  const summary = [type, schoolOnly === "plain" ? "plain only" : schoolOnly === "logo" ? "with school logo" : ""].filter(Boolean).join(", ").toLowerCase();
  const clear = () => { setType(""); setSchoolOnly("all"); };
  const bySlug = Object.fromEntries(schools.map((s) => [s.slug, s]));

  return (
    <>
      <Seo title={`${c.title} school uniform`} description={`${c.blurb} Plain and embroidered school uniform from I&A, Tooting. Pay in 3 with Klarna.`} path={`/collections/${handle}`} image={c.banner} jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: c.title, path: `/collections/${handle}` }])} />
      <section className="bg-sage-soft">
        {/* The title sits on the page grid; the photograph runs out to the right edge of the window. */}
        <div className="grid items-stretch md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col justify-center px-4 py-8 sm:px-6 md:py-12 md:pl-[max(1.5rem,calc((100vw-1200px)/2+1.5rem))] md:pr-10">
            <h1>{c.title}</h1>
            <p className="t-lede mt-3 max-w-md text-ink/75">{c.blurb}</p>
          </div>
          <img src={asset(c.banner)} alt="" className="hidden h-full max-h-[300px] min-h-[220px] w-full object-cover md:block" />
        </div>
      </section>
      <section className="wrap mt-6">
        <h2 className="sr-only">{c.title} products</h2>
        {/* Phones: one Filter button and the state of the filters in words; the grid follows straight after. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="filters" className="pill gap-2 font-medium lg:hidden">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M3 6h18M7 12h10M10 18h4" /></svg>
            Filter{activeCount ? ` (${activeCount})` : ""}
          </button>
          <p role="status" className="ml-auto text-ink/75 lg:order-last lg:ml-0">
            <strong className="text-ink">{shown.length} {shown.length === 1 ? "item" : "items"}</strong>{summary ? `, ${summary}` : ""}
          </p>
          {activeCount > 0 && <button type="button" onClick={clear} className="min-h-11 px-1 underline underline-offset-4 lg:order-last">Clear filters</button>}
        </div>
        <div id="filters" className={`${filtersOpen ? "panel-in mt-3 grid" : "hidden"} gap-x-8 gap-y-3 border-y border-line py-4 lg:mt-3 lg:flex lg:flex-wrap lg:items-center lg:border-t-0 lg:pt-0`}>
          <div role="group" aria-label="Type" className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={!type} onClick={() => setType("")} className="pill">All types</button>
            {types.map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className="pill">{t}</button>)}
          </div>
          <div role="group" aria-label="School logo" className="flex flex-wrap gap-2">
            {(["all", "plain", "logo"] as const).map((k) => (
              <button key={k} type="button" aria-pressed={schoolOnly === k} onClick={() => setSchoolOnly(k)} className="pill">{k === "all" ? "Plain or logo" : k === "plain" ? "Plain only" : "With school logo"}</button>
            ))}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:mt-8 lg:grid-cols-4">
          {shown.map((p) => <ProductCard key={p.handle} p={p} school={p.school ? bySlug[p.school] : undefined} showSchool />)}
        </div>
        {loaded && shown.length === 0 && (
          <div className="measure py-12">
            <p className="t-h3 font-medium">Nothing matches those filters.</p>
            <p className="mt-2 text-ink/75">It may still be on the shelf in Tooting: call {SITE.phone}.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={clear} className="btn btn-ink">Clear filters</button>
              <Link to="/schools" className="btn btn-ghost">Find your school</Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
