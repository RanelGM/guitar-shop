import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ThunkActionDispatch } from 'types/action';
import { Guitar } from 'types/product';
import { ModalHandlerGroup } from 'hooks/useModal';
import { getCart } from 'store/order-data/selectors';
import { setCart } from 'store/action';
import { adaptImageSrc, getNumberWithSpaceBetween } from 'utils/utils';
import { GuitarGroup } from 'utils/const';

type ModalCartAddProps = {
  guitar: Guitar,
  handlerGroup: ModalHandlerGroup,
}

function ModalCartAdd({ guitar, handlerGroup }: ModalCartAddProps): JSX.Element {
  const { name, vendorCode, type, previewImg, stringCount, price } = guitar;
  const { handleCloseBtnClick, handleOverlayClick, handleModalDidMount, handleModalDidUnmount, handleSuccessEvent } = handlerGroup;

  const guitarsInCart = useSelector(getCart);
  const dispatch = useDispatch<ThunkActionDispatch>();

  useEffect(() => {
    handleModalDidMount();

    return () => handleModalDidUnmount();
  });

  const adaptedImageSrc = adaptImageSrc(previewImg);
  const adaptedPrice = getNumberWithSpaceBetween(price);
  const adaptedType = Object.values(GuitarGroup).find((group) => group.type === type)?.labelSingular;

  const handleBuyBtnClick = () => {
    const updatingCart = guitarsInCart ? guitarsInCart.slice() : [];

    const updatingGuitar = Object.assign({}, guitar, {
      count: 1,
    });

    updatingCart.push(updatingGuitar);
    dispatch(setCart(updatingCart));
    handleSuccessEvent();
  };

  return (
    <div className="modal is-active">
      <div className="modal__wrapper">
        <div onClick={handleOverlayClick} className="modal__overlay" data-testid="overlay"></div>
        <div className="modal__content">
          <h2 className="modal__header title title--medium">Добавить товар в корзину</h2>
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
            <button onClick={handleBuyBtnClick} className="button button--red button--big modal__button modal__button--add">Добавить в корзину</button>
          </div>
          <button onClick={handleCloseBtnClick} className="modal__close-btn button-cross" type="button" aria-label="Закрыть">
            <span className="button-cross__icon"></span>
            <span className="modal__close-btn-interactive-area"></span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalCartAdd;
