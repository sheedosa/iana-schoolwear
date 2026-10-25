import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { Header } from "./components/Header";
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

function NotFound() {
  return (
    <section className="wrap py-24 text-center">
      <h1 className="text-3xl font-extrabold">That page isn't here</h1>
      <p className="mt-2 text-ink/60">Try finding your school instead.</p>
      <Link to="/schools" className="btn btn-ink mt-6">Find your school</Link>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CartProvider>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
        <Header />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="/schools/:slug" element={<SchoolPage />} />
            <Route path="/collections/:handle" element={<Collection />} />
            <Route path="/products/:handle" element={<ProductPage />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
      </CartProvider>
    </BrowserRouter>
  );
}
