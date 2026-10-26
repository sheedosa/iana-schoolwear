import { asset } from "../lib/shopify";

// Official I&A Schoolwear lockups (brand guide 2022), rebuilt as outlined SVG.
// Replace the files in public/img/logo/brand/ with the client's originals when supplied.
export function Logo({ white = false, className = "h-7" }: { white?: boolean; className?: string }) {
  return (
    <img
      src={asset(`/img/logo/brand/iana-schoolwear-horizontal-${white ? "white" : "ochre"}.svg`)}
      alt="I&A Schoolwear"
      className={`${className} w-auto`}
      width={240}
      height={28}
    />
  );
}

export function Marque({ className = "h-10" }: { className?: string }) {
  return <img src={asset("/img/logo/brand/iana-marque-ochre.svg")} alt="" className={`${className} w-auto`} />;
}
