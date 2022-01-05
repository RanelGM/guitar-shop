import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action, Store } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import Sort from './sort';
import { setOrderType, setSortType } from 'store/action';
import { NameSpace } from 'store/root-reducer';
import { createAPI } from 'api/api';
import { DEFAULT_SORT_ORDER, DEFAULT_SORT_TYPE, SortGroup } from 'utils/const';
import { SortType } from 'types/product';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const history = createMemoryHistory();

const getStore = (orderType?: SortType, sortType?: SortType) => mockStore({
  [NameSpace.query]: {
    orderType: orderType || null,
    sortType: sortType || null,
  },
});

const getSortMock = (store: Store) => (
  <Provider store={store}>
    <Router history={history}>
      <Sort />
    </Router>
  </Provider>
);

describe('Sort component', () => {
  it('should render component', () => {
    const store = getStore();
    const sortComponent = getSortMock(store);

    render(sortComponent);

    expect(screen.getByText(/Сортировать:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(SortGroup.Ascending.label)).toBeInTheDocument();
    expect(screen.getByLabelText(SortGroup.Descending.label)).toBeInTheDocument();
    expect(screen.getByLabelText(SortGroup.Price.label)).toBeInTheDocument();
    expect(screen.getByLabelText(SortGroup.Rating.label)).toBeInTheDocument();
  });

  it('should render sort/order buttons as active if corresponding state is proveded', () => {
    const orderType = SortGroup.Descending.type;
    const sortType = SortGroup.Rating.type;
    const store = getStore(orderType, sortType);
    const sortComponent = getSortMock(store);

    render(sortComponent);

    const descendingButton = screen.getByLabelText(SortGroup.Descending.label);
    const ascendingButton = screen.getByLabelText(SortGroup.Ascending.label);
    const ratingButton = screen.getByLabelText(SortGroup.Rating.label);
    const priceButton = screen.getByLabelText(SortGroup.Price.label);

    expect(descendingButton.classList.contains('catalog-sort__order-button--active')).toBe(true);
    expect(descendingButton.tabIndex).toBe(-1);

    expect(ratingButton.classList.contains('catalog-sort__type-button--active')).toBe(true);
    expect(ratingButton.tabIndex).toBe(-1);

    expect(ascendingButton.classList.contains('catalog-sort__order-button--active')).toBe(false);
    expect(ascendingButton.tabIndex).toBe(0);

    expect(priceButton.classList.contains('catalog-sort__type-button--active')).toBe(false);
    expect(ascendingButton.tabIndex).toBe(0);
  });

  it('should dispatch sort type when clicking on appropriate button and default order type if it wasn\'t clicked before', () => {
    const store = getStore();
    const sortComponent = getSortMock(store);

    render(sortComponent);

    const priceBtn = screen.getByLabelText(SortGroup.Price.label);

    userEvent.click(priceBtn);

    expect(store.getActions()).toEqual([
      setSortType(SortGroup.Price.type),
      setOrderType(DEFAULT_SORT_ORDER),
    ]);
  });

  it('should dispatch order type when clicking on appropriate button and default sort type if it wasn\'t clicked before', () => {
    const store = getStore();
    const sortComponent = getSortMock(store);

    render(sortComponent);

    const deecendingBtn = screen.getByLabelText(SortGroup.Descending.label);

    userEvent.click(deecendingBtn);

    expect(store.getActions()).toEqual([
      setSortType(DEFAULT_SORT_TYPE),
      setOrderType(SortGroup.Descending.type),
    ]);
  });

  it(`should dispatch correct order and sort type when clicking on appropriate button
      and sort/order type was clicked before`, () => {
    const orderType = SortGroup.Ascending.type;
    const sortType = SortGroup.Rating.type;
    const store = getStore(orderType, sortType);
    const sortComponent = getSortMock(store);

    render(sortComponent);

    const deecendingBtn = screen.getByLabelText(SortGroup.Descending.label);

    userEvent.click(deecendingBtn);

    expect(store.getActions()).toEqual([
      setSortType(sortType),
      setOrderType(SortGroup.Descending.type),
    ]);
  });
});
