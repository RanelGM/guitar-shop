import { Guitar } from 'types/product';
import { GuitarGroup, MAX_STARS_COUNT } from 'utils/const';
import { adaptImageSrc, getNumberWithSpaceBetween } from 'utils/utils';

type CardProps = {
  product: Guitar,
}

const stars = Array.from({ length: MAX_STARS_COUNT }, (item, index) => index);

function Card({ product }: CardProps): JSX.Element {
  const { id, name, vendorCode, type, description, previewImg, stringCount, rating, price } = product;

  const adaptedImageSrc = adaptImageSrc(previewImg);
  const adaptedPrice = getNumberWithSpaceBetween(price);
  const adaptedType = Object.values(GuitarGroup).find((group) => group.type === type)?.labelSingular;

  return (
    <div className="product-container">
      <img className="product-container__img" width="90" height="235" alt=""
        src={adaptedImageSrc}
      />

      <div className="product-container__info-wrapper">
        <h2 className="product-container__title title title--big title--uppercase">
          {name}
        </h2>

        <div className="rate product-container__rating" aria-hidden="true"><span className="visually-hidden">Рейтинг:</span>
          {stars.map((item, index) => {
            const isFullStar = index < rating;

            return (
              <svg key={`${id}-${item}`} width="12" height="11" aria-hidden="true">
                <use xlinkHref={isFullStar ? '#icon-full-star' : '#icon-star'}></use>
              </svg>
            );
          })}

          <span className="rate__count"></span><span className="rate__message"></span>
        </div>

        <div className="tabs">
          <a className="button button--medium tabs__button" href="#characteristics">Характеристики</a>
          <a className="button button--black-border button--medium tabs__button" href="#description">Описание</a>
          <div className="tabs__content" id="characteristics">
            <table className="tabs__table">
              <tbody>
                <tr className="tabs__table-row">
                  <td className="tabs__title">Артикул:</td>
                  <td className="tabs__value">{vendorCode}</td>
                </tr>
                <tr className="tabs__table-row">
                  <td className="tabs__title">Тип:</td>
                  <td className="tabs__value">{adaptedType}</td>
                </tr>
                <tr className="tabs__table-row">
                  <td className="tabs__title">Количество струн:</td>
                  <td className="tabs__value">{stringCount} струнная</td>
                </tr>
              </tbody>
            </table>

            <p className="tabs__product-description hidden">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="product-container__price-wrapper">
        <p className="product-container__price-info product-container__price-info--title">Цена:</p>
        <p className="product-container__price-info product-container__price-info--value">
          {adaptedPrice} ₽
        </p>
        <a className="button button--red button--big product-container__button" href="#todo">Добавить в корзину</a>
      </div>
    </div>
  );
}

export default Card;
