import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import ModalCartSuccess from './modal-cart-success';
import { AppRoute, INITIAL_CATALOG_PAGE } from 'utils/const';

const history = createMemoryHistory();

const fakeHistory = {
  location: { pathname: '' },
  push(path: string) {
    this.location.pathname = path;
  },
};

jest.mock('store/browser-history', () => fakeHistory);

const mockHandlerGroup = {
  handleCloseBtnClick: jest.fn(),
  handleOverlayClick: jest.fn(),
  handleModalDidMount: jest.fn(),
  handleModalDidUnmount: jest.fn(),
  handleSuccessEvent: jest.fn(),
};

const mockComponent = (
  <Router history={history}>
    <ModalCartSuccess handlerGroup={mockHandlerGroup} />
  </Router>
);

describe('Modal Cart Success component', () => {
  it('should render component and call handleModalDidMount callback', async () => {
    expect(mockHandlerGroup.handleModalDidMount).not.toBeCalled();

    render(mockComponent);

    expect(screen.getByText(/Товар успешно добавлен в корзину/i)).toBeInTheDocument();
    expect(screen.getByText(/Перейти в корзину/i)).toBeInTheDocument();
    expect(screen.getByText(/Продолжить покупки/i)).toBeInTheDocument();
    expect(mockHandlerGroup.handleModalDidMount).toBeCalled();
  });

  it('should call handleCloseBtnClick and handleOverlayClick when clicking on close button or overlay', () => {
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

  it('should call handleCloseBtnClick when clicking on continue button and this is Catalog Page', () => {
    fakeHistory.push(`${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`);
    render(mockComponent);

    const continueButton = screen.getByText(/Продолжить покупки/i);
    expect(mockHandlerGroup.handleCloseBtnClick).not.toBeCalled();

    userEvent.click(continueButton);

    expect(mockHandlerGroup.handleCloseBtnClick).toBeCalled();
  });

  it('should redirect to Catalog Page from Cart Page when clicking on continue button', () => {
    fakeHistory.push(AppRoute.Cart);
    render(mockComponent);

    const continueButton = screen.getByText(/Продолжить покупки/i);
    const path = `${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`;

    expect(history.location.pathname).not.toBe(path);

    userEvent.click(continueButton);
    expect(history.location.pathname).toBe(path);
  });
});
