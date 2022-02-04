import { createReducer } from '@reduxjs/toolkit';
import { OrderDataState } from 'types/state';
import { setCart, setDiscount } from '../action';
import { INITIAL_PROMOCODE_DISCOUNT } from 'utils/const';

export const initialState: OrderDataState = {
  cart: null,
  discount: INITIAL_PROMOCODE_DISCOUNT,
};

const orderData = createReducer(initialState, (builder) => {
  builder
    .addCase(setCart, (state, action) => {
      state.cart = action.payload;
    })
    .addCase(setDiscount, (state, action) => {
      state.discount = action.payload;
    });
});

export default orderData;
