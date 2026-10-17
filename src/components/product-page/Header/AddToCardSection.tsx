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
    <div className="fixed md:relative w-full bg-white border-t md:border-none border-black/5 bottom-0 left-0 p-4 md:p-0 z-10 flex items-center justify-between sm:justify-start md:justify-center">
      <CartCounter onAdd={setQuantity} onRemove={setQuantity} />
      <AddToCartBtn data={{ ...data, quantity }} />
    </div>
  );
};

export default AddToCardSection;
