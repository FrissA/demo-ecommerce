"use client";

import { setColorSelection } from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { colorCode } from "@/lib/catalog";
import React, { useEffect } from "react";
import { IoMdCheckmark } from "react-icons/io";

const ColorSelection = ({ colors }: { colors: string[] }) => {
  const { colorSelection } = useAppSelector(
    (state: RootState) => state.products
  );
  const dispatch = useAppDispatch();
  const colorsData = colors.map((name) => ({ name, code: colorCode(name) }));

  // The selection is shared across products: fall back to this one's first color
  useEffect(() => {
    if (colors.length > 0 && !colors.includes(colorSelection.name)) {
      dispatch(setColorSelection({ name: colors[0], code: colorCode(colors[0]) }));
    }
  }, [colors, colorSelection.name, dispatch]);

  return (
    <div className="flex flex-col">
      <span className="text-sm sm:text-base text-black/60 mb-4">
        Select Colors: <span className="text-black">{colorSelection.name}</span>
      </span>
      <div className="flex items-center flex-wrap space-x-3 sm:space-x-4">
        {colorsData.map((color) => (
          <button
            key={color.name}
            type="button"
            aria-label={color.name}
            title={color.name}
            aria-pressed={colorSelection.name === color.name}
            className={cn([
              color.code,
              "rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center border border-black/20",
            ])}
            onClick={() => dispatch(setColorSelection(color))}
          >
            {colorSelection.name === color.name && (
              <IoMdCheckmark
                className={cn([
                  "text-base",
                  color.name === "White" ? "text-black" : "text-white",
                ])}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelection;
