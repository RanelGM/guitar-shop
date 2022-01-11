import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import App from './app';
import { createAPI } from 'api/api';
import { getGuitarMock } from 'utils/mocks';
import { DEFAULT_SORT_TYPE, DEFAULT_SORT_ORDER, SortGroup, INITIAL_CATALOG_PAGE, AppRoute } from 'utils/const';
import { sortGuitarsByPrice } from 'utils/utils';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const guitars = [getGuitarMock(), getGuitarMock(), getGuitarMock()];
const types = guitars.map((guitar) => guitar.type);

const store = mockStore({
  PRODUCT: {
    defaultServerGuitars: guitars,
    guitarsTotalCount: guitars.length,
    guitarsToRender: guitars,
    similarAtSearch: [],
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
  },
});

const history = createMemoryHistory();

const mockApp = (
  <Provider store={store}>
    <Router history={history}>
      <App isServerError={false} />
    </Router>
  </Provider>
);

describe('Application routing', () => {
  it('should render ErrorScreen component when data failed to load and isServerError = true', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <App isServerError />
        </Router>
      </Provider>,
    );

    expect(screen.getByText(/Возникла ошибка при загрузке данных с сервера/i)).toBeInTheDocument();
  });

  it('should redirect to Catalog when route is /', () => {
    render(mockApp);

    expect(screen.getByText(/Каталог гитар/i)).toBeInTheDocument();
    expect(screen.getByText(/Фильтр/i)).toBeInTheDocument();
    expect(screen.getByText(/Сортировать/i)).toBeInTheDocument();
  });

  it('should render Catalog Screen when route is /catalog/:id', () => {
    history.push(`${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`);
    render(mockApp);

    expect(screen.getByText(/Каталог гитар/i)).toBeInTheDocument();
    expect(screen.getByText(/Фильтр/i)).toBeInTheDocument();
    expect(screen.getByText(/Сортировать/i)).toBeInTheDocument();
  });

  it('should render Under Construction Screen when route is /product/:id', () => {
    const { id } = getGuitarMock();
    history.push(`${AppRoute.Product}/${id}`);
    render(mockApp);

    expect(screen.getByText(/Страница находится на этапе разработки/i)).toBeInTheDocument();
    expect(screen.getByText(/Реализация на следующем этапе/i)).toBeInTheDocument();
  });

  it('should render Under Construction Screen when route is /cart', () => {
    history.push(AppRoute.Cart);
    render(mockApp);

    expect(screen.getByText(/Страница находится на этапе разработки/i)).toBeInTheDocument();
    expect(screen.getByText(/Реализация на следующем этапе/i)).toBeInTheDocument();
  });

  it('should render Not Found Screen when route is unknown', () => {
    history.push('unknown');
    render(mockApp);

    expect(screen.getByText(/Запрашиваемая страница не найдена/i)).toBeInTheDocument();
    expect(screen.getByText(/Вернуться на главную/i)).toBeInTheDocument();
  });
});
