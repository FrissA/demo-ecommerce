"use client";

import { setSizeSelection } from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import React from "react";
import { track } from "@/lib/analytics";

const SizeSelection = ({ productId }: { productId: number }) => {
  const { sizeSelection, sizeError } = useAppSelector(
    (state: RootState) => state.products
  );
  const dispatch = useAppDispatch();

  return (
    <div
      id="size-selection"
      role="radiogroup"
      aria-labelledby="size-selection-label"
      aria-describedby={sizeError ? "size-selection-error" : undefined}
      aria-invalid={sizeError}
      tabIndex={-1}
      className={cn([
        "flex flex-col rounded-2xl outline-none transition-all",
        sizeError && "ring-2 ring-red-600 ring-offset-4",
      ])}
    >
      <span
        id="size-selection-label"
        className="text-sm sm:text-base text-black/60 mb-4"
      >
        Choose Size
      </span>
      {/* Sizes are always visible so they work on touch screens */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {["Small", "Medium", "Large", "X-Large"].map((size) => (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={sizeSelection === size}
            className={cn([
              "bg-[#F0F0F0] px-5 py-2.5 text-sm lg:text-base rounded-full whitespace-nowrap",
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
      {sizeError && (
        <span
          id="size-selection-error"
          role="alert"
          className="mt-3 text-sm sm:text-base font-medium text-red-600"
        >
          Select a size to add this item to your cart.
        </span>
      )}
    </div>
  );
};

export default SizeSelection;
