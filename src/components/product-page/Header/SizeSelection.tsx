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
    <div className="flex flex-col">
      <span
        id="size-label"
        className="text-sm sm:text-base text-black/60 mb-4"
      >
        Choose Size
      </span>
      <div
        role="group"
        aria-labelledby="size-label"
        className="flex items-center flex-wrap gap-2 sm:gap-3"
      >
        {["Small", "Medium", "Large", "X-Large"].map((size) => (
          <button
            key={size}
            type="button"
            aria-pressed={sizeSelection === size}
            className={cn([
              "bg-[#F0F0F0] min-h-11 px-5 py-2.5 text-sm lg:text-base rounded-full whitespace-nowrap",
              sizeSelection === size && "bg-black font-medium text-white",
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
