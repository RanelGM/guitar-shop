import { ThunkActionResult } from 'types/action';
import { Guitar } from 'types/guitar';
import { loadProductData, setSearchSimilar, setGuitars } from './action';
import { APIRoute, SortType } from 'utils/const';

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

export const loadSortedGuitarsAction = (type: SortType | null, order: SortType | null): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    type = type ? type : SortType.Price;

    const path = order ? `${APIRoute.Guitars}?_sort=${type}&_order=${order}` : `${APIRoute.Guitars}?_sort=${type}`;
    const { data } = await api.get<Guitar[]>(path);

    dispatch(setGuitars(data));
  };
