"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { Product } from "@/types/product.types";
import React, { useState } from "react";

const AddToCartBtn = ({ data }: { data: Product & { quantity: number } }) => {
  const dispatch = useAppDispatch();
  const { sizeSelection, colorSelection } = useAppSelector(
    (state: RootState) => state.products,
  );
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full ml-3 sm:ml-5">
      {error && !sizeSelection && (
        <span className="absolute -top-6 left-0 text-sm text-red-600">
          Please select a size
        </span>
      )}
      <button
        type="button"
        className="bg-black w-full rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all"
        onClick={() => {
          if (!sizeSelection) {
            setError(true);
            return;
          }
          dispatch(
            addToCart({
              id: data.id,
              name: data.title,
              srcUrl: data.srcUrl,
              price: data.price,
              attributes: [sizeSelection, colorSelection.name],
              discount: data.discount,
              quantity: data.quantity,
            }),
          );
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCartBtn;
