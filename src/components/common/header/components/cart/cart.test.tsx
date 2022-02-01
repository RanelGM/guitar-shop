import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action, Store } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import Cart from './cart';
import { createAPI } from 'api/api';
import { getGuitarInCartMock } from 'utils/mocks';
import { GuitarInCart } from 'types/product';
import { NameSpace } from 'store/root-reducer';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const history = createMemoryHistory();

const getStore = (cart: GuitarInCart[] | null) => mockStore({
  [NameSpace.order]: {
    cart: cart,
  },
});

const getCartMock = (store: Store) => (
  <Provider store={store}>
    <Router history={history}>
      <Cart />
    </Router>
  </Provider>
);

describe('Cart Component', () => {
  it('should render component with NO products in cart', () => {
    const store = getStore(null);
    const cartComponent = getCartMock(store);

    render(cartComponent);

    expect(screen.getByText(/Перейти в корзину/i)).toBeInTheDocument();
  });

  it('should render component with products in cart', () => {
    const cart = [getGuitarInCartMock(), getGuitarInCartMock(), getGuitarInCartMock()];
    const cartCount = cart.length;
    const store = getStore(cart);
    const cartComponent = getCartMock(store);

    render(cartComponent);

    expect(screen.getByText(/Перейти в корзину/i)).toBeInTheDocument();
    expect(screen.getByText(`${cartCount}`)).toBeInTheDocument();
  });
});

