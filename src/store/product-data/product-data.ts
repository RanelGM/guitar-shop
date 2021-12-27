import { createReducer } from '@reduxjs/toolkit';
import { ProductDataState } from 'types/state';
import { loadProductData, setGuitarsFiltered, setGuitarsToRender, setSearchSimilar } from '../action';

export const initialState: ProductDataState = {
  defaultServerGuitars: null,
  guitarsFiltered: null,
  guitarsToRender: null,
  similarAtSearch: null,
};

const productData = createReducer(initialState, (builder) => {
  builder
    .addCase(loadProductData, (state, action) => {
      state.defaultServerGuitars = action.payload;
    })
    .addCase(setGuitarsFiltered, (state, action) => {
      state.guitarsFiltered = action.payload;
    })
    .addCase(setGuitarsToRender, (state, action) => {
      state.guitarsToRender = action.payload;
    })
    .addCase(setSearchSimilar, (state, action) => {
      state.similarAtSearch = action.payload;
    });
});

export default productData;
