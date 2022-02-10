import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';

import { State } from 'types/state';
import Header from './header';
import { NameSpace } from 'store/root-reducer';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { AppRoute, INITIAL_CATALOG_PAGE } from 'utils/const';

const history = createMemoryHistory();

const fakeHistory = {
  location: { pathname: '' },
  push(path: string) {
    this.location.pathname = path;
  },
};

jest.mock('store/browser-history', () => fakeHistory);

const mockStore = configureMockStore<State, Action, ThunkDispatch<State, undefined, Action>>();

const store = mockStore({
  [NameSpace.product]: {
    similarAtSearch: [],
  },
  [NameSpace.order]: {
    cart: null,
  },
});

const headerMockComponent = (
  <Provider store={store}>
    <Router history={history}>
      <Header />
    </Router>
  </Provider>
);

describe('Header Component', () => {
  afterEach(() => {
    expect(screen.getByText(/Каталог/i)).toBeInTheDocument();
    expect(screen.getByText(/Где купить?/i)).toBeInTheDocument();
    expect(screen.getByText(/О компании?/i)).toBeInTheDocument();

    expect(screen.getByText(/Перейти в корзину/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Поиск/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/что вы ищите?/i)).toBeInTheDocument();
  });

  it('should render Logo as Link if location is NOT Catalog Page', () => {
    const path = `${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`;
    fakeHistory.push(path);
    history.push(path);

    render(headerMockComponent);

    const logo = screen.getByTestId('logo');

    expect(logo).toBeInTheDocument();
    expect(logo.tagName === 'A').toBe(false);
  });

  it('should render Logo NOT as Link if location is NOT Catalog Page', () => {
    const path = AppRoute.Cart;
    fakeHistory.push(path);
    history.push(path);
    render(headerMockComponent);

    const logo = screen.getByTestId('logo');

    expect(logo).toBeInTheDocument();
    expect(logo.tagName === 'A').toBe(true);
  });

  it('should render Catalog link without redirect to Catalog Page (contains class link--current) if location is Catalog Page', () => {
    const path = `${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`;
    const classLink = 'link--current';

    fakeHistory.push(path);
    history.push(path);

    render(headerMockComponent);

    const catalogLink = screen.getByText(/Каталог/i);

    expect(catalogLink).toBeInTheDocument();
    expect(catalogLink.classList.contains(classLink)).toBe(true);

  });

  it('should render Catalog link WITH redirect to Catalog Page if location is NOT Catalog Page', () => {
    const path = AppRoute.Cart;
    const classLink = 'link--current';

    fakeHistory.push(path);
    history.push(path);

    render(headerMockComponent);

    const catalogLink = screen.getByText(/Каталог/i);

    expect(catalogLink).toBeInTheDocument();
    expect(catalogLink.classList.contains(classLink)).toBe(false);

    userEvent.click(catalogLink);
    expect(history.location.pathname).toBe(`${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`);
  });
});
