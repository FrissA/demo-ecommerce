import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Color = {
  name: string;
  code: string;
};

// Define a type for the slice state
interface ProductsState {
  colorSelection: Color;
  sizeSelection: string;
  // Set when Add to Cart is tapped without a size; cleared on size pick
  sizeError: boolean;
}

// Define the initial state using that type
const initialState: ProductsState = {
  colorSelection: {
    name: "Brown",
    code: "bg-[#4F4631]",
  },
  sizeSelection: "",
  sizeError: false,
};

export const productsSlice = createSlice({
  name: "products",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setColorSelection: (state, action: PayloadAction<Color>) => {
      state.colorSelection = action.payload;
    },
    setSizeSelection: (state, action: PayloadAction<string>) => {
      state.sizeSelection = action.payload;
      state.sizeError = false;
    },
    setSizeError: (state, action: PayloadAction<boolean>) => {
      state.sizeError = action.payload;
    },
  },
});

export const { setColorSelection, setSizeSelection, setSizeError } =
  productsSlice.actions;

export default productsSlice.reducer;
