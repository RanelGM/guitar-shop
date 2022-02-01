
import { useEffect, useState, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { Review } from '../components';
import { ErrorScreen } from 'components/page-screens/page-screens';
import { getExpandedGuitar } from 'store/product-data/selectors';
import { MAX_COMMENTS_COUNT } from 'utils/const';
import { ModalReview, ModalSuccessReview } from 'components/modals/modals';

function ReviewsList(): JSX.Element {
  const product = useSelector(getExpandedGuitar);
  const [displayCount, setDisplayCount] = useState(MAX_COMMENTS_COUNT);
  const [openedModal, setOpenedModal] = useState({
    isModalReviewOpen: false,
    isModalSuccessOpen: false,
  });

  useEffect(() => {
    if (openedModal.isModalReviewOpen || openedModal.isModalSuccessOpen) {
      return;
    }

    document.addEventListener('scroll', handlePageScroll);

    return () => {
      document.removeEventListener('scroll', handlePageScroll);
    };
  });

  if (!product) { return <ErrorScreen />; }

  const reviews = product.comments;

  const isReviews = reviews.length > 0;
  const isShowMoreBtnAvailable = displayCount < reviews.length;

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
        <ModalSuccessReview
          onModalClose={handleModalsClose}
        />
      )}
    </section>
  );
}

export default ReviewsList;
