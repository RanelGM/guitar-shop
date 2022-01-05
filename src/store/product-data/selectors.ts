import { State } from 'types/state';
import { Guitar } from 'types/product';
import { NameSpace } from 'store/root-reducer';

export const getDefaultServerGuitars = (state: State): Guitar[] | [] => state[NameSpace.product].defaultServerGuitars;
export const getGuitarsTotalCount = (state: State): number => state[NameSpace.product].guitarsTotalCount;
export const getGuitarsToRender = (state: State): Guitar[] | [] => state[NameSpace.product].guitarsToRender;
export const getSimilarAtSearch = (state: State): Guitar[] | [] => state[NameSpace.product].similarAtSearch;
