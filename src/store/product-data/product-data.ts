import { createReducer } from '@reduxjs/toolkit';
import { ProductDataState } from 'types/state';
import { setDefaultProductData, setGuitarsTotalCount, setGuitarsToRender, setSearchSimilar, setIsUpdateLoaded, setExpandedGuitar } from '../action';
import { INITIAL_GUITAR_COUNT } from 'utils/const';

export const initialState: ProductDataState = {
  defaultServerGuitars: [],
  isUpdateLoaded: true,
  guitarsTotalCount: INITIAL_GUITAR_COUNT,
  guitarsToRender: [],
  similarAtSearch: [],
  expandedGuitar: null,
};

const productData = createReducer(initialState, (builder) => {
  builder
    .addCase(setDefaultProductData, (state, action) => {
      state.defaultServerGuitars = action.payload;
    })
    .addCase(setIsUpdateLoaded, (state, action) => {
      state.isUpdateLoaded = action.payload;
    })
    .addCase(setGuitarsTotalCount, (state, action) => {
      state.guitarsTotalCount = action.payload;
    })
    .addCase(setGuitarsToRender, (state, action) => {
      state.guitarsToRender = action.payload;
    })
    .addCase(setSearchSimilar, (state, action) => {
      state.similarAtSearch = action.payload;
    })
    .addCase(setExpandedGuitar, (state, action) => {
      state.expandedGuitar = action.payload;
    });
});

export default productData;
