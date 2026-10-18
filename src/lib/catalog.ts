// Shop vocabulary shared by the product data, the shop filters and the product page

export const CATEGORIES = [
  { slug: "t-shirts", title: "T-shirts" },
  { slug: "shorts", title: "Shorts" },
  { slug: "shirts", title: "Shirts" },
  { slug: "hoodie", title: "Hoodie" },
  { slug: "jeans", title: "Jeans" },
] as const;
export type Category = (typeof CATEGORIES)[number]["slug"];

export const STYLES = [
  { slug: "casual", title: "Casual" },
  { slug: "formal", title: "Formal" },
  { slug: "party", title: "Party" },
  { slug: "gym", title: "Gym" },
] as const;
export type Style = (typeof STYLES)[number]["slug"];

export const COLORS = [
  { name: "Brown", code: "bg-[#4F4631]" },
  { name: "Green", code: "bg-[#314F4A]" },
  { name: "Blue", code: "bg-[#31344F]" },
  { name: "Red", code: "bg-[#9B2C2C]" },
  { name: "Black", code: "bg-black" },
  { name: "White", code: "bg-white" },
] as const;
export type ColorName = (typeof COLORS)[number]["name"];

export const colorCode = (name: string) =>
  COLORS.find((c) => c.name === name)?.code ?? "bg-black";

export const SIZES = ["Small", "Medium", "Large", "X-Large"] as const;

export const PRICE_MIN = 0;
export const PRICE_MAX = 300;
