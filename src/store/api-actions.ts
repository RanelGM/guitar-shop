import { ThunkActionDispatch, ThunkActionResult } from 'types/action';
import { Guitar, GuitarType } from 'types/product';
import { handleServerError } from 'index';
import browserHistory from './browser-history';
import { loadProductData, setSearchSimilar, setGuitarsToRender, setGuitarsTotalCount, setPriceRangeFrom, setPriceRangeTo, setGuitarType } from './action';
import { APIRoute, APIQuery, DEFAULT_SORT_ORDER, DEFAULT_SORT_TYPE, MAX_CARD_ON_PAGE_COUNT, INDEX_ADJUSTMENT_VALUE, AppRoute, INITIAL_CATALOG_PAGE } from 'utils/const';
import { getQueryState } from './query-data/selectors';
import { QueryDataState } from 'types/state';
import { getPageFromLocation, getQueryPath } from 'utils/utils';

const GuitarEmbedWithComment = `${APIRoute.Guitar}?${APIQuery.EmbedComment}`;

const reduceGuitarsTypesArray = (array: GuitarType[]): string => array.reduce((result, type) => {
  result += `&${APIQuery.GuitarType}=${type}`;
  return result;
}, '');

const redirectToRoute = (url: string) => {
  browserHistory.push(`${AppRoute.Catalog}/${url}`);
};

const parseStateToPath = (state: QueryDataState, isPagination?: boolean) => {
  const page = isPagination ? state.currentPage : INITIAL_CATALOG_PAGE;
  const priceFrom = state.priceRangeFrom ? `&${APIQuery.PriceFrom}=${state.priceRangeFrom}` : '';
  const priceTo = state.priceRangeTo ? `&${APIQuery.PriceTo}=${state.priceRangeTo}` : '';
  const guitarType = state.guitarType ? reduceGuitarsTypesArray(state.guitarType) : '';
  const diapasonFrom = `&${APIQuery.GuitarFrom}=${MAX_CARD_ON_PAGE_COUNT * (page - INDEX_ADJUSTMENT_VALUE)}`;
  const diapasonTo = `&${APIQuery.GuitarToLimit}=${MAX_CARD_ON_PAGE_COUNT}`;
  let sortType = state.sortType ? `&${APIQuery.Sort}=${state.sortType}` : `&${APIQuery.Sort}=${DEFAULT_SORT_TYPE}`;
  let orderType = state.orderType ? `&${APIQuery.Order}=${state.orderType}` : `&${APIQuery.Order}=${DEFAULT_SORT_ORDER}`;

  if (!state.sortType && !state.orderType) {
    sortType = '';
    orderType = '';
  }

  const path = GuitarEmbedWithComment + sortType + orderType + priceFrom + priceTo + guitarType + diapasonFrom + diapasonTo;
  const url = page + priceFrom + priceTo + guitarType;

  return { path, url };
};

const parsePathToState = (path: string, page: number, dispatch: ThunkActionDispatch) => {
  const queryState = getQueryState();
  const queryList = path.split('&');

  const priceRangeFrom = queryList.find((item) => item.includes(APIQuery.PriceFrom))?.split('=').pop();
  const priceRangeTo = queryList.find((item) => item.includes(APIQuery.PriceTo))?.split('=').pop();
  const types = queryList.reduce((result, item) => {
    if (item.includes(APIQuery.GuitarType)) {
      const type = item.split('=').pop() as GuitarType;
      result.push(type);
    }

    return result;
  }, [] as GuitarType[]) as GuitarType[] | null;

  if (priceRangeFrom) { dispatch(setPriceRangeFrom(priceRangeFrom)); }
  if (priceRangeTo) { dispatch(setPriceRangeTo(priceRangeTo)); }
  if (types) { dispatch(setGuitarType(types)); }

  return Object.assign(
    {},
    queryState,
    {
      priceRangeFrom,
      priceRangeTo,
      guitarType: types,
      currentPage: page,
    },
  );
};

export const loadProductAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const { data: defaultGuitars } = await api.get<Guitar[]>(GuitarEmbedWithComment);

    const maxPageCount = Math.ceil(defaultGuitars.length / MAX_CARD_ON_PAGE_COUNT);
    let page = getPageFromLocation();

    if (isNaN(page) || page < INITIAL_CATALOG_PAGE || page > maxPageCount) {
      page = INITIAL_CATALOG_PAGE;
    }

    const path = getQueryPath(page.toString()) as string;
    const state = parsePathToState(path, page, dispatch);
    const { path: pathWithDiapason } = parseStateToPath(state, true);

    const response = await api.get<Guitar[]>(pathWithDiapason);
    const { data: guitarsToRender } = response;
    const totalCount = Number(response.headers[APIQuery.TotalCount]);

    dispatch(setGuitarsTotalCount(totalCount));
    dispatch(loadProductData(defaultGuitars));
    dispatch(setGuitarsToRender(guitarsToRender));
  };

export const loadSearchSimilarAction = (inputValue: string): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const { data } = await api.get<Guitar[]>(`${APIRoute.Guitar}?${APIQuery.Similar}=${inputValue}`);

    dispatch(setSearchSimilar(data));
  };

export const loadFilteredGuitarsAction = (isPagination?: boolean): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const queryState = getQueryState();
    const { path, url } = parseStateToPath(queryState, isPagination);

    try {
      const response = await api.get<Guitar[]>(path);
      const { data } = response;
      const totalCount = Number(response.headers[APIQuery.TotalCount]);

      redirectToRoute(url);
      dispatch(setGuitarsTotalCount(totalCount));
      dispatch(setGuitarsToRender(data));
    }
    catch {
      handleServerError();
    }
  };
