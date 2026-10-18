"use client";

import { setSizeSelection } from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import React from "react";
import { track } from "@/lib/analytics";

const SizeSelection = ({ productId }: { productId: number }) => {
  const { sizeSelection } = useAppSelector(
    (state: RootState) => state.products
  );
  const dispatch = useAppDispatch();

  return (
    <div id="size-selection" className="flex flex-col scroll-mt-24">
      <span
        id="size-selection-label"
        className="text-sm sm:text-base text-black/60 mb-4"
      >
        Choose Size
        {!sizeSelection && (
          <span className="text-black font-medium"> (select a size)</span>
        )}
      </span>
      <div
        role="radiogroup"
        aria-labelledby="size-selection-label"
        className="flex flex-wrap gap-2 lg:gap-3"
      >
        {["Small", "Medium", "Large", "X-Large"].map((size) => (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={sizeSelection === size}
            className={cn([
              "bg-[#F0F0F0] min-h-11 px-5 py-2.5 text-sm lg:text-base rounded-full whitespace-nowrap border-2 border-transparent hover:border-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
              sizeSelection === size &&
                "bg-black border-black font-medium text-white",
            ])}
            onClick={() => {
              dispatch(setSizeSelection(size));
              track("size_selected", { product_id: productId, size });
            }}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelection;
