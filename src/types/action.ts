import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AxiosInstance } from 'axios';
import { State } from './state';

export enum ActionType {
  LoadProductData = 'product/loadProductData',
  SetSimilarAtSearch = 'product/setSimilarAtSearch',
  SetGuitarsTotalCount = 'product/setGuitarsTotalCount',
  SetGuitarsToRender = 'product/setGuitarsToRender',
  SetCart = 'order/setCart',
  SetSortType = 'query/setSortType',
  SetOrderType = 'query/setOrderType',
  SetPriceRangeFrom = 'query/setPriceRangeFrom',
  SetPriceRangeTo = 'query/setPriceRangeTo',
  SetGuitarType = 'query/setGuitarType',
  SetCurrentPage = 'query/setCurrentPage',
}

export type ThunkActionResult = ThunkAction<Promise<void>, State, AxiosInstance, Action>
export type ThunkActionDispatch = ThunkDispatch<State, AxiosInstance, Action>;
