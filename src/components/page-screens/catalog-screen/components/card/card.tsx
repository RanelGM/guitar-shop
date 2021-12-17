import { Guitar } from 'types/guitar';
import { getNumberWithSpaceBetween, addWordInToArray } from 'utils/utils';

type CardProps = {
  guitar: Guitar
}

const MAX_STARS_COUNT = 5;
const stars = Array.from({ length: MAX_STARS_COUNT }, (item, index) => index);

const adaptImageSrc = (src: string): string => {
  const adaptingPath = 'content';
  return addWordInToArray(adaptingPath, src.split('/'));
};

function Card({ guitar }: CardProps): JSX.Element {
  const { id, name, previewImg, price, rating } = guitar;

  const adaptedImageSrc = adaptImageSrc(previewImg);
  const adaptedPrice = getNumberWithSpaceBetween(price);

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

          <span className="rate__count">#todo</span><span className="rate__message"></span>
        </div>
        <p className="product-card__title">{name}</p>
        <p className="product-card__price"><span className="visually-hidden">Цена:</span>{adaptedPrice} ₽
        </p>
      </div>
      <div className="product-card__buttons"><a href="#todo" className="button button--mini">Подробнее</a><a className="button button--red button--mini button--add-to-cart" href="#todo">Купить</a>
      </div>
    </div>
  );
}

export default Card;
