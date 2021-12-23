import { State } from 'types/state';
import { SortType } from 'types/product';
import { NameSpace } from 'store/root-reducer';

export const getSortType = (state: State): SortType | null => state[NameSpace.query].sortType;
export const getOrderType = (state: State): SortType | null => state[NameSpace.query].orderType;
export const getPriceRangeFrom = (state: State): string => state[NameSpace.query].priceRangeFrom;
export const getPriceRangeTo = (state: State): string => state[NameSpace.query].priceRangeTo;
