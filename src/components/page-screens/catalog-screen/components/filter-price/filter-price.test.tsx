import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import FilterPrice from './filter-price';
import store from 'store/store';
import { setDefaultProductData } from 'store/action';
import { NameSpace } from 'store/root-reducer';
import { sortGuitarsByPrice } from 'utils/utils';
import { SortGroup } from 'utils/const';
import { getGuitarMock } from 'utils/mocks';

const history = createMemoryHistory();

const fakeHistory = {
  location: { pathname: '' },
  push(path: string) {
    this.location.pathname = path;
  },
};

jest.mock('store/browser-history', () => fakeHistory);

const guitars = [getGuitarMock(), getGuitarMock(), getGuitarMock()];
const minAvailablePrice = sortGuitarsByPrice(guitars, SortGroup.Ascending.type)[0].price;
const maxAvailablePrice = sortGuitarsByPrice(guitars, SortGroup.Descending.type)[0].price;


const getFilterPriceMock = () => (
  <Provider store={store}>
    <Router history={history}>
      <FilterPrice />
    </Router>
  </Provider>
);
describe('Filter Price Component', () => {
  it('should render component', () => {
    const filterComponent = getFilterPriceMock();

    render(filterComponent);

    expect(screen.getByText(/Цена, ₽/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Минимальная цена/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Максимальная цена/i)).toBeInTheDocument();
  });

  it('should render with min/max available value when typing value is lesser/greater than available', () => {
    const filterComponent = getFilterPriceMock();
    const minTypingValue = '12';
    const maxTypingValue = '99999999999999';
    store.dispatch((setDefaultProductData(guitars)));

    render(filterComponent);

    const minPriceInput = screen.getByLabelText(/Минимальная цена/i);
    const maxPriceInput = screen.getByLabelText(/Максимальная цена/i);

    userEvent.type(minPriceInput, minTypingValue);
    fireEvent.blur(minPriceInput);

    expect(store.getState()[NameSpace.query].priceRangeFrom).toBe(minAvailablePrice.toString());
    expect(screen.getByDisplayValue(minAvailablePrice.toString())).toBeInTheDocument();

    userEvent.type(maxPriceInput, maxTypingValue);
    fireEvent.blur(maxPriceInput);

    expect(store.getState()[NameSpace.query].priceRangeTo).toBe(maxAvailablePrice.toString());
    expect(screen.getByDisplayValue(maxAvailablePrice.toString())).toBeInTheDocument();
  });

  it('should render with min available value when typing value is negative', () => {
    const filterComponent = getFilterPriceMock();
    const minTypingValue = '-100';
    const maxTypingValue = '-1000';
    store.dispatch((setDefaultProductData(guitars)));

    render(filterComponent);

    const minPriceInput = screen.getByLabelText(/Минимальная цена/i);
    const maxPriceInput = screen.getByLabelText(/Максимальная цена/i);

    userEvent.type(minPriceInput, minTypingValue);
    fireEvent.blur(minPriceInput);

    expect(store.getState()[NameSpace.query].priceRangeFrom).toBe(minAvailablePrice.toString());
    expect(screen.getByDisplayValue(minAvailablePrice.toString())).toBeInTheDocument();

    userEvent.type(maxPriceInput, maxTypingValue);
    fireEvent.blur(maxPriceInput);

    expect(store.getState()[NameSpace.query].priceRangeTo).toBe(minAvailablePrice.toString());
    expect(screen.getAllByDisplayValue(minAvailablePrice.toString()).length).toBe(2);
  });
});

