import { Guitar, SortType, GuitarType } from './product';
import { RootState } from 'store/root-reducer';

export type ProductDataState = {
  defaultServerGuitars: Guitar[] | [],
  guitarsTotalCount: number,
  guitarsToRender: Guitar[] | [],
  similarAtSearch: Guitar[] | [],
}

export type OrderDataState = {
  cart: Guitar[] | null,
}

export type QueryDataState = {
  sortType: SortType | null,
  orderType: SortType | null,
  priceRangeFrom: string,
  priceRangeTo: string,
  guitarType: GuitarType[] | null,
  currentPage: number,
  isServerError: boolean,
}

export type State = RootState;
