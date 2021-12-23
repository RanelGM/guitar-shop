import { createReducer } from '@reduxjs/toolkit';
import { QueryDataState } from 'types/state';
import { setSortType, setOrderType, setPriceRangeFrom, setPriceRangeTo, setGuitarType } from 'store/action';

const initialState: QueryDataState = {
  sortType: null,
  orderType: null,
  priceRangeFrom: '',
  priceRangeTo: '',
  guitarType: null,
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
    });
});

export default QueryData;
