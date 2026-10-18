import { Category, ColorName, Style } from "@/lib/catalog";

export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  id: number;
  title: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  category: Category;
  style: Style;
  colors: ColorName[];
  rating: number;
};
