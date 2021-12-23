import { Guitar, SortType, GuitarType } from './product';
import { RootState } from 'store/root-reducer';

export type ProductDataState = {
  defaultServerGuitars: Guitar[] | null,
  guitars: Guitar[] | null,
  similarAtSearch: Guitar[] | null,
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
}

export type State = RootState;
