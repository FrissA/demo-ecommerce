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
        id="size-selection-label"
        className="text-sm sm:text-base text-black/60 mb-4"
      >
        Choose Size:{" "}
        <span className="text-black">{sizeSelection || "none selected"}</span>
      </span>
      <div
        role="group"
        aria-labelledby="size-selection-label"
        className="flex items-center flex-wrap gap-3 lg:gap-4"
      >
        {["Small", "Medium", "Large", "X-Large"].map((size) => (
          <button
            key={size}
            type="button"
            aria-pressed={sizeSelection === size}
            className={cn([
              "bg-[#F0F0F0] text-black border border-black/20 px-5 lg:px-6 py-2.5 lg:py-3 text-sm lg:text-base rounded-full whitespace-nowrap hover:border-black",
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
