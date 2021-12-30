import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Footer from './footer';

describe('Footer Component', () => {
  afterEach(() => {
    expect(screen.getByText(/Магазин гитар, музыкальных инструментов и гитарная мастерская/i)).toBeInTheDocument();
    expect(screen.getByText(/8-812-500-50-50/i)).toBeInTheDocument();
    expect(screen.getAllByRole('heading').find((heading) => heading.textContent === 'О нас')).toBeInTheDocument();
    expect(screen.getAllByRole('heading').find((heading) => heading.textContent === 'Информация')).toBeInTheDocument();
  });

  it('should render Footer component on Main Page with Link component as NOT link', () => {
    render(
      <Router>
        <Footer isMainPage />
      </Router>,
    );

    const logo = screen.getByTestId('logo');

    expect(logo).toBeInTheDocument();
    expect(logo.tagName === 'A').toBe(false);
  });

  it('should render Footer component on Main Page with Link component as link', () => {
    render(
      <Router>
        <Footer />
      </Router>,
    );

    const logo = screen.getByTestId('logo');

    expect(logo).toBeInTheDocument();
    expect(logo.tagName === 'A').toBe(true);
  });
});
