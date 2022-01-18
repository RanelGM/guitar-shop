import { ThunkActionDispatch, ThunkActionResult } from 'types/action';
import { Guitar, GuitarType } from 'types/product';
import browserHistory from './browser-history';
import { setDefaultProductData, setSearchSimilar, setGuitarsToRender, setGuitarsTotalCount, setPriceRangeFrom, setPriceRangeTo, setGuitarType, setIsServerError, setIsUpdateLoaded, setStringCount, setExpandedGuitar } from './action';
import { APIRoute, APIQuery, DEFAULT_SORT_ORDER, DEFAULT_SORT_TYPE, MAX_CARD_ON_PAGE_COUNT, INDEX_ADJUSTMENT_VALUE, AppRoute, INITIAL_CATALOG_PAGE } from 'utils/const';
import { getQueryState } from './query-data/selectors';
import { QueryDataState } from 'types/state';
import { getPageFromLocation, getQueryPath, sortGuitarsByLetter } from 'utils/utils';

const GuitarEmbedWithComment = `${APIRoute.Guitar}?${APIQuery.EmbedComment}`;

const reduceGuitarsTypesArray = (array: GuitarType[]): string => array.reduce((result, type) => {
  result += `&${APIQuery.GuitarType}=${type}`;
  return result;
}, '');

const reduceStringsArray = (array: number[]): string => array.reduce((result, string) => {
  result += `&${APIQuery.StringCount}=${string}`;
  return result;
}, '');

const redirectToRoute = (url: string) => {
  browserHistory.push(`${AppRoute.Catalog}/${url}`);
};

export const parseStateToPath = (state: QueryDataState, isPagination?: boolean) => {
  const page = isPagination ? state.currentPage : INITIAL_CATALOG_PAGE;
  const priceFrom = state.priceRangeFrom ? `&${APIQuery.PriceFrom}=${state.priceRangeFrom}` : '';
  const priceTo = state.priceRangeTo ? `&${APIQuery.PriceTo}=${state.priceRangeTo}` : '';
  const guitarType = state.guitarType ? reduceGuitarsTypesArray(state.guitarType) : '';
  const stringCount = state.stringCount ? reduceStringsArray(state.stringCount) : '';
  const diapasonFrom = `&${APIQuery.GuitarFrom}=${MAX_CARD_ON_PAGE_COUNT * (page - INDEX_ADJUSTMENT_VALUE)}`;
  const diapasonTo = `&${APIQuery.GuitarToLimit}=${MAX_CARD_ON_PAGE_COUNT}`;
  let sortType = state.sortType ? `&${APIQuery.Sort}=${state.sortType}` : `&${APIQuery.Sort}=${DEFAULT_SORT_TYPE}`;
  let orderType = state.orderType ? `&${APIQuery.Order}=${state.orderType}` : `&${APIQuery.Order}=${DEFAULT_SORT_ORDER}`;

  if (!state.sortType && !state.orderType) {
    sortType = '';
    orderType = '';
  }

  const path = GuitarEmbedWithComment + sortType + orderType + priceFrom + priceTo + guitarType + stringCount + diapasonFrom + diapasonTo;
  const url = page + priceFrom + priceTo + guitarType + stringCount;

  return { path, url };
};

const parsePathToState = (path: string, page: number, dispatch: ThunkActionDispatch) => {
  const queryState = getQueryState();
  const queryList = path.split('&');

  const priceRangeFrom = queryList.find((item) => item.includes(APIQuery.PriceFrom))?.split('=').pop();
  const priceRangeTo = queryList.find((item) => item.includes(APIQuery.PriceTo))?.split('=').pop();

  const stringCount = queryList.reduce((result, item) => {
    if (item.includes(APIQuery.StringCount)) {
      const string = item.split('=').pop() as GuitarType;
      result.push(Number(string));
    }

    return result;
  }, [] as number[]) as number[];

  const types = queryList.reduce((result, item) => {
    if (item.includes(APIQuery.GuitarType)) {
      const type = item.split('=').pop() as GuitarType;
      result.push(type);
    }

    return result;
  }, [] as GuitarType[]) as GuitarType[];

  if (priceRangeFrom) { dispatch(setPriceRangeFrom(priceRangeFrom)); }
  if (priceRangeTo) { dispatch(setPriceRangeTo(priceRangeTo)); }
  if (stringCount.length > 0) { dispatch(setStringCount(stringCount)); }
  if (types.length > 0) { dispatch(setGuitarType(types)); }

  return Object.assign(
    {},
    queryState,
    {
      priceRangeFrom,
      priceRangeTo,
      stringCount,
      guitarType: types,
      currentPage: page,
    },
  );
};

export const loadProductAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const { data: defaultGuitars } = await api.get<Guitar[]>(GuitarEmbedWithComment);

    let maxPageCount = Math.ceil(defaultGuitars.length / MAX_CARD_ON_PAGE_COUNT);
    let page = getPageFromLocation();

    if (isNaN(page) || page < INITIAL_CATALOG_PAGE || page > maxPageCount) {
      page = INITIAL_CATALOG_PAGE;
    }

    const path = getQueryPath(page.toString()) as string;
    const state = parsePathToState(path, page, dispatch);
    const { path: pathWithDiapason } = parseStateToPath(state, true);

    let response = await api.get<Guitar[]>(pathWithDiapason);
    let { data: guitarsToRender } = response;
    const totalCount = Number(response.headers[APIQuery.TotalCount]);
    maxPageCount = Math.ceil(totalCount / MAX_CARD_ON_PAGE_COUNT);

    if (page > maxPageCount) {
      page = INITIAL_CATALOG_PAGE;
      const diapasonFrom = `&${APIQuery.GuitarFrom}=${0}`;
      const diapasonTo = `&${APIQuery.GuitarToLimit}=${MAX_CARD_ON_PAGE_COUNT}`;
      response = await api.get<Guitar[]>(`${GuitarEmbedWithComment}${path}${diapasonFrom}${diapasonTo}`);
      guitarsToRender = response.data;
    }

    dispatch(setGuitarsTotalCount(totalCount));
    dispatch(setDefaultProductData(defaultGuitars));
    dispatch(setGuitarsToRender(guitarsToRender));
  };

export const loadSearchSimilarAction = (inputValue: string): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const { data } = await api.get<Guitar[]>(`${APIRoute.Guitar}?${APIQuery.Similar}=${inputValue}`);

    const dataSortedByLetter = sortGuitarsByLetter(data, inputValue);

    dispatch(setSearchSimilar(dataSortedByLetter));
  };

export const loadFilteredGuitarsAction = (isPagination?: boolean): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const queryState = getQueryState();
    const { path, url } = parseStateToPath(queryState, isPagination);

    dispatch(setIsUpdateLoaded(false));

    try {
      const response = await api.get<Guitar[]>(path);
      const { data } = response;

      const totalCount = Number(response.headers[APIQuery.TotalCount]);

      redirectToRoute(url);
      dispatch(setGuitarsTotalCount(totalCount));
      dispatch(setGuitarsToRender(data));
      dispatch(setIsUpdateLoaded(true));
    }
    catch {
      dispatch(setIsServerError(true));
    }
  };

export const loadExpandedGuitarAction = (id: string | number): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    const { data } = await api.get<Guitar>(`${APIRoute.Guitar}/${id}?${APIQuery.EmbedComment}`);

    dispatch(setExpandedGuitar(data));
  };
