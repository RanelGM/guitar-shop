import { createReducer } from '@reduxjs/toolkit';
import { ProductDataState } from 'types/state';
import { loadProductData } from '../action';

const initialState: ProductDataState = {
  guitars: null,
};

const ProductData = createReducer(initialState, (builder) => {
  builder
    .addCase(loadProductData, (state, action) => {
      state.guitars = action.payload;
    });
});

export default ProductData;
