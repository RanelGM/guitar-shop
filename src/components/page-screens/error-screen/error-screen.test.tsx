import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ErrorScreen from './error-screen';

describe('Error Screen Component', () => {
  it('should render component', () => {
    render(
      <Router>
        <ErrorScreen />
      </Router>,
    );

    expect(screen.getByText(/Возникла ошибка при загрузке данных с сервера. Попробуйте позднее/i)).toBeInTheDocument();
  });
});
