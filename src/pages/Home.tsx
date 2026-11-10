import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SchoolFinder } from "../components/SchoolFinder";
import { ProductCard } from "../components/ProductCard";
import { asset, COLLECTIONS, storefront, type Product, type School } from "../lib/shopify";
import { Seo } from "../components/Seo";
import { SITE, money } from "../data/site";

const FIRST_DAY = [
  { img: "heathbrook-walk", school: "heathbrook", label: "Heathbrook", alt: "A child seen from behind, walking to school with a Heathbrook backpack" },
  { img: "trinity-pe-gym", school: "trinity-st-marys", label: "Trinity St Mary's PE kit", alt: "Trinity St Mary's PE T-shirt and drawstring PE bag in a school hall" },
  { img: "st-annes-hallway", school: "st-annes", label: "St Anne's", alt: "A St Anne's backpack and striped tie hanging on a hallway peg" },
];

export function Home() {
  const [schools, setSchools] = useState<School[]>([]);
  const [picks, setPicks] = useState<Product[]>([]);
  useEffect(() => {
    storefront.schools().then(setSchools);
    storefront.products().then((ps) => setPicks(ps.filter((p) => p.images.length && !p.logoItem).slice(0, 8)));
  }, []);
  const bySlug = Object.fromEntries(schools.map((s) => [s.slug, s]));
  const d = SITE.delivery;

  return (
    <>
      <Seo title="School uniform for south London schools" description="Embroidered school uniform, PE kit and bags for Heathbrook, Fircroft, Allen Edwards, Trinity St Mary's, St Anne's and more, plus plain basics. Family-run in Tooting since 1993. Pay in 3 with Klarna." path="/" jsonLd={{ "@context": "https://schema.org", "@type": "WebSite", url: SITE.url, name: SITE.name, potentialAction: { "@type": "SearchAction", target: `${SITE.url}/schools?q={search_term_string}`, "query-input": "required name=search_term_string" } }} />
      {/* Hero: the finder. One question, answered by typing or by tapping a tile. On desktop the panel sits over the
          wall of the photograph, never on the garments; below that the photograph is a band above it. */}
      <section className="relative bg-sage-soft lg:flex lg:min-h-[min(74vh,720px)] lg:items-center lg:py-8">
        <picture>
          <source media="(max-width: 1023px)" srcSet={asset("/img/hero/home-mobile.webp")} />
          <img src={asset("/img/hero/home-desktop.webp")} alt="Four school sweatshirts hanging on a peg rail with two backpacks below" className="h-[24vh] min-h-[168px] w-full object-cover object-[50%_35%] md:h-[30vh] lg:absolute lg:inset-0 lg:h-full lg:object-[0%_center]" fetchPriority="high" />
        </picture>
        <div className="wrap relative -mt-6 pb-10 lg:mt-0 lg:flex lg:justify-end lg:pb-0">
          <div className="rise rounded-[3px] border border-ink/15 bg-white p-5 sm:p-8 lg:w-[54%] lg:max-w-[660px] lg:px-10 lg:py-9">
            <h1 className="t-hero">School uniform, sorted in one visit.</h1>
            <p className="t-lede mt-3 text-ink/75 lg:mt-4">Embroidered uniform for south London schools and the plain basics, from a family shop in Tooting since 1993.</p>
            <div className="mt-5"><SchoolFinder id="school-finder-hero" /></div>
          </div>
        </div>
      </section>

      {/* Why I&A: verified facts, one quiet row */}
      <section className="wrap">
        <ul className="grid gap-x-10 gap-y-4 border-b border-line py-8 text-ink/75 sm:grid-cols-2 lg:grid-cols-4">
          <li><strong className="text-ink">Since 1993.</strong> Family-run on Mitcham Road, Tooting.</li>
          <li><strong className="text-ink">Embroidered in house.</strong> Crests stitched here, not shipped in.</li>
          <li><strong className="text-ink">Drop-off to school, £{d.schoolDropOff}.</strong> Or collect from the shop, seven days a week.</li>
          <li><strong className="text-ink">Free delivery from £{d.freeOver}.</strong> <Link to="/delivery" className="underline underline-offset-4">Standard {money(d.standard.price)}, express {money(d.express.price)}</Link>.</li>
        </ul>
      </section>

      {/* Collections as wide rows */}
      <section className="wrap mt-16 lg:mt-20">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
          <h2>The everyday basics</h2>
          <p className="mt-2 text-ink/75 lg:mt-0 lg:pb-1">Plain uniform any school accepts, from brands built to last the year.</p>
        </div>
        <div className="mt-6 grid gap-x-6 gap-y-8 md:grid-cols-2">
          {(["boys", "girls", "pe-kit", "bags"] as const).map((k) => {
            const c = COLLECTIONS[k];
            return (
              <Link key={k} to={`/collections/${k}`} className="group block">
                <img src={asset(c.banner)} alt="" className="aspect-[21/9] w-full rounded-[3px] object-cover" loading="lazy" />
                <div className="mt-3 sm:flex sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="t-h3 whitespace-nowrap font-serif font-bold group-hover:underline group-hover:underline-offset-4">{c.title}</h3>
                  <p className="mt-1 text-ink/75 sm:mt-0 sm:text-right">{c.blurb}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Made to last: facts from the eco-uniform page. A full-width Sage band; the blazer runs to the band's edge. */}
      <section className="mt-16 bg-sage lg:mt-24">
        <div className="mx-auto grid max-w-[1536px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <img src={asset("/img/banners/blazers.webp")} alt="Grey flannel school blazer on a wooden hanger" className="h-full max-h-[340px] min-h-[260px] w-full object-cover object-[12%_center] lg:max-h-none" loading="lazy" />
          <div className="px-4 py-10 sm:px-6 lg:px-16 lg:py-20">
            <h2>Made to last, made responsibly</h2>
            <p className="measure mt-4">Durable uniform is cheaper uniform. Our trousers are protected by Teflon™, so stains lift and they need fewer washes. Sweatshirts and cardigans are made with 40% recycled fibre, and our eco range includes blazers and ties made from recycled bottles. Up to 90% of our suppliers are UK-based.</p>
            <ul className="measure mt-6 border-t border-ink/30">
              <li className="border-b border-ink/30 py-2.5">Sturdy-fit and slim-fit trousers from £10.50</li>
              <li className="border-b border-ink/30 py-2.5">Banner and Trutex knitwear and blazers</li>
              <li className="border-b border-ink/30 py-2.5">Member of the Schoolwear Association</li>
            </ul>
            <Link to="/collections/all" className="btn btn-ink mt-8">See the full range</Link>
          </div>
        </div>
      </section>

      {/* First day: each photo goes to its school */}
      <section className="wrap mt-16 lg:mt-24">
        <div className="grid gap-x-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end">
          <h2>Ready for the first day</h2>
          <p className="measure mt-2 text-ink/75 lg:mt-0 lg:pb-1">Uniform from three of the schools we stitch for. Tap a photo to see that school's list.</p>
        </div>
        <div className="mt-6 grid gap-3 md:h-[620px] md:grid-cols-[1.3fr_1fr] md:grid-rows-2">
          {FIRST_DAY.map((f, i) => (
            <Link key={f.img} to={`/schools/${f.school}`} className={`group relative block overflow-hidden rounded-[3px] md:min-h-0 ${i === 0 ? "md:row-span-2" : ""}`}>
              <img src={asset(`/img/lifestyle/${f.img}.webp`)} alt={f.alt} className={`w-full object-cover ${i === 0 ? "aspect-[4/5] md:aspect-auto md:h-full" : "aspect-[4/3] md:aspect-auto md:h-full"}`} loading="lazy" />
              <span className="absolute bottom-3 left-3 rounded-[3px] bg-white px-3 py-2 font-medium group-hover:underline group-hover:underline-offset-4">{f.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Picks */}
      {picks.length > 0 && (
        <section className="wrap mt-16 lg:mt-24">
          <div className="flex flex-wrap items-end justify-between gap-x-6">
            <h2>Plain basics, every school</h2>
            <Link to="/collections/all" className="inline-flex min-h-11 items-center font-medium underline underline-offset-4">All plain uniform</Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {picks.map((p) => <ProductCard key={p.handle} p={p} school={p.school ? bySlug[p.school] : undefined} showSchool />)}
          </div>
        </section>
      )}

      {/* The shop: a full-width School Blue band that runs into the footer */}
      <section className="on-dark -mb-20 mt-16 bg-blue text-white lg:mt-24">
        <div className="wrap grid gap-8 py-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:py-16">
          <div>
            <h2>Come and get fitted in Tooting</h2>
            <p className="t-lede measure mt-3">Not sure between two sizes? Bring your child in. We measure, you try, and you leave with the right size. The blue shopfront on Mitcham Road, by Tooting Broadway.</p>
          </div>
          <div className="lg:border-l lg:border-white/40 lg:pl-10">
            <address className="not-italic">
              <span className="font-medium">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}</span><br />
              {SITE.hours}
            </address>
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-primary mt-5">Call {SITE.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
