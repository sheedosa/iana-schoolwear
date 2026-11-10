import { Link } from "react-router-dom";
import { storefront } from "../lib/shopify";
import { SITE } from "../data/site";

const links = [
  { to: "/schools", label: "Schools" },
  { to: "/collections/plain", label: "Plain basics" },
  { to: "/size-guide", label: "Size guide" },
  { to: "/delivery", label: "Delivery and returns" },
  { to: "/about", label: "About the shop" },
  { to: "/about#schools", label: "For schools" },
];

/** White, one blue rule, three lines: where the shop is, where else to go, who trades. */
export function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-blue bg-white pb-[var(--tabbar)]">
      <div className="wrap py-6">
        <address>
          <strong>I&A Schoolwear</strong>, {SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}. {SITE.hours}. <a href={`tel:${SITE.phoneIntl}`} className="link whitespace-nowrap">{SITE.phone}</a>
        </address>
        <nav aria-label="Footer" className="mt-2 flex flex-wrap gap-x-6">
          {links.map((l) => <Link key={l.to} to={l.to} className="link tap">{l.label}</Link>)}
          <a href={SITE.social.instagram} className="link tap" rel="noopener">Instagram</a>
          <a href={SITE.social.facebook} className="link tap" rel="noopener">Facebook</a>
        </nav>
        <p className="t-small mt-2 text-mute">
          © {new Date().getFullYear()} {SITE.legalName}. Company no. {SITE.companyNumber}. Product and lifestyle imagery created with AI from our real garments. {storefront.mode === "demo" ? "Preview catalogue" : "Powered by Shopify"}.
        </p>
      </div>
    </footer>
  );
}
