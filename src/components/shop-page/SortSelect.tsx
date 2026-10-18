"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SortSelect = ({ value }: { value: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex items-center">
      Sort by:{" "}
      <Select
        value={value}
        onValueChange={(sort) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("sort", sort);
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="most-popular">Most Popular</SelectItem>
          <SelectItem value="low-price">Low Price</SelectItem>
          <SelectItem value="high-price">High Price</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortSelect;
