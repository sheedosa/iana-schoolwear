import { Link } from "react-router-dom";
import { storefront } from "../lib/shopify";
import { SITE, money } from "../data/site";

export function Footer() {
  const d = SITE.delivery;
  const delivery = [
    { k: "Standard", v: money(d.standard.price), note: d.standard.time },
    { k: "Express", v: money(d.express.price), note: d.express.time },
    { k: "Free delivery", v: `from £${d.freeOver}`, note: `on orders of £${d.freeOver} and over` },
    { k: "Drop-off to school", v: `£${d.schoolDropOff}`, note: "to your child's school" },
    { k: "Click and collect", v: "Tooting", note: SITE.address.street },
    { k: "Returns", v: `${SITE.returns.days} days`, note: "embroidered items exchanged for size" },
  ];
  return (
    <footer className="on-dark bg-ink text-white">
      {/* Delivery and returns, from SITE: the line parents look for at the bottom of every page. */}
      <div className="border-b border-white/15">
        <div className="wrap py-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-3 lg:grid-cols-6">
            {delivery.map((x) => (
              <div key={x.k}>
                <dt className="t-small text-white/70">{x.k}</dt>
                <dd className="figure mt-1.5 text-[1.75rem]">{x.v}</dd>
                <dd className="t-small mt-1 text-white/70">{x.note}</dd>
              </div>
            ))}
          </dl>
          <Link to="/delivery" className="mt-4 inline-flex min-h-11 items-center underline underline-offset-4">Delivery and returns in full</Link>
        </div>
      </div>
      <div className="wrap grid grid-cols-2 gap-x-10 gap-y-10 py-12 lg:grid-cols-[1.5fr_0.8fr_1fr_1.3fr]">
        <div className="col-span-2 lg:col-span-1">
          <img src={`${import.meta.env.BASE_URL}img/logo/brand/iana-schoolwear-horizontal-white.svg`} alt="I&A Schoolwear" className="h-8 w-auto" width={274} height={32} />
          <p className="mt-5 max-w-sm text-white/75">Family-run clothing and school uniform shop in Tooting since 1993. We supply embroidered uniform to nine south London schools and plain basics for everyone else.</p>
          <address className="mt-5 not-italic text-white/75">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}</address>
          <p className="mt-1 flex flex-wrap gap-x-6">
            <a href={`tel:${SITE.phoneIntl}`} className="inline-flex min-h-11 items-center font-medium underline underline-offset-4">{SITE.phone}</a>
            <a href={SITE.social.instagram} className="inline-flex min-h-11 items-center text-white/75 underline underline-offset-4" rel="noopener">Instagram</a>
            <a href={SITE.social.facebook} className="inline-flex min-h-11 items-center text-white/75 underline underline-offset-4" rel="noopener">Facebook</a>
          </p>
        </div>
        <nav aria-label="Shop">
          <h2 className="label text-white">Shop</h2>
          <ul className="mt-2 text-white/80 [&_a]:flex [&_a]:min-h-11 [&_a]:items-center [&_a]:underline-offset-4 hover:[&_a]:underline">
            <li><Link to="/schools">By school</Link></li>
            <li><Link to="/collections/boys">Boys</Link></li>
            <li><Link to="/collections/girls">Girls</Link></li>
            <li><Link to="/collections/pe-kit">PE kit</Link></li>
            <li><Link to="/collections/bags">Bags</Link></li>
            <li><Link to="/collections/blazers">Blazers</Link></li>
          </ul>
        </nav>
        <nav aria-label="Help">
          <h2 className="label text-white">Help</h2>
          <ul className="mt-2 text-white/80 [&_a]:flex [&_a]:min-h-11 [&_a]:items-center [&_a]:underline-offset-4 hover:[&_a]:underline">
            <li><Link to="/size-guide">Size guide</Link></li>
            <li><Link to="/delivery">Delivery and returns</Link></li>
            <li><Link to="/delivery#exchanges">Exchanges</Link></li>
            <li><Link to="/about#eco">Eco uniform</Link></li>
            <li><Link to="/about">About the shop</Link></li>
          </ul>
        </nav>
        <div className="col-span-2 lg:col-span-1">
          <h2 className="label text-white">For schools</h2>
          <p className="mt-4 text-white/80">Want I&A to supply your uniform? In-house embroidery, stock held all year, a dedicated account manager, and £1 back to the school for every embroidered sweatshirt, jumper or blazer sold. <a href={`tel:${SITE.phoneIntl}`} className="underline underline-offset-4">Call {SITE.phone}</a>.</p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="wrap t-small flex flex-wrap items-center justify-between gap-x-8 gap-y-1 py-5 text-white/70">
          <span>© {new Date().getFullYear()} {SITE.legalName}. Company no. {SITE.companyNumber}.</span>
          <span>Product and lifestyle imagery created with AI from our real garments</span>
          <span>{storefront.mode === "demo" ? "Preview catalogue" : "Powered by Shopify"}</span>
        </div>
      </div>
    </footer>
  );
}
