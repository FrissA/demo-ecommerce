import Image from "next/image";
import InputGroup from "@/components/ui/input-group";

// A plain GET form: works before hydration and needs no client state
const ShopSearch = ({ defaultValue }: { defaultValue: string }) => {
  return (
    <form action="/shop" method="get" role="search" className="md:hidden">
      <InputGroup className="bg-[#F0F0F0]">
        <InputGroup.Text>
          <Image src="/icons/search.svg" height={20} width={20} alt="" className="min-w-5 min-h-5" />
        </InputGroup.Text>
        <InputGroup.Input
          type="search"
          name="q"
          id="shop-search"
          defaultValue={defaultValue}
          aria-label="Search for products"
          placeholder="Search for products..."
          className="bg-transparent placeholder:text-black/40"
        />
      </InputGroup>
    </form>
  );
};

export default ShopSearch;
