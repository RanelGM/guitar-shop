import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { render, screen } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import App from './app';
import { createAPI } from 'api/api';
import { getGuitarMock } from 'utils/mocks';
import { DEFAULT_SORT_TYPE, DEFAULT_SORT_ORDER, SortGroup, INITIAL_CATALOG_PAGE, AppRoute, APIQuery, APIRoute } from 'utils/const';
import { sortGuitarsByPrice } from 'utils/utils';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const expandedGuitar = getGuitarMock();
const guitars = [getGuitarMock(), getGuitarMock(), getGuitarMock(), expandedGuitar];
const types = guitars.map((guitar) => guitar.type);

const store = mockStore({
  PRODUCT: {
    defaultServerGuitars: guitars,
    guitarsTotalCount: guitars.length,
    guitarsToRender: guitars,
    similarAtSearch: [],
    expandedGuitar: expandedGuitar,
  },
  ORDER: {
    cart: null,
  },
  QUERY: {
    sortType: DEFAULT_SORT_TYPE,
    orderType: DEFAULT_SORT_ORDER,
    priceRangeFrom: `${sortGuitarsByPrice(guitars, SortGroup.Ascending.type)[0].price}`,
    priceRangeTo: `${sortGuitarsByPrice(guitars, SortGroup.Descending.type)[0].price}`,
    guitarType: types,
    stringCount: null,
    currentPage: INITIAL_CATALOG_PAGE,
    isServerError: false,
  },
});

const history = createMemoryHistory();

const fakeHistory = {
  location: { pathname: '' },
  push(path: string) {
    this.location.pathname = path;
  },
};

jest.mock('store/browser-history', () => fakeHistory);

const mockApp = (
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
);

const path = '/guitars?_embed=comments';
const slicedPath = `${path}&_start=0&_limit=9`;

const headers = {
  [APIQuery.TotalCount]: guitars.length,
};

describe('Application routing', () => {
  it('should redirect to Catalog when route is /', async () => {
    mockAPI
      .onGet(path)
      .reply(200, guitars);

    mockAPI
      .onGet(slicedPath)
      .reply(200, guitars, headers);

    render(mockApp);

    await screen.findByText(/Каталог гитар/i);
    await screen.findByText(/Фильтр/i);
    await screen.findByText(/Сортировать/i);
  });

  it('should render Catalog Screen when route is /catalog/:id', async () => {
    mockAPI
      .onGet(path)
      .reply(200, guitars);

    mockAPI
      .onGet(slicedPath)
      .reply(200, guitars, headers);

    history.push(`${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`);
    render(mockApp);

    await screen.findByText(/Каталог гитар/i);
    expect(screen.getByText(/Фильтр/i)).toBeInTheDocument();
    expect(screen.getByText(/Сортировать/i)).toBeInTheDocument();
  });

  it('should render Product Screen when route is /product/:id', async () => {
    const { id } = expandedGuitar;

    mockAPI
      .onGet(`${APIRoute.Guitar}/${id}?${APIQuery.EmbedComment}`)
      .reply(200, expandedGuitar);

    fakeHistory.push(`${AppRoute.Product}/${id}`);
    history.push(`${AppRoute.Product}/${id}`);

    render(mockApp);

    expect(screen.getByText(/Товар/i)).toBeInTheDocument();
    await screen.findByText(/Отзывы/i);
    expect(screen.getByText(/Характеристики/i)).toBeInTheDocument();
    expect(screen.getByText(expandedGuitar.vendorCode)).toBeInTheDocument();
  });

  it('should render Cart Screen when route is /cart', () => {
    history.push(AppRoute.Cart);
    render(mockApp);

    expect(screen.getAllByText(/Корзина/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Корзина пуста./i)).toBeInTheDocument();
    expect(screen.getByText(/Воспользуйтесь каталогом, чтобы найти нужный товар./i)).toBeInTheDocument();
  });

  it('should render Not Found Screen when route is unknown', () => {
    history.push('unknown');
    render(mockApp);

    expect(screen.getByText(/Запрашиваемая страница не найдена/i)).toBeInTheDocument();
    expect(screen.getByText(/Вернуться на главную/i)).toBeInTheDocument();
  });
});
