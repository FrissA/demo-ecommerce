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
      <span id="size-label" className="text-sm sm:text-base text-black/60 mb-4">
        Choose Size
      </span>
      <div
        role="radiogroup"
        aria-labelledby="size-label"
        className="flex items-center flex-wrap lg:space-x-3"
      >
        {["Small", "Medium", "Large", "X-Large"].map((size) => (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={sizeSelection === size}
            className={cn([
              "bg-[#F0F0F0] flex items-center justify-center px-5 lg:px-6 py-2.5 lg:py-3 text-sm lg:text-base rounded-full m-1 lg:m-0 max-h-[46px] border border-black/20 hover:bg-black/10",
              sizeSelection === size && "bg-black font-medium text-white hover:bg-black",
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
