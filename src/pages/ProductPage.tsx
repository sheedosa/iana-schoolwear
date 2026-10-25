import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../lib/cart";
import { asset, priceLabel, storefront, type Product, type School } from "../lib/shopify";
import { sortSizes } from "./SchoolPage";

export function ProductPage() {
  const { handle = "" } = useParams();
  const [p, setP] = useState<Product | undefined>();
  const [school, setSchool] = useState<School | undefined>();
  const [related, setRelated] = useState<Product[]>([]);
  const [size, setSize] = useState("");
  const [img, setImg] = useState(0);
  const [guide, setGuide] = useState(false);
  const { add } = useCart();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSize(""); setImg(0); window.scrollTo(0, 0);
    storefront.product(handle).then(async (prod) => {
      setP(prod);
      if (!prod) return;
      setSchool(prod.school ? await storefront.school(prod.school) : undefined);
      const rel = await storefront.products(prod.school ? { school: prod.school } : { type: prod.productType });
      setRelated(rel.filter((r) => r.handle !== prod.handle).slice(0, 4));
    });
  }, [handle]);

  if (!p) return <div className="wrap py-20 text-ink/60">Loading…</div>;
  const needsSize = p.sizes.length > 0;

  return (
    <>
      <section className="wrap grid gap-10 py-8 lg:grid-cols-[1.1fr_1fr] lg:py-12">
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-white">
            {p.images[img] ? (
              <img src={asset(p.images[img])} alt={p.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center p-10 text-center" style={{ background: school?.tint ?? "#eef0f3" }}>
                <p className="text-ink/60">Photo coming soon. This item is in store now, embroidered with the {school?.short ?? "school"} crest.</p>
              </div>
            )}
          </div>
          {p.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {p.images.map((src, i) => (
                <button key={src} type="button" onClick={() => setImg(i)} className={`h-20 w-16 overflow-hidden rounded-xl border ${i === img ? "border-ink" : "border-line"}`}><img src={asset(src)} alt="" className="h-full w-full object-cover" /></button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start">
          {school && <Link to={`/schools/${school.slug}`} className="inline-flex items-center gap-2 font-semibold" style={{ color: school.colour }}><span className="h-2.5 w-2.5 rounded-full" style={{ background: school.colour }} />{school.name}</Link>}
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{p.title}</h1>
          <p className="mt-2 text-2xl font-bold">{priceLabel(p)}</p>
          {p.description && <p className="mt-4 text-ink/70">{p.description}</p>}

          {needsSize && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Size</span>
                <button type="button" onClick={() => setGuide(true)} className="min-h-11 px-2 text-sm underline">Size guide</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {sortSizes(p.sizes).map((s) => (
                  <button key={s} type="button" onClick={() => setSize(s)} className={`min-h-11 min-w-14 rounded-pill border px-3 py-2 text-sm font-medium ${size === s ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}>{s}</button>
                ))}
              </div>
              <p className="mt-2 text-sm text-ink/55">Between two sizes? Go up. Exchanges are free.</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={busy || (needsSize && !size)}
              onClick={async () => { setBusy(true); await add(p.handle, size || null); setBusy(false); }}
              className="btn btn-primary flex-1 py-4 text-lg disabled:opacity-50"
            >
              {p.available ? "Add to basket" : "Pre-order"}
            </button>
          </div>
          {needsSize && !size && <p className="mt-2 text-sm text-ink/55">Choose a size to add this.</p>}

          <dl className="mt-8 divide-y divide-line border-y border-line text-[15px]">
            <div className="flex justify-between py-3"><dt className="text-ink/60">Delivery</dt><dd>Next day in London, 2–4 days UK</dd></div>
            <div className="flex justify-between py-3"><dt className="text-ink/60">Exchanges</dt><dd>Free size exchange, 30 days</dd></div>
            <div className="flex justify-between py-3"><dt className="text-ink/60">Returns</dt><dd>{p.logoItem ? "Exchange only (made to order)" : "Full refund, unworn with tags"}</dd></div>
            <div className="flex justify-between py-3"><dt className="text-ink/60">Collect</dt><dd>Stockwell Road, ready in 2 hours</dd></div>
          </dl>
        </div>
      </section>

      {guide && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Size guide">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setGuide(false)} aria-label="Close" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[560px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Size guide</h2><button type="button" onClick={() => setGuide(false)} className="pill">Close</button></div>
            <SizeTable />
            <Link to="/size-guide" className="mt-4 inline-block underline">Full guide and how to measure</Link>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="wrap mt-8">
          <h2 className="text-2xl font-extrabold">{school ? `More for ${school.short}` : "You might also need"}</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">{related.map((r) => <ProductCard key={r.handle} p={r} school={school} />)}</div>
        </section>
      )}
    </>
  );
}

export function SizeTable() {
  const rows = [
    ["3–4", "98–104", "56", "53", "58"],
    ["5–6", "110–116", "60", "55", "66"],
    ["7–8", "122–128", "64", "58", "74"],
    ["9–10", "134–140", "70", "62", "82"],
    ["11–12", "146–152", "76", "66", "90"],
    ["13", "158", "82", "70", "96"],
  ];
  return (
    <table className="mt-4 w-full text-sm">
      <thead><tr className="text-left text-ink/55"><th className="py-2 font-medium">Age</th><th className="font-medium">Height cm</th><th className="font-medium">Chest cm</th><th className="font-medium">Waist cm</th><th className="font-medium">Inside leg cm</th></tr></thead>
      <tbody className="divide-y divide-line">{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} className={`py-2 ${i === 0 ? "font-semibold" : ""}`}>{c}</td>)}</tr>)}</tbody>
    </table>
  );
}
