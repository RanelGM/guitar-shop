import { ThunkActionResult } from 'types/action';
import { Guitar, GuitarType } from 'types/product';
import { store } from 'index';
import { loadProductData, setSearchSimilar, setGuitars } from './action';
import { APIRoute, APIQuery, DEFAULT_SORT_ORDER, DEFAULT_SORT_TYPE, MAX_CARD_ON_PAGE_COUNT, INDEX_ADJUSTMENT_VALUE } from 'utils/const';

const GuitarEmbedWithComment = `${APIRoute.Guitar}?${APIQuery.EmbedComment}`;

const reduceGuitarsTypesArray = (array: GuitarType[]): string => array.reduce((result, type) => {
  result += `&${APIQuery.GuitarType}=${type}`;
  return result;
}, '');

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

    const page = queryState.currentPage as number;
    const guitarsFrom = `&${APIQuery.GuitarFrom}=${MAX_CARD_ON_PAGE_COUNT * (page - INDEX_ADJUSTMENT_VALUE)}`;
    const guitarsTo = `&${APIQuery.GuitarToLimit}=${MAX_CARD_ON_PAGE_COUNT}`;
    const priceFrom = queryState.priceRangeFrom ? `&${APIQuery.PriceFrom}=${queryState.priceRangeFrom}` : '';
    const priceTo = queryState.priceRangeTo ? `&${APIQuery.PriceTo}=${queryState.priceRangeTo}` : '';
    const guitarType = queryState.guitarType ? reduceGuitarsTypesArray(queryState.guitarType) : '';
    let sortType = queryState.sortType ? `&${APIQuery.Sort}=${queryState.sortType}` : `&${APIQuery.Sort}=${DEFAULT_SORT_TYPE}`;
    let orderType = queryState.orderType ? `&${APIQuery.Order}=${queryState.orderType}` : `&${APIQuery.Order}=${DEFAULT_SORT_ORDER}`;

    if (!queryState.sortType && !queryState.orderType) {
      sortType = '';
      orderType = '';
    }

    const path = GuitarEmbedWithComment + guitarsFrom + guitarsTo + sortType + orderType + priceFrom + priceTo + guitarType;

    const { data } = await api.get<Guitar[]>(path);

    dispatch(setGuitars(data));
  };
