import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import FocusLock from 'react-focus-lock';

import { ModalHandlerGroup } from 'hooks/useModal';
import { Portal } from 'components/common/common';
import browserHistory from 'store/browser-history';
import { AppRoute, INITIAL_CATALOG_PAGE } from 'utils/const';

type ModalCartSuccessProps = {
  handlerGroup: ModalHandlerGroup,
}

function ModalCartSuccess({ handlerGroup }: ModalCartSuccessProps): JSX.Element {
  const { handleCloseBtnClick, handleOverlayClick, handleModalDidMount, handleModalDidUnmount } = handlerGroup;
  const isCatalogPage = browserHistory.location.pathname.includes(AppRoute.Catalog);

  useEffect(() => {
    handleModalDidMount();

    return () => handleModalDidUnmount();
  });

  return (
    <Portal>
      <FocusLock>
        <div className="modal is-active modal--success">
          <div className="modal__wrapper">
            <div onClick={handleOverlayClick} className="modal__overlay" data-testid="overlay"></div>
            <div className="modal__content">
              <svg className="modal__icon" width="26" height="20" aria-hidden="true">
                <use xlinkHref="#icon-success"></use>
              </svg>
              <p className="modal__message">Товар успешно добавлен в корзину</p>
              <div className="modal__button-container modal__button-container--add">
                <Link
                  className="button button--small modal__button"
                  to={AppRoute.Cart}
                >Перейти в корзину
                </Link>

                {isCatalogPage && (
                  <button
                    className="button button--black-border button--small modal__button modal__button--right"
                    onClick={handleCloseBtnClick}
                  >Продолжить покупки
                  </button>
                )}

                {!isCatalogPage && (
                  <Link
                    className="button button--black-border button--small modal__button modal__button--right"
                    to={`${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`}
                  >Продолжить покупки
                  </Link>
                )}
              </div>
              <button onClick={handleCloseBtnClick} className="modal__close-btn button-cross" type="button" aria-label="Закрыть">
                <span className="button-cross__icon"></span>
                <span className="modal__close-btn-interactive-area"></span>
              </button>
            </div>
          </div>
        </div>
      </FocusLock>
    </Portal>
  );
}

export default ModalCartSuccess;
