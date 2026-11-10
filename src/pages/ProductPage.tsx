import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductRows, garmentName, priceText } from "../components/ProductRow";
import { OrderTable } from "../components/OrderTable";
import { asset, priceLabel, storefront, type Product, type School } from "../lib/shopify";
import { Seo, breadcrumbs } from "../components/Seo";
import { VLink, productVT } from "../components/VLink";
import { SITE, money } from "../data/site";
import { typeId } from "./Collection";

export function ProductPage() {
  const { handle = "" } = useParams();
  const [p, setP] = useState<Product | undefined>();
  const [school, setSchool] = useState<School | undefined>();
  const [related, setRelated] = useState<Product[]>([]);
  const [img, setImg] = useState(0);
  const [guide, setGuide] = useState(false);

  useEffect(() => {
    setImg(0); window.scrollTo(0, 0);
    storefront.product(handle).then(async (prod) => {
      setP(prod);
      if (!prod) return;
      setSchool(prod.school ? await storefront.school(prod.school) : undefined);
      const rel = await storefront.products(prod.school ? { school: prod.school } : { type: prod.productType });
      setRelated(rel.filter((r) => r.handle !== prod.handle && !(r.images[0] && prod.images.includes(r.images[0]))).slice(0, 5));
    });
  }, [handle]);

  useEffect(() => {
    if (!guide) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setGuide(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [guide]);

  if (!p) return <div className="wrap py-16 text-mute">Loading…</div>;
  const d = SITE.delivery;
  const flat = p.priceMax <= p.priceMin;
  const productLd = {
    "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.description || `${p.title} from I&A Schoolwear, Tooting.`,
    image: p.images.map((i) => asset(i).startsWith("http") ? asset(i) : `${SITE.url}${i}`), brand: { "@type": "Brand", name: school ? school.name : "I&A Schoolwear" },
    sku: p.handle, category: p.productType,
    offers: { "@type": p.priceMax > p.priceMin ? "AggregateOffer" : "Offer", priceCurrency: "GBP", ...(p.priceMax > p.priceMin ? { lowPrice: p.priceMin, highPrice: p.priceMax } : { price: p.priceMin }), availability: p.available ? "https://schema.org/InStock" : "https://schema.org/PreOrder", url: `${SITE.url}/products/${p.handle}`, seller: { "@id": `${SITE.url}/#store` } },
  };
  const hasPhoto = p.images.length > 0;

  return (
    <div className="wrap py-6 lg:py-8">
      <Seo title={p.title} description={`${p.title}${school ? ` for ${school.name}` : ""}: ${priceLabel(p)}. ${p.description || "Embroidered school uniform from I&A, Tooting."}`.slice(0, 160)} path={`/products/${p.handle}`} image={p.images[0]} type="product" jsonLd={[productLd, breadcrumbs([{ name: "Home", path: "/" }, ...(school ? [{ name: school.short, path: `/schools/${school.slug}` }] : [{ name: p.productType, path: "/collections/all" }]), { name: p.title, path: `/products/${p.handle}` }])]} />
      <p className="t-small">
        {school
          ? <VLink to={`/schools/${school.slug}`} className="link tap">{school.short}</VLink>
          : <Link to={`/collections/plain#${typeId(p.productType)}`} className="link tap">Plain basics, {p.productType.toLowerCase()}</Link>}
        <span className="hidden text-mute sm:inline"> / {school ? garmentName(p, school) : p.title}</span>
      </p>

      <div className={`mt-2 grid gap-x-12 gap-y-6 ${hasPhoto ? "md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]" : "max-w-[760px]"}`}>
        {hasPhoto && (
          <div className="md:sticky md:top-[calc(var(--head)+1.5rem)] md:self-start">
            <div className="mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-[4px] bg-white" style={productVT(p.handle)}>
              <img src={asset(p.images[img])} alt={p.title} className="h-full w-full object-contain" />
            </div>
            {p.images.length > 1 && (
              <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                {p.images.map((src, i) => (
                  <button key={src} type="button" onClick={() => setImg(i)} aria-label={`Show photo ${i + 1} of ${p.images.length}`} aria-pressed={i === img} className={`h-14 w-14 overflow-hidden rounded-[4px] border-2 bg-white ${i === img ? "border-blue" : "border-line hover:border-blue"}`}><img src={asset(src)} alt="" className="h-full w-full object-contain" /></button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="min-w-0">
          <h1>{p.title}</h1>
          <p className="mt-1.5">
            <span className="num text-xl font-semibold">{p.priceMin > 0 ? priceText(p) : "Price in store"}</span>
            {p.priceMin > 0 && <span className="text-mute">{flat ? (p.sizes.length > 1 ? " in every size" : "") : ", by size"}</span>}
            {p.brand && <span className="text-mute">. Made by {p.brand}</span>}
          </p>
          {!hasPhoto && <p className="mt-1 text-mute">No photo of this one yet. It is in the shop now{school && p.logoItem ? `, with the ${school.short} crest` : ""}.</p>}

          <div className="mt-5"><OrderTable p={p} sticky onGuide={() => setGuide(true)} /></div>
          {p.sizes.length > 1 && <p className="mt-3 text-mute">Between two sizes, go up. Or bring your child to the shop and we measure them: no appointment needed.</p>}
          {p.description && <p className="measure mt-6 whitespace-pre-line break-words">{p.description}</p>}
          <dl className="facts mt-8 border-t-2 border-blue">
          <div><dt>Delivery</dt><dd>Standard {money(d.standard.price)}, {d.standard.time}. Express {money(d.express.price)}, {d.express.time}. Free on orders of £{d.freeOver} and over.</dd></div>
          <div><dt>To school</dt><dd>Drop-off to your child's school for £{d.schoolDropOff}.</dd></div>
          <div><dt>Collect</dt><dd>{d.collect}.</dd></div>
          <div><dt>{p.logoItem ? "Exchanges" : "Returns"}</dt><dd>{p.logoItem ? SITE.returns.embroidered : `${SITE.returns.days}-day returns.`} <Link to="/delivery" className="link">Delivery and returns</Link></dd></div>
          <div><dt>Pay</dt><dd>Card, or Klarna Pay in 3.</dd></div>
          </dl>
        </div>

      </div>

      {guide && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Size guide">
          <button type="button" className="sheet-in absolute inset-0 bg-ink/50" onClick={() => setGuide(false)} aria-label="Close size guide" />
          <div className="sheet-in absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-ctl border-2 border-blue bg-white p-5 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[600px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-ctl sm:p-6">
            <div className="flex items-center justify-between"><h2>Size guide</h2><button type="button" autoFocus onClick={() => setGuide(false)} className="btn btn-line min-h-11 px-4">Close</button></div>
            <SizeTable />
            <Link to="/size-guide" className="link tap mt-2">How to measure</Link>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-12 max-w-[760px]" aria-labelledby="also-h">
          <div className="group-head">
            <h2 id="also-h">{school ? `Also on the ${school.short} list` : `More ${p.productType.toLowerCase()}`}</h2>
            {school ? <VLink to={`/schools/${school.slug}`} className="link">Whole list</VLink> : <Link to={`/collections/plain#${typeId(p.productType)}`} className="link">All of them</Link>}
          </div>
          <div className="[&>.sheet]:border-t-0"><ProductRows products={related} school={school ?? undefined} /></div>
        </section>
      )}
    </div>
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
    <table className="num mt-4 w-full border-t-2 border-blue">
      <caption className="sr-only">Typical measurements by age, in centimetres</caption>
      <thead><tr className="t-small border-b border-line text-left text-mute">{["Age", "Height", "Chest", "Waist", "Inside leg"].map((h) => <th key={h} scope="col" className="py-2.5 pr-2 font-medium">{h}{h !== "Age" && <span className="font-normal"> cm</span>}</th>)}</tr></thead>
      <tbody>{rows.map((r) => <tr key={r[0]} className="border-b border-line">{r.map((c, i) => i === 0 ? <th key={i} scope="row" className="py-2.5 pr-2 text-left font-semibold">{c}</th> : <td key={i} className="py-2.5 pr-2">{c}</td>)}</tr>)}</tbody>
    </table>
  );
}
