import { useEffect, MouseEvent } from 'react';
import FocusLock from 'react-focus-lock';
import { KeyboardKey } from 'utils/const';

type ModalSuccessProps = {
  onModalClose: () => void
}

function ModalSuccess({ onModalClose }: ModalSuccessProps): JSX.Element {
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

  return (
    <FocusLock>
      <div className="modal is-active modal--success modal-for-ui-kit">
        <div className="modal__wrapper">
          <div onClick={handleOverlayClick} className="modal__overlay" data-testid="overlay"></div>
          <div className="modal__content">
            <svg className="modal__icon" width="26" height="20" aria-hidden="true">
              <use xlinkHref="#icon-success"></use>
            </svg>
            <p className="modal__message">Спасибо за ваш отзыв!</p>
            <div className="modal__button-container modal__button-container--review">
              <button onClick={handleCloseBtnClick} className="button button--small modal__button modal__button--review">К покупкам!</button>
            </div>
            <button onClick={handleCloseBtnClick} className="modal__close-btn button-cross" type="button" aria-label="Закрыть">
              <span className="button-cross__icon"></span>
              <span className="modal__close-btn-interactive-area"></span>
            </button>
          </div>
        </div>
      </div>
    </FocusLock>
  );
}

export default ModalSuccess;
