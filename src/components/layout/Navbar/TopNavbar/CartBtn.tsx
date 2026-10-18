"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CartBtn = () => {
  const { cart } = useAppSelector((state: RootState) => state.carts);
  const count = cart?.totalQuantities ?? 0;

  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
      className="flex items-center min-h-11 mr-2 sm:mr-3 px-2.5 sm:px-4 rounded-full border-2 border-black bg-white text-black font-bold text-base hover:bg-black hover:text-white transition-all"
    >
      <Image
        priority
        src="/icons/cart.svg"
        height={100}
        width={100}
        alt=""
        className="max-w-[22px] max-h-[22px]"
      />
      <span className="ml-2">Cart</span>
      {count > 0 && (
        <span className="ml-2 min-w-6 h-6 px-1.5 flex items-center justify-center rounded-full bg-black text-white text-sm">
          {count}
        </span>
      )}
    </Link>
  );
};

export default CartBtn;
