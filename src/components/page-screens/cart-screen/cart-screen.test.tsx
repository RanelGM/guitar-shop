import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action, Store } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import CartScreen from './cart-screen';
import { INITIAL_PROMOCODE_DISCOUNT } from 'utils/const';
import { getGuitarInCartMock } from 'utils/mocks';
import { GuitarInCart } from 'types/product';
import { NameSpace } from 'store/root-reducer';
import { getNumberWithSpaceBetween } from 'utils/utils';

const history = createMemoryHistory();
const guitarsInCart = [getGuitarInCartMock(), getGuitarInCartMock(), getGuitarInCartMock()];

const mockStore = configureMockStore<State, Action, ThunkDispatch<State, undefined, Action>>();

const getMockStore = (guitars?: GuitarInCart[] | null, discount?: number) => {
  guitars = guitars === undefined ? guitarsInCart : guitars;
  discount = discount ? discount : INITIAL_PROMOCODE_DISCOUNT;

  return mockStore({
    [NameSpace.product]: {
      similarAtSearch: [],
    },
    [NameSpace.order]: {
      cart: guitars,
      discount: discount,
    },
  });
};

const getMockComponent = (store?: Store) => {
  store = store ? store : getMockStore();

  return (
    <Provider store={store}>
      <Router history={history}>
        <CartScreen />
      </Router>
    </Provider>
  );
};

describe('Page-Screens Card Component', () => {
  it('should render component with all children components', () => {
    const mockComponent = getMockComponent();
    render(mockComponent);

    expect(screen.getAllByTestId('logo').length).toBe(2);
    expect(screen.getByPlaceholderText(/что вы ищите?/i)).toBeInTheDocument();

    expect(screen.getAllByText(/Корзина/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Артикул:/i)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Изменить количество/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Промокод на скидку/i)).toBeInTheDocument();
    expect(screen.getByText(/Всего:/i)).toBeInTheDocument();
    expect(screen.getByText(/Оформить заказ/i)).toBeInTheDocument();

    expect(screen.getByText(/Магазин гитар, музыкальных инструментов/i)).toBeInTheDocument();

    expect(screen.queryByText(/Корзина пуста./i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Воспользуйтесь каталогом, чтобы найти нужный товар./i)).not.toBeInTheDocument();
  });

  it('should render blank messages when cart is empty', () => {
    const store = getMockStore(null);
    const mockComponent = getMockComponent(store);
    render(mockComponent);

    expect(screen.getByText(/Корзина пуста./i)).toBeInTheDocument();
    expect(screen.getByText(/Воспользуйтесь каталогом, чтобы найти нужный товар./i)).toBeInTheDocument();
  });

  it('should correctly count total, discount, totalDiscounted price depending on the discount value', () => {
    const discount = 10;
    const totalPrice = guitarsInCart.reduce((sum, guitar) => sum += guitar.price * guitar.count, 0);
    const discountPrice = totalPrice * discount / 100;
    const totalDiscountedPrice = totalPrice - discountPrice;

    const adaptedTotalPrice = `${getNumberWithSpaceBetween(totalPrice)} ₽`;
    const adaptedDiscountPrice = `- ${getNumberWithSpaceBetween(discountPrice)} ₽`;
    const adaptedTotalDiscountedPrice = `${getNumberWithSpaceBetween(totalDiscountedPrice)} ₽`;

    const store = getMockStore(undefined, discount);
    const mockComponent = getMockComponent(store);

    render(mockComponent);

    const totalPriceParagraph = screen.getByTestId('total-value');
    const discountPriceParagraph = screen.getByTestId('discount-value');
    const totalDicountedPriceParagraph = screen.getByTestId('total-discounted-value');

    expect(totalPriceParagraph.textContent).toEqual(adaptedTotalPrice);
    expect(discountPriceParagraph.textContent).toEqual(adaptedDiscountPrice);
    expect(totalDicountedPriceParagraph.textContent).toEqual(adaptedTotalDiscountedPrice);
  });
});
