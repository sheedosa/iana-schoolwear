import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SchoolFinder } from "../components/SchoolFinder";
import { Seo, breadcrumbs } from "../components/Seo";

export function Schools() {
  const [params] = useSearchParams();
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <section className="wrap py-10 lg:py-14">
      <Seo title="Find your school" description="School uniform by school: Heathbrook, Fircroft, Allen Edwards, Trinity St Mary's, St Anne's, Gatton, St Andrew's, Vauxhall and Penwortham. Embroidered in Tooting." path="/schools" jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Schools", path: "/schools" }])} />
      <div className="grid gap-x-16 gap-y-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end">
        <h1>Find your school</h1>
        <p className="measure text-ink/75">We supply embroidered uniform for these south London schools. Each page shows the school's logo items first, then the plain basics that go with them. Schools marked "in store only" are on the shelf in Tooting but not online yet.</p>
      </div>
      <div className="mt-8"><SchoolFinder layout="list" id="school-finder-page" initialQuery={params.get("q") ?? ""} /></div>
    </section>
  );
}
