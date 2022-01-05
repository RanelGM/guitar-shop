import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';

import { State } from 'types/state';
import Header from './header';
import { NameSpace } from 'store/root-reducer';

const mockStore = configureMockStore<State, Action, ThunkDispatch<State, undefined, Action>>();

const store = mockStore({
  [NameSpace.product]: {
    similarAtSearch: [],
  },
  [NameSpace.order]: {
    cart: null,
  },
});

const getHeaderMock = (isMainPage: boolean) => (
  <Provider store={store}>
    <Router>
      <Header isMainPage={isMainPage} />
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

  it('should render Header component on Main Page with Link component as NOT link', () => {
    const isMainPage = true;
    const headerMockComponent = getHeaderMock(isMainPage);

    render(headerMockComponent);

    const logo = screen.getByTestId('logo');

    expect(logo).toBeInTheDocument();
    expect(logo.tagName === 'A').toBe(false);
  });

  it('should render Header component on Main Page with Link component as link', () => {
    const isMainPage = false;
    const headerMockComponent = getHeaderMock(isMainPage);

    render(headerMockComponent);

    const logo = screen.getByTestId('logo');

    expect(logo).toBeInTheDocument();
    expect(logo.tagName === 'A').toBe(true);
  });
});
