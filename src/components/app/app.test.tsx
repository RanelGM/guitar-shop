import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { act, render, screen } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import App from './app';
import { createAPI } from 'api/api';
import { getGuitarMock } from 'utils/mocks';
import { DEFAULT_SORT_TYPE, DEFAULT_SORT_ORDER, SortGroup, INITIAL_CATALOG_PAGE } from 'utils/const';
import { sortGuitarsByPrice } from 'utils/utils';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockAPI = new MockAdapter(api);
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const guitars = [getGuitarMock(), getGuitarMock(), getGuitarMock()];
const types = guitars.map((guitar) => guitar.type);

const store = mockStore({
  PRODUCT: {
    defaultServerGuitars: guitars,
    guitarsTotalCount: guitars.length,
    guitarsToRender: guitars,
    similarAtSearch: null,
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
    currentPage: INITIAL_CATALOG_PAGE,
  },
});

const history = createMemoryHistory();

const fakeHistory = {
  location: { pathname: '' },
  push(path: string) {
    this.location.pathname = path;
  },
};

jest.mock('../../store/browser-history', () => fakeHistory);

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
});
