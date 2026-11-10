import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PhotoComing, ProductCard } from "../components/ProductCard";
import { useCart } from "../lib/cart";
import { asset, priceLabel, sortSizes, storefront, StorefrontError, type Product, type School } from "../lib/shopify";
import { Seo, breadcrumbs } from "../components/Seo";
import { StickyBar } from "../components/StickyBar";
import { VLink, productVT, scrollBehaviour } from "../components/VLink";
import { SITE, money } from "../data/site";

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
  const [err, setErr] = useState<string | null>(null);
  const [addBtn, setAddBtn] = useState<HTMLElement | null>(null);
  // One place for add-to-basket so every button shows the same friendly message when Shopify says no.
  const tryAdd = async (handle: string, chosen: string | null) => {
    setBusy(true); setErr(null);
    try { await add(handle, chosen); }
    catch (e) { setErr(e instanceof StorefrontError ? e.message : "Couldn't add that to your basket. Please try again."); }
    finally { setBusy(false); }
  };

  useEffect(() => {
    setSize(""); setImg(0); window.scrollTo(0, 0);
    storefront.product(handle).then(async (prod) => {
      setP(prod);
      if (!prod) return;
      setSchool(prod.school ? await storefront.school(prod.school) : undefined);
      const rel = await storefront.products(prod.school ? { school: prod.school } : { type: prod.productType });
      setRelated(rel.filter((r) => r.handle !== prod.handle && !(r.images[0] && prod.images.includes(r.images[0]))).slice(0, 4));
    });
  }, [handle]);

  if (!p) return <div className="wrap py-20 text-ink/60">Loading…</div>;
  const needsSize = p.sizes.length > 0;
  const mustChoose = needsSize && !size;
  const addOrAsk = () => {
    if (mustChoose) { document.getElementById("size-picker")?.scrollIntoView({ behavior: scrollBehaviour(), block: "center" }); return; }
    void tryAdd(p.handle, size || null);
  };
  const productLd = {
    "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.description || `${p.title} from I&A Schoolwear, Tooting.`,
    image: p.images.map((i) => asset(i).startsWith("http") ? asset(i) : `${SITE.url}${i}`), brand: { "@type": "Brand", name: school ? school.name : "I&A Schoolwear" },
    sku: p.handle, category: p.productType,
    offers: { "@type": p.priceMax > p.priceMin ? "AggregateOffer" : "Offer", priceCurrency: "GBP", ...(p.priceMax > p.priceMin ? { lowPrice: p.priceMin, highPrice: p.priceMax } : { price: p.priceMin }), availability: p.available ? "https://schema.org/InStock" : "https://schema.org/PreOrder", url: `${SITE.url}/products/${p.handle}`, seller: { "@id": `${SITE.url}/#store` } },
  };

  return (
    <>
      <Seo title={p.title} description={`${p.title}${school ? ` for ${school.name}` : ""}: ${priceLabel(p)}. ${p.description || "Embroidered school uniform from I&A, Tooting."}`.slice(0, 160)} path={`/products/${p.handle}`} image={p.images[0]} type="product" jsonLd={[productLd, breadcrumbs([{ name: "Home", path: "/" }, ...(school ? [{ name: school.short, path: `/schools/${school.slug}` }] : [{ name: p.productType, path: "/collections/all" }]), { name: p.title, path: `/products/${p.handle}` }])]} />
      <section className="wrap grid gap-x-12 gap-y-5 py-5 sm:py-8 md:grid-cols-2 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-x-16 lg:py-12">
        <div className="md:sticky md:top-32 md:self-start">
          <div className="aspect-[4/3] overflow-hidden rounded-[3px] border border-line bg-white md:aspect-[4/5]" style={productVT(p.handle)}>
            {p.images[img] ? (
              <img src={asset(p.images[img])} alt={p.title} className="h-full w-full object-contain p-3" />
            ) : (
              <PhotoComing p={p} school={p.logoItem ? school : undefined} large />
            )}
          </div>
          {p.images.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {p.images.map((src, i) => (
                <button key={src} type="button" onClick={() => setImg(i)} aria-label={`Show photo ${i + 1} of ${p.images.length}`} aria-pressed={i === img} className={`h-16 w-14 overflow-hidden rounded-[3px] border-2 sm:h-20 sm:w-16 ${i === img ? "border-ink" : "border-line hover:border-ink/40"}`}><img src={asset(src)} alt="" className="h-full w-full object-cover" /></button>
              ))}
            </div>
          )}
        </div>

        <div>
          {school && <VLink to={`/schools/${school.slug}`} className="inline-flex min-h-11 items-center gap-2 font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-ink"><span className="h-3 w-3 rounded-[2px]" style={{ background: school.colour }} aria-hidden />{school.name}</VLink>}
          <h1 className="t-h2 mt-1">{p.title}</h1>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-4"><span className="figure text-[2rem]">{p.priceMin > 0 ? priceLabel(p) : "Price in store"}</span>{p.brand && <span className="text-ink/75">by {p.brand}</span>}</p>

          {needsSize && (
            <div role="group" aria-labelledby="size-h" className="mt-6 scroll-mt-32" id="size-picker">
              <div className="flex items-center justify-between">
                <p id="size-h" className="t-h3 font-medium" aria-live="polite">{size ? `Size ${size}` : "Choose a size"}</p>
                <button type="button" onClick={() => setGuide(true)} className="min-h-11 px-2 underline underline-offset-4">Size guide</button>
              </div>
              <div className="sizes mt-1">
                {sortSizes(p.sizes).map((s) => {
                  const soldOut = p.soldOutSizes?.includes(s) ?? false;
                  return (
                    <button key={s} type="button" aria-pressed={size === s} aria-label={soldOut ? `${s}, out of stock online` : s} onClick={() => { setSize(s); setErr(null); }} className={`pill ${soldOut && size !== s ? "text-ink/50 line-through" : ""}`}>{s}</button>
                  );
                })}
              </div>
              <p className="mt-3 text-ink/75">Between two sizes? Go up; children grow into it by spring.</p>
            </div>
          )}

          <button
            ref={setAddBtn}
            type="button"
            disabled={busy || !p.available}
            aria-disabled={mustChoose}
            onClick={addOrAsk}
            className="btn btn-primary mt-6 w-full py-4 text-[0.9375rem] disabled:opacity-60"
          >
            {!p.available ? "Out of stock online" : busy ? "Adding…" : mustChoose ? "Choose a size to add" : "Add to basket"}
          </button>
          {err ? <p role="alert" className="mt-2 font-medium text-ink">{err} {err.includes("stock") ? <>Call <a href={`tel:${SITE.phoneIntl}`} className="underline">{SITE.phone}</a> to check the shelf in Tooting.</> : null}</p> : null}
          {!p.available ? <p className="mt-2 text-ink/75">Call {SITE.phone} to check what's in the shop; most sizes are on the shelf in Tooting.</p> : null}

          {p.description && <p className="measure mt-8 whitespace-pre-line break-words text-ink/75">{p.description}</p>}

          <dl className="mt-8 divide-y divide-line border-y border-ink">
            <div className="grid gap-1 py-3 sm:grid-cols-[110px_1fr] sm:gap-4"><dt className="label pt-0.5 text-ink/65">Delivery</dt><dd>Standard {money(SITE.delivery.standard.price)}, {SITE.delivery.standard.time}. Express {money(SITE.delivery.express.price)}, {SITE.delivery.express.time}. Free on orders of £{SITE.delivery.freeOver} and over.</dd></div>
            <div className="grid gap-1 py-3 sm:grid-cols-[110px_1fr] sm:gap-4"><dt className="label pt-0.5 text-ink/65">To school</dt><dd>Drop-off to your child's school for £{SITE.delivery.schoolDropOff}.</dd></div>
            <div className="grid gap-1 py-3 sm:grid-cols-[110px_1fr] sm:gap-4"><dt className="label pt-0.5 text-ink/65">Collect</dt><dd>Click and collect from {SITE.address.street}, {SITE.address.area}.</dd></div>
            <div className="grid gap-1 py-3 sm:grid-cols-[110px_1fr] sm:gap-4"><dt className="label pt-0.5 text-ink/65">{p.logoItem ? "Exchanges" : "Returns"}</dt><dd>{p.logoItem ? SITE.returns.embroidered : `${SITE.returns.days}-day returns.`} <Link to="/delivery" className="underline underline-offset-4">Delivery and returns</Link></dd></div>
            <div className="grid gap-1 py-3 sm:grid-cols-[110px_1fr] sm:gap-4"><dt className="label pt-0.5 text-ink/65">Pay</dt><dd>Card, or Klarna Pay in 3.</dd></div>
          </dl>
        </div>
      </section>

      {p.available && (
        <StickyBar target={addBtn} label="Add to basket">
          <div className="min-w-0 flex-1 leading-tight"><p className="truncate font-medium">{p.priceMin > 0 ? priceLabel(p) : p.title}</p><p className="t-small truncate text-ink/75">{size ? `Size ${size}` : needsSize ? "Size to choose" : p.title}</p></div>
          <button type="button" disabled={busy} onClick={addOrAsk} className="btn btn-primary shrink-0 disabled:opacity-60">{busy ? "Adding…" : mustChoose ? "Choose size" : "Add to basket"}</button>
        </StickyBar>
      )}

      {guide && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Size guide">
          <button type="button" className="sheet-in absolute inset-0 bg-ink/40" onClick={() => setGuide(false)} aria-label="Close" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto sheet-in rounded-t-[3px] border border-ink bg-white p-5 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[600px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[3px] sm:p-6">
            <div className="flex items-center justify-between"><h2 className="t-h3">Size guide</h2><button type="button" onClick={() => setGuide(false)} className="pill">Close</button></div>
            <SizeTable />
            <Link to="/size-guide" className="mt-3 inline-flex min-h-11 items-center underline underline-offset-4">Full guide and how to measure</Link>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="wrap mt-12 lg:mt-16">
          <h2>{school ? `More for ${school.short}` : "You might also need"}</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">{related.map((r) => <ProductCard key={r.handle} p={r} school={school ?? undefined} />)}</div>
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
    <table className="mt-4 w-full border-y border-ink [font-variant-numeric:tabular-nums]">
      <caption className="sr-only">Typical measurements by age, in centimetres</caption>
      <thead><tr className="t-small border-b border-line text-left text-ink/75">{["Age", "Height", "Chest", "Waist", "Inside leg"].map((h) => <th key={h} scope="col" className="py-2.5 pr-2 font-medium">{h}{h !== "Age" && <span className="font-normal"> cm</span>}</th>)}</tr></thead>
      <tbody className="divide-y divide-line">{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => i === 0 ? <th key={i} scope="row" className="py-2.5 pr-2 text-left font-medium">{c}</th> : <td key={i} className="py-2.5 pr-2">{c}</td>)}</tr>)}</tbody>
    </table>
  );
}
