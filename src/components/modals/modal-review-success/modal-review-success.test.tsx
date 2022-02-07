import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import ModalReviewSuccess from './modal-review-success';

const history = createMemoryHistory();

const mockHandlerGroup = {
  handleCloseBtnClick: jest.fn(),
  handleOverlayClick: jest.fn(),
  handleModalDidMount: jest.fn(),
  handleModalDidUnmount: jest.fn(),
  handleSuccessEvent: jest.fn(),
};

const mockComponent = (
  <Router history={history}>
    <ModalReviewSuccess handlerGroup={mockHandlerGroup} />
  </Router>
);

describe('Modal Review Success component', () => {
  it('should render component and call handleModalDidMount callback', async () => {
    expect(mockHandlerGroup.handleModalDidMount).not.toBeCalled();

    render(mockComponent);

    expect(screen.getByText(/Спасибо за ваш отзыв!/i)).toBeInTheDocument();
    expect(screen.getByText(/К покупкам!/i)).toBeInTheDocument();
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
});
