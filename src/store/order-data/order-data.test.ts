import { ActionType } from 'types/action';
import reducer, { initialState } from './order-data';
import { getGuitarMock } from 'utils/mocks';

const state = Object.assign(initialState);

describe('Order Data reducer', () => {
  it('should return initial state without additional parameters', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' }))
      .toEqual(initialState);
  });

  it('should update cart state with guitarsInCart when setCartAction', () => {
    const guitarsInCart = Array.from({ length: 5 }, () => getGuitarMock());

    const setCart = {
      type: ActionType.SetCart,
      payload: guitarsInCart,
    };

    expect(reducer(state, setCart))
      .toEqual(Object.assign(
        {},
        state,
        {
          cart: guitarsInCart,
        },
      ));
  });

  it('should update discount state with discount when setDiscount', () => {
    const discount = 10;

    const setDiscount = {
      type: ActionType.SetDiscount,
      payload: discount,
    };

    expect(reducer(state, setDiscount))
      .toEqual(Object.assign(
        {},
        state,
        {
          discount: discount,
        },
      ));
  });
});

