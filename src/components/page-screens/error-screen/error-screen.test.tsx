import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import { createAPI } from 'api/api';
import { NameSpace } from 'store/root-reducer';
import ErrorScreen from './error-screen';


const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const store = mockStore({
  [NameSpace.query]: {
    priceRangeFrom: '',
    priceRangeTo: '',
    guitarType: null,
  },
});

const history = createMemoryHistory();

describe('Error Screen Component', () => {
  it('should render component', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ErrorScreen />
        </Router>
      </Provider>,
    );

    expect(screen.getByText(/Возникла ошибка при загрузке данных с сервера. Попробуйте позднее/i)).toBeInTheDocument();
  });
});
