import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import Filters from "@/components/shop-page/filters";
import ShopSearch from "@/components/shop-page/ShopSearch";
import SortSelect from "@/components/shop-page/SortSelect";
import { FiSliders } from "react-icons/fi";
import { newArrivalsData, relatedProductData, topSellingData } from "../page";
import ProductCard from "@/components/common/ProductCard";
import { CATEGORIES, STYLES } from "@/lib/catalog";
import { filterProducts, parseShopParams, ShopParams } from "@/lib/shop-filters";
import Link from "next/link";

const allProducts = [...newArrivalsData, ...topSellingData, ...relatedProductData];

export default function ShopPage({ searchParams }: { searchParams: ShopParams }) {
  const filters = parseShopParams(searchParams);
  const products = filterProducts(allProducts, filters);
  const heading = filters.q
    ? `Results for "${filters.q}"`
    : (CATEGORIES.find((c) => c.slug === filters.category)?.title ??
      STYLES.find((s) => s.slug === filters.style)?.title ??
      "All products");

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters />
          </div>
          <div className="flex flex-col w-full space-y-5">
            <ShopSearch defaultValue={filters.q} />
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px]">{heading}</h1>
                <MobileFilters />
              </div>
              <div className="flex flex-col sm:items-center sm:flex-row">
                <span className="text-sm md:text-base text-black/60 mr-3">
                  Showing {products.length} of {allProducts.length} products
                </span>
                <SortSelect value={filters.sort} />
              </div>
            </div>
            {products.length > 0 ? (
              <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-black/60">
                <p className="mb-4">No products match these filters.</p>
                <Link href="/shop" className="font-medium text-black underline">
                  Clear filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
