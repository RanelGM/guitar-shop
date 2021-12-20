import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AxiosInstance } from 'axios';
import { State } from './state';

export enum ActionType {
  LoadProductData = 'product/loadProductData',
  SetSimilarAtSearch = 'product/setSimilarAtSearch',
  SetGuitars = 'product/setGuitars',
  SetCart = 'order/setCart',
}

export type ThunkActionResult = ThunkAction<Promise<void>, State, AxiosInstance, Action>
export type ThunkActionDispatch = ThunkDispatch<State, AxiosInstance, Action>;
