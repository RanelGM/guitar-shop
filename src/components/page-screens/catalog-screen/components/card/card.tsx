import { MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Guitar } from 'types/product';
import useModal from 'hooks/useModal';
import { getCart } from 'store/order-data/selectors';
import { getNumberWithSpaceBetween, adaptImageSrc } from 'utils/utils';
import { AppRoute, MAX_STARS_COUNT } from 'utils/const';
import { ModalCartAdd } from 'components/modals/modals';

type CardProps = {
  guitar: Guitar
}

const stars = Array.from({ length: MAX_STARS_COUNT }, (item, index) => index);

const successModalKey = 'isModalSuccessOpen';

const modalState = {
  isModalAddOpen: false,
  [successModalKey]: false,
};

function Card({ guitar }: CardProps): JSX.Element {
  const { id, name, previewImg, price, rating, comments } = guitar;

  const guitarsInCart = useSelector(getCart);
  const isGuitarInCart = guitarsInCart !== null && guitarsInCart.filter((guitarInCart) => guitarInCart.id === guitar.id).length > 0;

  const modalController = useModal(modalState, successModalKey);
  const { openedModal, setOpenedModal } = modalController;

  const adaptedImageSrc = adaptImageSrc(previewImg);
  const adaptedPrice = getNumberWithSpaceBetween(price);

  const handleCartBtnClick = (evt: MouseEvent) => {
    evt.preventDefault();

    setOpenedModal({ ...openedModal, isModalAddOpen: true });
  };

  return (
    <div className="product-card">
      <img className='product-card__img' src={adaptedImageSrc} width="75" height="190" alt={name} />
      <div className="product-card__info">
        <div className="rate product-card__rate" aria-hidden="true"><span className="visually-hidden">Рейтинг:</span>
          {stars.map((item, index) => {
            const isFullStar = index < rating;

            return (
              <svg key={`${id}-${item}`} width="12" height="11" aria-hidden="true">
                <use xlinkHref={isFullStar ? '#icon-full-star' : '#icon-star'}></use>
              </svg>
            );
          })}

          <span className="rate__count">{comments.length}</span><span className="rate__message"></span>
        </div>
        <p className="product-card__title">{name}</p>
        <p className="product-card__price"><span className="visually-hidden">Цена:</span>{adaptedPrice} ₽</p>
      </div>
      <div className="product-card__buttons">
        <Link to={`${AppRoute.Product}/${id}`} className="button button--mini">Подробнее</Link>

        {isGuitarInCart && (
          <Link to={AppRoute.Cart} className={'button button--mini button--red-border button--in-cart'}>В Корзине
          </Link>
        )}

        {!isGuitarInCart && (
          <a href="#todo"
            className={'button button--mini button--red  button--add-to-cart'}
            onClick={handleCartBtnClick}
          >Купить
          </a>
        )}

        {openedModal.isModalAddOpen && (
          <ModalCartAdd guitar={guitar} modalController={modalController} />
        )}
      </div>
    </div >
  );
}

export default Card;
