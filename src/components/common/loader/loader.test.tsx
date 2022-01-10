import { render, screen } from '@testing-library/react';
import Loader from './loader';

describe('Loader component', () => {
  it('should render component', () => {
    render(<Loader />);

    expect(screen.getByText(/Загружаем список гитар/i)).toBeInTheDocument();
  });
});
