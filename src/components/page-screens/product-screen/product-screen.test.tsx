import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { render, screen } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import ProductScreen from './product-screen';
import { createAPI } from 'api/api';
import { NameSpace } from 'store/root-reducer';
import { getGuitarMock } from 'utils/mocks';
import { APIQuery, APIRoute, AppRoute } from 'utils/const';

const expandedGuitar = getGuitarMock();

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const store = mockStore({
  [NameSpace.order]: {
    cart: null,
  },
  [NameSpace.product]: {
    expandedGuitar: expandedGuitar,
    similarAtSearch: [],
  },
});

const history = createMemoryHistory();

const fakeHistory = {
  location: { pathname: '' },
  push(path: string) {
    this.location.pathname = path;
  },
};

jest.mock('store/browser-history', () => fakeHistory);

const mockComponent = (
  <Provider store={store}>
    <Router history={history}>
      <ProductScreen />
    </Router>
  </Provider>
);

describe('Product Screen component', () => {
  it('should render component with children components', async () => {
    const { id } = expandedGuitar;

    mockAPI
      .onGet(`${APIRoute.Guitar}/${id}?${APIQuery.EmbedComment}`)
      .reply(200, expandedGuitar);

    fakeHistory.push(`${AppRoute.Product}/${id}`);
    history.push(`${AppRoute.Product}/${id}`);

    render(mockComponent);

    await screen.findByText(/Отзывы/i);
    expect(screen.getByText(/Товар/i)).toBeInTheDocument();
    expect(screen.getByText(/Характеристики/i)).toBeInTheDocument();
    expect(screen.getByText(expandedGuitar.vendorCode)).toBeInTheDocument();

    expect(screen.getAllByTestId('logo').length).toBe(2);
    expect(screen.getByPlaceholderText(/что вы ищите?/i)).toBeInTheDocument();
  });

  it('should render Error Screen if server response is NOT OK', async () => {
    const { id } = expandedGuitar;

    mockAPI
      .onGet(`${APIRoute.Guitar}/${id}?${APIQuery.EmbedComment}`)
      .reply(500);

    fakeHistory.push(`${AppRoute.Product}/${id}`);
    history.push(`${AppRoute.Product}/${id}`);

    render(mockComponent);

    await screen.findByText(/Возникла ошибка при загрузке данных с сервера. Попробуйте позднее/i);
  });

  it('should render Not Found Screen if server response is 404', async () => {
    const { id } = expandedGuitar;

    mockAPI
      .onGet(`${APIRoute.Guitar}/${id}?${APIQuery.EmbedComment}`)
      .reply(404);

    fakeHistory.push(`${AppRoute.Product}/${id}`);
    history.push(`${AppRoute.Product}/${id}`);

    render(mockComponent);

    await screen.findByText(/Запрашиваемая страница не найдена/i);
    expect(screen.getByText(/Вернуться на главную/i)).toBeInTheDocument();
  });
});
