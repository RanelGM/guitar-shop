import { ThunkActionResult } from 'types/action';
import { Guitar } from 'types/product';
import { store } from 'index';
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

export const loadFilteredGuitarsAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const queryState = store.getState().QUERY;

    const priceFrom = queryState.priceRangeFrom ? `&${APIQuery.PriceFrom}=${queryState.priceRangeFrom}` : '';
    const priceTo = queryState.priceRangeTo ? `&${APIQuery.PriceTo}=${queryState.priceRangeTo}` : '';
    let sort = queryState.sortType ? `&${APIQuery.Sort}=${queryState.sortType}` : `&${APIQuery.Sort}=${DEFAULT_SORT_TYPE}`;
    let order = queryState.orderType ? `&${APIQuery.Order}=${queryState.orderType}` : `&${APIQuery.Order}=${DEFAULT_SORT_ORDER}`;

    if (!queryState.sortType && !queryState.orderType) {
      sort = '';
      order = '';
    }

    const path = GuitarEmbedWithComment + sort + order + priceFrom + priceTo;

    const { data } = await api.get<Guitar[]>(path);

    dispatch(setGuitars(data));
  };
