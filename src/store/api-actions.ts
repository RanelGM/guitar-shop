import { ThunkActionResult } from 'types/action';
import { Guitar, GuitarType } from 'types/product';
import { store } from 'index';
import browserHistory from './browser-history';
import { loadProductData, setSearchSimilar, setGuitarsToRender, setGuitarsFiltered } from './action';
import { APIRoute, APIQuery, DEFAULT_SORT_ORDER, DEFAULT_SORT_TYPE, MAX_CARD_ON_PAGE_COUNT, INDEX_ADJUSTMENT_VALUE, AppRoute, INITIAL_CATALOG_PAGE } from 'utils/const';

const GuitarEmbedWithComment = `${APIRoute.Guitar}?${APIQuery.EmbedComment}`;

const reduceGuitarsTypesArray = (array: GuitarType[]): string => array.reduce((result, type) => {
  result += `&${APIQuery.GuitarType}=${type}`;
  return result;
}, '');

const redirectToInitialPage = () => {
  browserHistory.push(`${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`);
};

export const loadProductAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const { data } = await api.get<Guitar[]>(GuitarEmbedWithComment);

    const maxPageCount = Math.ceil(data.length / MAX_CARD_ON_PAGE_COUNT);
    let page = Number(browserHistory.location.pathname.split('/').pop());

    if (isNaN(page) || page < INITIAL_CATALOG_PAGE || page > maxPageCount) {
      page = INITIAL_CATALOG_PAGE;
    }

    const guitarsToRender = data.slice(MAX_CARD_ON_PAGE_COUNT * (page - INDEX_ADJUSTMENT_VALUE), MAX_CARD_ON_PAGE_COUNT * page);

    dispatch(loadProductData(data));
    dispatch(setGuitarsFiltered(data));
    dispatch(setGuitarsToRender(guitarsToRender));
  };

export const loadSearchSimilarAction = (inputValue: string): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const { data } = await api.get<Guitar[]>(`${APIRoute.Guitar}?${APIQuery.Similar}=${inputValue}`);

    dispatch(setSearchSimilar(data));
  };

export const loadFilteredGuitarsAction = (isPagination?: boolean): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const queryState = store.getState().QUERY;

    const page = isPagination ? queryState.currentPage as number : INITIAL_CATALOG_PAGE;
    const priceFrom = queryState.priceRangeFrom ? `&${APIQuery.PriceFrom}=${queryState.priceRangeFrom}` : '';
    const priceTo = queryState.priceRangeTo ? `&${APIQuery.PriceTo}=${queryState.priceRangeTo}` : '';
    const guitarType = queryState.guitarType ? reduceGuitarsTypesArray(queryState.guitarType) : '';
    let sortType = queryState.sortType ? `&${APIQuery.Sort}=${queryState.sortType}` : `&${APIQuery.Sort}=${DEFAULT_SORT_TYPE}`;
    let orderType = queryState.orderType ? `&${APIQuery.Order}=${queryState.orderType}` : `&${APIQuery.Order}=${DEFAULT_SORT_ORDER}`;

    if (!queryState.sortType && !queryState.orderType) {
      sortType = '';
      orderType = '';
    }

    const path = GuitarEmbedWithComment + sortType + orderType + priceFrom + priceTo + guitarType;

    const { data } = await api.get<Guitar[]>(path);
    const guitarsToRender = data.slice(MAX_CARD_ON_PAGE_COUNT * (page - INDEX_ADJUSTMENT_VALUE), MAX_CARD_ON_PAGE_COUNT * page);

    dispatch(setGuitarsFiltered(data));
    dispatch(setGuitarsToRender(guitarsToRender));

    if (!isPagination && queryState.currentPage !== INITIAL_CATALOG_PAGE) {
      redirectToInitialPage();
    }
  };
