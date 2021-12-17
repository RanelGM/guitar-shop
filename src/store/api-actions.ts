import { ThunkActionResult } from 'types/action';
import { Guitar } from 'types/guitar';
import { loadProductData, setSearchSimilar } from './action';
import { APIRoute } from 'utils/const';

export const loadProductAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const { data } = await api.get<Guitar[]>(APIRoute.Guitars);

    dispatch(loadProductData(data));
  };

export const loadSearchSimilarAction = (inputValue: string): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const { data } = await api.get<Guitar[]>(`${APIRoute.SearchSimilar}=${inputValue}`);

    dispatch(setSearchSimilar(data));
  };
