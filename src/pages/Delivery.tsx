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
      <div className="wrap py-8 lg:py-10"><div className="max-w-[760px]">
        <h1>Delivery and returns</h1>
        <p className="measure mt-2 text-mute">Delivery is free on orders of £{d.freeOver} and over.</p>

        <section id="delivery" className="mt-7" aria-labelledby="del-h">
          <h2 id="del-h">Four ways to get your order</h2>
          <table className="mt-3 w-full border-t-2 border-blue text-left">
            <caption className="sr-only">Delivery options and prices</caption>
            <thead className="sr-only sm:not-sr-only">
              <tr className="t-small border-b border-line text-mute"><th scope="col" className="py-2 pr-4 font-medium">Option</th><th scope="col" className="py-2 pr-4 font-medium">Price</th><th scope="col" className="py-2 font-medium">When and where</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-line py-3 sm:table-row sm:py-0">
                  <th scope="row" className="font-semibold sm:py-3.5 sm:pr-4">{r.name}</th>
                  <td className="num text-right font-semibold sm:py-3.5 sm:pr-4 sm:text-left">{r.price}</td>
                  <td className="col-span-2 text-mute sm:py-3.5">{r.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="returns" className="mt-10" aria-labelledby="ret-h">
          <h2 id="ret-h">Returns</h2>
          <p className="measure mt-2">You have {SITE.returns.days} days to return plain uniform. Bring it back to the shop, or call <a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a> and we'll arrange it.</p>
          <p className="measure mt-2">Across I&A shops, {list(SITE.returns.excluded)} can't be returned.</p>
        </section>

        <section id="exchanges" className="mt-10" aria-labelledby="exc-h">
          <h2 id="exc-h">Exchanges on embroidered items</h2>
          <p className="measure mt-2">{SITE.returns.embroidered} Bring it to the shop, or call us first and we'll check we have the size.</p>
          <p className="measure mt-2">To get the size right first time, use the <Link to="/size-guide" className="link">size guide</Link>.</p>
        </section>

        <section className="mt-10" aria-labelledby="visit-h">
          <h2 id="visit-h">Or come in</h2>
          <p className="measure mt-2">Bring your child to the shop and we measure them for the right size. No appointment needed.</p>
          <address className="mt-2">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}<br /><a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a></address>
        </section>
      </div></div>
    </>
  );
}
