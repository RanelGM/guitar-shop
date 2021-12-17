import { Guitar } from './guitar';
import { RootState } from 'store/root-reducer';

export type ProductDataState = {
  guitars: Guitar[] | null,
}

export type OrderDataState = {
  cart: Guitar[] | null,
}

export type State = RootState;
