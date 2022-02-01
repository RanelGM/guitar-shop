import { GuitarInCart } from 'types/product';
import { GuitarGroup } from 'utils/const';
import { adaptImageSrc, getNumberWithSpaceBetween } from 'utils/utils';

type CardProps = {
  guitar: GuitarInCart
}

function Card({ guitar }: CardProps): JSX.Element {
  const {name, vendorCode, type, previewImg, stringCount, price, count  } = guitar;
  const totalPrice = price * count;

  const adaptedImageSrc = adaptImageSrc(previewImg);
  const adaptedPrice = getNumberWithSpaceBetween(price);
  const adaptedTotalPrice = getNumberWithSpaceBetween(totalPrice);
  const adaptedType = Object.values(GuitarGroup).find((group) => group.type === type)?.labelSingular;

  return (
    <div className="cart-item">
      <button className="cart-item__close-button button-cross" type="button" aria-label="Удалить">
        <span className="button-cross__icon"></span>
        <span className="cart-item__close-button-interactive-area"></span>
      </button>

      <div className="cart-item__image">
        <img src={adaptedImageSrc} width="55" height="130" alt={`Гитара ${name}`}/>
      </div>

      <div className="product-info cart-item__info">
        <p className="product-info__title">{adaptedType} {name}</p>
        <p className="product-info__info">Артикул: {vendorCode}</p>
        <p className="product-info__info">{adaptedType}, {stringCount} струнная</p>
      </div>

      <div className="cart-item__price">{adaptedPrice} ₽</div>

      <div className="quantity cart-item__quantity">
        <button className="quantity__button" aria-label="Уменьшить количество">
          <svg width="8" height="8" aria-hidden="true">
            <use xlinkHref="#icon-minus"></use>
          </svg>
        </button>
        <input className="quantity__input" type="number" id="counter" name="counter" max="99" placeholder={`${count}`} />
        <button className="quantity__button" aria-label="Увеличить количество">
          <svg width="8" height="8" aria-hidden="true">
            <use xlinkHref="#icon-plus"></use>
          </svg>
        </button>
      </div>

      <div className="cart-item__price-total">{adaptedTotalPrice} ₽</div>
    </div>
  );
}

export default Card;
