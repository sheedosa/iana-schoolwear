import { asset } from "../lib/shopify";

export function Logo({ white = false, className = "h-14" }: { white?: boolean; className?: string }) {
  return <img src={asset(white ? "/img/logo/iana-logo-white.png" : "/img/logo/iana-logo.png")} alt="I&A Schoolwear" className={`${className} w-auto`} />;
}
