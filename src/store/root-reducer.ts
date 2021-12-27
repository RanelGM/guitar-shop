import { combineReducers } from 'redux';
import productData from './product-data/product-data';
import orderData from './order-data/order-data';
import queryData from './query-data/query-data';

export enum NameSpace {
  product = 'PRODUCT',
  order = 'ORDER',
  query = 'QUERY',
}

export const rootReducer = combineReducers({
  [NameSpace.product]: productData,
  [NameSpace.order]: orderData,
  [NameSpace.query]: queryData,
});

export type RootState = ReturnType<typeof rootReducer>
