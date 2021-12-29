import store from '../store';
import { QueryDataState, State } from 'types/state';
import { GuitarType, SortType } from 'types/product';
import { NameSpace } from 'store/root-reducer';

export const getSortType = (state: State): SortType | null => state[NameSpace.query].sortType;
export const getOrderType = (state: State): SortType | null => state[NameSpace.query].orderType;
export const getPriceRangeFrom = (state: State): string => state[NameSpace.query].priceRangeFrom;
export const getPriceRangeTo = (state: State): string => state[NameSpace.query].priceRangeTo;
export const getGuitarType = (state: State): GuitarType[] | null => state[NameSpace.query].guitarType;
export const getCurrentPage = (state: State): number => state[NameSpace.query].currentPage;
export const getIsServerError = (state: State): boolean => state[NameSpace.query].isServerError;
export const getQueryState = (): QueryDataState => store.getState()[NameSpace.query];
