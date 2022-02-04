import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FocusLock from 'react-focus-lock';

import { ThunkActionDispatch } from 'types/action';
import { GuitarInCart } from 'types/product';
import { Portal } from 'components/common/common';
import { ModalHandlerGroup } from 'hooks/useModal';
import { getCart } from 'store/order-data/selectors';
import { setCart } from 'store/action';
import { adaptImageSrc, getNumberWithSpaceBetween, updateArray } from 'utils/utils';
import { GuitarGroup } from 'utils/const';


type ModalCartDeleteProps = {
  guitar: GuitarInCart,
  handlerGroup: ModalHandlerGroup,
}

function ModalCartDelete({ guitar, handlerGroup }: ModalCartDeleteProps): JSX.Element {
  const { name, vendorCode, type, previewImg, stringCount, price } = guitar;
  const { handleCloseBtnClick, handleOverlayClick, handleModalDidMount, handleModalDidUnmount, handleSuccessEvent } = handlerGroup;

  const cart = useSelector(getCart);
  const dispatch = useDispatch<ThunkActionDispatch>();

  useEffect(() => {
    handleModalDidMount();

    return () => handleModalDidUnmount();
  });

  const adaptedImageSrc = adaptImageSrc(previewImg);
  const adaptedPrice = getNumberWithSpaceBetween(price);
  const adaptedType = Object.values(GuitarGroup).find((group) => group.type === type)?.labelSingular;

  const handleDeleteBtnClick = () => {
    const updatingCart = updateArray(cart, guitar);
    dispatch(setCart(updatingCart));
    handleSuccessEvent();
  };

  return (
    <Portal>
      <FocusLock>
        <div className="modal is-active">
          <div className="modal__wrapper">
            <div onClick={handleOverlayClick} className="modal__overlay" data-close-modal=""></div>
            <div className="modal__content">
              <h2 className="modal__header title title--medium title--red">Удалить этот товар?</h2>
              <div className="modal__info">
                <img className="modal__img" src={adaptedImageSrc} width="67" height="137" alt="Честер bass" />
                <div className="modal__info-wrapper">
                  <h3 className="modal__product-name title title--little title--uppercase">Гитара {name}</h3>
                  <p className="modal__product-params modal__product-params--margin-11">Артикул: {vendorCode}</p>
                  <p className="modal__product-params">{adaptedType}, {stringCount} струнная</p>
                  <p className="modal__price-wrapper">
                    <span className="modal__price">Цена:</span>
                    <span className="modal__price">{adaptedPrice} ₽</span>
                  </p>
                </div>
              </div>
              <div className="modal__button-container">
                <button onClick={handleDeleteBtnClick} className="button button--small modal__button">Удалить товар</button>
                <button onClick={handleCloseBtnClick} className="button button--black-border button--small modal__button modal__button--right">Продолжить покупки</button>
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

export default ModalCartDelete;
