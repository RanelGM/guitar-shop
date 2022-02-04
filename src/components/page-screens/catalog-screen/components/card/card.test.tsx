import { Action, Store } from 'redux';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import { Guitar, GuitarInCart } from 'types/product';
import Card from './card';
import { NameSpace } from 'store/root-reducer';
import { getGuitarMock, getGuitarInCartMock } from 'utils/mocks';
import { AppRoute } from 'utils/const';

const history = createMemoryHistory();

const mockStore = configureMockStore<State, Action, ThunkDispatch<State, undefined, Action>>();

const getStore = (guitars: GuitarInCart[] | null) => mockStore({
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

  it('should render component as OUT OF cart if cart is null and should open Modal Cart Add', async () => {
    const guitar = getGuitarMock();
    const store = getStore(null);
    const cardMock = getCardMock(guitar, store);

    render(cardMock);

    const addBtn = screen.getByText(/Купить/i);
    expect(screen.queryByText(/В Корзине/i)).not.toBeInTheDocument();
    expect(addBtn).toBeInTheDocument();

    expect(screen.queryByText(/Добавить товар в корзину/i)).not.toBeInTheDocument();
    userEvent.click(addBtn);
    expect(await screen.findByText(/Добавить товар в корзину/i)).toBeInTheDocument();
  });

  it('should render component as OUT OF cart if cart doesn\'t contains current guitar and should open Modal Cart Add', async () => {
    const guitar = getGuitarMock();
    const guitarsInCart = [getGuitarInCartMock(), getGuitarInCartMock(), getGuitarInCartMock()];
    const store = getStore(guitarsInCart);
    const cardMock = getCardMock(guitar, store);

    render(cardMock);

    const addBtn = screen.getByText(/Купить/i);
    expect(screen.queryByText(/В Корзине/i)).not.toBeInTheDocument();
    expect(addBtn).toBeInTheDocument();

    expect(screen.queryByText(/Добавить товар в корзину/i)).not.toBeInTheDocument();
    userEvent.click(addBtn);
    expect(await screen.findByText(/Добавить товар в корзину/i)).toBeInTheDocument();
  });

  it('should render component as IN cart if cart contains current guitar and should redirect to Cart Screen', async () => {
    const guitar = getGuitarInCartMock();
    const anotherGuitars = [getGuitarInCartMock(), getGuitarInCartMock()];
    const guitarsInCart = anotherGuitars.concat(guitar);
    const store = getStore(guitarsInCart);
    const cardMock = getCardMock(guitar, store);

    render(cardMock);

    const addBtn = screen.getByText(/В Корзине/i);
    expect(screen.queryByText(/Купить/i)).not.toBeInTheDocument();
    expect(addBtn).toBeInTheDocument();

    userEvent.click(addBtn);

    expect(history.location.pathname).toEqual(AppRoute.Cart);
  });
});
