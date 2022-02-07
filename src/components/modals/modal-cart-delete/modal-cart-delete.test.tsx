import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import ModalCartDelete from './modal-cart-delete';
import { NameSpace } from 'store/root-reducer';
import { getGuitarInCartMock } from 'utils/mocks';
import { setCart } from 'store/action';

const mockStore = configureMockStore<State, Action, ThunkDispatch<State, undefined, Action>>();

const guitarInCart = getGuitarInCartMock();
const guitarsInCart = [getGuitarInCartMock(), getGuitarInCartMock(), guitarInCart, getGuitarInCartMock()];

const store = mockStore({
  [NameSpace.order]: {
    cart: guitarsInCart,
  },
});

const history = createMemoryHistory();

const mockHandlerGroup = {
  handleCloseBtnClick: jest.fn(),
  handleOverlayClick: jest.fn(),
  handleModalDidMount: jest.fn(),
  handleModalDidUnmount: jest.fn(),
  handleSuccessEvent: jest.fn(),
};

const mockComponent = (
  <Provider store={store}>
    <Router history={history}>
      <ModalCartDelete
        guitar={guitarInCart}
        handlerGroup={mockHandlerGroup}
      />
    </Router>
  </Provider>
);

describe('Modal Cart Delete component', () => {
  it('should render component and call handleModalDidMount callback', () => {
    expect(mockHandlerGroup.handleModalDidMount).not.toBeCalled();

    render(mockComponent);

    const nameRegex = new RegExp(guitarInCart.name, 'g');

    expect(screen.getByText(/Удалить этот товар?/i)).toBeInTheDocument();
    expect(screen.getByText(/Удалить товар/i)).toBeInTheDocument();
    expect(screen.getByText(/Продолжить покупки/i)).toBeInTheDocument();
    expect(screen.getByText(nameRegex)).toBeInTheDocument();

    expect(mockHandlerGroup.handleModalDidMount).toBeCalled();
  });

  it('should call handleCloseBtnClick and handleOverlayClick when clicking on close/continue button or overlay', () => {
    render(mockComponent);

    const closeButton = screen.getByLabelText(/Закрыть/i);
    const continueButton = screen.getByText(/Продолжить покупки/i);
    const overlay = screen.getByTestId('overlay');

    expect(mockHandlerGroup.handleCloseBtnClick).not.toBeCalled();
    expect(mockHandlerGroup.handleOverlayClick).not.toBeCalled();

    userEvent.click(closeButton);
    userEvent.click(continueButton);
    userEvent.click(overlay);

    expect(mockHandlerGroup.handleCloseBtnClick).toBeCalledTimes(2);
    expect(mockHandlerGroup.handleOverlayClick).toBeCalled();
  });

  it('should remove guitar from cart and call handleSuccessEvent when remove button is clicked', () => {
    render(mockComponent);

    const removeButton = screen.getByTestId(guitarInCart.id);

    const index = guitarsInCart.indexOf(guitarInCart);
    const updatedCart = guitarsInCart.slice();
    updatedCart.splice(index, 1);

    expect(mockHandlerGroup.handleSuccessEvent).not.toBeCalled();

    userEvent.click(removeButton);

    expect(mockHandlerGroup.handleSuccessEvent).toBeCalled();
    expect(store.getActions()).toEqual([
      setCart(updatedCart),
    ]);
  });
});
