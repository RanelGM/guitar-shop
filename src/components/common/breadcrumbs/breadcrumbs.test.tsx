import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import Breadcumbs from './breadcrumbs';
import { AppRoute, INITIAL_CATALOG_PAGE } from 'utils/const';

const history = createMemoryHistory();

const mockBreadcumbs = (
  <Router history={history}>
    <Breadcumbs />
  </Router>
);

describe('Breadcrumbs Component', () => {
  it('should render component', () => {
    render(mockBreadcumbs);

    expect(screen.getByText(/Главная/i)).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    screen.getAllByRole('link').forEach((link) => expect(link).toBeInTheDocument());
  });

  it('should redirect to Home Page', () => {
    render(mockBreadcumbs);

    const linkElement = screen.getByText(/Главная/i);
    const initialPage = `${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`;
    const homePage = AppRoute.Home;

    history.push(`${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`);
    expect(history.location.pathname).toBe(initialPage);

    userEvent.click(linkElement);
    expect(history.location.pathname).toBe(homePage);
  });
});
