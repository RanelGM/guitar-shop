import { ChangeEvent, KeyboardEvent, useState } from 'react';

import { GuitarInCart } from 'types/product';
import useModal from 'hooks/useModal';
import { ModalCartDelete } from 'components/modals/modals';
import { GuitarGroup, KeyboardKey, MIN_PRODUCT_COUNT, MAX_PRODUCT_COUNT } from 'utils/const';
import { adaptImageSrc, getNumberWithSpaceBetween } from 'utils/utils';

type CardProps = {
  guitar: GuitarInCart,
  onCartUpdate: (count: number, guitar: GuitarInCart) => void,
}

function Card({ guitar, onCartUpdate }: CardProps): JSX.Element {
  const { name, vendorCode, type, previewImg, stringCount, price, count } = guitar;
  const [currentCount, setCurrentCount] = useState<number | string>(count);

  const handleSuccesEvent = () => setIsModalDeleteOpen(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen, modalDeleteHandlerGroup] = useModal(handleSuccesEvent);

  const totalPrice = price * count;
  const adaptedImageSrc = adaptImageSrc(previewImg);
  const adaptedPrice = getNumberWithSpaceBetween(price);
  const adaptedTotalPrice = getNumberWithSpaceBetween(totalPrice);
  const adaptedType = Object.values(GuitarGroup).find((group) => group.type === type)?.labelSingular;

  const handleCountChange = (evt: ChangeEvent) => {
    const input = evt.target as HTMLInputElement;
    const value = input.value;
    const isValueOutOfSymbol = value.length > MAX_PRODUCT_COUNT.toString().length;

    if (isValueOutOfSymbol) {
      return;
    }

    setCurrentCount(value);
  };

  const handleDecrementBtnClick = () => {
    const isValueValid = Number(currentCount) > MIN_PRODUCT_COUNT;
    const value = isValueValid ? Number(currentCount) - 1 : MIN_PRODUCT_COUNT;

    if (!isValueValid) {
      setIsModalDeleteOpen(true);
      return;
    }

    setCurrentCount(value);
    onCartUpdate(value, guitar);
  };

  const handleIncrementBtnClick = () => {
    const value = Number(currentCount) < MAX_PRODUCT_COUNT ? Number(currentCount) + 1 : MAX_PRODUCT_COUNT;
    setCurrentCount(value);
    onCartUpdate(value, guitar);
  };

  const handleCountBlur = (evt: ChangeEvent) => {
    const input = evt.target as HTMLInputElement;
    const value = Number(input.value);

    let updatingCount = value > MIN_PRODUCT_COUNT ? value : MIN_PRODUCT_COUNT;
    updatingCount = updatingCount < MAX_PRODUCT_COUNT ? updatingCount : MAX_PRODUCT_COUNT;

    setCurrentCount(updatingCount);
    onCartUpdate(updatingCount, guitar);
  };

  const handleEnterKeydown = (evt: KeyboardEvent) => {
    const input = evt.target as HTMLInputElement;

    if (evt.key !== KeyboardKey.Enter) {
      return;
    }

    input.blur();
  };

  const handleDeleteBtnClick = () => {
    setIsModalDeleteOpen(true);
  };

  return (
    <div className="cart-item">
      <button onClick={handleDeleteBtnClick} className="cart-item__close-button button-cross" type="button" aria-label="Удалить">
        <span className="button-cross__icon"></span>
        <span className="cart-item__close-button-interactive-area"></span>
      </button>

      <div className="cart-item__image">
        <img src={adaptedImageSrc} width="55" height="130" alt={`Гитара ${name}`} />
      </div>

      <div className="product-info cart-item__info">
        <p className="product-info__title">{adaptedType} {name}</p>
        <p className="product-info__info">Артикул: {vendorCode}</p>
        <p className="product-info__info">{adaptedType}, {stringCount} струнная</p>
      </div>

      <div className="cart-item__price">{adaptedPrice} ₽</div>

      <div className="quantity cart-item__quantity">
        <button className="quantity__button" aria-label="Уменьшить количество"
          onClick={handleDecrementBtnClick}
        >
          <svg width="8" height="8" aria-hidden="true">
            <use xlinkHref="#icon-minus"></use>
          </svg>
        </button>

        <input
          className="quantity__input" type="number" id="counter" name="counter"
          min={MIN_PRODUCT_COUNT}
          max={MAX_PRODUCT_COUNT}
          aria-label="Изменить количество"
          value={currentCount}
          onChange={handleCountChange}
          onBlur={handleCountBlur}
          onKeyDown={handleEnterKeydown}
        />

        <button className="quantity__button" aria-label="Увеличить количество"
          onClick={handleIncrementBtnClick}
        >
          <svg width="8" height="8" aria-hidden="true">
            <use xlinkHref="#icon-plus"></use>
          </svg>
        </button>
      </div>

      <div className="cart-item__price-total">{adaptedTotalPrice} ₽</div>

      {isModalDeleteOpen && (
        <ModalCartDelete guitar={guitar} handlerGroup={modalDeleteHandlerGroup} />
      )}
    </div>
  );
}

export default Card;
