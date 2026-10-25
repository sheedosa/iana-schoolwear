import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { storefront } from "../lib/shopify";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo white className="h-14" />
          <p className="mt-4 max-w-sm text-white/70">Independent school uniform shop serving south London families since the shop opened on Stockwell Road. Official supplier to nine local schools.</p>
          <p className="mt-6 text-white/70">I&A, Stockwell Road, London SW9<br />Mon–Sat 9:30–6:00 · Sun closed<br /><a href="mailto:hello@iandagroup.co.uk" className="underline">hello@iandagroup.co.uk</a></p>
        </div>
        <div>
          <h3 className="font-semibold">Shop</h3>
          <ul className="mt-3 space-y-1 text-white/75 [&_a]:inline-block [&_a]:py-1.5">
            <li><Link to="/schools">By school</Link></li>
            <li><Link to="/collections/boys">Boys</Link></li>
            <li><Link to="/collections/girls">Girls</Link></li>
            <li><Link to="/collections/pe-kit">PE kit</Link></li>
            <li><Link to="/collections/bags">Bags</Link></li>
            <li><Link to="/collections/blazers">Blazers</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Help</h3>
          <ul className="mt-3 space-y-1 text-white/75 [&_a]:inline-block [&_a]:py-1.5">
            <li><Link to="/size-guide">Size guide</Link></li>
            <li><Link to="/about#delivery">Delivery</Link></li>
            <li><Link to="/about#returns">Returns and exchanges</Link></li>
            <li><Link to="/about">About the shop</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">For schools</h3>
          <p className="mt-3 text-white/75">Want I&A to supply your uniform? We handle embroidery, stock and parent orders. <a href="mailto:hello@iandagroup.co.uk" className="underline">Talk to us</a>.</p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="wrap flex flex-wrap items-center justify-between gap-2 py-5 text-sm text-white/55">
          <span>© {new Date().getFullYear()} IandA Group Ltd</span>
          <span>Product and lifestyle imagery created with AI from our real garments · {storefront.mode === "demo" ? "Preview catalogue" : "Powered by Shopify"}</span>
        </div>
      </div>
    </footer>
  );
}
