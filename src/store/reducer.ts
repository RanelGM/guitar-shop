import { createReducer } from '@reduxjs/toolkit';
import { State } from 'types/state';
import { loadProductData } from './action';

const initialState: State = {
  guitars: null,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadProductData, (state, action) => {
      state.guitars = action.payload;
    });
});

export default reducer;
