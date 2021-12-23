import { Guitar, SortType } from './product';
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
}

export type State = RootState;
