import { createReducer } from '@reduxjs/toolkit';
import { ProductDataState } from 'types/state';
import { loadProductData, setSearchSimilar } from '../action';

const initialState: ProductDataState = {
  guitars: null,
  similarAtSearch: null,
};

const ProductData = createReducer(initialState, (builder) => {
  builder
    .addCase(loadProductData, (state, action) => {
      state.guitars = action.payload;
    })
    .addCase(setSearchSimilar, (state, action) => {
      state.similarAtSearch = action.payload;
    });
});

export default ProductData;
