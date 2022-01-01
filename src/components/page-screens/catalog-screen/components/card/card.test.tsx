import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import { Guitar } from 'types/product';
import Card from './card';
import { getGuitarMock } from 'utils/mocks';
import store from 'store/store';
import { setCart } from 'store/action';

const history = createMemoryHistory();

const getCardMock = (guitar: Guitar) => (
  <Provider store={store}>
    <Router history={history}>
      <Card guitar={guitar} />
    </Router>
  </Provider>
);

describe('Card component', () => {
  it('should render component', () => {
    const guitar = getGuitarMock();
    const cardMock = getCardMock(guitar);

    render(cardMock);

    expect(screen.getByText(guitar.name)).toBeInTheDocument();
    expect(screen.getByText(guitar.comments.length)).toBeInTheDocument();
    expect(screen.getByText(/Цена/i)).toBeInTheDocument();
    expect(screen.getByText(/Подробнее/i)).toBeInTheDocument();
  });

  it('should add guitar card to cart if not in the cart yet', () => {
    const guitar = getGuitarMock();
    const cardMock = getCardMock(guitar);

    render(cardMock);

    const addBtn = screen.getByText(/Купить/i);
    expect(screen.queryByText(/В Корзине/i)).not.toBeInTheDocument();
    expect(addBtn).toBeInTheDocument();

    userEvent.click(addBtn);

    expect(screen.getByText(/В Корзине/i)).toBeInTheDocument();
    expect(screen.queryByText(/Купить/i)).not.toBeInTheDocument();
  });

  it('should remove guitar card from cart if it is already in the cart', async () => {
    const guitar = getGuitarMock();
    const cardMock = getCardMock(guitar);

    render(cardMock);

    store.dispatch(setCart([guitar]));

    const addBtn = screen.getByText(/В Корзине/i);
    expect(screen.queryByText(/Купить/i)).not.toBeInTheDocument();
    expect(addBtn).toBeInTheDocument();

    userEvent.click(addBtn);

    expect(screen.getByText(/Купить/i)).toBeInTheDocument();
    expect(screen.queryByText(/В Корзине/i)).not.toBeInTheDocument();
  });
});
