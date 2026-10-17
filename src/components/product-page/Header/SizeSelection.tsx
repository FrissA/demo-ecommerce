"use client";

import { setSizeSelection } from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import React from "react";
import { FaChevronDown } from "react-icons/fa6";
import { track } from "@/lib/analytics";

const SizeSelection = ({ productId }: { productId: number }) => {
  const { sizeSelection } = useAppSelector(
    (state: RootState) => state.products
  );
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col">
      <span className="text-sm sm:text-base text-black/60 mb-4">
        Choose Size
      </span>
      {/* Sizes open on hover */}
      <div className="group relative w-fit">
        <div className="flex items-center gap-3 bg-[#F0F0F0] px-5 py-2.5 rounded-full text-sm lg:text-base cursor-default">
          {sizeSelection || "Size"}
          <FaChevronDown className="text-xs" />
        </div>
        <div className="absolute left-0 top-full z-20 hidden pt-2 group-hover:flex">
          <div className="flex gap-2 rounded-2xl bg-white p-2 shadow-lg border border-black/10">
            {["Small", "Medium", "Large", "X-Large"].map((size) => (
              <button
                key={size}
                type="button"
                className={cn([
                  "bg-[#F0F0F0] px-4 py-2 text-sm rounded-full whitespace-nowrap",
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
      </div>
    </div>
  );
};

export default SizeSelection;
