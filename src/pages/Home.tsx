import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SchoolTable } from "../components/SchoolFinder";
import { storefront, type Product } from "../lib/shopify";
import { Seo } from "../components/Seo";
import { SITE, money } from "../data/site";
import { TYPE_ORDER, typeId } from "./Collection";

export function Home() {
  const [plain, setPlain] = useState<Product[]>([]);
  useEffect(() => { storefront.products().then((ps) => setPlain(ps.filter((p) => !p.logoItem))); }, []);
  const d = SITE.delivery;
  const types = TYPE_ORDER.map((t) => ({ t, n: plain.filter((p) => p.productType === t).length })).filter((x) => x.n > 0);

  return (
    <>
      <Seo title="School uniform for south London schools" description="Embroidered school uniform, PE kit and bags for Heathbrook, Fircroft, Allen Edwards, Trinity St Mary's, St Anne's and more, plus plain basics. Family-run in Tooting since 1993. Pay in 3 with Klarna." path="/" jsonLd={{ "@context": "https://schema.org", "@type": "WebSite", url: SITE.url, name: SITE.name, potentialAction: { "@type": "SearchAction", target: `${SITE.url}/schools?q={search_term_string}`, "query-input": "required name=search_term_string" } }} />
      <div className="wrap grid gap-x-14 gap-y-10 py-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:py-10">
        <section aria-labelledby="schools-h">
          <h1 id="schools-h">Find your school's uniform</h1>
          <p className="mt-2 text-mute">Pick the school. Its list opens with the crested items, each with its sizes.</p>
          <div className="mt-5"><SchoolTable /></div>
        </section>

        <div className="space-y-9 lg:pt-1">
          <section aria-labelledby="plain-h">
            <h2 id="plain-h">Plain basics for any school</h2>
            <ul className="sheet mt-3">
              {types.map(({ t, n }) => (
                <li key={t}>
                  <Link to={`/collections/plain#${typeId(t)}`} className="line-link flex min-h-11 items-center justify-between gap-4 pr-2">
                    <span className="font-medium">{t}</span><span className="num text-mute">{n}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/collections/plain" className="link tap mt-1">All plain basics</Link>
          </section>

          <section aria-labelledby="delivery-h">
            <h2 id="delivery-h">Delivery</h2>
            <p className="mt-2">Standard {money(d.standard.price)} in {d.standard.time}, express {money(d.express.price)} in {d.express.time}, free on orders of £{d.freeOver} and over. Drop-off to your child's school is £{d.schoolDropOff}. {d.collect}.</p>
            <Link to="/delivery" className="link tap">Delivery and returns</Link>
          </section>

          <section aria-labelledby="shop-h">
            <h2 id="shop-h">The shop</h2>
            <address className="mt-2">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}<br /><a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a></address>
            <p className="mt-2 text-mute">Not sure of a size? Bring your child in and we measure them. No appointment needed.</p>
          </section>
        </div>
      </div>
    </>
  );
}
