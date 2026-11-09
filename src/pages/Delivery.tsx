import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { SITE, money } from "../data/site";

const list = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`);

export function Delivery() {
  useEffect(() => window.scrollTo(0, 0), []);
  const d = SITE.delivery;
  const rows = [
    { name: "Standard delivery", price: money(d.standard.price), when: d.standard.time },
    { name: "Express delivery", price: money(d.express.price), when: d.express.time },
    { name: "Drop-off to your child's school", price: money(d.schoolDropOff), when: "We drop the order at your child's school" },
    { name: "Click and collect", price: "Free", when: `${SITE.address.street}, ${SITE.address.area}. ${SITE.hours}` },
  ];
  return (
    <>
      <Seo title="Delivery and returns" description={`Standard delivery ${money(d.standard.price)} (${d.standard.time}), express ${money(d.express.price)} (${d.express.time}), free over £${d.freeOver}. Drop-off to your child's school for £${d.schoolDropOff}, or click and collect in Tooting. ${SITE.returns.days}-day returns.`} path="/delivery" jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Delivery and returns", path: "/delivery" }])} />
      <section className="wrap py-12">
        <h1 className="display text-4xl sm:text-5xl">Delivery and returns</h1>
        <p className="mt-3 max-w-[60ch] text-lg text-ink/75">Free delivery on orders of £{d.freeOver} and over. Or we'll drop the uniform at your child's school for £{d.schoolDropOff}.</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div id="delivery">
            <h2 className="text-3xl font-extrabold">Getting it to you</h2>
            <table className="mt-5 w-full border-y border-ink text-left">
              <caption className="sr-only">Delivery options and prices</caption>
              <thead className="sr-only sm:not-sr-only">
                <tr className="border-b border-line"><th scope="col" className="label py-3 pr-4 font-normal text-ink/65">Option</th><th scope="col" className="label py-3 pr-4 font-normal text-ink/65">Price</th><th scope="col" className="label py-3 font-normal text-ink/65">When</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.name} className="grid grid-cols-[1fr_auto] gap-x-4 py-3 sm:table-row sm:py-0">
                    <th scope="row" className="font-medium sm:py-4 sm:pr-4">{r.name}</th>
                    <td className="text-right font-medium sm:py-4 sm:pr-4 sm:text-left">{r.price}</td>
                    <td className="col-span-2 text-ink/70 sm:py-4">{r.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-ink/75">Delivery is free on orders of £{d.freeOver} and over.</p>
          </div>

          <aside className="self-start rounded-md bg-sage-soft p-6">
            <h2 className="text-2xl font-extrabold">Rather come in?</h2>
            <p className="mt-2 text-ink/75">Bring your child to the shop and we'll measure them for the right size. No appointment needed.</p>
            <p className="mt-4">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}</p>
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink mt-5 w-full">Call {SITE.phone}</a>
          </aside>
        </div>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 md:grid-cols-2">
          <div id="returns">
            <h2 className="text-3xl font-extrabold">Returns</h2>
            <p className="mt-3 text-ink/75">You have {SITE.returns.days} days to return plain uniform. Bring it back to the shop, or call {SITE.phone} and we'll arrange it.</p>
            <p className="mt-3 text-ink/75">Across I&A shops, {list(SITE.returns.excluded)} can't be returned.</p>
          </div>
          <div id="exchanges">
            <h2 className="text-3xl font-extrabold">Exchanges on embroidered items</h2>
            <p className="mt-3 text-ink/75">{SITE.returns.embroidered} Bring it to the shop, or call us first and we'll check we have the size.</p>
            <p className="mt-3 text-ink/75">Not sure of the size? The <Link to="/size-guide" className="underline">size guide</Link> helps, or come in and we'll measure.</p>
          </div>
        </div>
      </section>
    </>
  );
}
