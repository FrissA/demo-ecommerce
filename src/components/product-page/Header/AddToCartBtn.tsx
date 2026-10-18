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
  const [added, setAdded] = useState(false);

  return (
    <div className="relative w-full ml-3 sm:ml-5">
      {error && !sizeSelection && (
        <span
          role="alert"
          className="absolute -top-7 left-0 rounded-full bg-white px-2 text-sm font-medium text-red-700"
        >
          Select a size above first
        </span>
      )}
      {added && sizeSelection && (
        <span
          role="status"
          className="absolute -top-7 left-0 rounded-full bg-white px-2 text-sm font-medium text-green-700"
        >
          Added to cart.{" "}
          <Link href="/cart" className="text-black underline underline-offset-2">
            View cart
          </Link>
        </span>
      )}
      <button
        type="button"
        className="bg-black w-full rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all"
        onClick={() => {
          track("add_to_cart_clicked", {
            product_id: data.id,
            has_size: !!sizeSelection,
          });
          if (!sizeSelection) {
            setAdded(false);
            setError(true);
            document
              .getElementById("size-label")
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
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
          setAdded(true);
          track("product_added", {
            product_id: data.id,
            size: sizeSelection,
            color: colorSelection.name,
            quantity: data.quantity,
            price: data.price,
          });
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCartBtn;
