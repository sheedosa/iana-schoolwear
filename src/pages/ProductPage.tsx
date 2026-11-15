import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductRows, garmentName, priceText } from "../components/ProductRow";
import { OrderTable } from "../components/OrderTable";
import { asset, priceLabel, storefront, type Product, type School } from "../lib/shopify";
import { Seo, breadcrumbs, fit } from "../components/Seo";
import { VLink, productVT } from "../components/VLink";
import { SITE, money } from "../data/site";
import { typeId } from "./Collection";
import { boot, bootProducts } from "../lib/preload";
import { largeImg, smallImg } from "../lib/img";
import { firstPhoto, photos } from "../lib/photo-rules";
import { useSheet } from "../lib/sheet";

/** The other lines offered under a product: the rest of its school's list, or more of its garment type. */
const alsoFor = (prod: Product, rel: Product[]) => rel.filter((r) => { const lead = firstPhoto(r); return r.handle !== prod.handle && !(lead && photos(prod).includes(lead)); }).slice(0, 5);

export function ProductPage() {
  const { handle = "" } = useParams();
  // Start from what was fetched before React began, so the page is whole in its first render.
  const [p, setP] = useState<Product | undefined>(() => boot.products.find((x) => x.handle === handle));
  const [school, setSchool] = useState<School | undefined>(() => boot.schools.find((s) => s.slug === p?.school));
  const [related, setRelated] = useState<Product[]>(() => (p ? alsoFor(p, bootProducts(p.school ? { school: p.school } : { type: p.productType })) : []));
  const guideBox = useRef<HTMLDivElement>(null);
  const guideOpener = useRef<HTMLElement | null>(null);
  const openGuide = () => { guideOpener.current = document.activeElement as HTMLElement | null; setGuide(true); };
  const [img, setImg] = useState(0);
  const [guide, setGuide] = useState(false);

  useEffect(() => {
    storefront.product(handle).then(async (prod) => {
      setP(prod);
      if (!prod) return;
      setSchool(prod.school ? await storefront.school(prod.school) : undefined);
      const rel = await storefront.products(prod.school ? { school: prod.school } : { type: prod.productType });
      setRelated(alsoFor(prod, rel));
    }).catch(() => {});
  }, [handle]);

  // The size guide sheet: Escape closes it, Tab stays inside it, and focus goes back to the link that opened it.
  useSheet(guide, () => setGuide(false), "size-guide");
  useEffect(() => {
    if (!guide) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setGuide(false);
      const el = guideBox.current;
      if (e.key !== "Tab" || !el) return;
      const stops = [...el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      const first = stops[0], last = stops[stops.length - 1], at = document.activeElement;
      if (e.shiftKey && (at === first || !el.contains(at))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (at === last || !el.contains(at))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      const opener = guideOpener.current;
      (opener?.isConnected && opener !== document.body ? opener : document.querySelector<HTMLElement>(".order .sheet-head button"))?.focus({ preventScroll: true });
    };
  }, [guide]);

  if (!p) return <div className="wrap py-16 text-mute">Loading…</div>;
  const d = SITE.delivery;
  const flat = p.priceMax <= p.priceMin;
  const pics = photos(p); // the photos rule 4 allows, whole garment first (lib/photo-rules.ts)
  const productLd = {
    "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.description || `${p.title} from I&A Schoolwear, Tooting.`,
    image: pics.map((i) => asset(i).startsWith("http") ? asset(i) : `${SITE.url}${i}`), brand: { "@type": "Brand", name: school ? school.name : "I&A Schoolwear" },
    sku: p.handle, category: p.productType,
    // Offers only for a real price: a few items in the data carry 0 until the store lists them.
    ...(p.priceMin > 0 && { offers: { "@type": p.priceMax > p.priceMin ? "AggregateOffer" : "Offer", priceCurrency: "GBP", ...(p.priceMax > p.priceMin ? { lowPrice: p.priceMin, highPrice: p.priceMax } : { price: p.priceMin }), url: `${SITE.url}/products/${p.handle}`, seller: { "@id": `${SITE.url}/#store` } } }),
  };
  const hasPhoto = pics.length > 0;

  return (
    <div className="wrap py-6 lg:py-8">
      <Seo title={p.title} description={fit(`${p.title}${school ? ` for ${school.name}` : ""}: ${priceLabel(p)}.`, p.description, school && p.logoItem ? `Embroidered with the ${school.short} crest in our Tooting shop.` : `From I&A Schoolwear, ${SITE.address.street}, Tooting.`, `Free delivery from £${SITE.delivery.freeOver}.`, "Pay in 3 with Klarna.", "Bring your child in to be measured.")} path={`/products/${p.handle}`} image={hasPhoto ? `/img/og/p/${p.handle}.jpg` : undefined} imageAlt={hasPhoto ? `${p.title}, the shop's own photograph, beside the I&A Schoolwear lockup` : undefined} type="product" jsonLd={[productLd, breadcrumbs([{ name: "Home", path: "/" }, ...(school ? [{ name: school.short, path: `/schools/${school.slug}` }] : [{ name: p.productType, path: "/collections/all" }]), { name: p.title, path: `/products/${p.handle}` }])]} />
      <p className="t-small">
        {school
          ? <VLink to={`/schools/${school.slug}`} className="link tap">{school.short}</VLink>
          : <Link to={`/collections/plain#${typeId(p.productType)}`} className="link tap">Plain basics, {p.productType.toLowerCase()}</Link>}
        <span className="hidden text-mute sm:inline"> / {school ? garmentName(p, school) : p.title}</span>
      </p>

      <div className={`mt-2 grid gap-x-12 gap-y-5 ${hasPhoto ? "md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]" : "max-w-[760px]"}`}>
        {/* On a phone the name and price come first, then the picture; from 768px the picture stands to the left of both. */}
        <div className={`min-w-0 ${hasPhoto ? "md:col-start-2" : ""}`}>
          <h1>{p.title}</h1>
          <p className="mt-1.5">
            <span className="num text-xl font-semibold">{p.priceMin > 0 ? priceText(p) : "Price in store"}</span>
            {p.priceMin > 0 && <span className="text-mute">{flat ? (p.sizes.length > 1 ? " in every size" : "") : ", by size"}</span>}
            {p.brand && <span className="text-mute">. Made by {p.brand}</span>}
          </p>
          {!hasPhoto && <p className="mt-1 text-mute">No photo of this one yet. It is in the shop now{school && p.logoItem ? `, with the ${school.short} crest` : ""}.</p>}
        </div>

        {hasPhoto && (
          <div className="md:sticky md:top-[calc(var(--head)+1.5rem)] md:col-start-1 md:[grid-row:1/span_2] md:self-start">
            <div className="product-pic mx-auto aspect-square max-w-[320px] overflow-hidden rounded-[4px] bg-white" style={productVT(p.handle)}>
              <img {...largeImg(pics[img] ?? pics[0])} alt={p.title} fetchPriority="high" className="h-full w-full object-contain" />
            </div>
            {pics.length > 1 && (
              <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                {pics.map((src, i) => (
                  <button key={src} type="button" onClick={() => setImg(i)} aria-label={`Show photo ${i + 1} of ${pics.length}`} aria-pressed={i === img} className={`h-14 w-14 overflow-hidden rounded-[4px] border-2 bg-white ${i === img ? "border-blue" : "border-line hover:border-blue"}`}><img {...smallImg(src, 52)} alt="" loading="lazy" className="h-full w-full object-contain" /></button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={`min-w-0 ${hasPhoto ? "md:col-start-2" : ""}`}>
          <div><OrderTable p={p} sticky onGuide={openGuide} /></div>
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
          <button type="button" tabIndex={-1} className="backdrop sheet-in absolute inset-0 bg-ink/50" onClick={() => setGuide(false)} aria-label="Close size guide" />
          <div ref={guideBox} className="sheet-scroll sheet-in absolute inset-x-0 bottom-0 max-h-[85dvh] rounded-t-ctl border-2 border-blue bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[600px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-ctl sm:p-6">
            <div className="flex items-center justify-between"><h2>Size guide</h2><button type="button" autoFocus onClick={() => setGuide(false)} className="btn btn-line min-h-11 px-4">Close</button></div>
            <SizeTable />
            <Link to="/size-guide" replace className="link tap mt-2">How to measure</Link>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-12 max-w-[760px]" aria-labelledby="also-h">
          <div className="group-head">
            <h2 id="also-h">{school ? `Also on the ${school.short} list` : `More ${p.productType.toLowerCase()}`}</h2>
            {school ? <VLink to={`/schools/${school.slug}`} className="link tap -my-2.5">Whole list</VLink> : <Link to={`/collections/plain#${typeId(p.productType)}`} className="link tap -my-2.5">All of them</Link>}
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
