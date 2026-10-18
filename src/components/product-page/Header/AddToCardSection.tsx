"use client";

import CartCounter from "@/components/ui/CartCounter";
import React, { useEffect, useState } from "react";
import AddToCartBtn from "./AddToCartBtn";
import { Product } from "@/types/product.types";
import { track } from "@/lib/analytics";

const AddToCardSection = ({ data }: { data: Product }) => {
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    track("product_viewed", {
      product_id: data.id,
      product_name: data.title,
      price: data.price,
    });
  }, [data.id, data.title, data.price]);

  return (
    // In the page flow (not a fixed bottom bar) so nothing overlaps the size
    // buttons or the button itself on mobile and at large text sizes
    <div className="relative mt-5 md:mt-0 w-full flex flex-wrap items-end gap-3 sm:gap-5">
      <CartCounter onAdd={setQuantity} onRemove={setQuantity} />
      <AddToCartBtn data={{ ...data, quantity }} />
    </div>
  );
};

export default AddToCardSection;
