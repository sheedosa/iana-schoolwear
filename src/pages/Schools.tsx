import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SchoolTable } from "../components/SchoolFinder";
import { Seo, breadcrumbs } from "../components/Seo";

export function Schools() {
  const [params] = useSearchParams();
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <section className="wrap py-8 lg:py-10">
      <Seo title="Find your school" description="School uniform by school: Heathbrook, Fircroft, Allen Edwards, Trinity St Mary's, St Anne's, Gatton, St Andrew's, Vauxhall and Penwortham. Embroidered in Tooting." path="/schools" jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Schools", path: "/schools" }])} />
      <h1>Choose your school</h1>
      <p className="measure mt-2 text-mute">Each school's page lists its crested items first, then the plain items that go with them. A school marked in store only is on the shelf in Tooting and not online yet.</p>
      <div className="mt-6 max-w-[760px]"><SchoolTable query={params.get("q") ?? ""} /></div>
    </section>
  );
}
