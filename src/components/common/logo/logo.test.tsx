import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import { createAPI } from 'api/api';
import Logo from './logo';
import { AppRoute } from 'utils/const';
import { NameSpace } from 'store/root-reducer';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const store = mockStore({
  [NameSpace.query]: {
    priceRangeFrom: '',
    priceRangeTo: '',
    guitarType: null,
  },
});

const history = createMemoryHistory();

const getHeaderMock = (isMainPage: boolean) => (
  <Provider store={store}>
    <Router history={history}>
      <Logo isMainPage={isMainPage} />
    </Router>
  </Provider>
);

describe('Logo Component', () => {
  it('should render Logo component with Link Component as NOT link to Main Page', () => {
    const isMainPage = true;
    const headerMockComponent = getHeaderMock(isMainPage);

    render(headerMockComponent);

    const logo = screen.getByTestId('logo');

    expect(logo).toBeInTheDocument();
    expect(logo.tagName === 'A').toBe(false);
  });

  it('should render Logo component with Link Component as link to Main Page and lead to Main page after click', () => {
    const isMainPage = false;
    const headerMockComponent = getHeaderMock(isMainPage);
    history.push(AppRoute.Cart);

    render(headerMockComponent);

    const logo = screen.getByTestId('logo');

    expect(logo).toBeInTheDocument();
    expect(logo.tagName === 'A').toBe(true);

    userEvent.click(logo);

    expect(history.location.pathname).toBe(AppRoute.Home);
  });
});
