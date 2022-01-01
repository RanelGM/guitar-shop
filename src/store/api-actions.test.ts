import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { State } from 'types/state';
import { Guitar, GuitarType } from 'types/product';
import { createAPI } from 'api/api';
import { loadProductAction, loadSearchSimilarAction, loadFilteredGuitarsAction, parseStateToPath } from './api-actions';
import { setDefaultProductData, setGuitarsToRender, setGuitarsTotalCount, setGuitarType, setIsServerError, setPriceRangeFrom, setPriceRangeTo, setSearchSimilar } from './action';
import { getGuitarMock } from 'utils/mocks';
import { APIRoute, APIQuery, AppRoute, MAX_CARD_ON_PAGE_COUNT, INDEX_ADJUSTMENT_VALUE, GuitarGroup, SortGroup, INITIAL_CATALOG_PAGE } from 'utils/const';
import { sortGuitarsByPrice } from 'utils/utils';
import { NameSpace } from './root-reducer';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const fakeHistory = {
  location: { pathname: '' },
  push(path: string) {
    this.location.pathname = path;
  },
};

jest.mock('./browser-history', () => fakeHistory);

const getState = (guitars: Guitar[], page: number, isFrom?: boolean, isTo?: boolean, types?: GuitarType[]) => {
  const priceFrom = isFrom ? sortGuitarsByPrice(guitars, SortGroup.Ascending.type)[0].price : '';
  const priceTo = isTo ? sortGuitarsByPrice(guitars, SortGroup.Descending.type)[0].price : '';
  const guitarTypes = types || null;

  return ({
    [NameSpace.order]: {},
    [NameSpace.product]: {},
    [NameSpace.query]: {
      sortType: null,
      orderType: null,
      priceRangeFrom: priceFrom.toString(),
      priceRangeTo: priceTo.toString(),
      guitarType: guitarTypes,
      currentPage: page,
      isServerError: false,
    },
  });
};

describe('Async actions', () => {
  const GuitarEmbedWithComment = `${APIRoute.Guitar}?${APIQuery.EmbedComment}`;

  const defaultGuitars = Array.from({ length: 18 }, () => getGuitarMock());
  let page = 2;

  const maxPageCount = Math.ceil(defaultGuitars.length / MAX_CARD_ON_PAGE_COUNT);

  if (isNaN(page) || page < INITIAL_CATALOG_PAGE || page > maxPageCount) {
    page = INITIAL_CATALOG_PAGE;
  }

  const totalCount = defaultGuitars.length;
  const sliceFrom = MAX_CARD_ON_PAGE_COUNT * (page - INDEX_ADJUSTMENT_VALUE);
  const guitarsToRender = defaultGuitars.slice(sliceFrom, MAX_CARD_ON_PAGE_COUNT);

  const headers = {
    [APIQuery.TotalCount]: totalCount,
  };

  it(`should setGuitarsTotalCount with totalCount, dispatch loadProductData with defaultGuitars
       and dispatch setGuitarsToRender with guitarsToRender sliced by maxGuitarToRenderCount`, async () => {
    const state = getState(defaultGuitars, page);
    const queryState = state[NameSpace.query];
    const store = mockStore(state);
    const { path } = parseStateToPath(queryState, true);

    fakeHistory.push(`${AppRoute.Catalog}/${page}`);

    mockAPI
      .onGet(GuitarEmbedWithComment)
      .reply(200, defaultGuitars);

    mockAPI
      .onGet(path)
      .reply(200, guitarsToRender, headers);

    await (store.dispatch(loadProductAction()));

    expect(store.getActions()).toEqual([
      setGuitarsTotalCount(totalCount),
      setDefaultProductData(defaultGuitars),
      setGuitarsToRender(guitarsToRender),
    ]);
  });

  it(`should setGuitarsTotalCount with totalCount, dispatch loadProductData with defaultGuitars,
       dispatch setGuitarsToRender with guitarsToRender sliced by maxGuitarToRenderCount and dispatch filter params`, async () => {
    const types = [GuitarGroup.Acoustic.type, GuitarGroup.Electric.type];
    const state = getState(defaultGuitars, page, true, true, types);
    const queryState = state[NameSpace.query];
    const store = mockStore(state);
    const { priceRangeFrom, priceRangeTo } = queryState;
    const { path } = parseStateToPath(queryState);

    fakeHistory.push(`${AppRoute.Catalog}/${path}`);

    mockAPI
      .onGet(GuitarEmbedWithComment)
      .reply(200, defaultGuitars);

    mockAPI
      .onGet(path)
      .reply(200, guitarsToRender, headers);

    await (store.dispatch(loadProductAction()));

    expect(store.getActions()).toEqual([
      setPriceRangeFrom(priceRangeFrom),
      setPriceRangeTo(priceRangeTo),
      setGuitarType(types),
      setGuitarsTotalCount(totalCount),
      setDefaultProductData(defaultGuitars),
      setGuitarsToRender(guitarsToRender),
    ]);
  });

  it('should dispatch setSearchSimilar when using loadSearchSimilarAction', async () => {
    const store = mockStore();
    const inputValue = 'random value';
    const guitars = [getGuitarMock(), getGuitarMock(), getGuitarMock()];

    mockAPI
      .onGet(`${APIRoute.Guitar}?${APIQuery.Similar}=${inputValue}`)
      .reply(200, guitars);

    expect(store.getActions()).toEqual([]);

    await (store.dispatch(loadSearchSimilarAction(inputValue)));

    expect(store.getActions()).toEqual([
      setSearchSimilar(guitars),
    ]);
  });

  it(`should dispatch setGuitarsTotalCount with totalCount and setGuitarsToRender with guitarsToRender when loadFilteredGuitarsAction
      and server response is OK, also should redirect to initial page`, async () => {
    const state = getState(defaultGuitars, page);
    const queryState = state[NameSpace.query];
    const store = mockStore(state);
    const { path } = parseStateToPath(queryState);

    mockAPI
      .onGet(path)
      .reply(200, guitarsToRender, headers);

    expect(store.getActions()).toEqual([]);

    await (store.dispatch(loadFilteredGuitarsAction()));

    expect(fakeHistory.location.pathname).toEqual(`${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`);

    expect(store.getActions()).toEqual([
      setGuitarsTotalCount(totalCount),
      setGuitarsToRender(guitarsToRender),
    ]);
  });

  it(`should dispatch setGuitarsTotalCount with totalCount and setGuitarsToRender with guitarsToRender when loadFilteredGuitarsAction
  and dispatch filter params and server response is OK, also should redirect to initial page`, async () => {
    const types = [GuitarGroup.Acoustic.type, GuitarGroup.Ukulele.type, GuitarGroup.Electric.type];
    const state = getState(defaultGuitars, page, true, true, types);
    const queryState = state[NameSpace.query];
    const store = mockStore(state);

    const { path } = parseStateToPath(queryState);

    mockAPI
      .onGet(path)
      .reply(200, guitarsToRender, headers);

    expect(store.getActions()).toEqual([]);

    await (store.dispatch(loadFilteredGuitarsAction()));

    expect(fakeHistory.location.pathname).toEqual(`${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`);

    expect(store.getActions()).toEqual([
      setGuitarsTotalCount(totalCount),
      setGuitarsToRender(guitarsToRender),
    ]);
  });

  it(`should dispatch setIsServerError when loadFilteredGuitarsAction
      and server response is NOT OK`, async () => {
    const state = getState(defaultGuitars, page);
    const queryState = state[NameSpace.query];
    const store = mockStore(state);
    const { path } = parseStateToPath(queryState);

    mockAPI
      .onGet(path)
      .reply(500, guitarsToRender, headers);

    expect(store.getActions()).toEqual([]);

    await (store.dispatch(loadFilteredGuitarsAction()));

    expect(store.getActions()).toEqual([
      setIsServerError(true),
    ]);
  });
});
