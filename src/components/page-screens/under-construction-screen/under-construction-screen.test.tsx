import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import { createAPI } from 'api/api';

import UnderConstructionScreen from './under-construction-screen';
import { NameSpace } from 'store/root-reducer';
import { AppRoute } from 'utils/const';

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

describe('Under construction screen Component', () => {
  it('should render component with Link to Home', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <UnderConstructionScreen />
        </Router>
      </Provider>,
    );

    const logos = screen.getAllByTestId('logo');

    logos.forEach((logo) => {
      userEvent.click(logo);
      expect(history.location.pathname).toBe(AppRoute.Home);
    });

    expect(screen.getByText(/Страница находится на этапе разработки/i)).toBeInTheDocument();
    expect(screen.getByText(/Реализация на следующем этапе/i)).toBeInTheDocument();
  });
});
