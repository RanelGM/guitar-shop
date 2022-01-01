import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import ErrorScreen from './error-screen';
import store from 'store/store';

describe('Error Screen Component', () => {
  it('should render component', () => {
    render(
      <Provider store={store}>
        <Router>
          <ErrorScreen />
        </Router>
      </Provider>,
    );

    expect(screen.getByText(/Возникла ошибка при загрузке данных с сервера. Попробуйте позднее/i)).toBeInTheDocument();
  });
});
