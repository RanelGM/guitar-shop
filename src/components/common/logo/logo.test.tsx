import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import Logo from './logo';
import { AppRoute } from 'utils/const';

const history = createMemoryHistory();

const getHeaderMock = (isMainPage: boolean) => (
  <Router history={history}>
    <Logo isMainPage={isMainPage} />
  </Router>
);

describe('Logo Component', () => {
  it('should render Logo component with Link Component as NOT link to Main Page', () => {
    const isMainPage = true;
    const headerMockComponent = getHeaderMock(isMainPage);

    render(headerMockComponent);

    const logo = screen.getByTestId('logo');

    expect(logo).toBeInTheDocument();
    expect(logo.tagName === 'A').toBe(false);
  });

  it('should render Logo component with Link Component as link to Main Page and lead to Main page after click', () => {
    const isMainPage = false;
    const headerMockComponent = getHeaderMock(isMainPage);
    history.push(AppRoute.Cart);

    render(headerMockComponent);

    const logo = screen.getByTestId('logo');

    expect(logo).toBeInTheDocument();
    expect(logo.tagName === 'A').toBe(true);

    userEvent.click(logo);

    expect(history.location.pathname).toBe(AppRoute.Home);
  });
});
