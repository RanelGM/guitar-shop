
import { useEffect, useState, MouseEvent } from 'react';
import { Guitar } from 'types/product';
import { Review } from '../components';
import { MAX_COMMENTS_COUNT } from 'utils/const';
import { sortCommentsByDate } from 'utils/utils';
import { ModalReview, ModalSuccess } from './components/components';

type ReviewsListProps = {
  product: Guitar,
}

function ReviewsList({ product }: ReviewsListProps): JSX.Element {
  const [displayCount, setDisplayCount] = useState(MAX_COMMENTS_COUNT);
  const [openedModal, setOpenedModal] = useState({
    isModalReviewOpen: false,
    isModalSuccessOpen: false,
  });

  const reviews = sortCommentsByDate(product.comments).reverse();

  const isReviews = reviews.length > 0;
  const isShowMoreBtnAvailable = displayCount < reviews.length;

  useEffect(() => {
    if (openedModal.isModalReviewOpen || openedModal.isModalSuccessOpen) {
      return;
    }

    document.addEventListener('scroll', handlePageScroll);

    return () => {
      document.removeEventListener('scroll', handlePageScroll);
    };
  });

  const showMoreComments = () => {
    const commentsCount = displayCount + MAX_COMMENTS_COUNT <= reviews.length ? displayCount + MAX_COMMENTS_COUNT : reviews.length;
    setDisplayCount(commentsCount);
  };

  const handleModalsClose = () => {
    setOpenedModal({ isModalReviewOpen: false, isModalSuccessOpen: false });
  };

  const handleSuccessPost = () => {
    setOpenedModal({ isModalReviewOpen: false, isModalSuccessOpen: true });
  };

  const handleAddReviewBtnClick = (evt: MouseEvent) => {
    evt.preventDefault();
    setOpenedModal({ ...openedModal, isModalReviewOpen: true });
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

      <a onClick={handleAddReviewBtnClick} className="button button--red-border button--big reviews__sumbit-button" href="#todo">Оставить отзыв</a>

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

      {openedModal.isModalReviewOpen && (
        <ModalReview
          product={product}
          onModalClose={handleModalsClose}
          onSuccessPost={handleSuccessPost}
        />
      )}

      {openedModal.isModalSuccessOpen && (
        <ModalSuccess
          onModalClose={handleModalsClose}
        />
      )}
    </section>
  );
}

export default ReviewsList;
