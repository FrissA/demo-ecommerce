"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { Product } from "@/types/product.types";
import React, { useState } from "react";
import { track } from "@/lib/analytics";
import Link from "next/link";

const AddToCartBtn = ({ data }: { data: Product & { quantity: number } }) => {
  const dispatch = useAppDispatch();
  const { sizeSelection, colorSelection } = useAppSelector(
    (state: RootState) => state.products,
  );
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <div className="relative w-full ml-3 sm:ml-5">
      {error && !sizeSelection && (
        <span
          role="alert"
          className="absolute -top-7 left-0 rounded-full bg-white px-2 text-sm font-medium text-red-700"
        >
          Please choose a size above first
        </span>
      )}
      <button
        type="button"
        className="bg-black w-full rounded-full h-12 md:h-[52px] text-base font-bold text-white hover:bg-black/80 transition-all"
        onClick={() => {
          track("add_to_cart_clicked", {
            product_id: data.id,
            has_size: !!sizeSelection,
          });
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
          track("product_added", {
            product_id: data.id,
            size: sizeSelection,
            color: colorSelection.name,
            quantity: data.quantity,
            price: data.price,
          });
          setAdded(true);
        }}
      >
        {added ? "Added to cart ✓" : "Add to Cart"}
      </button>
      {added && (
        <div role="status" className="mt-2">
          <span className="sr-only">Added to your cart.</span>
          <Link
            href="/cart"
            className="flex items-center justify-center w-full h-12 md:h-[52px] rounded-full border-2 border-black bg-white text-base font-bold text-black hover:bg-black hover:text-white transition-all"
          >
            View cart &amp; checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default AddToCartBtn;
