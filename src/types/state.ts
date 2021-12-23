import { Guitar } from './product';
import { RootState } from 'store/root-reducer';

export type ProductDataState = {
  defaultServerGuitars: Guitar[] | null,
  guitars: Guitar[] | null,
  similarAtSearch: Guitar[] | null,
}

export type OrderDataState = {
  cart: Guitar[] | null,
}

export type State = RootState;
