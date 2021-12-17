import { combineReducers } from 'redux';
import ProductData from './product-data/product-data';
import OrderData from './order-data/order-data';

export enum NameSpace {
  product = 'PRODUCT',
  order = 'ORDER',
}

export const rootReducer = combineReducers({
  [NameSpace.product]: ProductData,
  [NameSpace.order]: OrderData,
});

export type RootState = ReturnType<typeof rootReducer>
