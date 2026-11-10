import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { Seo } from "./components/Seo";
import { Header } from "./components/Header";
import { SchoolFinder } from "./components/SchoolFinder";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { CartProvider } from "./lib/cart";
import { Home } from "./pages/Home";
import { Schools } from "./pages/Schools";
import { SchoolPage } from "./pages/SchoolPage";
import { Collection } from "./pages/Collection";
import { ProductPage } from "./pages/ProductPage";
import { SizeGuide } from "./pages/SizeGuide";
import { About } from "./pages/About";
import { Delivery } from "./pages/Delivery";

function NotFound() {
  return (
    <section className="wrap py-12 lg:py-20">
      <Seo title="Page not found" description="That page isn't here. Find your school's uniform instead." path="/schools" noindex />
      <h1>That page isn't here</h1>
      <p className="t-lede mt-3 text-ink/75">Find your school instead, or <Link to="/collections/all" className="underline underline-offset-4">see all uniform</Link>.</p>
      <div className="mt-6 max-w-[620px]"><SchoolFinder id="school-finder-404" /></div>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CartProvider>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
        <Header />
        <main id="main" className="pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="/schools/:slug" element={<SchoolPage />} />
            <Route path="/collections/:handle" element={<Collection />} />
            <Route path="/products/:handle" element={<ProductPage />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/about" element={<About />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
      </CartProvider>
    </BrowserRouter>
  );
}
