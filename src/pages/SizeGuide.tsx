import { useEffect } from "react";
import { SizeTable } from "./ProductPage";
import { Seo, breadcrumbs } from "../components/Seo";
import { SITE } from "../data/site";

export function SizeGuide() {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <section className="wrap grid gap-x-14 gap-y-10 py-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:py-10">
      <Seo title="School uniform size guide" description="How to measure your child for school uniform: height, chest, waist and inside leg, with age-to-size tables for sweatshirts, trousers and blazers. Fittings in store in Tooting." path="/size-guide" jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Size guide", path: "/size-guide" }])} />
      <div className="min-w-0">
        <h1>Size guide</h1>
        <p className="measure mt-2 text-mute">Go by measurements and use age as a check. Children of the same age can be two sizes apart, and uniform is cut to be worn over a shirt. If in doubt, size up. These are typical UK schoolwear measurements; supplier charts for Banner and Trutex trousers and blazers are on each product page.</p>
        <SizeTable />
        <h2 className="mt-10">How to measure</h2>
        <dl className="facts mt-3 border-t-2 border-blue">
          <div><dt>Height</dt><dd>Standing against a wall, no shoes, heels together. This decides the age-size for sweatshirts, dresses and blazers.</dd></div>
          <div><dt>Chest</dt><dd>Around the fullest part, tape flat and snug, arms relaxed.</dd></div>
          <div><dt>Waist</dt><dd>Around the natural waist, where trousers sit. For sturdy-fit trousers add 4cm.</dd></div>
          <div><dt>Inside leg</dt><dd>From the top of the inner thigh to the floor, without shoes. Trousers come in short, regular and long.</dd></div>
        </dl>
        <h2 className="mt-10">Buying for September</h2>
        <p className="measure mt-2">Buy in July for the September height: most children grow over the summer. Blazers and coats should have a finger's width at the cuff. Ask in store about hemming trousers.</p>
      </div>
      <div className="space-y-7 lg:sticky lg:top-[calc(var(--head)+1.5rem)] lg:self-start">
        <figure>
          <MeasureDrawing />
          <figcaption className="t-small mt-2 text-mute">Chest across the fullest part. Waist where trousers sit. Inside leg from the top of the thigh to the floor.</figcaption>
        </figure>
        <aside>
          <h2>We can measure for you</h2>
          <p className="mt-1.5">Bring your child to the shop and we measure and fit them. No appointment needed.</p>
          <address className="mt-2">{SITE.address.street}, {SITE.address.area} {SITE.address.postcode}<br />{SITE.hours}<br /><a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a></address>
        </aside>
      </div>
    </section>
  );
}

/** Flat garments with the three tape lines: drawn, so no child is shown. */
function MeasureDrawing() {
  return (
    <svg viewBox="0 0 320 250" className="w-full" role="img" aria-label="A sweatshirt with a tape line across the chest, and trousers with tape lines at the waist and down the inside leg">
      <g fill="#edf1fd" stroke="#45353a" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M58 30 L36 40 L12 92 L30 100 L44 74 L44 160 L120 160 L120 74 L134 100 L152 92 L128 40 L106 30 C100 42 64 42 58 30 Z" />
        <path d="M190 30 L280 30 L286 226 L250 226 L235 92 L220 226 L184 226 Z" />
      </g>
      <g stroke="#2f55c8" strokeWidth="2.5" fill="none">
        <path d="M46 90 L118 90" /><path d="M46 84 v12 M118 84 v12" />
        <path d="M190 44 L280 44" /><path d="M190 38 v12 M280 38 v12" />
        <path d="M232 104 L218 222" />
      </g>
      <g fill="#45353a" fontFamily="Lexend, sans-serif" fontSize="13" fontWeight="500">
        <text x="82" y="118" textAnchor="middle">Chest</text>
        <text x="235" y="22" textAnchor="middle">Waist</text>
        <text x="300" y="160" textAnchor="middle" transform="rotate(90 300 160)">Inside leg</text>
      </g>
      <path d="M232 104 L300 120" stroke="#45353a" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}
