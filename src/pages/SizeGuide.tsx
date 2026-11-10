import { useEffect } from "react";
import { SizeTable } from "./ProductPage";
import { Seo, breadcrumbs } from "../components/Seo";
import { SITE } from "../data/site";

export function SizeGuide() {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <section className="wrap grid gap-x-16 gap-y-10 py-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:py-14">
      <Seo title="School uniform size guide" description="How to measure your child for school uniform: height, chest, waist and inside leg, with age-to-size tables for sweatshirts, trousers and blazers. Fittings in store in Tooting." path="/size-guide" jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Size guide", path: "/size-guide" }])} />
      <div>
        <h1>Size guide</h1>
        <p className="t-lede measure mt-3 text-ink/75">Go by measurements, not age. Children of the same age can vary by two sizes, and uniform is cut to be worn over a shirt. If in doubt, size up. These are typical UK schoolwear measurements; supplier charts for Banner and Trutex trousers and blazers are on each product page.</p>
        <SizeTable />
        <h2 className="mt-12">How to measure</h2>
        <ol className="measure mt-4 divide-y divide-line border-y border-line text-ink/75 [&>li]:py-3">
          <li><strong className="text-ink">Height.</strong> Standing against a wall, no shoes, heels together. This decides the age-size for sweatshirts, dresses and blazers.</li>
          <li><strong className="text-ink">Chest.</strong> Around the fullest part, tape flat and snug, arms relaxed.</li>
          <li><strong className="text-ink">Waist.</strong> Around the natural waist, where trousers sit. For sturdy-fit trousers add 4cm.</li>
          <li><strong className="text-ink">Inside leg.</strong> From the top of the inner thigh to the floor, without shoes. Trousers come in short, regular and long.</li>
        </ol>
        <h2 className="mt-12">Buying for September</h2>
        <p className="measure mt-3 text-ink/75">Buy in July for the September height, not the July one: most children grow over the summer. Blazers and coats should have a finger's width at the cuff. Ask in store about hemming trousers.</p>
      </div>
      <div className="space-y-6 lg:sticky lg:top-32 lg:self-start">
        <figure className="rounded-[3px] bg-sage-soft p-6">
          <MeasureDrawing />
          <figcaption className="mt-3 text-ink/75">Chest across the fullest part; waist where trousers sit; inside leg from the top of the thigh to the floor.</figcaption>
        </figure>
        <aside className="border-t-2 border-ink pt-5">
          <h2 className="t-h3">Still unsure?</h2>
          <p className="mt-2 text-ink/70">Bring your child to the shop and we'll measure and fit them properly. No appointment needed.</p>
          <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink mt-5 w-full">Call {SITE.phone}</a>
          <p className="mt-4 text-ink/75">{SITE.address.street}, {SITE.address.area} {SITE.address.postcode}<br />{SITE.hours}</p>
        </aside>
      </div>
    </section>
  );
}

/** Flat garments with the three tape lines: drawn, so no child is shown. */
function MeasureDrawing() {
  return (
    <svg viewBox="0 0 320 250" className="w-full" role="img" aria-label="A sweatshirt with a tape line across the chest, and trousers with tape lines at the waist and down the inside leg">
      <g fill="#ffffff" stroke="#45353a" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M58 30 L36 40 L12 92 L30 100 L44 74 L44 160 L120 160 L120 74 L134 100 L152 92 L128 40 L106 30 C100 42 64 42 58 30 Z" />
        <path d="M190 30 L280 30 L286 226 L250 226 L235 92 L220 226 L184 226 Z" />
      </g>
      <g stroke="#4169e1" strokeWidth="2" fill="none">
        <path d="M46 90 L118 90" /><path d="M46 84 v12 M118 84 v12" />
        <path d="M190 44 L280 44" /><path d="M190 38 v12 M280 38 v12" />
        <path d="M232 104 L218 222" />
      </g>
      <g fill="#45353a" fontFamily="Lexend, sans-serif" fontSize="12" letterSpacing="1.5">
        <text x="82" y="118" textAnchor="middle">CHEST</text>
        <text x="235" y="22" textAnchor="middle">WAIST</text>
        <text x="300" y="160" textAnchor="middle" transform="rotate(90 300 160)">INSIDE LEG</text>
      </g>
      <path d="M232 104 L300 120" stroke="#45353a" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}
