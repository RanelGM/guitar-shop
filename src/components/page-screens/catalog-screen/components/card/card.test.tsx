import { Action, Store } from 'redux';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import { Guitar } from 'types/product';
import Card from './card';
import { setCart } from 'store/action';
import { NameSpace } from 'store/root-reducer';
import { getGuitarMock } from 'utils/mocks';

const history = createMemoryHistory();

const mockStore = configureMockStore<State, Action, ThunkDispatch<State, undefined, Action>>();

const getStore = (guitars: Guitar[] | null) => mockStore({
  [NameSpace.order]: {
    cart: guitars,
  },
});

const getCardMock = (guitar: Guitar, store: Store) => (
  <Provider store={store}>
    <Router history={history}>
      <Card guitar={guitar} />
    </Router>
  </Provider>
);

describe('Card component', () => {
  it('should render component', () => {
    const guitar = getGuitarMock();
    const store = getStore(null);
    const cardMock = getCardMock(guitar, store);

    render(cardMock);

    expect(screen.getByText(guitar.name)).toBeInTheDocument();
    expect(screen.getByText(guitar.comments.length)).toBeInTheDocument();
    expect(screen.getByText(/Цена/i)).toBeInTheDocument();
    expect(screen.getByText(/Подробнее/i)).toBeInTheDocument();
  });

  it('should render component as OUT OF cart if cart is null and should add guitar card to cart', () => {
    const guitar = getGuitarMock();
    const store = getStore(null);
    const cardMock = getCardMock(guitar, store);

    render(cardMock);

    const addBtn = screen.getByText(/Купить/i);
    expect(screen.queryByText(/В Корзине/i)).not.toBeInTheDocument();
    expect(addBtn).toBeInTheDocument();

    userEvent.click(addBtn);

    expect(store.getActions()).toEqual([setCart([guitar])]);
  });

  it('should render component as OUT OF cart if cart doesn\'t contains current guitar and should add guitar card to cart', () => {
    const guitar = getGuitarMock();
    const guitarsInCart = [getGuitarMock(), getGuitarMock(), getGuitarMock()];
    const store = getStore(guitarsInCart);
    const cardMock = getCardMock(guitar, store);

    render(cardMock);

    const addBtn = screen.getByText(/Купить/i);
    expect(screen.queryByText(/В Корзине/i)).not.toBeInTheDocument();
    expect(addBtn).toBeInTheDocument();

    userEvent.click(addBtn);

    expect(store.getActions()).toEqual([setCart(guitarsInCart.concat(guitar))]);
  });

  it('should render component as IN cart if cart contains current guitar and should remove car from cart', async () => {
    const guitar = getGuitarMock();
    const anotherGuitars = [getGuitarMock(), getGuitarMock()];
    const guitarsInCart = anotherGuitars.concat(guitar);
    const store = getStore(guitarsInCart);
    const cardMock = getCardMock(guitar, store);

    render(cardMock);

    const addBtn = screen.getByText(/В Корзине/i);
    expect(screen.queryByText(/Купить/i)).not.toBeInTheDocument();
    expect(addBtn).toBeInTheDocument();

    userEvent.click(addBtn);

    expect(store.getActions()).toEqual([setCart(anotherGuitars)]);
  });
});
