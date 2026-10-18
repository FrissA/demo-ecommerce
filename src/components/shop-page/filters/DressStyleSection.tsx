import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { STYLES } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const DressStyleSection = ({
  selected,
  linkWith,
}: {
  selected?: string;
  linkWith: (key: string, value: string) => string;
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="filter-style">
      <AccordionItem value="filter-style" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Dress Style
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-col text-black/60 space-y-0.5">
            {STYLES.map((dStyle) => (
              <Link
                key={dStyle.slug}
                href={linkWith("style", dStyle.slug)}
                aria-current={selected === dStyle.slug ? "page" : undefined}
                className={cn([
                  "flex items-center justify-between py-2",
                  selected === dStyle.slug && "font-bold text-black",
                ])}
              >
                {dStyle.title} <MdKeyboardArrowRight />
              </Link>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DressStyleSection;
