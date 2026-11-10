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
    { name: "Click and collect", price: "", when: `${SITE.address.street}, ${SITE.address.area}. ${SITE.hours}` },
  ];
  return (
    <>
      <Seo title="Delivery and returns" description={`Standard delivery ${money(d.standard.price)} (${d.standard.time}), express ${money(d.express.price)} (${d.express.time}), free from £${d.freeOver}. Drop-off to your child's school for £${d.schoolDropOff}, or click and collect in Tooting. ${SITE.returns.days}-day returns.`} path="/delivery" jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Delivery and returns", path: "/delivery" }])} />
      <section className="wrap py-10 lg:py-14">
        <h1>Delivery and returns</h1>
        <p className="t-lede measure mt-3 text-ink/75">Free delivery on orders of £{d.freeOver} and over. Or we'll drop the uniform at your child's school for £{d.schoolDropOff}.</p>

        <div className="mt-10 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div id="delivery" className="scroll-mt-32">
            <h2>Getting it to you</h2>
            <table className="mt-5 w-full border-y border-ink text-left">
              <caption className="sr-only">Delivery options and prices</caption>
              <thead className="sr-only sm:not-sr-only">
                <tr className="border-b border-line"><th scope="col" className="label py-3 pr-4 font-normal text-ink/65">Option</th><th scope="col" className="label py-3 pr-4 font-normal text-ink/65">Price</th><th scope="col" className="label py-3 font-normal text-ink/65">When</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.name} className="grid grid-cols-[1fr_auto] gap-x-4 py-3 sm:table-row sm:py-0">
                    <th scope="row" className="font-medium sm:py-4 sm:pr-4">{r.name}</th>
                    <td className="figure text-right text-[1.5rem] sm:py-4 sm:pr-4 sm:text-left">{r.price}</td>
                    <td className="col-span-2 text-ink/70 sm:py-4">{r.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="self-start rounded-[3px] bg-sage p-6 sm:p-8">
            <h2 className="t-h3">Rather come in?</h2>
            <p className="mt-2">Bring your child to the shop and we'll measure them for the right size. No appointment needed.</p>
            <p className="mt-4">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}</p>
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink mt-5 w-full">Call {SITE.phone}</a>
          </aside>
        </div>

        <div className="mt-14 grid gap-x-16 gap-y-10 border-t border-ink pt-10 md:grid-cols-2">
          <div id="returns" className="scroll-mt-32">
            <h2>Returns</h2>
            <p className="mt-3 text-ink/75">You have {SITE.returns.days} days to return plain uniform. Bring it back to the shop, or call {SITE.phone} and we'll arrange it.</p>
            <p className="mt-3 text-ink/75">Across I&A shops, {list(SITE.returns.excluded)} can't be returned.</p>
          </div>
          <div id="exchanges" className="scroll-mt-32">
            <h2>Exchanges on embroidered items</h2>
            <p className="mt-3 text-ink/75">{SITE.returns.embroidered} Bring it to the shop, or call us first and we'll check we have the size.</p>
            <p className="mt-3 text-ink/75">Not sure of the size? The <Link to="/size-guide" className="underline underline-offset-4">size guide</Link> helps, or come in and we'll measure.</p>
          </div>
        </div>
      </section>
    </>
  );
}
