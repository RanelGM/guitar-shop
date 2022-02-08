import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import Card from './card';
import { MAX_PRODUCT_COUNT, MIN_PRODUCT_COUNT } from 'utils/const';
import { getGuitarInCartMock } from 'utils/mocks';
import { GuitarInCart } from 'types/product';
import { NameSpace } from 'store/root-reducer';

const history = createMemoryHistory();

const guitar = getGuitarInCartMock();
const handleCartUpdate = jest.fn();

const mockStore = configureMockStore<State, Action, ThunkDispatch<State, undefined, Action>>();

const store = mockStore({
  [NameSpace.order]: {
    cart: [guitar],
  },
});

const getMockComponent = (guitarInCart?: GuitarInCart) => {
  guitarInCart = guitarInCart ? guitarInCart : guitar;

  return (
    <Provider store={store}>
      <Router history={history}>
        <Card guitar={guitarInCart}
          onCartUpdate={handleCartUpdate}
        />
      </Router>
    </Provider>

  );
};

describe('Page-Screens Card Component', () => {
  it('should render component', () => {
    const mockComponent = getMockComponent();
    render(mockComponent);

    const nameReg = new RegExp(guitar.name);
    const vendorReg = new RegExp(guitar.vendorCode);

    expect(screen.getByText(nameReg)).toBeInTheDocument();
    expect(screen.getByText(vendorReg)).toBeInTheDocument();
    expect(screen.getByText(/Артикул/i)).toBeInTheDocument();
    expect(screen.getByText(/струнная/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Уменьшить количество')).toBeInTheDocument();
    expect(screen.getByLabelText('Увеличить количество')).toBeInTheDocument();
    expect(screen.getByLabelText('Изменить количество')).toBeInTheDocument();
  });

  it('should increase / decrease input value by +1/-1 when clicking on Increase / Decrease button', () => {
    const mockComponent = getMockComponent();
    render(mockComponent);

    const increaseButton = screen.getByLabelText('Увеличить количество');
    const decreaseButton = screen.getByLabelText('Уменьшить количество');
    const input = screen.getByLabelText('Изменить количество') as HTMLInputElement;

    expect(input.value).toBe('1');

    userEvent.click(increaseButton);
    expect(input.value).toBe('2');

    userEvent.click(increaseButton);
    expect(input.value).toBe('3');

    userEvent.click(decreaseButton);
    expect(input.value).toBe('2');

    userEvent.click(decreaseButton);
    expect(input.value).toBe('1');
  });

  it('should change input value by typing value when input is on blur', () => {
    const mockComponent = getMockComponent();
    const typingValue = '10';
    render(mockComponent);

    const input = screen.getByLabelText('Изменить количество') as HTMLInputElement;

    input.value = '';

    userEvent.type(input, typingValue);
    expect(input.value).toBe(typingValue);
    fireEvent.blur(input);
    expect(input.value).toBe(typingValue);
  });

  it('should use min/max input values when input is on blur and typed value is lesser/greater than min/max value', () => {
    const mockComponent = getMockComponent();
    const minTypingValue = (MIN_PRODUCT_COUNT - 1).toString();
    const maxTypingValue = (MAX_PRODUCT_COUNT + 1).toString();

    render(mockComponent);

    const input = screen.getByLabelText('Изменить количество') as HTMLInputElement;

    input.value = '';

    userEvent.type(input, minTypingValue);
    expect(input.value).toBe(minTypingValue);
    fireEvent.blur(input);
    expect(input.value).toBe(MIN_PRODUCT_COUNT.toString());

    input.value = '';

    userEvent.type(input, maxTypingValue);
    expect(input.value).toBe(maxTypingValue);
    fireEvent.blur(input);
    expect(input.value).toBe(MAX_PRODUCT_COUNT.toString());
  });

  it('should render ModalCartDelete component when clicking on delete button', () => {
    const mockComponent = getMockComponent();

    render(mockComponent);

    const deleteButton = screen.getByLabelText('Удалить');

    expect(screen.queryByText(/Удалить этот товар?/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Удалить товар/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Продолжить покупки/i)).not.toBeInTheDocument();

    userEvent.click(deleteButton);

    expect(screen.getByText(/Удалить этот товар?/i)).toBeInTheDocument();
    expect(screen.getByText(/Удалить товар/i)).toBeInTheDocument();
    expect(screen.getByText(/Продолжить покупки/i)).toBeInTheDocument();
  });

  it('should render ModalCartDelete component when clicking on decrease button and count is min available', () => {
    const guitarWithMinCount = getGuitarInCartMock(guitar, MIN_PRODUCT_COUNT);
    const mockComponent = getMockComponent(guitarWithMinCount);

    render(mockComponent);

    const decreaseButton = screen.getByLabelText('Уменьшить количество');

    expect(screen.queryByText(/Удалить этот товар?/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Удалить товар/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Продолжить покупки/i)).not.toBeInTheDocument();

    userEvent.click(decreaseButton);

    expect(screen.getByText(/Удалить этот товар?/i)).toBeInTheDocument();
    expect(screen.getByText(/Удалить товар/i)).toBeInTheDocument();
    expect(screen.getByText(/Продолжить покупки/i)).toBeInTheDocument();
  });
});
