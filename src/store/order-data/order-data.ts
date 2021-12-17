import { createReducer } from '@reduxjs/toolkit';
import { OrderDataState } from 'types/state';
import { setCart } from '../action';

const initialState: OrderDataState = {
  cart: null,
};

const OrderData = createReducer(initialState, (builder) => {
  builder
    .addCase(setCart, (state, action) => {
      state.cart = action.payload;
    });
});

export default OrderData;
