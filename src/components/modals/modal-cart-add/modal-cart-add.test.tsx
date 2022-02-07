import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action, Store } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import ModalCartAdd from './modal-cart-add';
import { NameSpace } from 'store/root-reducer';
import { getGuitarInCartMock, getGuitarMock } from 'utils/mocks';
import { setCart } from 'store/action';
import { replaceItemInArrayByIndex } from 'utils/utils';
import { Guitar, GuitarInCart } from 'types/product';

const mockStore = configureMockStore<State, Action, ThunkDispatch<State, undefined, Action>>();

const guitarMock = getGuitarMock();
const count = 3;
const guitarInCart = getGuitarInCartMock(guitarMock, count);
const guitarsInCart = [getGuitarInCartMock(), getGuitarInCartMock(), getGuitarInCartMock()];

const getStore = (guitars?: GuitarInCart[]) => {
  const cart = guitars ? guitars : guitarsInCart;

  return mockStore({
    [NameSpace.order]: {
      cart: cart,
    },
  });
};

const history = createMemoryHistory();

const mockHandlerGroup = {
  handleCloseBtnClick: jest.fn(),
  handleOverlayClick: jest.fn(),
  handleModalDidMount: jest.fn(),
  handleModalDidUnmount: jest.fn(),
  handleSuccessEvent: jest.fn(),
};

const getMockComponent = (guitar?: Guitar, store?: Store) => {
  guitar = guitar ? guitar : guitarMock;
  store = store ? store : getStore();

  return (
    <Provider store={store}>
      <Router history={history}>
        <ModalCartAdd
          guitar={guitar}
          handlerGroup={mockHandlerGroup}
        />
      </Router>
    </Provider>
  );
};

describe('Modal Cart Add component', () => {
  it('should render component and call handleModalDidMount callback', () => {
    const mockComponent = getMockComponent();

    expect(mockHandlerGroup.handleModalDidMount).not.toBeCalled();

    render(mockComponent);

    const nameRegex = new RegExp(guitarMock.name, 'g');

    expect(screen.getByText(/Добавить товар в корзину/i)).toBeInTheDocument();
    expect(screen.getByText(/Добавить в корзину/i)).toBeInTheDocument();
    expect(screen.getByText(nameRegex)).toBeInTheDocument();

    expect(mockHandlerGroup.handleModalDidMount).toBeCalled();
  });

  it('should call handleCloseBtnClick and handleOverlayClick when clicking on close button or overlay', () => {
    const mockComponent = getMockComponent();

    render(mockComponent);

    const closeButton = screen.getByLabelText(/Закрыть/i);
    const overlay = screen.getByTestId('overlay');

    expect(mockHandlerGroup.handleCloseBtnClick).not.toBeCalled();
    expect(mockHandlerGroup.handleOverlayClick).not.toBeCalled();

    userEvent.click(closeButton);
    userEvent.click(overlay);

    expect(mockHandlerGroup.handleCloseBtnClick).toBeCalled();
    expect(mockHandlerGroup.handleOverlayClick).toBeCalled();
  });

  it(`should add guitar to cart with count 1 and call handleSuccessEvent
      when button is clicked and guitar not in cart yet`, () => {
    const store = getStore();
    const mockComponent = getMockComponent(guitarMock, store);

    render(mockComponent);

    const submitBtn = screen.getByText(/Добавить в корзину/i);

    const updatedGuitar = getGuitarInCartMock(guitarMock);

    const updatedCart = guitarsInCart.concat(updatedGuitar);

    expect(mockHandlerGroup.handleSuccessEvent).not.toBeCalled();

    userEvent.click(submitBtn);

    expect(mockHandlerGroup.handleSuccessEvent).toBeCalled();
    expect(store.getActions()).toEqual([
      setCart(updatedCart),
    ]);
  });

  it(`should add guitar to cart with current count + 1 and call handleSuccessEvent
      when button is clicked and guitar is already in cart`, () => {
    const cart = guitarsInCart.concat(guitarInCart);
    const store = getStore(cart);
    const mockComponent = getMockComponent(guitarInCart, store);

    render(mockComponent);

    const submitBtn = screen.getByText(/Добавить в корзину/i);
    const updatedGuitar = Object.assign({}, guitarInCart, {
      count: guitarInCart.count + 1,
    });

    const index = cart.indexOf(guitarInCart);

    const updatedCart = replaceItemInArrayByIndex(updatedGuitar, cart, index);

    expect(mockHandlerGroup.handleSuccessEvent).not.toBeCalled();

    userEvent.click(submitBtn);

    expect(mockHandlerGroup.handleSuccessEvent).toBeCalled();

    expect(store.getActions()).toEqual([
      setCart(updatedCart),
    ]);
  });
});
