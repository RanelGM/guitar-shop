import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import CatalogScreen from './catalog-screen';
import { NameSpace } from 'store/root-reducer';
import store from 'store/store';
import { getGuitarMock } from 'utils/mocks';

const history = createMemoryHistory();

const mockStore = configureMockStore<State, Action, ThunkDispatch<State, undefined, Action>>();

const guitars = [getGuitarMock(), getGuitarMock(), getGuitarMock()];
const guitarsToRender = guitars;

const state = Object.assign({}, store.getState(), {
  [NameSpace.product]: {
    defaultServerGuitars: guitars,
    guitarsToRender: guitarsToRender,
    guitarsTotalCount: guitars.length,
  },
});

const mockedStore = mockStore(state);

describe('Catalog Screen component', () => {
  it('should render component with children components', () => {
    render(
      <Provider store={mockedStore}>
        <Router history={history}>
          <CatalogScreen />
        </Router>
      </Provider>,
    );

    expect(screen.getByText(/Каталог гитар/i)).toBeInTheDocument();

    expect(screen.getAllByTestId('logo').length).toBe(2);
    expect(screen.getByPlaceholderText(/что вы ищите?/i)).toBeInTheDocument();

    expect(screen.getByText(/Фильтр/i)).toBeInTheDocument();
    expect(screen.getByText(/Сортировать:/i)).toBeInTheDocument();
    expect(screen.getByText(/Цена, ₽/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Минимальная цена/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Максимальная цена/i)).toBeInTheDocument();

    expect(screen.getAllByText(/Подробнее/i).length).toBe(guitarsToRender.length);
  });
});