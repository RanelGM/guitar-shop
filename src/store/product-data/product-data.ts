import { createReducer } from '@reduxjs/toolkit';
import { ProductDataState } from 'types/state';
import { setDefaultProductData, setGuitarsTotalCount, setGuitarsToRender, setSearchSimilar } from '../action';
import { INITIAL_GUITAR_COUNT } from 'utils/const';

export const initialState: ProductDataState = {
  defaultServerGuitars: [],
  guitarsTotalCount: INITIAL_GUITAR_COUNT,
  guitarsToRender: [],
  similarAtSearch: [],
};

const productData = createReducer(initialState, (builder) => {
  builder
    .addCase(setDefaultProductData, (state, action) => {
      state.defaultServerGuitars = action.payload;
    })
    .addCase(setGuitarsTotalCount, (state, action) => {
      state.guitarsTotalCount = action.payload;
    })
    .addCase(setGuitarsToRender, (state, action) => {
      state.guitarsToRender = action.payload;
    })
    .addCase(setSearchSimilar, (state, action) => {
      state.similarAtSearch = action.payload;
    });
});

export default productData;
