import Link from "next/link";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { CATEGORIES } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const CategoriesSection = ({
  selected,
  linkWith,
}: {
  selected?: string;
  linkWith: (key: string, value: string) => string;
}) => {
  return (
    <div className="flex flex-col space-y-0.5 text-black/60">
      {CATEGORIES.map((category) => (
        <Link
          key={category.slug}
          href={linkWith("category", category.slug)}
          aria-current={selected === category.slug ? "page" : undefined}
          className={cn([
            "flex items-center justify-between py-2",
            selected === category.slug && "font-bold text-black",
          ])}
        >
          {category.title} <MdKeyboardArrowRight />
        </Link>
      ))}
    </div>
  );
};

export default CategoriesSection;
