
import { useEffect, useState, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { Review } from '../components';
import { ErrorScreen } from 'components/page-screens/page-screens';
import useModal from 'hooks/useModal';
import { getExpandedGuitar } from 'store/product-data/selectors';
import { MAX_COMMENTS_COUNT } from 'utils/const';
import { ModalReviewAdd, ModalReviewSuccess } from 'components/modals/modals';

function ReviewsList(): JSX.Element {
  const product = useSelector(getExpandedGuitar);
  const [displayCount, setDisplayCount] = useState(MAX_COMMENTS_COUNT);

  const handleSuccesEvent = () => {
    setIsModalAddOpen(false);
    setIsModalSuccessOpen(true);
  };

  const [isModalSuccessOpen, setIsModalSuccessOpen, modalSuccessHandlerGroup] = useModal();
  const [isModalAddOpen, setIsModalAddOpen, modalAddHandlerGroup] = useModal(handleSuccesEvent);

  useEffect(() => {
    if (isModalAddOpen || isModalSuccessOpen) {
      return;
    }

    document.addEventListener('scroll', handleReviewListScroll);

    return () => {
      document.removeEventListener('scroll', handleReviewListScroll);
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

  const handleAddReviewBtnClick = (evt: MouseEvent) => {
    evt.preventDefault();
    setIsModalAddOpen(true);
  };

  const handleShowMoreBtnClick = () => {
    showMoreComments();
  };

  const handleReviewListScroll = () => {
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
      <h3 className="reviews__title title title--bigger">????????????</h3>

      <a onClick={handleAddReviewBtnClick} className="button button--red-border button--big reviews__sumbit-button" href="#todo">???????????????? ??????????</a>

      {reviews.slice(0, displayCount).map((review) => (
        <Review key={review.id} review={review} />
      ))}

      {!isReviews && (
        <div>?? ???????????? ???????? ?????? ?????? ??????????????</div>
      )}

      {isShowMoreBtnAvailable && (
        <button onClick={handleShowMoreBtnClick} className="button button--medium reviews__more-button">???????????????? ?????? ????????????</button>
      )}

      {isReviews && (
        <a className="button button--up button--red-border button--big reviews__up-button" href="#header">??????????</a>
      )}

      {isModalAddOpen && (
        <ModalReviewAdd
          product={product}
          handlerGroup={modalAddHandlerGroup}
        />
      )}

      {isModalSuccessOpen && (
        <ModalReviewSuccess
          handlerGroup={modalSuccessHandlerGroup}
        />
      )}
    </section>
  );
}

export default ReviewsList;
