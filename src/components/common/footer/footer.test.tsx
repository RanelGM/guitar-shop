import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import Footer from './footer';

const mockStore = configureMockStore<State, Action, ThunkDispatch<State, undefined, Action>>();

const store = mockStore({});
const history = createMemoryHistory();

describe('Footer Component', () => {
  afterEach(() => {
    expect(screen.getByText(/Магазин гитар, музыкальных инструментов и гитарная мастерская/i)).toBeInTheDocument();
    expect(screen.getByText(/8-812-500-50-50/i)).toBeInTheDocument();
    expect(screen.getAllByRole('heading').find((heading) => heading.textContent === 'О нас')).toBeInTheDocument();
    expect(screen.getAllByRole('heading').find((heading) => heading.textContent === 'Информация')).toBeInTheDocument();
  });

  it('should render Footer component on Main Page with Link component as NOT link', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <Footer isMainPage />
        </Router>
      </Provider>,
    );

    const logo = screen.getByTestId('logo');

    expect(logo).toBeInTheDocument();
    expect(logo.tagName === 'A').toBe(false);
  });

  it('should render Footer component on Main Page with Link component as link', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <Footer />
        </Router>
      </Provider>,
    );

    const logo = screen.getByTestId('logo');

    expect(logo).toBeInTheDocument();
    expect(logo.tagName === 'A').toBe(true);
  });
});
