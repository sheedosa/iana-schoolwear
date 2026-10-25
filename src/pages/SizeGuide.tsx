import { useEffect } from "react";
import { SizeTable } from "./ProductPage";

export function SizeGuide() {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <section className="wrap grid gap-10 py-12 lg:grid-cols-[1fr_420px]">
      <div>
        <h1 className="display text-4xl sm:text-5xl">Size guide</h1>
        <p className="mt-3 max-w-xl text-ink/65">Go by measurements, not age. Children of the same age vary by two sizes, and uniform is cut to be worn over a shirt. If in doubt, size up; exchanges are free.</p>
        <SizeTable />
        <h2 className="mt-10 text-2xl font-extrabold">How to measure</h2>
        <ol className="mt-4 space-y-3 text-ink/75">
          <li><strong className="text-ink">Height.</strong> Standing against a wall, no shoes, heels together. This decides the age-size for sweatshirts, dresses and blazers.</li>
          <li><strong className="text-ink">Chest.</strong> Around the fullest part, tape flat and snug, arms relaxed.</li>
          <li><strong className="text-ink">Waist.</strong> Around the natural waist, where trousers sit. For sturdy-fit trousers add 4cm.</li>
          <li><strong className="text-ink">Inside leg.</strong> From the top of the inner thigh to the floor, without shoes. Trousers come in short, regular and long.</li>
        </ol>
        <h2 className="mt-10 text-2xl font-extrabold">Buying for September</h2>
        <p className="mt-3 max-w-xl text-ink/75">Buy in July for the September height, not the July one: most children grow 2–3cm over the summer. Blazers and coats should have a finger's width at the cuff; trousers can be hemmed once free of charge in store.</p>
      </div>
      <aside className="rounded-3xl bg-white border border-line p-6 lg:sticky lg:top-32 lg:self-start">
        <h2 className="text-xl font-bold">Still unsure?</h2>
        <p className="mt-2 text-ink/65">Bring your child to the shop and we'll measure and fit in ten minutes, or order two sizes and send one back free.</p>
        <a href="mailto:hello@iandagroup.co.uk" className="btn btn-ink mt-5 w-full">Book a fitting</a>
        <p className="mt-4 text-sm text-ink/55">Stockwell Road, London SW9 · Mon–Sat 9:30–6:00</p>
      </aside>
    </section>
  );
}
