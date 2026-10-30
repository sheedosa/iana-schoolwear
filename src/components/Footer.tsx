import { Link } from "react-router-dom";
import { storefront } from "../lib/shopify";
import { SITE } from "../data/site";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img src={`${import.meta.env.BASE_URL}img/logo/brand/iana-schoolwear-horizontal-white.svg`} alt="I&A Schoolwear" className="h-8 w-auto" />
          <p className="mt-4 max-w-sm text-white/70">Family-run clothing and school uniform shop in Tooting since 1993. We supply embroidered uniform to nine south London schools and plain basics for everyone else.</p>
          <p className="mt-6 text-white/70">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}<br /><a href={`tel:${SITE.phoneIntl}`} className="inline-flex min-h-11 items-center underline">{SITE.phone}</a></p>
          <p className="mt-2 flex gap-4 text-white/70"><a href={SITE.social.instagram} className="inline-flex min-h-11 items-center underline" rel="noopener">Instagram</a><a href={SITE.social.facebook} className="inline-flex min-h-11 items-center underline" rel="noopener">Facebook</a></p>
        </div>
        <div>
          <h2 className="label text-white">Shop</h2>
          <ul className="mt-3 text-white/75 [&_a]:flex [&_a]:min-h-11 [&_a]:items-center">
            <li><Link to="/schools">By school</Link></li>
            <li><Link to="/collections/boys">Boys</Link></li>
            <li><Link to="/collections/girls">Girls</Link></li>
            <li><Link to="/collections/pe-kit">PE kit</Link></li>
            <li><Link to="/collections/bags">Bags</Link></li>
            <li><Link to="/collections/blazers">Blazers</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="label text-white">Help</h2>
          <ul className="mt-3 text-white/75 [&_a]:flex [&_a]:min-h-11 [&_a]:items-center">
            <li><Link to="/size-guide">Size guide</Link></li>
            <li><Link to="/about#delivery">Delivery and collection</Link></li>
            <li><Link to="/about#returns">Returns</Link></li>
            <li><Link to="/about#eco">Eco uniform</Link></li>
            <li><Link to="/about">About the shop</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="label text-white">For schools</h2>
          <p className="mt-3 text-white/75">Want I&A to supply your uniform? In-house embroidery, stock held all year, a dedicated account manager, and £1 back to the school for every embroidered sweatshirt, jumper or blazer sold. <a href={`tel:${SITE.phoneIntl}`} className="underline">Call {SITE.phone}</a>.</p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="wrap flex flex-wrap items-center justify-between gap-2 py-5 text-sm text-white/55">
          <span>© {new Date().getFullYear()} {SITE.legalName}. Company no. {SITE.companyNumber}.</span>
          <span>Product and lifestyle imagery created with AI from our real garments · {storefront.mode === "demo" ? "Preview catalogue" : "Powered by Shopify"}</span>
        </div>
      </div>
    </footer>
  );
}
