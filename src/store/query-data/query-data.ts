import { createReducer } from '@reduxjs/toolkit';
import { QueryDataState } from 'types/state';
import { setSortType, setOrderType, setPriceRangeFrom, setPriceRangeTo, setGuitarType, setCurrentPage, setIsServerError, setStringCount, setIsDataLoading } from 'store/action';
import { INITIAL_CATALOG_PAGE } from 'utils/const';

export const initialState: QueryDataState = {
  sortType: null,
  orderType: null,
  priceRangeFrom: '',
  priceRangeTo: '',
  guitarType: null,
  stringCount: null,
  currentPage: INITIAL_CATALOG_PAGE,
  isServerError: false,
  isDataLoading: false,
};

const queryData = createReducer(initialState, (builder) => {
  builder
    .addCase(setSortType, (state, action) => {
      state.sortType = action.payload;
    })
    .addCase(setOrderType, (state, action) => {
      state.orderType = action.payload;
    })
    .addCase(setPriceRangeFrom, (state, action) => {
      state.priceRangeFrom = action.payload;
    })
    .addCase(setPriceRangeTo, (state, action) => {
      state.priceRangeTo = action.payload;
    })
    .addCase(setGuitarType, (state, action) => {
      state.guitarType = action.payload;
    })
    .addCase(setStringCount, (state, action) => {
      state.stringCount = action.payload;
    })
    .addCase(setCurrentPage, (state, action) => {
      state.currentPage = action.payload;
    })
    .addCase(setIsServerError, (state, action) => {
      state.isServerError = action.payload;
    })
    .addCase(setIsDataLoading, (state, action) => {
      state.isDataLoading = action.payload;
    });
});

export default queryData;
