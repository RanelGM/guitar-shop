import { combineReducers } from 'redux';
import ProductData from './product-data/product-data';
import OrderData from './order-data/order-data';
import QueryData from './query-data/query-data';

export enum NameSpace {
  product = 'PRODUCT',
  order = 'ORDER',
  query = 'QUERY',
}

export const rootReducer = combineReducers({
  [NameSpace.product]: ProductData,
  [NameSpace.order]: OrderData,
  [NameSpace.query]: QueryData,
});

export type RootState = ReturnType<typeof rootReducer>
