import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AxiosInstance } from 'axios';
import { State } from './state';

export enum ActionType {
  LoadProductData = 'product/loadProductData',
}

export type ThunkActionResult = ThunkAction<Promise<void>, State, AxiosInstance, Action>
export type ThunkActionDispatch = ThunkDispatch<State, AxiosInstance, Action>;
