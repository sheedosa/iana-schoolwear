import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SchoolFinder } from "../components/SchoolFinder";
import { ProductCard } from "../components/ProductCard";
import { asset, COLLECTIONS, storefront, type Product, type School } from "../lib/shopify";

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
      {/* Hero: the peg rail, and one question */}
      <section className="relative">
        <picture>
          <source media="(max-width: 640px)" srcSet={asset("/img/hero/home-mobile.webp")} />
          <img src={asset("/img/hero/home-desktop.webp")} alt="Four school sweatshirts hanging on a peg rail with two backpacks below" className="h-[56vh] min-h-[420px] w-full object-cover object-[50%_30%] sm:h-[78vh] sm:min-h-[560px] sm:object-[20%_center]" fetchPriority="high" />
        </picture>
        <div className="absolute inset-0 hidden sm:block sm:bg-gradient-to-l sm:from-ink/50 sm:via-ink/20 sm:to-transparent" />
        <div className="absolute inset-0 hidden sm:block">
          <div className="wrap flex h-full flex-col justify-end pb-10 sm:items-end sm:justify-center sm:pb-0">
            <div className="max-w-2xl text-white sm:w-[52%]">
              <h1 className="display text-[2.6rem] sm:text-6xl lg:text-7xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]">School uniform, sorted in one visit.</h1>
              <p className="mt-4 max-w-md text-lg text-white/90">Official kit for nine south London schools, plus the everyday basics. Pick your school and we'll show you exactly what's on the list.</p>
            </div>
            <div className="mt-6 w-full max-w-xl sm:w-[52%]"><SchoolFinder size="lg" /></div>
            <p className="mt-3 text-sm text-white/80 sm:w-[52%]">Free size exchanges, so you can size up with confidence.</p>
          </div>
        </div>
        <div className="wrap -mt-6 relative sm:hidden">
          <div className="rounded-3xl bg-white p-5 shadow-[0_12px_40px_rgba(27,42,74,0.12)]">
            <h1 className="display text-[2.3rem]">School uniform, sorted in one visit.</h1>
            <p className="mt-3 text-ink/70">Official kit for nine south London schools, plus the everyday basics.</p>
            <div className="mt-4"><SchoolFinder size="lg" /></div>
          </div>
        </div>
      </section>

      {/* Schools */}
      <section className="wrap mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold">Shop by school</h2>
            <p className="mt-1 text-ink/60">Each page shows the compulsory items first, then everything else your school allows.</p>
          </div>
          <Link to="/schools" className="hidden sm:inline font-semibold underline">All schools</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {schools.filter((s) => s.tile).map((s) => (
            <Link key={s.slug} to={`/schools/${s.slug}`} className="lift group block">
              <div className="aspect-square overflow-hidden rounded-2xl" style={{ background: s.tint }}>
                <img src={asset(s.tile!)} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.colour }} />
                <span className="font-semibold group-hover:underline">{s.short}</span>
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
      </section>

      {/* Trust row: plain statements, no icons needed */}
      <section className="wrap mt-16">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {[
            ["Free size exchanges", "Wrong size? Swap it free, in store or by post."],
            ["Next-day across London", "Order by 2pm. Collect from Stockwell Road any time."],
            ["30-day returns", "Unworn with tags. Logo items exchange only."],
            ["Pay in 3", "Spread the September shop with Klarna, no interest."],
          ].map(([h, d]) => (
            <div key={h} className="bg-white p-5">
              <h3 className="font-bold">{h}</h3>
              <p className="mt-1 text-sm text-ink/60">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Collections as wide rows */}
      <section className="wrap mt-20">
        <h2 className="text-3xl font-extrabold">The everyday basics</h2>
        <p className="mt-1 text-ink/60">Plain uniform any school accepts. Buy once in September; it lasts the year.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(["boys", "girls", "pe-kit", "bags"] as const).map((k) => {
            const c = COLLECTIONS[k];
            return (
              <Link key={k} to={`/collections/${k}`} className="lift group block">
                <div className="overflow-hidden rounded-2xl"><img src={asset(c.banner)} alt="" className="aspect-[21/9] w-full object-cover" loading="lazy" /></div>
                <div className="mt-3 flex items-baseline justify-between gap-4">
                  <h3 className="whitespace-nowrap text-2xl font-extrabold group-hover:underline">{c.title}</h3>
                  <p className="text-right text-sm text-ink/60">{c.blurb}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Lasts the year */}
      <section className="wrap mt-20">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-white border border-line lg:grid-cols-2">
          <img src={asset("/img/banners/blazers.webp")} alt="Grey flannel school blazer on a wooden hanger" className="h-full w-full object-cover" loading="lazy" />
          <div className="p-8 lg:p-12">
            <h2 className="text-3xl font-extrabold">Bought once. Worn until July.</h2>
            <p className="mt-4 text-ink/70">We stock Banner and Trutex because they survive a school year: triple-stitched seams, Teflon-coated trousers, knitwear that keeps its shape after forty washes. Cheaper uniform costs more by Easter.</p>
            <ul className="mt-6 space-y-2 text-ink/80">
              <li>Sturdy-fit and slim-fit trousers from £10.50</li>
              <li>Flannel blazers from £35, fitted in store</li>
              <li>Twin-pack shirts from £20</li>
            </ul>
            <Link to="/collections/all" className="btn btn-ink mt-8">See the full range</Link>
          </div>
        </div>
      </section>

      {/* Lifestyle strip */}
      <section className="mt-20">
        <div className="wrap"><h2 className="text-3xl font-extrabold">First days, done right</h2></div>
        <div className="wrap mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {["heathbrook-walk", "trinity-pe-gym", "heathbrook-door", "st-annes-hallway"].map((n) => (
            <img key={n} src={asset(`/img/lifestyle/${n}.webp`)} alt="" className="aspect-[4/5] w-full rounded-2xl object-cover" loading="lazy" />
          ))}
        </div>
      </section>

      {/* Picks */}
      {picks.length > 0 && (
        <section className="wrap mt-20">
          <h2 className="text-3xl font-extrabold">Parents' picks</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {picks.map((p) => <ProductCard key={p.handle} p={p} school={p.school ? bySlug[p.school] : undefined} />)}
          </div>
        </section>
      )}

      {/* Shop */}
      <section className="wrap mt-20">
        <div className="rounded-3xl bg-ink p-8 text-white lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="text-3xl font-extrabold">Come and get fitted</h2>
              <p className="mt-3 text-white/75">Not sure between two sizes? Bring them in. We measure, you try, and we embroider logo items while you wait on Saturdays.</p>
            </div>
            <div className="text-white/85">
              <p className="font-semibold">I&A, Stockwell Road, London SW9</p>
              <p className="mt-1">Monday to Saturday, 9:30 to 6:00</p>
              <p className="mt-1">Late opening to 8pm through August</p>
              <a href="mailto:hello@iandagroup.co.uk" className="btn btn-primary mt-5">Book a fitting</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
