import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import NotFoundScreen from './not-found-screen';
import store from 'store/store';
import { AppRoute } from 'utils/const';

const history = createMemoryHistory();

describe('Under construction screen Component', () => {
  it('should render component with Link to Home', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <NotFoundScreen />
        </Router>
      </Provider>,
    );

    const mainPageLink = screen.getByText(/Вернуться на главную/i);
    const logos = screen.getAllByTestId('logo');

    expect(screen.getByText(/Запрашиваемая страница не найдена/i)).toBeInTheDocument();

    userEvent.click(mainPageLink);

    expect(history.location.pathname).toBe(AppRoute.Home);

    logos.forEach((logo) => {
      userEvent.click(logo);
      expect(history.location.pathname).toBe(AppRoute.Home);
    });
  });
});
