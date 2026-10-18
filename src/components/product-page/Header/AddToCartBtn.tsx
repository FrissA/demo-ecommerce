"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { Product } from "@/types/product.types";
import Link from "next/link";
import React, { useState } from "react";
import { track } from "@/lib/analytics";

const AddToCartBtn = ({ data }: { data: Product & { quantity: number } }) => {
  const dispatch = useAppDispatch();
  const { sizeSelection, colorSelection } = useAppSelector(
    (state: RootState) => state.products,
  );
  const [error, setError] = useState(false);
  const [added, setAdded] = useState<string | null>(null);

  return (
    <div className="flex flex-col flex-1 min-w-[200px]">
      {error && !sizeSelection && (
        <span
          role="alert"
          className="mb-2 text-sm sm:text-base font-medium text-red-700"
        >
          Select a size above before adding to cart
        </span>
      )}
      {added && (
        <div
          role="status"
          className="mb-2 flex flex-wrap items-center gap-x-3 text-sm sm:text-base font-medium text-green-800"
        >
          <span>Added to cart ({added})</span>
          <Link
            href="/cart"
            className="inline-flex min-h-11 items-center font-bold text-black underline"
          >
            View cart
          </Link>
        </div>
      )}
      <button
        type="button"
        className="bg-black w-full rounded-full min-h-[52px] px-4 py-3 text-base font-medium text-white hover:bg-black/80 transition-all"
        onClick={() => {
          track("add_to_cart_clicked", {
            product_id: data.id,
            has_size: !!sizeSelection,
          });
          if (!sizeSelection) {
            setAdded(null);
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
          setAdded(`${sizeSelection}, ${colorSelection.name}`);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCartBtn;
