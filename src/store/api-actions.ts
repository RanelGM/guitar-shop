import { ThunkActionResult } from 'types/action';
import { Guitar, SortType } from 'types/product';
import { loadProductData, setSearchSimilar, setGuitars } from './action';
import { APIRoute, APIQuery, DEFAULT_SORT_ORDER, DEFAULT_SORT_TYPE } from 'utils/const';

const GuitarEmbedWithComment = `${APIRoute.Guitar}?${APIQuery.EmbedComment}`;

export const loadProductAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const { data } = await api.get<Guitar[]>(GuitarEmbedWithComment);

    dispatch(loadProductData(data));
  };

export const loadSearchSimilarAction = (inputValue: string): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const { data } = await api.get<Guitar[]>(`${APIRoute.Guitar}?${APIQuery.Similar}=${inputValue}`);

    dispatch(setSearchSimilar(data));
  };

export const loadSortedGuitarsAction = (type: SortType | null, order: SortType | null): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    type = type ? type : DEFAULT_SORT_TYPE;
    order = order ? order : DEFAULT_SORT_ORDER;

    const path = order
      ? `${GuitarEmbedWithComment}&${APIQuery.Sort}=${type}&${APIQuery.Order}=${order}`
      : `${GuitarEmbedWithComment}&${APIQuery.Sort}=${type}`;

    const { data } = await api.get<Guitar[]>(path);

    dispatch(setGuitars(data));
  };

export const loadFilteredByPriceGutarsAction = (from: string, to: string): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const pathFrom = from ? `&${APIQuery.PriceFrom}=${from}` : '';
    const pathTo = to ? `&${APIQuery.PriceTo}=${to}` : '';

    const path = `${GuitarEmbedWithComment}${pathFrom}${pathTo}`;

    const { data } = await api.get<Guitar[]>(path);

    dispatch(setGuitars(data));
  };
