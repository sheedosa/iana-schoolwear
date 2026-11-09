import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SchoolFinder } from "../components/SchoolFinder";
import { ProductCard } from "../components/ProductCard";
import { asset, COLLECTIONS, inStoreOnly, storefront, type Product, type School } from "../lib/shopify";
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

  return (
    <>
      <Seo title="School uniform for south London schools" description="Embroidered school uniform, PE kit and bags for Heathbrook, Fircroft, Allen Edwards, Trinity St Mary's, St Anne's and more, plus plain basics. Family-run in Tooting since 1993. Pay in 3 with Klarna." path="/" jsonLd={{ "@context": "https://schema.org", "@type": "WebSite", url: SITE.url, name: SITE.name, potentialAction: { "@type": "SearchAction", target: `${SITE.url}/schools?q={search_term_string}`, "query-input": "required name=search_term_string" } }} />
      {/* Hero: the peg rail, and one question. One h1; on desktop the copy sits in a panel over the wall, never on the garments. */}
      <section className="relative">
        <picture>
          <source media="(max-width: 1023px)" srcSet={asset("/img/hero/home-mobile.webp")} />
          <img src={asset("/img/hero/home-desktop.webp")} alt="Four school sweatshirts hanging on a peg rail with two backpacks below" className="h-[30vh] min-h-[220px] w-full object-cover object-[50%_35%] lg:h-[74vh] lg:min-h-[560px] lg:object-[0%_center]" fetchPriority="high" />
        </picture>
        <div className="wrap relative -mt-8 lg:absolute lg:inset-0 lg:mt-0 lg:flex lg:items-center lg:justify-end">
          <div className="rounded-md bg-white p-5 shadow-[0_12px_40px_rgba(69,53,58,0.12)] sm:p-7 lg:w-[46%] lg:max-w-[560px] lg:p-10">
            <h1 className="display text-[2.25rem] sm:text-5xl lg:text-[3.6rem]">School uniform, sorted in one visit.</h1>
            <p className="mt-3 max-w-md text-ink/70 lg:mt-4 lg:text-lg">Embroidered uniform for south London schools, plus the plain basics, from a family shop in Tooting since 1993. Pick your school and we'll show you what's on the list.</p>
            <div className="mt-5"><SchoolFinder size="lg" id="school-finder-hero" /></div>
          </div>
        </div>
      </section>

      {/* Schools */}
      <section className="mt-12 bg-sage-soft py-14 lg:mt-0">
        <div className="wrap">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold">Shop by school</h2>
            <p className="mt-1 max-w-[52ch] text-ink/65">Each page shows your school's embroidered items first, then the plain basics that go with them.</p>
          </div>
          <Link to="/schools" className="hidden min-h-11 items-center font-medium underline sm:inline-flex">All schools</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {schools.filter((s) => s.tile).map((s) => (
            <Link key={s.slug} to={`/schools/${s.slug}`} className="lift group block">
              <div className="aspect-square overflow-hidden rounded-md bg-sage">
                <img src={asset(s.tile!.replace("/tiles/", "/tiles/sage/"))} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="font-medium group-hover:underline">{s.short}</span>
                <span className="ml-auto hidden text-sm text-ink/60 sm:inline">{s.area}</span>
              </div>
            </Link>
          ))}
          <div className="col-span-2 flex flex-col justify-center rounded-md border border-ink/15 bg-white p-4 sm:col-span-3 lg:col-span-5 lg:flex-row lg:items-center lg:gap-6">
            <p className="label text-ink/70 lg:shrink-0">Also supplied</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 lg:mt-0">
              {schools.filter((s) => !s.tile).map((s) => (
                <li key={s.slug}><Link to={`/schools/${s.slug}`} className="inline-flex min-h-11 items-center gap-2 font-medium underline-offset-4 hover:underline">{s.short}{inStoreOnly(s) && <span className="label text-[0.6875rem] text-ink/60">In store</span>}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      </section>

      {/* Why I&A: verified facts, one quiet row */}
      <section className="wrap mt-10">
        <ul className="hairline grid gap-x-8 gap-y-3 py-6 text-ink/75 sm:grid-cols-2 lg:grid-cols-4">
          <li><strong className="text-ink">Since 1993.</strong> Family-run on Mitcham Road, Tooting.</li>
          <li><strong className="text-ink">Embroidered in house.</strong> Crests stitched here, not shipped in.</li>
          <li><strong className="text-ink">Drop-off to school, £{SITE.delivery.schoolDropOff}.</strong> Or collect from the shop, seven days a week.</li>
          <li><strong className="text-ink">Free delivery over £{SITE.delivery.freeOver}.</strong> <Link to="/delivery" className="underline">Standard {money(SITE.delivery.standard.price)}, express {money(SITE.delivery.express.price)}</Link>.</li>
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
                <div className="mt-3 sm:flex sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className="whitespace-nowrap font-serif text-[1.75rem] font-bold leading-none group-hover:underline">{c.title}</h3>
                  <p className="mt-1 text-ink/65 sm:mt-0 sm:text-right">{c.blurb}</p>
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

      {/* First day: each photo goes to its school */}
      <section className="wrap mt-20">
        <h2 className="text-4xl font-extrabold">Ready for the first day</h2>
        <p className="mt-1 max-w-[52ch] text-ink/65">Uniform from three of the schools we stitch for. Tap a photo to see that school's list.</p>
        <div className="mt-6 grid gap-3 md:h-[620px] md:grid-cols-[1.3fr_1fr] md:grid-rows-2">
          {FIRST_DAY.map((f, i) => (
            <Link key={f.img} to={`/schools/${f.school}`} className={`lift group relative block overflow-hidden rounded-md md:min-h-0 ${i === 0 ? "md:row-span-2" : ""}`}>
              <img src={asset(`/img/lifestyle/${f.img}.webp`)} alt={f.alt} className={`w-full object-cover ${i === 0 ? "aspect-[4/5] md:aspect-auto md:h-full" : "aspect-[4/3] md:aspect-auto md:h-full"}`} loading="lazy" />
              <span className="absolute bottom-3 left-3 rounded-[3px] bg-white px-3 py-2 label text-[0.6875rem] group-hover:underline">{f.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Picks */}
      {picks.length > 0 && (
        <section className="wrap mt-20">
          <h2 className="text-4xl font-extrabold">Plain basics, every school</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {picks.map((p) => <ProductCard key={p.handle} p={p} school={p.school ? bySlug[p.school] : undefined} showSchool />)}
          </div>
        </section>
      )}

      {/* The shop */}
      <section className="wrap mt-20">
        <div className="rounded-md bg-blue p-8 text-white lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="text-4xl font-extrabold">Come and get fitted in Tooting</h2>
              <p className="mt-3 text-white">Not sure between two sizes? Bring your child in. We measure, you try, and you leave with the right size. The blue shopfront on Mitcham Road, by Tooting Broadway.</p>
            </div>
            <div className="text-white">
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
