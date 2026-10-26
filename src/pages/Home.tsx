import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SchoolFinder } from "../components/SchoolFinder";
import { ProductCard } from "../components/ProductCard";
import { asset, COLLECTIONS, storefront, type Product, type School } from "../lib/shopify";
import { Seo } from "../components/Seo";
import { SITE } from "../data/site";

export function Home() {
  const [schools, setSchools] = useState<School[]>([]);
  const [picks, setPicks] = useState<Product[]>([]);
  useEffect(() => {
    storefront.schools().then(setSchools);
    storefront.products().then((ps) => setPicks(ps.filter((p) => p.images.length && !p.logoItem).slice(0, 8)));
  }, []);
  const bySlug = Object.fromEntries(schools.map((s) => [s.slug, s]));

  return (
    <>
      <Seo title="School uniform for south London schools" description="Embroidered school uniform, PE kit and bags for Heathbrook, Fircroft, Allen Edwards, Trinity St Mary's, St Anne's and more, plus plain basics. Family-run in Tooting since 1993. Pay in 3 with Klarna." path="/" jsonLd={{ "@context": "https://schema.org", "@type": "WebSite", url: SITE.url, name: SITE.name, potentialAction: { "@type": "SearchAction", target: `${SITE.url}/schools?q={search_term_string}`, "query-input": "required name=search_term_string" } }} />
      {/* Hero: the peg rail, and one question */}
      <section className="relative">
        <picture>
          <source media="(max-width: 1023px)" srcSet={asset("/img/hero/home-mobile.webp")} />
          <img src={asset("/img/hero/home-desktop.webp")} alt="Four school sweatshirts hanging on a peg rail with two backpacks below" className="h-[56vh] min-h-[420px] w-full object-cover object-[50%_30%] lg:h-[78vh] lg:min-h-[560px] lg:object-[20%_center]" fetchPriority="high" />
        </picture>
        <div className="absolute inset-0 hidden lg:block lg:bg-gradient-to-l lg:from-ink/50 lg:via-ink/20 lg:to-transparent" />
        <div className="absolute inset-0 hidden lg:block">
          <div className="wrap flex h-full flex-col justify-end pb-10 lg:items-end lg:justify-center lg:pb-0">
            <div className="max-w-2xl text-white lg:w-[52%]">
              <h1 className="display text-[2.6rem] lg:text-6xl lg:text-7xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]">School uniform, sorted in one visit.</h1>
              <p className="mt-4 max-w-md text-lg text-white/90">Embroidered uniform for nine south London schools, plus the plain basics, from a family shop in Tooting since 1993. Pick your school and we'll show you what's on the list.</p>
            </div>
            <div className="mt-6 w-full max-w-xl lg:w-[52%]"><SchoolFinder size="lg" /></div>
            <p className="mt-3 text-sm text-white/80 lg:w-[52%]">Embroidered in house. Pay in 3 with Klarna. Collect from Mitcham Road.</p>
          </div>
        </div>
        <div className="wrap -mt-6 relative lg:hidden">
          <div className="rounded-md bg-white p-5 shadow-[0_12px_40px_rgba(27,42,74,0.12)]">
            <h1 className="display text-[2.3rem]">School uniform, sorted in one visit.</h1>
            <p className="mt-3 text-ink/70">Embroidered uniform for nine south London schools, plus the plain basics. Tooting since 1993.</p>
            <div className="mt-4"><SchoolFinder size="lg" /></div>
          </div>
        </div>
      </section>

      {/* Schools */}
      <section className="bg-sage-soft py-14">
        <div className="wrap">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold">Shop by school</h2>
            <p className="mt-1 text-ink/60">Each page shows your school's embroidered items first, then the plain basics that go with them.</p>
          </div>
          <Link to="/schools" className="hidden sm:inline font-medium underline">All schools</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {schools.filter((s) => s.tile).map((s) => (
            <Link key={s.slug} to={`/schools/${s.slug}`} className="lift group block">
              <div className="aspect-square overflow-hidden rounded-md" style={{ background: s.tint }}>
                <img src={asset(s.tile!)} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.colour }} />
                <span className="font-medium group-hover:underline">{s.short}</span>
                <span className="ml-auto hidden text-sm text-ink/50 sm:inline">{s.area}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {schools.filter((s) => !s.tile).map((s) => (
            <Link key={s.slug} to={`/schools/${s.slug}`} className="pill font-medium hover:border-ink">
              <span className="mr-2 h-2 w-2 rounded-full" style={{ background: s.colour }} />{s.short}
            </Link>
          ))}
        </div>
      </div>
      </section>

      {/* Why I&A: verified facts, one quiet row */}
      <section className="wrap mt-10">
        <ul className="hairline grid gap-x-8 gap-y-3 py-6 text-[15px] text-ink/75 sm:grid-cols-2 lg:grid-cols-4">
          <li><strong className="text-ink">Since 1993.</strong> Family-run on Mitcham Road, Tooting.</li>
          <li><strong className="text-ink">Embroidered in house.</strong> Crests stitched here, not shipped in.</li>
          <li><strong className="text-ink">Pay in 3.</strong> Klarna at checkout, no interest.</li>
          <li><strong className="text-ink">Click and collect.</strong> Seven days a week, 9am to 6pm.</li>
        </ul>
      </section>

      {/* Collections as wide rows */}
      <section className="wrap mt-20">
        <h2 className="text-4xl font-extrabold">The everyday basics</h2>
        <p className="mt-1 text-ink/60">Plain uniform any school accepts, from brands built to last the year.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(["boys", "girls", "pe-kit", "bags"] as const).map((k) => {
            const c = COLLECTIONS[k];
            return (
              <Link key={k} to={`/collections/${k}`} className="lift group block">
                <div className="overflow-hidden rounded-md"><img src={asset(c.banner)} alt="" className="aspect-[21/9] w-full object-cover" loading="lazy" /></div>
                <div className="mt-3 flex items-baseline justify-between gap-4">
                  <h3 className="whitespace-nowrap font-serif text-[1.75rem] font-bold leading-none group-hover:underline">{c.title}</h3>
                  <p className="text-right text-sm text-ink/60">{c.blurb}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Made to last: facts from the eco-uniform page */}
      <section className="wrap mt-20">
        <div className="grid items-center gap-8 overflow-hidden rounded-md bg-white border border-line lg:grid-cols-2">
          <img src={asset("/img/banners/blazers.webp")} alt="Grey flannel school blazer on a wooden hanger" className="h-full min-h-[320px] w-full object-cover object-[12%_center]" loading="lazy" />
          <div className="p-8 lg:p-12">
            <h2 className="text-4xl font-extrabold">Made to last, made responsibly</h2>
            <p className="mt-4 text-ink/70">Durable uniform is cheaper uniform. Our trousers are protected by Teflon™, so stains lift and they need fewer washes. Sweatshirts and cardigans are made with 40% recycled fibre, and our eco range includes blazers and ties made from recycled bottles. Up to 90% of our suppliers are UK-based.</p>
            <ul className="mt-6 space-y-2 text-ink/80">
              <li>Sturdy-fit and slim-fit trousers from £10.50</li>
              <li>Banner and Trutex knitwear and blazers</li>
              <li>Member of the Schoolwear Association</li>
            </ul>
            <Link to="/collections/all" className="btn btn-ink mt-8">See the full range</Link>
          </div>
        </div>
      </section>

      {/* Lifestyle strip */}
      <section className="mt-20">
        <div className="wrap"><h2 className="text-4xl font-extrabold">Ready for the first day</h2></div>
        <div className="wrap mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {["heathbrook-walk", "trinity-pe-gym", "heathbrook-door", "st-annes-hallway"].map((n) => (
            <img key={n} src={asset(`/img/lifestyle/${n}.webp`)} alt="" className="aspect-[4/5] w-full rounded-md object-cover" loading="lazy" />
          ))}
        </div>
      </section>

      {/* Picks */}
      {picks.length > 0 && (
        <section className="wrap mt-20">
          <h2 className="text-4xl font-extrabold">Plain basics, every school</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {picks.map((p) => <ProductCard key={p.handle} p={p} school={p.school ? bySlug[p.school] : undefined} />)}
          </div>
        </section>
      )}

      {/* The shop */}
      <section className="wrap mt-20">
        <div className="rounded-md bg-blue p-8 text-white lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="text-4xl font-extrabold">Come and get fitted in Tooting</h2>
              <p className="mt-3 text-white/75">Not sure between two sizes? Bring your child in. We measure, you try, and embroidered items can be stitched while you shop. The blue shopfront on Mitcham Road, by Tooting Broadway.</p>
            </div>
            <div className="text-white/85">
              <p className="font-medium">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}</p>
              <p className="mt-1">{SITE.hours}</p>
              <p className="mt-1"><a href={`tel:${SITE.phoneIntl}`} className="underline">{SITE.phone}</a></p>
              <a href={`tel:${SITE.phoneIntl}`} className="btn btn-primary mt-5">Call the shop</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
