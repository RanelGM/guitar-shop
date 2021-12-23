import { State } from 'types/state';
import { Guitar } from 'types/product';
import { NameSpace } from 'store/root-reducer';

export const getDefaultServerGuitars = (state: State): Guitar[] | null => state[NameSpace.product].defaultServerGuitars;
export const getGuitars = (state: State): Guitar[] | null => state[NameSpace.product].guitars;
export const getSimilarAtSearch = (state: State): Guitar[] | null => state[NameSpace.product].similarAtSearch;
