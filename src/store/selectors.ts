import { State } from 'types/state';
import { Guitar } from 'types/guitar';

export const getGuitars = (state: State): Guitar[] | null => state.guitars;
