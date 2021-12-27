import { createReducer } from '@reduxjs/toolkit';
import { OrderDataState } from 'types/state';
import { setCart } from '../action';

export const initialState: OrderDataState = {
  cart: null,
};

const orderData = createReducer(initialState, (builder) => {
  builder
    .addCase(setCart, (state, action) => {
      state.cart = action.payload;
    });
});

export default orderData;
