import { Router } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import ModalReviewSuccess from './modal-review-success';
import { KeyboardKey } from 'utils/const';

const history = createMemoryHistory();

const handleModalDidUnmount = jest.fn();
const handleCloseBtnClick = jest.fn();
const handleOverlayClick = jest.fn();
const handleEscAction = jest.fn();
const handleMountAction = jest.fn();

const handleEscKeydown = (evt: KeyboardEvent) => {
  if (evt.key === KeyboardKey.Esc) {
    handleEscAction();
  }
};

const handleModalDidMount = () => {
  handleMountAction();
  document.addEventListener('keydown', handleEscKeydown);
};

const mockHandlerGroup = {
  handleCloseBtnClick: handleCloseBtnClick,
  handleOverlayClick: handleOverlayClick,
  handleModalDidMount: handleModalDidMount,
  handleModalDidUnmount: handleModalDidUnmount,
  handleSuccessEvent: jest.fn(),
};

const mockComponent = (
  <Router history={history}>
    <ModalReviewSuccess handlerGroup={mockHandlerGroup} />
  </Router>
);

describe('Modal Review Success component', () => {
  it('should render component', async () => {
    render(mockComponent);

    expect(screen.getByText(/Спасибо за ваш отзыв!/i)).toBeInTheDocument();
    expect(screen.getByText(/К покупкам!/i)).toBeInTheDocument();
    expect(handleMountAction).toBeCalled();
  });

  it('should call close callback when Esc keydown, click on close button or overlay', () => {
    render(mockComponent);

    const closeButton = screen.getByLabelText(/Закрыть/i);
    const overlay = screen.getByTestId('overlay');

    expect(handleCloseBtnClick).toBeCalledTimes(0);
    expect(handleOverlayClick).toBeCalledTimes(0);
    expect(handleEscAction).toBeCalledTimes(0);

    userEvent.click(closeButton);
    expect(handleCloseBtnClick).toBeCalledTimes(1);

    userEvent.click(overlay);
    expect(handleOverlayClick).toBeCalledTimes(1);

    fireEvent.keyDown(document, { key: KeyboardKey.Esc });
    fireEvent.keyDown(document, { key: KeyboardKey.Enter });
    expect(handleEscAction).toBeCalledTimes(1);
  });
});
