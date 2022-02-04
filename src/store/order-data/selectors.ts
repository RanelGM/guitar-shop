import { State } from 'types/state';
import { GuitarInCart } from 'types/product';
import { NameSpace } from 'store/root-reducer';

export const getCart = (state: State): GuitarInCart[] | null => state[NameSpace.order].cart;
export const getDiscount = (state: State): number => state[NameSpace.order].discount;
