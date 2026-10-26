import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SchoolFinder } from "../components/SchoolFinder";
import { asset, storefront, type School } from "../lib/shopify";
import { Seo, breadcrumbs } from "../components/Seo";

export function Schools() {
  const [schools, setSchools] = useState<School[]>([]);
  useEffect(() => { storefront.schools().then(setSchools); window.scrollTo(0, 0); }, []);
  return (
    <section className="wrap py-12">
      <Seo title="Find your school" description="School uniform by school: Heathbrook, Fircroft, Allen Edwards, Trinity St Mary's, St Anne's, Gatton, St Andrew's, Vauxhall and Penwortham. Embroidered in Tooting." path="/schools" jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Schools", path: "/schools" }])} />
      <h1 className="display text-4xl sm:text-5xl">Find your school</h1>
      <p className="mt-3 max-w-xl text-ink/65">We supply embroidered uniform for these south London schools. Each page shows the school's logo items first, then the plain basics that go with them.</p>
      <div className="mt-6 max-w-xl"><SchoolFinder size="lg" autoFocus /></div>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {schools.map((s) => (
          <li key={s.slug}>
            <Link to={`/schools/${s.slug}`} className="lift flex items-center gap-4 rounded-md border border-line bg-white p-3 hover:border-ink">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded" style={{ background: s.tint }}>
                {s.tile && <img src={asset(s.tile)} alt="" className="h-full w-full object-cover" />}
              </div>
              <div>
                <p className="font-medium leading-tight">{s.name}</p>
                <p className="text-sm text-ink/55">{s.area} · {s.productCount ? `${s.productCount} items` : "in store now"}</p>
              </div>
              <span className="ml-auto h-3 w-3 rounded-full" style={{ background: s.colour }} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
