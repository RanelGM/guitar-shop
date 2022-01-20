import { MouseEvent, FormEvent, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { CommentPost, Guitar } from 'types/product';
import { ThunkActionDispatch } from 'types/action';
import { postCommentAction } from 'store/api-actions';
import { KeyboardKey } from 'utils/const';

type ModalReviewProps = {
  product: Guitar,
  onModalClose: () => void,
  onSuccessPost: () => void,
}


const getCommentPostData = (id: number, name: string, pros: string, cons: string, comment: string, rating: string): CommentPost => ({
  'guitarId': id,
  'userName': name,
  'advantage': pros,
  'disadvantage': cons,
  'comment': comment,
  'rating': Number(rating),
});

function ModalReview({ product, onModalClose, onSuccessPost }: ModalReviewProps): JSX.Element {
  const { id, name } = product;
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [validInputs, setValidInputs] = useState({
    'isNameValid': true,
    'isRatingValid': true,
    'isProsValid': true,
    'isConsValid': true,
    'isCommentAreaValid': true,
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const dispatch = useDispatch<ThunkActionDispatch>();

  useEffect(() => {
    document.addEventListener('keydown', handleEscKeydown);
    document.body.classList.add('scroll-lock');

    return () => {
      document.removeEventListener('keydown', handleEscKeydown);
      document.body.classList.remove('scroll-lock');
    };
  });

  const handleCloseBtnClick = () => {
    onModalClose();
  };

  const handleEscKeydown = (evt: KeyboardEvent) => {
    if (evt.key === KeyboardKey.Esc) {
      onModalClose();
    }
  };

  const handleOverlayClick = (evt: MouseEvent) => {
    const isOverlay = (evt.target as HTMLDivElement).closest('.modal__overlay') !== null;

    if (!isOverlay) { return; }

    onModalClose();
  };

  const postComment = async (comment: CommentPost) => {
    try {
      await dispatch(postCommentAction(comment));
      onSuccessPost();
    }
    catch {
      setIsServerError(true);
    }
    finally {
      setIsDataLoading(false);
    }
  };

  const handleFormSubmit = (evt: FormEvent) => {
    evt.preventDefault();

    if (formRef.current === null) { return; }

    const nameInput = formRef.current.querySelector<HTMLInputElement>('#user-name');
    const ratingInput = formRef.current.querySelector<HTMLInputElement>('input[name="rate"]:checked');
    const prosInput = formRef.current.querySelector<HTMLInputElement>('#pros');
    const consInput = formRef.current.querySelector<HTMLInputElement>('#cons');
    const commentArea = formRef.current.querySelector<HTMLTextAreaElement>('#comments');

    if (!nameInput || !prosInput || !consInput || !commentArea) { return; }

    const isNameValid = Boolean(nameInput.value);
    const isRatingValid = ratingInput !== null && Boolean(ratingInput.value);
    const isProsValid = Boolean(prosInput.value);
    const isConsValid = Boolean(consInput.value);
    const isCommentValid = Boolean(commentArea.value);

    const isFormValid = isNameValid && isRatingValid && isProsValid && isConsValid && isCommentValid;

    setValidInputs({
      'isNameValid': isNameValid,
      'isRatingValid': isRatingValid,
      'isProsValid': isProsValid,
      'isConsValid': isConsValid,
      'isCommentAreaValid': isCommentValid,
    });

    if (!isFormValid) {
      return;
    }

    const commentData = getCommentPostData(id, nameInput.value, prosInput.value, consInput.value, commentArea.value, ratingInput.value);

    setIsDataLoading(true);
    postComment(commentData);
  };

  return (
    <div className="modal is-active modal--review">
      <div className="modal__wrapper">
        <div onClick={handleOverlayClick} className="modal__overlay"></div>

        <div className="modal__content">
          <h2 className="modal__header modal__header--review title title--medium">Оставить отзыв</h2>
          <h3 className="modal__product-name title title--medium-20 title--uppercase">{name}</h3>
          <form ref={formRef} onSubmit={handleFormSubmit} className="form-review">
            <fieldset className='form-review__fieldset'
              disabled={isDataLoading}
            >
              {!isDataLoading && isServerError && (
                <span className="form-review__warning form-review__warning--load-error">Возникла ошибка при отправке комментария. Попробуйте позднее.</span>
              )}

              <div className="form-review__wrapper">
                <div className="form-review__name-wrapper">
                  <label className="form-review__label form-review__label--required" htmlFor="user-name">Ваше Имя</label>
                  <input className="form-review__input form-review__input--name" id="user-name" type="text" autoComplete="off" />

                  {!validInputs.isNameValid && (
                    <span className="form-review__warning">Заполните поле</span>
                  )}
                </div>

                <div>
                  <span className="form-review__label form-review__label--required">Ваша Оценка</span>
                  <div className="rate rate--reverse">
                    <input className="visually-hidden" type="radio" id="star-5" name="rate" value="5" />
                    <label className="rate__label" htmlFor="star-5" title="Отлично"></label>
                    <input className="visually-hidden" type="radio" id="star-4" name="rate" value="4" />
                    <label className="rate__label" htmlFor="star-4" title="Хорошо"></label>
                    <input className="visually-hidden" type="radio" id="star-3" name="rate" value="3" />
                    <label className="rate__label" htmlFor="star-3" title="Нормально"></label>
                    <input className="visually-hidden" type="radio" id="star-2" name="rate" value="2" />
                    <label className="rate__label" htmlFor="star-2" title="Плохо"></label>
                    <input className="visually-hidden" type="radio" id="star-1" name="rate" value="1" />
                    <label className="rate__label" htmlFor="star-1" title="Ужасно"></label>
                    <span className="rate__count"></span>

                    {!validInputs.isRatingValid && (
                      <span className="rate__message">Поставьте оценку</span>
                    )}
                  </div>
                </div>
              </div>

              <label className="form-review__label form-review__label--required" htmlFor="pros">Достоинства</label>
              <input className="form-review__input" id="pros" type="text" autoComplete="off" />
              {!validInputs.isProsValid && (
                <span className="form-review__warning">Заполните поле</span>
              )}

              <label className="form-review__label form-review__label--required" htmlFor="cons">Недостатки</label>
              <input className="form-review__input" id="cons" type="text" autoComplete="off" />
              {!validInputs.isConsValid && (
                <span className="form-review__warning">Заполните поле</span>
              )}

              <label className="form-review__label form-review__label--required" htmlFor="comments">Комментарий</label>
              <textarea className="form-review__input form-review__input--textarea" id="comments" rows={10} autoComplete="off"></textarea>
              {!validInputs.isCommentAreaValid && (
                <span className="form-review__warning">Заполните поле</span>
              )}

            </fieldset>

            <button className="button button--medium-20 form-review__button" type="submit"
              disabled={isDataLoading}
            >
              {isDataLoading ? 'Отправляем...' : 'Отправить отзыв'}
            </button>
          </form>

          <button onClick={handleCloseBtnClick} className="modal__close-btn button-cross" type="button" aria-label="Закрыть">
            <span className="button-cross__icon"></span>
            <span className="modal__close-btn-interactive-area"></span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModalReview;
