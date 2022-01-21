import { Router } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import ModalSuccess from './modal-success';
import { KeyboardKey } from 'utils/const';

const history = createMemoryHistory();

const handleModalClose = jest.fn();

const mockComponent = (
  <Router history={history}>
    <ModalSuccess onModalClose={handleModalClose} />
  </Router>
);

describe('Review component', () => {
  it('should render component', async () => {
    render(mockComponent);

    expect(screen.getByText(/Спасибо за ваш отзыв!/i)).toBeInTheDocument();
    expect(screen.getByText(/К покупкам!/i)).toBeInTheDocument();
  });

  it('should call close callback when Esc keydown, click on close button or overlay', () => {
    render(mockComponent);

    const closeButton = screen.getByLabelText(/Закрыть/i);
    const overlay = screen.getByTestId('overlay');

    expect(handleModalClose).toBeCalledTimes(0);

    userEvent.click(closeButton);
    userEvent.click(overlay);
    fireEvent.keyDown(document, { key: KeyboardKey.Esc });

    expect(handleModalClose).toBeCalledTimes(3);
  });
});
