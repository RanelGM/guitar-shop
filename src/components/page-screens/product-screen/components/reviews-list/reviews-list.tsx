
import { useEffect, useState } from 'react';
import { Comment } from 'types/product';
import { Review } from '../components';
import { MAX_COMMENTS_COUNT } from 'utils/const';
import { sortCommentsByDate } from 'utils/utils';

type ReviewsListProps = {
  reviews: Comment[]
}

function ReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  const [displayCount, setDisplayCount] = useState(MAX_COMMENTS_COUNT);

  reviews = sortCommentsByDate(reviews).reverse();

  const isReviews = reviews.length > 0;
  const isShowMoreBtnAvailable = displayCount < reviews.length;

  useEffect(() => {
    document.addEventListener('scroll', handlePageScroll);

    return () => {
      document.removeEventListener('scroll', handlePageScroll);
    };
  });

  const showMoreComments = () => {
    const commentsCount = displayCount + MAX_COMMENTS_COUNT <= reviews.length ? displayCount + MAX_COMMENTS_COUNT : reviews.length;
    setDisplayCount(commentsCount);
  };

  const handleShowMoreBtnClick = () => {
    showMoreComments();
  };

  const handlePageScroll = () => {
    if (!isShowMoreBtnAvailable) { return; }

    const viewportHeight = window.innerHeight;
    const toBottomDistance = document.body.getBoundingClientRect().bottom;
    const isEndOfDocument = Math.floor(Math.abs(viewportHeight - toBottomDistance)) === 0;

    if (isEndOfDocument) {
      showMoreComments();
    }
  };

  return (
    <section className="reviews">
      <h3 className="reviews__title title title--bigger">Отзывы</h3>

      <a className="button button--red-border button--big reviews__sumbit-button" href="#todo">Оставить отзыв</a>

      {reviews.slice(0, displayCount).map((review) => (
        <Review key={review.id} review={review} />
      ))}

      {!isReviews && (
        <div>У товара пока что нет отзывов</div>
      )}

      {isShowMoreBtnAvailable && (
        <button onClick={handleShowMoreBtnClick} className="button button--medium reviews__more-button">Показать еще отзывы</button>
      )}

      {isReviews && (
        <a className="button button--up button--red-border button--big reviews__up-button" href="#header">Назад</a>
      )}
    </section>
  );
}

export default ReviewsList;
