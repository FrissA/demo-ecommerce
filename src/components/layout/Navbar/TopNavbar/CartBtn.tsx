"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CartBtn = () => {
  const { cart } = useAppSelector((state: RootState) => state.carts);

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${cart?.totalQuantities ?? 0} items`}
      className="relative mr-[14px] flex items-center gap-1.5 min-h-11 min-w-11 px-2.5 rounded-full border border-black font-bold text-sm sm:text-base"
    >
      <Image
        priority
        src="/icons/cart.svg"
        height={100}
        width={100}
        alt=""
        className="max-w-[22px] max-h-[22px]"
      />
      <span>Cart</span>
      {cart && cart.totalQuantities > 0 && (
        <span className="bg-black text-white rounded-full min-w-5 px-1.5 text-xs leading-5 text-center">
          {cart.totalQuantities}
        </span>
      )}
    </Link>
  );
};

export default CartBtn;
