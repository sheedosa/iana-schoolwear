import { useEffect } from "react";
import { asset } from "../lib/shopify";
import { Seo, breadcrumbs } from "../components/Seo";
import { Link } from "react-router-dom";
import { SITE, money } from "../data/site";

// Facts on this page come from iafashions.co.uk (About, Eco Uniform, Want us to supply your school, Contact, Terms).
export function About() {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <>
      <Seo title="About I&A" description="Family-run clothing and school uniform shop on Mitcham Road, Tooting, since 1993. In-house embroidery, an eco uniform range, Klarna Pay in 3, and a Schoolwear Association member." path="/about" jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <section className="wrap grid gap-x-16 gap-y-8 py-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-center lg:py-14">
        <div>
          <h1>Tooting's uniform shop since 1993</h1>
          <p className="t-lede measure mt-5">I&A started as a family business selling children's clothes and school uniform, with a simple idea: the community deserved better-quality clothes for less than the local competition charged. It grew into four shops and then into the purpose-built store you see today on Mitcham Road, 5,000 square feet of shop floor by Tooting Broadway.</p>
          <p className="measure mt-4 text-ink/75">Schoolwear is still the heart of it. We supply embroidered uniform to a number of primary and secondary schools across south London, stitch crests in our own embroidery room, and keep stock all year round, not just in August. The owner's two sons took the business on in 2019 and brought it online.</p>
          <p className="measure mt-4 text-ink/75">We're members of the Schoolwear Association and the Federation of Small Businesses.</p>
        </div>
        <img src={asset("/img/lifestyle/fircroft-flatlay.webp")} alt="A folded Fircroft school kit laid out on a desk" className="aspect-[4/3] w-full rounded-[3px] object-cover md:aspect-[4/5]" />
      </section>

      <section className="wrap"><div className="grid gap-6 border-y border-ink py-8 md:grid-cols-[1fr_auto] md:items-center">
        <div id="delivery">
          <h2>Delivery, collection and returns</h2>
          <p className="measure mt-3 text-ink/75">Standard delivery {money(SITE.delivery.standard.price)}, express {money(SITE.delivery.express.price)}, free on orders of £{SITE.delivery.freeOver} and over. Drop-off to your child's school for £{SITE.delivery.schoolDropOff}, or collect from the shop, {SITE.hours}. {SITE.returns.days}-day returns; embroidered items exchanged for a different size.</p>
        </div>
        <Link to="/delivery" className="btn btn-ghost">Delivery and returns</Link>
      </div></section>

      <section id="eco" className="on-dark mt-14 scroll-mt-28 bg-ink text-white lg:mt-20">
        <div className="wrap grid gap-x-16 gap-y-10 py-12 md:grid-cols-2 lg:py-16">
          <div>
            <h2>Eco uniform</h2>
            <p className="measure mt-3 text-white/80">Up to 90% of our suppliers and manufacturers are UK-based. Our sweatshirts and cardigans are made with 40% recycled fibre, and our eco range includes blazers and ties made from recycled bottles. Trousers are protected by Teflon™, so stains lift at lower temperatures and garments last longer.</p>
          </div>
          <div>
            <h2>For schools</h2>
            <p className="measure mt-3 text-white/80">Thinking of switching supplier? We offer in-store, online and direct-to-parent ordering, stock held all year, a dedicated account manager, Klarna for parents, and £1 back to the school for every embroidered sweatshirt, jumper or blazer sold.</p>
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-primary mt-5">Call {SITE.phone}</a>
          </div>
        </div>
      </section>

      <section className="wrap mt-12 grid gap-x-16 gap-y-8 md:grid-cols-2 lg:mt-16">
        <div>
          <h2>Visit</h2>
          <p className="mt-3 text-ink/75">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}<br /><a href={`tel:${SITE.phoneIntl}`} className="underline underline-offset-4">{SITE.phone}</a></p>
          <p className="mt-3 text-ink/75">Two minutes from Tooting Broadway station. Look for the blue shopfront.</p>
        </div>
        <div>
          <h2>Company</h2>
          <p className="mt-3 text-ink/75">{SITE.legalName}. Registered in England and Wales, company number {SITE.companyNumber}, VAT {SITE.vat}.</p>
        </div>
      </section>
    </>
  );
}
