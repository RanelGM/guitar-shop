import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import UnderConstructionScreen from './under-construction-screen';
import store from 'store/store';
import { AppRoute } from 'utils/const';

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
