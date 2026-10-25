import { useEffect } from "react";
import { asset } from "../lib/shopify";

export function About() {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <>
      <section className="wrap grid gap-10 py-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="display text-4xl sm:text-5xl">A uniform shop that knows your school</h1>
          <p className="mt-4 text-ink/70">I&A is a family-run clothing shop on Stockwell Road. We became the official uniform supplier for local schools because parents kept asking, and because we could embroider in house and keep every size in stock through September.</p>
          <p className="mt-3 text-ink/70">Today we supply nine schools across Clapham, Stockwell, Tooting and Wandsworth, with plain basics for everyone else. Same shop, same people, now online.</p>
        </div>
        <img src={asset("/img/lifestyle/fircroft-flatlay.webp")} alt="A folded Fircroft school kit laid out on a desk" className="aspect-[4/5] w-full rounded-3xl object-cover" />
      </section>
      <section id="delivery" className="wrap mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-line bg-white p-7">
          <h2 className="text-2xl font-extrabold">Delivery</h2>
          <ul className="mt-4 space-y-2 text-ink/75">
            <li>London next day, order by 2pm: £3.95, free over £60</li>
            <li>Rest of UK, 2–4 working days: £4.95, free over £75</li>
            <li>Collect from the shop: free, ready in 2 hours in opening hours</li>
            <li>Logo items not in stock: embroidered and dispatched within 2 working days</li>
          </ul>
        </div>
        <div id="returns" className="rounded-3xl border border-line bg-white p-7">
          <h2 className="text-2xl font-extrabold">Returns and exchanges</h2>
          <ul className="mt-4 space-y-2 text-ink/75">
            <li>Free size exchange on everything, in store or by post, within 30 days</li>
            <li>Plain items: full refund, unworn with tags, within 30 days</li>
            <li>Logo items are made to order and exchange only, unless faulty</li>
            <li>Faulty within the school year: we replace it</li>
          </ul>
        </div>
      </section>
    </>
  );
}
