import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import Breadcumbs from './breadcrumbs';

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
});
