import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import Review from './review';
import { getGuitarComment } from 'utils/mocks';

const randomId = 1;
const review = getGuitarComment(randomId);

const history = createMemoryHistory();

const mockComponent = (
  <Router history={history}>
    <Review review={review} />
  </Router>
);

describe('Review component', () => {
  it('should render component', async () => {
    render(mockComponent);

    const ratingStars = screen.getAllByTestId('rateStar');

    expect(ratingStars.length).toEqual(review.rating);
    expect(screen.getByText(review.userName)).toBeInTheDocument();
    expect(screen.getByText(review.advantage)).toBeInTheDocument();
    expect(screen.getByText(review.disadvantage)).toBeInTheDocument();
    expect(screen.getByText(review.comment)).toBeInTheDocument();
  });
});
