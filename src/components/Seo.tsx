import { useEffect } from "react";
import { SITE } from "../data/site";

type Props = {
  title: string;
  description: string;
  path: string; // "/schools/heathbrook"
  image?: string; // absolute or site-relative
  type?: "website" | "product" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
export const absolute = (p: string) => (p.startsWith("http") ? p : `${SITE.url}${p.startsWith("/") ? p : `/${p}`}`);

function upsert(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = document.createElement(selector.startsWith("link") ? "link" : "meta");
    Object.entries(attrs).forEach(([k, v]) => k !== "content" && k !== "href" && el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
}

export const ORG_LD = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "@id": `${SITE.url}/#store`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: absolute("/img/logo/iana-logo.png"),
  image: absolute("/img/og/og-home.jpg"),
  telephone: SITE.phoneIntl,
  foundingDate: String(SITE.since),
  priceRange: "£",
  address: { "@type": "PostalAddress", streetAddress: SITE.address.street, addressLocality: SITE.address.area, addressRegion: SITE.address.city, postalCode: SITE.address.postcode, addressCountry: "GB" },
  openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "09:00", closes: "18:00" },
  sameAs: [SITE.social.instagram, SITE.social.facebook, SITE.currentSite],
  memberOf: SITE.memberships.map((m) => ({ "@type": "Organization", name: m })),
  paymentAccepted: "Cash, Credit Card, Debit Card, Klarna",
};

export function Seo({ title, description, path, image = "/img/og/og-home.jpg", type = "website", jsonLd, noindex }: Props) {
  useEffect(() => {
    const full = path === "/" ? `${title} — I&A Schoolwear` : `${title} | I&A Schoolwear`;
    document.title = full;
    const url = `${SITE.url}${path === "/" ? "/" : path}`;
    const img = absolute(image);
    upsert('meta[name="description"]', { name: "description", content: description });
    upsert('meta[name="robots"]', { name: "robots", content: noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large" });
    upsert('link[rel="canonical"]', { rel: "canonical", href: url });
    upsert('meta[property="og:title"]', { property: "og:title", content: full });
    upsert('meta[property="og:description"]', { property: "og:description", content: description });
    upsert('meta[property="og:url"]', { property: "og:url", content: url });
    upsert('meta[property="og:type"]', { property: "og:type", content: type === "product" ? "product" : "website" });
    upsert('meta[property="og:image"]', { property: "og:image", content: img });
    upsert('meta[property="og:image:width"]', { property: "og:image:width", content: "1200" });
    upsert('meta[property="og:image:height"]', { property: "og:image:height", content: "630" });
    upsert('meta[property="og:site_name"]', { property: "og:site_name", content: SITE.name });
    upsert('meta[property="og:locale"]', { property: "og:locale", content: "en_GB" });
    upsert('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsert('meta[name="twitter:title"]', { name: "twitter:title", content: full });
    upsert('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsert('meta[name="twitter:image"]', { name: "twitter:image", content: img });

    document.head.querySelectorAll('script[data-seo="page"]').forEach((s) => s.remove());
    const blocks = [ORG_LD, ...(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [])];
    for (const b of blocks) {
      const s = document.createElement("script");
      s.type = "application/ld+json"; s.dataset.seo = "page"; s.textContent = JSON.stringify(b);
      document.head.appendChild(s);
    }
  }, [title, description, path, image, type, jsonLd, noindex]);
  return null;
}

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE.url}${it.path}` })),
});

export { BASE };
