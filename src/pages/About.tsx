import { useEffect } from "react";
import { Seo, breadcrumbs } from "../components/Seo";
import { Link } from "react-router-dom";
import { SITE, money } from "../data/site";

// Facts on this page come from iafashions.co.uk (About, Eco Uniform, Want us to supply your school, Contact, Terms).
export function About() {
  useEffect(() => window.scrollTo(0, 0), []);
  const d = SITE.delivery;
  return (
    <>
      <Seo title="About I&A" description="Family-run clothing and school uniform shop on Mitcham Road, Tooting, since 1993. In-house embroidery, an eco uniform range, Klarna Pay in 3, and a Schoolwear Association member." path="/about" jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <div className="wrap grid gap-x-14 gap-y-10 py-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:py-10">
        <div className="min-w-0">
          <h1>Tooting's uniform shop since 1993</h1>
          <p className="measure mt-3">I&A started as a family business selling children's clothes and school uniform, to give the community better-quality clothes for less than the local competition charged. It grew into four shops and then into the purpose-built store on Mitcham Road: 5,000 square feet of shop floor by Tooting Broadway.</p>
          <p className="measure mt-3">We supply embroidered uniform to primary and secondary schools across south London, stitch the crests in our own embroidery room, and keep stock all year round. The owner's two sons took the business on in 2019 and brought it online.</p>
          <p className="measure mt-3">We are members of the Schoolwear Association and the Federation of Small Businesses.</p>

          <section id="eco" className="mt-10 scroll-mt-[var(--head)]" aria-labelledby="eco-h">
            <h2 id="eco-h">Eco uniform</h2>
            <dl className="facts mt-3 border-t-2 border-blue">
              <div><dt>Suppliers</dt><dd>Up to 90% of our suppliers and manufacturers are UK-based.</dd></div>
              <div><dt>Knitwear</dt><dd>Sweatshirts and cardigans are made with 40% recycled fibre.</dd></div>
              <div><dt>Eco range</dt><dd>Blazers and ties made from recycled bottles.</dd></div>
              <div><dt>Trousers</dt><dd>Protected by Teflon™, so stains lift at lower temperatures and the trousers last longer.</dd></div>
            </dl>
          </section>

          <section id="schools" className="mt-10 scroll-mt-[var(--head)]" aria-labelledby="schools-h">
            <h2 id="schools-h">For schools</h2>
            <p className="measure mt-2">Thinking of switching supplier? We offer in-store, online and direct-to-parent ordering, stock held all year, a dedicated account manager, Klarna for parents, and £1 back to the school for every embroidered sweatshirt, jumper or blazer sold.</p>
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-line mt-4">Call {SITE.phone}</a>
          </section>
        </div>

        <aside className="space-y-7 lg:pt-1">
          <section>
            <h2>Visit</h2>
            <address className="mt-1.5">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}<br /><a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a></address>
            <p className="mt-2 text-mute">Two minutes from Tooting Broadway station. Look for the blue shopfront.</p>
          </section>
          <section id="delivery">
            <h2>Delivery and returns</h2>
            <p className="mt-1.5">Standard {money(d.standard.price)}, express {money(d.express.price)}, free on orders of £{d.freeOver} and over. Drop-off to your child's school for £{d.schoolDropOff}, or collect from the shop. {SITE.returns.days}-day returns; embroidered items exchanged for a different size. <Link to="/delivery" className="link">Delivery and returns</Link></p>
          </section>
          <section>
            <h2>Company</h2>
            <p className="mt-1.5">{SITE.legalName}. Registered in England and Wales, company number {SITE.companyNumber}, VAT {SITE.vat}.</p>
          </section>
        </aside>
      </div>
    </>
  );
}
