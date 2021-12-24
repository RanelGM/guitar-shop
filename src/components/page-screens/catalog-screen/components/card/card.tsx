import { MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Guitar } from 'types/product';
import { ThunkActionDispatch } from 'types/action';
import { getCart } from 'store/order-data/selectors';
import { setCart } from 'store/action';
import { getNumberWithSpaceBetween, addWordInToArray } from 'utils/utils';

type CardProps = {
  guitar: Guitar
}

const MAX_STARS_COUNT = 5;
const stars = Array.from({ length: MAX_STARS_COUNT }, (item, index) => index);

const adaptImageSrc = (src: string): string => {
  const adaptingPath = 'content';
  return `/${addWordInToArray(adaptingPath, src.split('/'))}`;
};

function Card({ guitar }: CardProps): JSX.Element {
  const { id, name, previewImg, price, rating, comments } = guitar;

  const adaptedImageSrc = adaptImageSrc(previewImg);
  const adaptedPrice = getNumberWithSpaceBetween(price);

  const guitarsInCart = useSelector(getCart);
  const isGuitarInCart = guitarsInCart?.includes(guitar);
  const dispatch = useDispatch() as ThunkActionDispatch;

  const handleCartBtnClick = (evt: MouseEvent) => {
    evt.preventDefault();

    const updatingChart = guitarsInCart ? guitarsInCart.slice() : [];

    if (!isGuitarInCart) {
      updatingChart.push(guitar);
    }

    if (isGuitarInCart) {
      const index = updatingChart.indexOf(guitar);
      updatingChart.splice(index, 1);
    }


    dispatch(setCart(updatingChart));
  };

  return (
    <div className="product-card"><img src={adaptedImageSrc} width="75" height="190" alt={name} />
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
        <a href="#todo" className="button button--mini">Подробнее</a>
        <a href="#todo"
          className={`button button--mini ${isGuitarInCart
            ? 'button--red-border button--in-cart'
            : 'button--red  button--add-to-cart'}
          `}
          onClick={handleCartBtnClick}
        >{isGuitarInCart ? 'В Корзине' : 'Купить'}
        </a>
      </div>
    </div >
  );
}

export default Card;
