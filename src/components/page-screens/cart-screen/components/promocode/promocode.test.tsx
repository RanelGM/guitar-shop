import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import Promocode from './promocode';
import { createAPI } from 'api/api';
import { setDiscount } from 'store/action';
import { NameSpace } from 'store/root-reducer';
import { APIRoute, INITIAL_PROMOCODE_DISCOUNT } from 'utils/const';

const history = createMemoryHistory();
const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const store = mockStore({
  [NameSpace.order]: {
    discount: 0,
  },
});

const mockComponent = (
  <Provider store={store}>
    <Router history={history}>
      <Promocode />
    </Router>
  </Provider>
);

describe('Promocode Component', () => {
  beforeEach(() => {
    store.clearActions();
  });

  it('should render component', () => {
    render(mockComponent);

    expect(screen.getByText(/Промокод на скидку/i)).toBeInTheDocument();
    expect(screen.getByText(/Введите свой промокод, если он у вас есть./i)).toBeInTheDocument();
    expect(screen.getByText(/Применить/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Введите промокод/i)).toBeInTheDocument();
  });

  it('should change input value by typing value', () => {
    const typingValue = 'foo';
    render(mockComponent);

    const input = screen.getByPlaceholderText(/Введите промокод/i) as HTMLInputElement;

    userEvent.type(input, typingValue);
    expect(input.value).toBe(typingValue);
  });

  it('should render blankMessage and dispatch initial discount when input value is empty and clicking on submit button', () => {
    const blankMessage = 'Введите промокод';
    render(mockComponent);

    const input = screen.getByPlaceholderText(/Введите промокод/i) as HTMLInputElement;
    const submitButton = screen.getByText(/Применить/i);

    expect(screen.queryByText(blankMessage)).not.toBeInTheDocument();
    expect(input.value).toBe('');

    userEvent.click(submitButton);
    expect(screen.getByText(blankMessage)).toBeInTheDocument();
    expect(store.getActions()).toEqual([
      setDiscount(INITIAL_PROMOCODE_DISCOUNT),
    ]);
  });

  it(`should render successMessage and dispatch setDiscount with responded discount
      when input value is NOT empty after clicking on submit button and server response is OK`, async () => {
    const successMessage = 'Промокод принят';
    const promocode = 'foo';
    const discount = 10;

    render(mockComponent);

    const input = screen.getByPlaceholderText(/Введите промокод/i) as HTMLInputElement;
    const submitButton = screen.getByText(/Применить/i);

    expect(screen.queryByText(successMessage)).not.toBeInTheDocument();

    userEvent.type(input, promocode);
    userEvent.click(submitButton);

    mockAPI
      .onPost(APIRoute.Coupons)
      .reply(200, discount);

    await screen.findByText(successMessage);
    expect(store.getActions()).toEqual([
      setDiscount(discount),
    ]);
  });

  it(`should render errorMessage and dispatch initial dscount
      when input value is NOT empty after clicking on submit button and server response is NOT OK`, async () => {
    const errorMessage = 'Неверный промокод';
    const promocode = 'bar';

    render(mockComponent);

    const input = screen.getByPlaceholderText(/Введите промокод/i) as HTMLInputElement;
    const submitButton = screen.getByText(/Применить/i);

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    userEvent.type(input, promocode);
    userEvent.click(submitButton);

    mockAPI
      .onPost(APIRoute.Coupons)
      .reply(400);

    await screen.findByText(errorMessage);
    expect(store.getActions()).toEqual([
      setDiscount(INITIAL_PROMOCODE_DISCOUNT),
    ]);
  });
});
