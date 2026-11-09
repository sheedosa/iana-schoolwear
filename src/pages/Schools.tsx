import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SchoolFinder } from "../components/SchoolFinder";
import { asset, inStoreOnly, storefront, type School } from "../lib/shopify";
import { Seo, breadcrumbs } from "../components/Seo";

export function Schools() {
  const [schools, setSchools] = useState<School[]>([]);
  useEffect(() => { storefront.schools().then(setSchools); window.scrollTo(0, 0); }, []);
  return (
    <section className="wrap py-12">
      <Seo title="Find your school" description="School uniform by school: Heathbrook, Fircroft, Allen Edwards, Trinity St Mary's, St Anne's, Gatton, St Andrew's, Vauxhall and Penwortham. Embroidered in Tooting." path="/schools" jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Schools", path: "/schools" }])} />
      <h1 className="display text-4xl sm:text-5xl">Find your school</h1>
      <p className="mt-3 max-w-xl text-ink/65">We supply embroidered uniform for these south London schools. Each page shows the school's logo items first, then the plain basics that go with them. Schools marked "In store" are on the shelf in Tooting but not online yet.</p>
      <div className="mt-6 max-w-xl"><SchoolFinder size="lg" id="school-finder-page" /></div>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {schools.map((s) => (
          <li key={s.slug}>
            <Link to={`/schools/${s.slug}`} className="lift flex items-center gap-4 rounded-md border border-line bg-white p-3 hover:border-ink">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded bg-sage">
                {s.tile ? <img src={asset(s.tile.replace("/tiles/", "/tiles/sage/"))} alt="" className="h-full w-full object-cover" /> : <span className="display text-3xl">{s.short.replace(/[^A-Z]/g, "").slice(0, 2)}</span>}
              </div>
              <div className="min-w-0">
                <p className="font-medium leading-tight">{s.name}</p>
                <p className="mt-1 text-ink/65">{s.area}</p>
              </div>
              <span className={`label ml-auto shrink-0 text-[0.6875rem] ${inStoreOnly(s) ? "rounded-[3px] border border-ink px-2 py-1" : "text-ink/65"}`}>{inStoreOnly(s) ? "In store" : `${s.productCount} online`}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
