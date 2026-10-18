"use client";

import React, { useState } from "react";
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

// Category and style are links; color and size apply on tap; price waits for "Apply Filter"
const Filters = ({ onApply }: { onApply?: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = parseShopParams(Object.fromEntries(searchParams.entries()));

  const [price, setPrice] = useState<[number, number]>([current.minPrice, current.maxPrice]);
  const [color, setColor] = useState(current.color);
  const [size, setSize] = useState(current.size);

  const linkWith = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) params.delete(key);
    else params.set(key, value);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const apply = (picked: { color?: string; size?: string } = { color, size }) => {
    const params = new URLSearchParams(searchParams.toString());
    const set = (key: string, value: string | undefined) =>
      value ? params.set(key, value) : params.delete(key);
    set("minPrice", price[0] > PRICE_MIN ? String(price[0]) : undefined);
    set("maxPrice", price[1] < PRICE_MAX ? String(price[1]) : undefined);
    set("color", picked.color);
    set("size", picked.size);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Tapping a color or size updates the results right away
  const pickColor = (c: string) => {
    const next = c === color ? undefined : c;
    setColor(next);
    apply({ color: next, size });
  };
  const pickSize = (s: string) => {
    const next = s === size ? undefined : s;
    setSize(next);
    apply({ color, size: next });
  };

  // Clearing filters keeps what the shopper searched for
  const clearHref = current.q ? `${pathname}?${new URLSearchParams({ q: current.q })}` : pathname;

  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesSection selected={current.category} linkWith={linkWith} />
      <hr className="border-t-black/10" />
      <PriceSection value={price} onChange={setPrice} />
      <hr className="border-t-black/10" />
      <ColorsSection selected={color} onSelect={pickColor} />
      <hr className="border-t-black/10" />
      <SizeSection selected={size} onSelect={pickSize} />
      <hr className="border-t-black/10" />
      <DressStyleSection selected={current.style} linkWith={linkWith} />
      <Button
        type="button"
        onClick={() => {
          apply();
          onApply?.();
        }}
        className="bg-black w-full rounded-full text-sm font-medium py-4 h-12"
      >
        Apply Filter
      </Button>
      <Link
        href={clearHref}
        onClick={() => {
          setColor(undefined);
          setSize(undefined);
          onApply?.();
        }}
        className="block text-center text-sm text-black/60 underline"
      >
        Clear all filters
      </Link>
    </>
  );
};

export default Filters;
