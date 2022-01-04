import { Action, Store } from 'redux';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import FilterPrice from './filter-price';
import { createAPI } from 'api/api';
import { setPriceRangeFrom, setPriceRangeTo } from 'store/action';
import { NameSpace } from 'store/root-reducer';
import { sortGuitarsByPrice } from 'utils/utils';
import { SortGroup } from 'utils/const';
import { getGuitarMock } from 'utils/mocks';

const guitars = Array.from({ length: 5 }, () => getGuitarMock());
const minAvailablePrice = sortGuitarsByPrice(guitars, SortGroup.Ascending.type)[0].price;
const maxAvailablePrice = sortGuitarsByPrice(guitars, SortGroup.Descending.type)[0].price;

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const getStore = (from?: string, to?: string) => mockStore({
  [NameSpace.product]: {
    defaultServerGuitars: guitars,
  },
  [NameSpace.query]: {
    priceRangeFrom: from || minAvailablePrice.toString(),
    priceRangeTo: to || maxAvailablePrice.toString(),
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

const getFilterPriceMock = (store: Store) => (
  <Provider store={store}>
    <Router history={history}>
      <FilterPrice />
    </Router>
  </Provider>
);

describe('Filter Price Component', () => {
  it('should render component', () => {
    const store = getStore();
    const filterComponent = getFilterPriceMock(store);

    render(filterComponent);

    expect(screen.getByText(/Цена, ₽/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Минимальная цена/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Максимальная цена/i)).toBeInTheDocument();
  });

  it('should render min/max typed and dispatched to store value (dispatched values - doesn\'t go beyond  min/max available range)', () => {
    const randomNumber = 555;
    const minTypedValue = (minAvailablePrice + randomNumber).toString();
    const maxTypedValue = (maxAvailablePrice - randomNumber).toString();
    const store = getStore(minTypedValue, maxTypedValue);
    const filterComponent = getFilterPriceMock(store);

    render(filterComponent);

    expect(screen.getByDisplayValue(minTypedValue.toString())).toBeInTheDocument();
    expect(screen.getByDisplayValue(maxTypedValue.toString())).toBeInTheDocument();
    expect(screen.queryByDisplayValue(minAvailablePrice.toString())).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue(maxAvailablePrice.toString())).not.toBeInTheDocument();
  });

  it('should dispatch with min available value when typing value is lesser than available', () => {
    const minTypedValue = (minAvailablePrice - 1).toString();
    const store = getStore(minTypedValue);
    const filterComponent = getFilterPriceMock(store);

    render(filterComponent);

    const minPriceInput = screen.getByLabelText(/Минимальная цена/i);

    expect(store.getActions()).toEqual([]);

    fireEvent.blur(minPriceInput);

    expect(store.getActions()).toEqual([
      setPriceRangeFrom(minAvailablePrice.toString()),
      setPriceRangeTo(maxAvailablePrice.toString()),
    ]);
  });

  it('should dispatch with max available value when typing value is greater than available', () => {
    const maxTypedValue = (maxAvailablePrice + 1).toString();
    const store = getStore(undefined, maxTypedValue);
    const filterComponent = getFilterPriceMock(store);

    render(filterComponent);

    const maxPriceInput = screen.getByLabelText(/Максимальная цена/i);

    expect(store.getActions()).toEqual([]);

    fireEvent.blur(maxPriceInput);

    expect(store.getActions()).toEqual([
      setPriceRangeTo(maxAvailablePrice.toString()),
    ]);
  });
});

