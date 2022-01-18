
import { Comment } from 'types/product';
import { Review } from '../components';

type ReviewsListProps = {
  reviews: Comment[]
}

function ReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  return (
    <section className="reviews">
      <h3 className="reviews__title title title--bigger">Отзывы</h3>

      <a className="button button--red-border button--big reviews__sumbit-button" href="#todo">Оставить отзыв</a>

      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}

      <button className="button button--medium reviews__more-button">Показать еще отзывы</button><a className="button button--up button--red-border button--big reviews__up-button" href="#header">Наверх</a>
    </section>
  );
}

export default ReviewsList;
