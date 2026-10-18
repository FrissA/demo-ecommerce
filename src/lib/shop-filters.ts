import { Product } from "@/types/product.types";
import { CATEGORIES, COLORS, PRICE_MAX, PRICE_MIN, SIZES, STYLES } from "@/lib/catalog";

export type ShopParams = { [key: string]: string | string[] | undefined };

export type ShopFilters = {
  q: string;
  category?: string;
  style?: string;
  color?: string;
  size?: string;
  minPrice: number;
  maxPrice: number;
  sort: "most-popular" | "low-price" | "high-price";
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const known = (v: string, values: readonly string[]) =>
  values.find((x) => x.toLowerCase() === v.toLowerCase());

export function parseShopParams(params: ShopParams): ShopFilters {
  const num = (v: string, fallback: number) => {
    const n = Number(v);
    return v !== "" && Number.isFinite(n) ? n : fallback;
  };
  const sort = one(params.sort);
  return {
    q: one(params.q).trim(),
    category: known(one(params.category), CATEGORIES.map((c) => c.slug)),
    style: known(one(params.style), STYLES.map((s) => s.slug)),
    color: known(one(params.color), COLORS.map((c) => c.name)),
    size: known(one(params.size), SIZES),
    minPrice: num(one(params.minPrice), PRICE_MIN),
    maxPrice: num(one(params.maxPrice), PRICE_MAX),
    sort: sort === "low-price" || sort === "high-price" ? sort : "most-popular",
  };
}

export const finalPrice = (p: Product) =>
  p.discount.percentage > 0
    ? Math.round(p.price - (p.price * p.discount.percentage) / 100)
    : p.price - p.discount.amount;

// "Blue T-Shirts" and "blue tshirt" both match a blue "T-shirt with Tape Details"
const words = (text: string) =>
  text
    .toLowerCase()
    .replace(/-/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w));

export function matchesSearch(product: Product, q: string) {
  const haystack = new Set(
    words([product.title, product.category, product.style, ...product.colors].join(" "))
  );
  const hay = Array.from(haystack);
  return words(q).every((w) => haystack.has(w) || hay.some((h) => h.startsWith(w)));
}

export function filterProducts(products: Product[], f: ShopFilters): Product[] {
  const result = products.filter(
    (p) =>
      (!f.q || matchesSearch(p, f.q)) &&
      (!f.category || p.category === f.category) &&
      (!f.style || p.style === f.style) &&
      (!f.color || p.colors.includes(f.color as Product["colors"][number])) &&
      finalPrice(p) >= f.minPrice &&
      finalPrice(p) <= f.maxPrice
  );
  if (f.sort === "low-price") result.sort((a, b) => finalPrice(a) - finalPrice(b));
  if (f.sort === "high-price") result.sort((a, b) => finalPrice(b) - finalPrice(a));
  if (f.sort === "most-popular") result.sort((a, b) => b.rating - a.rating);
  return result;
}
