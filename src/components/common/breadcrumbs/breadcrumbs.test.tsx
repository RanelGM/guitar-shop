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
import Breadcumbs from './breadcrumbs';
import { NameSpace } from 'store/root-reducer';
import { AppRoute, INITIAL_CATALOG_PAGE } from 'utils/const';

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

const mockBreadcumbs = (
  <Provider store={store}>
    <Router history={history}>
      <Breadcumbs />
    </Router>
  </Provider>
);

describe('Breadcrumbs Component', () => {
  it('should render component', () => {
    render(mockBreadcumbs);

    expect(screen.getByText(/Главная/i)).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    screen.getAllByRole('link').forEach((link) => expect(link).toBeInTheDocument());
  });

  it('should redirect to Home Page', () => {
    render(mockBreadcumbs);

    const linkElement = screen.getByText(/Главная/i);
    const initialPage = `${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`;
    const homePage = AppRoute.Home;

    history.push(`${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`);
    expect(history.location.pathname).toBe(initialPage);

    userEvent.click(linkElement);
    expect(history.location.pathname).toBe(homePage);
  });
});
