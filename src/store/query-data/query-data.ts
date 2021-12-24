import { createReducer } from '@reduxjs/toolkit';
import { QueryDataState } from 'types/state';
import { setSortType, setOrderType, setPriceRangeFrom, setPriceRangeTo, setGuitarType, setCurrentPage } from 'store/action';
import { START_FROM_PAGE } from 'utils/const';

const initialState: QueryDataState = {
  sortType: null,
  orderType: null,
  priceRangeFrom: '',
  priceRangeTo: '',
  guitarType: null,
  currentPage: START_FROM_PAGE,
};

const QueryData = createReducer(initialState, (builder) => {
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
    .addCase(setCurrentPage, (state, action) => {
      state.currentPage = action.payload;
    });
});

export default QueryData;
