import { createReducer } from '@reduxjs/toolkit';
import { QueryDataState } from 'types/state';
import { setSortType, setOrderType } from 'store/action';

const initialState: QueryDataState = {
  sortType: null,
  orderType: null,
};

const QueryData = createReducer(initialState, (builder) => {
  builder
    .addCase(setSortType, (state, action) => {
      state.sortType = action.payload;
    })
    .addCase(setOrderType, (state, action) => {
      state.orderType = action.payload;
    });
});

export default QueryData;
