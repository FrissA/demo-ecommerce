"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CategoriesSection from "@/components/shop-page/filters/CategoriesSection";
import ColorsSection from "@/components/shop-page/filters/ColorsSection";
import DressStyleSection from "@/components/shop-page/filters/DressStyleSection";
import PriceSection from "@/components/shop-page/filters/PriceSection";
import SizeSection from "@/components/shop-page/filters/SizeSection";
import { Button } from "@/components/ui/button";
import { parseShopParams } from "@/lib/shop-filters";
import { PRICE_MAX, PRICE_MIN } from "@/lib/catalog";
import Link from "next/link";

// Every filter applies as soon as it's picked; in the mobile drawer,
// "Show results" just closes it
const Filters = ({ onDone }: { onDone?: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = parseShopParams(Object.fromEntries(searchParams.entries()));

  const withParams = (changes: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };
  const toggle = (key: string, value: string) =>
    withParams({ [key]: searchParams.get(key) === value ? undefined : value });
  const go = (href: string) => router.push(href, { scroll: false });

  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesSection selected={current.category} linkWith={toggle} />
      <hr className="border-t-black/10" />
      <PriceSection
        key={`${current.minPrice}-${current.maxPrice}`}
        value={[current.minPrice, current.maxPrice]}
        onChange={([min, max]) =>
          go(
            withParams({
              minPrice: min > PRICE_MIN ? String(min) : undefined,
              maxPrice: max < PRICE_MAX ? String(max) : undefined,
            })
          )
        }
      />
      <hr className="border-t-black/10" />
      <ColorsSection selected={current.color} onSelect={(c) => go(toggle("color", c))} />
      <hr className="border-t-black/10" />
      <SizeSection selected={current.size} onSelect={(s) => go(toggle("size", s))} />
      <hr className="border-t-black/10" />
      <DressStyleSection selected={current.style} linkWith={toggle} />
      {onDone && (
        <Button
          type="button"
          onClick={onDone}
          className="bg-black w-full rounded-full text-sm font-medium py-4 h-12"
        >
          Show results
        </Button>
      )}
      <Link
        href={pathname}
        onClick={onDone}
        className="block text-center text-sm text-black/60 underline"
      >
        Clear all filters
      </Link>
    </>
  );
};

export default Filters;
