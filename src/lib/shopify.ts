// Storefront adapter. One interface, two implementations:
//  - ShopifyStorefront: the real Shopify Storefront API (headless). Enabled when
//    VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN are set at build time.
//  - DemoStorefront: the extracted I&A catalogue in src/data/catalogue.json, with a
//    local cart. Used for the GitHub Pages preview before the Shopify store exists.
//
// The page components only ever talk to `storefront`, so going live is a config change.

import catalogue from "../data/catalogue.json";

export type Money = { amount: number; currency: string };

export type Product = {
  id: string;
  handle: string;
  title: string;
  school: string | null; // school slug, from tag school:<slug>
  productType: string;
  gender: "Boys" | "Girls" | "Unisex";
  priceMin: number;
  priceMax: number;
  currency: string;
  sizes: string[];
  colours: string[];
  images: string[];
  description: string;
  available: boolean;
  logoItem: boolean;
  tags: string[];
};

export type School = {
  name: string;
  slug: string;
  short: string;
  colour: string;
  tint: string;
  tile: string | null;
  area: string;
  productCount: number;
};

export type CartLine = { id: string; product: Product; size: string | null; quantity: number };
export type Cart = { lines: CartLine[]; subtotal: number; checkoutUrl: string | null };

export interface Storefront {
  mode: "demo" | "shopify";
  schools(): Promise<School[]>;
  school(slug: string): Promise<School | undefined>;
  products(filter?: { school?: string; type?: string; gender?: string; collection?: string; query?: string }): Promise<Product[]>;
  product(handle: string): Promise<Product | undefined>;
  cart(): Promise<Cart>;
  addToCart(handle: string, size: string | null, quantity?: number): Promise<Cart>;
  updateLine(lineId: string, quantity: number): Promise<Cart>;
  subscribe(fn: (c: Cart) => void): () => void;
}

// ---------- shared helpers ----------
export const COLLECTIONS: Record<string, { title: string; banner: string; match: (p: Product) => boolean; blurb: string }> = {
  boys: { title: "Boys", banner: "/img/banners/boys.webp", match: (p) => p.gender !== "Girls", blurb: "Trousers, shirts and knitwear that last the year." },
  girls: { title: "Girls", banner: "/img/banners/girls.webp", match: (p) => p.gender !== "Boys", blurb: "Dresses, skirts, pinafores and cardigans." },
  "pe-kit": { title: "PE kit", banner: "/img/banners/pe-kit.webp", match: (p) => p.productType === "PE kit", blurb: "T-shirts, shorts, bags and swim kit for every school." },
  bags: { title: "Bags", banner: "/img/banners/bags.webp", match: (p) => p.productType === "Bags", blurb: "Book bags, backpacks and PE bags with your school's crest." },
  blazers: { title: "Blazers", banner: "/img/banners/blazers.webp", match: (p) => p.productType === "Blazers", blurb: "Banner flannel and S-Cut blazers, fitted in store or at home." },
  all: { title: "All uniform", banner: "/img/hero/home-desktop.webp", match: () => true, blurb: "Everything we stock, for every school." },
};

export function formatPrice(n: number, currency = "GBP") {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency, minimumFractionDigits: n % 1 ? 2 : 0 }).format(n);
}

export function priceLabel(p: Product) {
  if (p.priceMin <= 0) return "Price in store";
  if (p.priceMax > p.priceMin) return `${formatPrice(p.priceMin)} – ${formatPrice(p.priceMax)}`;
  return formatPrice(p.priceMin);
}

const base = import.meta.env.BASE_URL.replace(/\/$/, "");
export const asset = (path: string) => (path.startsWith("http") ? path : `${base}${path}`);

// ---------- demo implementation ----------
class DemoStorefront implements Storefront {
  mode = "demo" as const;
  private data = catalogue as { schools: School[]; products: Product[] };
  private lines: CartLine[] = [];
  private listeners = new Set<(c: Cart) => void>();

  constructor() {
    try {
      const saved = localStorage.getItem("iana-cart");
      if (saved) {
        const raw = JSON.parse(saved) as { handle: string; size: string | null; quantity: number }[];
        this.lines = raw
          .map((r) => {
            const product = this.data.products.find((p) => p.handle === r.handle);
            return product ? { id: `${r.handle}:${r.size ?? ""}`, product, size: r.size, quantity: r.quantity } : null;
          })
          .filter(Boolean) as CartLine[];
      }
    } catch { /* storage unavailable: start empty */ }
  }

  private persist() {
    try {
      localStorage.setItem("iana-cart", JSON.stringify(this.lines.map((l) => ({ handle: l.product.handle, size: l.size, quantity: l.quantity }))));
    } catch { /* ignore */ }
  }

  private snapshot(): Cart {
    const subtotal = this.lines.reduce((a, l) => a + l.product.priceMin * l.quantity, 0);
    return { lines: [...this.lines], subtotal, checkoutUrl: null };
  }

  private emit() {
    const c = this.snapshot();
    this.listeners.forEach((fn) => fn(c));
  }

  async schools() { return this.data.schools; }
  async school(slug: string) { return this.data.schools.find((s) => s.slug === slug); }
  async products(f: Parameters<Storefront["products"]>[0] = {}) {
    let list = this.data.products;
    if (f.school) list = list.filter((p) => p.school === f.school);
    if (f.type) list = list.filter((p) => p.productType === f.type);
    if (f.gender) list = list.filter((p) => p.gender === f.gender || p.gender === "Unisex");
    if (f.collection && COLLECTIONS[f.collection]) list = list.filter(COLLECTIONS[f.collection].match);
    if (f.query) {
      const q = f.query.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.productType.toLowerCase().includes(q));
    }
    // images first, then logo items, then by title
    return [...list].sort((a, b) => Number(!!b.images.length) - Number(!!a.images.length) || Number(b.available) - Number(a.available) || Number(b.logoItem) - Number(a.logoItem) || a.title.localeCompare(b.title));
  }
  async product(handle: string) { return this.data.products.find((p) => p.handle === handle); }
  async cart() { return this.snapshot(); }
  async addToCart(handle: string, size: string | null, quantity = 1) {
    const product = await this.product(handle);
    if (!product) throw new Error("Product not found");
    const id = `${handle}:${size ?? ""}`;
    const existing = this.lines.find((l) => l.id === id);
    if (existing) existing.quantity += quantity;
    else this.lines.push({ id, product, size, quantity });
    this.persist(); this.emit();
    return this.snapshot();
  }
  async updateLine(lineId: string, quantity: number) {
    this.lines = quantity <= 0 ? this.lines.filter((l) => l.id !== lineId) : this.lines.map((l) => (l.id === lineId ? { ...l, quantity } : l));
    this.persist(); this.emit();
    return this.snapshot();
  }
  subscribe(fn: (c: Cart) => void) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
}

// ---------- Shopify Storefront API implementation ----------
// Products in Shopify must be tagged `school:<slug>` and have productType set,
// exactly as in the launch template. Collections map by handle (boys, girls, pe-kit, bags, blazers).
class ShopifyStorefront implements Storefront {
  mode = "shopify" as const;
  private endpoint: string;
  private token: string;
  private cartId: string | null = null;
  private listeners = new Set<(c: Cart) => void>();
  private schoolsCache: School[] = (catalogue as { schools: School[] }).schools; // school metadata stays in the repo
  private productCache = new Map<string, Product>();

  constructor(domain: string, token: string) {
    this.endpoint = `https://${domain}/api/2026-07/graphql.json`;
    this.token = token;
    try { this.cartId = localStorage.getItem("iana-shopify-cart"); } catch { /* ignore */ }
  }

  private async gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": this.token },
      body: JSON.stringify({ query, variables }),
    });
    const json = (await res.json()) as { data: T; errors?: unknown };
    if (json.errors) throw new Error(JSON.stringify(json.errors));
    return json.data;
  }

  private toProduct(n: ShopifyProductNode): Product {
    const school = n.tags.find((t) => t.startsWith("school:"))?.slice(7) ?? null;
    const sizes = n.options.find((o) => /size/i.test(o.name))?.values ?? [];
    const colours = n.options.find((o) => /colou?r/i.test(o.name))?.values ?? [];
    const p: Product = {
      id: n.id, handle: n.handle, title: n.title, school,
      productType: n.productType || "Accessories",
      gender: /girl/i.test(n.title) ? "Girls" : /boy/i.test(n.title) ? "Boys" : "Unisex",
      priceMin: Number(n.priceRange.minVariantPrice.amount),
      priceMax: Number(n.priceRange.maxVariantPrice.amount),
      currency: n.priceRange.minVariantPrice.currencyCode,
      sizes, colours,
      images: n.images.nodes.map((i) => i.url),
      description: n.description,
      available: n.availableForSale,
      logoItem: !!school,
      tags: n.tags,
    };
    this.productCache.set(p.handle, p);
    return p;
  }

  async schools() { return this.schoolsCache; }
  async school(slug: string) { return this.schoolsCache.find((s) => s.slug === slug); }

  async products(f: Parameters<Storefront["products"]>[0] = {}) {
    const parts: string[] = [];
    if (f.school) parts.push(`tag:school:${f.school}`);
    if (f.type) parts.push(`product_type:'${f.type}'`);
    if (f.query) parts.push(f.query);
    const data = await this.gql<{ products: { nodes: ShopifyProductNode[] } }>(
      `query P($q: String) { products(first: 100, query: $q) { nodes { ${PRODUCT_FIELDS} } } }`,
      { q: parts.join(" AND ") || null },
    );
    let list = data.products.nodes.map((n) => this.toProduct(n));
    if (f.collection && COLLECTIONS[f.collection]) list = list.filter(COLLECTIONS[f.collection].match);
    if (f.gender) list = list.filter((p) => p.gender === f.gender || p.gender === "Unisex");
    return list;
  }

  async product(handle: string) {
    if (this.productCache.has(handle)) return this.productCache.get(handle);
    const data = await this.gql<{ product: ShopifyProductNode | null }>(
      `query One($h: String!) { product(handle: $h) { ${PRODUCT_FIELDS} } }`, { h: handle });
    return data.product ? this.toProduct(data.product) : undefined;
  }

  private async variantId(handle: string, size: string | null) {
    const data = await this.gql<{ product: { variants: { nodes: { id: string; selectedOptions: { name: string; value: string }[] }[] } } }>(
      `query V($h: String!) { product(handle: $h) { variants(first: 100) { nodes { id selectedOptions { name value } } } } }`, { h: handle });
    const v = data.product.variants.nodes.find((x) => !size || x.selectedOptions.some((o) => o.value === size)) ?? data.product.variants.nodes[0];
    return v.id;
  }

  private async readCart(): Promise<Cart> {
    if (!this.cartId) return { lines: [], subtotal: 0, checkoutUrl: null };
    const data = await this.gql<{ cart: ShopifyCart | null }>(`query C($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`, { id: this.cartId });
    if (!data.cart) { this.cartId = null; return { lines: [], subtotal: 0, checkoutUrl: null }; }
    return this.toCart(data.cart);
  }

  private toCart(c: ShopifyCart): Cart {
    const lines: CartLine[] = c.lines.nodes.map((l) => ({
      id: l.id,
      quantity: l.quantity,
      size: l.merchandise.selectedOptions.find((o) => /size/i.test(o.name))?.value ?? null,
      product: this.productCache.get(l.merchandise.product.handle) ?? this.toProduct(l.merchandise.product),
    }));
    const cart = { lines, subtotal: Number(c.cost.subtotalAmount.amount), checkoutUrl: c.checkoutUrl };
    this.listeners.forEach((fn) => fn(cart));
    return cart;
  }

  async cart() { return this.readCart(); }

  async addToCart(handle: string, size: string | null, quantity = 1) {
    const merchandiseId = await this.variantId(handle, size);
    if (!this.cartId) {
      const data = await this.gql<{ cartCreate: { cart: ShopifyCart } }>(
        `mutation Create($lines: [CartLineInput!]!) { cartCreate(input: { lines: $lines }) { cart { ${CART_FIELDS} } } }`,
        { lines: [{ merchandiseId, quantity }] });
      this.cartId = data.cartCreate.cart.id;
      try { localStorage.setItem("iana-shopify-cart", this.cartId); } catch { /* ignore */ }
      return this.toCart(data.cartCreate.cart);
    }
    const data = await this.gql<{ cartLinesAdd: { cart: ShopifyCart } }>(
      `mutation Add($id: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $id, lines: $lines) { cart { ${CART_FIELDS} } } }`,
      { id: this.cartId, lines: [{ merchandiseId, quantity }] });
    return this.toCart(data.cartLinesAdd.cart);
  }

  async updateLine(lineId: string, quantity: number) {
    if (!this.cartId) return this.readCart();
    const data = quantity <= 0
      ? await this.gql<{ cartLinesRemove: { cart: ShopifyCart } }>(
          `mutation Rm($id: ID!, $ids: [ID!]!) { cartLinesRemove(cartId: $id, lineIds: $ids) { cart { ${CART_FIELDS} } } }`, { id: this.cartId, ids: [lineId] })
          .then((d) => d.cartLinesRemove.cart)
      : await this.gql<{ cartLinesUpdate: { cart: ShopifyCart } }>(
          `mutation Up($id: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $id, lines: $lines) { cart { ${CART_FIELDS} } } }`,
          { id: this.cartId, lines: [{ id: lineId, quantity }] }).then((d) => d.cartLinesUpdate.cart);
    return this.toCart(data);
  }

  subscribe(fn: (c: Cart) => void) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
}

const PRODUCT_FIELDS = `id handle title productType description tags availableForSale
  priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
  options { name values } images(first: 6) { nodes { url } }`;
const CART_FIELDS = `id checkoutUrl cost { subtotalAmount { amount } }
  lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { selectedOptions { name value } product { ${PRODUCT_FIELDS} } } } } }`;

type ShopifyProductNode = {
  id: string; handle: string; title: string; productType: string; description: string; tags: string[]; availableForSale: boolean;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string }; maxVariantPrice: { amount: string; currencyCode: string } };
  options: { name: string; values: string[] }[];
  images: { nodes: { url: string }[] };
};
type ShopifyCart = {
  id: string; checkoutUrl: string; cost: { subtotalAmount: { amount: string } };
  lines: { nodes: { id: string; quantity: number; merchandise: { selectedOptions: { name: string; value: string }[]; product: ShopifyProductNode } }[] };
};

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN as string | undefined;
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined;

export const storefront: Storefront = domain && token ? new ShopifyStorefront(domain, token) : new DemoStorefront();
