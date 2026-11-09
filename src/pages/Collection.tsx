import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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

  useEffect(() => {
    storefront.products({ collection: handle }).then((ps) => setProducts(handle === "boys" || handle === "girls" ? [...ps].sort((a, b) => Number(!a.images.length) - Number(!b.images.length) || Number(a.logoItem) - Number(b.logoItem)) : ps));
    storefront.schools().then(setSchools);
    setType(""); setSchoolOnly("all"); setFiltersOpen(false); window.scrollTo(0, 0);
  }, [handle]);

  const types = useMemo(() => Array.from(new Set(products.map((p) => p.productType))).sort(), [products]);
  const shown = products.filter((p) => (!type || p.productType === type) && (schoolOnly === "all" || (schoolOnly === "logo") === p.logoItem));
  const activeCount = Number(!!type) + Number(schoolOnly !== "all");
  const bySlug = Object.fromEntries(schools.map((s) => [s.slug, s]));

  return (
    <>
      <Seo title={`${c.title} school uniform`} description={`${c.blurb} Plain and embroidered school uniform from I&A, Tooting. Pay in 3 with Klarna.`} path={`/collections/${handle}`} image={c.banner} jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: c.title, path: `/collections/${handle}` }])} />
      <section className="bg-sage-soft">
        <div className="wrap grid items-stretch gap-0 py-6 sm:py-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col justify-center rounded-t-md bg-white p-6 sm:p-8 lg:rounded-l-md lg:rounded-tr-none lg:p-10">
            <p className="label text-ink/65">Collection</p>
            <h1 className="display mt-2 text-4xl sm:text-6xl">{c.title}</h1>
            <p className="mt-3 max-w-md text-ink/75">{c.blurb}</p>
          </div>
          <img src={asset(c.banner)} alt="" className="hidden h-[300px] w-full rounded-r-md object-cover lg:block" />
        </div>
      </section>
      <section className="wrap mt-6">
        <h2 className="sr-only">{c.title} products</h2>
        {/* Phones: one Filter button; the grid follows straight after. */}
        <div className="flex items-center gap-3 lg:hidden">
          <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="filters" className="pill gap-2 font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M3 6h18M7 12h10M10 18h4" /></svg>
            Filter{activeCount ? ` (${activeCount})` : ""}
          </button>
          {activeCount > 0 && <button type="button" onClick={() => { setType(""); setSchoolOnly("all"); }} className="min-h-11 px-1 underline">Clear</button>}
          <span className="ml-auto text-ink/65">{shown.length} items</span>
        </div>
        <div id="filters" className={`${filtersOpen ? "mt-3 flex" : "hidden"} flex-wrap items-center gap-2 lg:mt-0 lg:flex`}>
          <button type="button" aria-pressed={!type} onClick={() => setType("")} className="pill">All</button>
          {types.map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className="pill">{t}</button>)}
          <span className="mx-2 hidden h-6 w-px bg-line sm:block" />
          {(["all", "plain", "logo"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={schoolOnly === k} onClick={() => setSchoolOnly(k)} className="pill">{k === "all" ? "Any school" : k === "plain" ? "Plain only" : "With school logo"}</button>
          ))}
          <span className="ml-auto hidden text-ink/65 lg:inline">{shown.length} items</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:mt-8 lg:grid-cols-4">
          {shown.map((p) => <ProductCard key={p.handle} p={p} school={p.school ? bySlug[p.school] : undefined} showSchool />)}
        </div>
        {shown.length === 0 && <p className="py-16 text-center text-ink/65">Nothing matches those filters yet. Try "Any school".</p>}
      </section>
    </>
  );
}
