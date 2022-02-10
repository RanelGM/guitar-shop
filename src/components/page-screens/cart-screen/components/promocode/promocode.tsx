import { FormEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ThunkActionDispatch } from 'types/action';
import { postDiscountAction } from 'store/api-actions';
import { setDiscount } from 'store/action';
import { INITIAL_PROMOCODE_DISCOUNT, PromocodeState } from 'utils/const';

function Promocode(): JSX.Element {
  const [promocodeStatus, setPromocodeStatus] = useState(PromocodeState.Initial);
  const dispatch = useDispatch<ThunkActionDispatch>();
  const promocodeRef = useRef<null | HTMLInputElement>(null);

  const isSubmitBtnDisabled = promocodeStatus === PromocodeState.Loading;

  const postCoupon = async (value: string) => {
    const coupon = {
      coupon: value,
    };

    try {
      setPromocodeStatus(PromocodeState.Loading);
      await dispatch(postDiscountAction(coupon));
      setPromocodeStatus(PromocodeState.Valid);
    }
    catch {
      setPromocodeStatus(PromocodeState.Invalid);
      dispatch(setDiscount(INITIAL_PROMOCODE_DISCOUNT));
    }
  };

  const handleFormSubmit = (evt: FormEvent) => {
    evt.preventDefault();

    const input = promocodeRef.current;
    const value = input ? input.value.toLowerCase().trim() : null;

    if (!input) { return; }

    if (!value) {
      setPromocodeStatus(PromocodeState.Blank);
      dispatch(setDiscount(INITIAL_PROMOCODE_DISCOUNT));
      return;
    }

    postCoupon(value);
  };

  const handleInputChange = () => {
    const input = promocodeRef.current;
    const whiteSpaceReg = new RegExp(/\s/g);

    if (!input) { return; }

    input.value = input.value.replace(whiteSpaceReg, '');
  };

  return (
    <div className="cart__coupon coupon">
      <h2 className="title title--little coupon__title">Промокод на скидку</h2>
      <p className="coupon__info">Введите свой промокод, если он у вас есть.</p>
      <form onSubmit={handleFormSubmit} className="coupon__form" id="coupon-form" method="post" action="/">
        <div className="form-input coupon__input">
          <label className="visually-hidden">Промокод</label>
          <input type="text" placeholder="Введите промокод" id="coupon" name="coupon"
            ref={promocodeRef}
            onChange={handleInputChange}
          />

          {promocodeStatus === PromocodeState.Valid && (
            <p className="form-input__message form-input__message--success">Промокод принят</p>
          )}

          {promocodeStatus === PromocodeState.Invalid && (
            <p className="form-input__message form-input__message--error">Неверный промокод</p>
          )}

          {promocodeStatus === PromocodeState.Blank && (
            <p className="form-input__message form-input__message--error">Введите промокод</p>
          )}

          {promocodeStatus === PromocodeState.Loading && (
            <p className="form-input__message">Применяем промокод...</p>
          )}
        </div>
        <button className="button button--big coupon__button" disabled={isSubmitBtnDisabled}>Применить</button>
      </form>
    </div>
  );
}

export default Promocode;
