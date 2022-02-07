import { render, screen } from '@testing-library/react';
import Portal from './portal';

const childMock = (
  <div>Random modal</div>
);

describe('Loader component', () => {
  it('should render component with passed child JSX Element', () => {
    render(<Portal>{childMock}</Portal>);

    expect(screen.getByText(/Random modal/i)).toBeInTheDocument();
  });
});
