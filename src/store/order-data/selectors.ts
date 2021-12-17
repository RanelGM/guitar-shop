import { State } from 'types/state';
import { Guitar } from 'types/guitar';
import { NameSpace } from 'store/root-reducer';

export const getCart = (state: State): Guitar[] | null => state[NameSpace.order].cart;
