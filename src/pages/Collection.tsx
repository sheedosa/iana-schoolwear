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

  useEffect(() => {
    storefront.products({ collection: handle }).then(setProducts);
    storefront.schools().then(setSchools);
    setType(""); window.scrollTo(0, 0);
  }, [handle]);

  const types = useMemo(() => Array.from(new Set(products.map((p) => p.productType))).sort(), [products]);
  const shown = products.filter((p) => (!type || p.productType === type) && (schoolOnly === "all" || (schoolOnly === "logo") === p.logoItem));
  const bySlug = Object.fromEntries(schools.map((s) => [s.slug, s]));

  return (
    <>
      <Seo title={`${c.title} school uniform`} description={`${c.blurb} Plain and embroidered school uniform from I&A, Tooting. Pay in 3 with Klarna.`} path={`/collections/${handle}`} image={c.banner} jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: c.title, path: `/collections/${handle}` }])} />
      <section className="relative">
        <img src={asset(c.banner)} alt="" className="h-[300px] w-full object-cover sm:h-[360px]" />
        <div className="absolute inset-0 flex items-center">
          <div className="wrap">
            <h1 className="display text-4xl sm:text-6xl">{c.title}</h1>
            <p className="mt-2 max-w-md text-ink/75">{c.blurb}</p>
          </div>
        </div>
      </section>
      <section className="wrap mt-8">
        <h2 className="sr-only">{c.title} products</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setType("")} className={`pill ${!type ? "border-ink bg-ink text-white" : ""}`}>All</button>
          {types.map((t) => <button key={t} type="button" onClick={() => setType(t)} className={`pill ${type === t ? "border-ink bg-ink text-white" : ""}`}>{t}</button>)}
          <span className="mx-2 hidden h-6 w-px bg-line sm:block" />
          {(["all", "plain", "logo"] as const).map((k) => (
            <button key={k} type="button" onClick={() => setSchoolOnly(k)} className={`pill ${schoolOnly === k ? "border-ink bg-ink text-white" : ""}`}>{k === "all" ? "Any school" : k === "plain" ? "Plain only" : "With school logo"}</button>
          ))}
          <span className="ml-auto text-sm text-ink/55">{shown.length} items</span>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((p) => <ProductCard key={p.handle} p={p} school={p.school ? bySlug[p.school] : undefined} />)}
        </div>
        {shown.length === 0 && <p className="py-16 text-center text-ink/60">Nothing matches those filters yet. Try "Any school".</p>}
      </section>
    </>
  );
}
