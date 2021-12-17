import { ThunkActionResult } from 'types/action';
import { Guitar } from 'types/guitar';
import { loadProductData } from './action';
import { APIRoute } from 'utils/const';

export const loadProductAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const { data } = await api.get<Guitar[]>(APIRoute.Guitars);

    dispatch(loadProductData(data));
  };
