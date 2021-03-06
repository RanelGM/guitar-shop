
import { useRef, useState, useEffect, FormEvent, KeyboardEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThunkActionDispatch } from 'types/action';
import { getDefaultServerGuitars } from 'store/product-data/selectors';
import { loadFilteredGuitarsAction } from 'store/api-actions';
import { setPriceRangeFrom, setPriceRangeTo } from 'store/action';
import { getPriceRangeFrom, getPriceRangeTo } from 'store/query-data/selectors';
import { getNumberWithSpaceBetween, sortGuitarsByPrice } from 'utils/utils';
import { SortGroup, KeyboardKey } from 'utils/const';

function FilterPrice(): JSX.Element {
  const dispatch = useDispatch<ThunkActionDispatch>();
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [blankInputAfterChange, setBlankInputAfterChange] = useState<HTMLInputElement | null>(null);

  const priceRangeFrom = useSelector(getPriceRangeFrom);
  const priceRangeTo = useSelector(getPriceRangeTo);
  const minPriceInput = useRef<HTMLInputElement | null>(null);
  const maxPriceInput = useRef<HTMLInputElement | null>(null);

  const guitars = useSelector(getDefaultServerGuitars);
  const isGuitars = guitars.length !== 0;

  const MIN_PRICE_VALUE = !isGuitars ? 0 : sortGuitarsByPrice(guitars, SortGroup.Ascending.type)[0].price;
  const MAX_PRICE_VALUE = !isGuitars ? 0 : sortGuitarsByPrice(guitars, SortGroup.Descending.type)[0].price;

  useEffect(() => {
    if (!isUpdateRequired) {
      return;
    }

    dispatch(loadFilteredGuitarsAction());
  }, [dispatch, isUpdateRequired, priceRangeFrom, priceRangeTo]);

  const handlePriceFocus = (evt: FormEvent) => {
    const input = evt.target as HTMLInputElement;
    setIsUpdateRequired(false);

    if (input.value === '') {
      setBlankInputAfterChange(null);
    }
  };

  const handlePriceBlur = async (evt: FormEvent) => {
    const input = evt.target as HTMLInputElement;
    const isMinPriceInput = input === minPriceInput.current;
    const isMaxPriceInput = input === maxPriceInput.current;

    if (input.value === '') {
      if (!blankInputAfterChange) {
        return;
      }

      setIsUpdateRequired(true);
      return;
    }

    let value = isMinPriceInput ? Number(minPriceInput.current?.value) : Number(maxPriceInput.current?.value);
    value = value < MIN_PRICE_VALUE ? MIN_PRICE_VALUE : value;
    value = value > MAX_PRICE_VALUE ? MAX_PRICE_VALUE : value;
    let updatingValue = '';

    if (isMinPriceInput) {
      updatingValue = value.toString();

      const valueTo = priceRangeTo && Number(priceRangeTo) < Number(updatingValue) ? '' : priceRangeTo;

      dispatch(setPriceRangeFrom(updatingValue));
      dispatch(setPriceRangeTo(valueTo));
    }

    if (isMaxPriceInput) {
      updatingValue = value > Number(priceRangeFrom) ? value.toString() : priceRangeFrom;

      dispatch(setPriceRangeTo(updatingValue));
    }

    setIsUpdateRequired(true);
  };

  const handlePriceChange = (evt: FormEvent) => {
    const input = evt.target as HTMLInputElement;
    const isValueBlank = input.value === '';
    const nonNegativeValue = isValueBlank ? '' : Math.abs(Number(input.value));

    if (input === minPriceInput.current) {
      dispatch(setPriceRangeFrom(nonNegativeValue.toString()));
    }

    if (input === maxPriceInput.current) {
      dispatch(setPriceRangeTo(nonNegativeValue.toString()));
    }

    if (isValueBlank) {
      setBlankInputAfterChange(input);
      return;
    }

    setBlankInputAfterChange(null);
  };

  const handleEnterKeydown = (evt: KeyboardEvent) => {
    const input = evt.target as HTMLInputElement;

    if (evt.key !== KeyboardKey.Enter) {
      return;
    }

    input.blur();
  };

  return (
    <fieldset onFocus={handlePriceFocus} onBlur={handlePriceBlur} className="catalog-filter__block">
      <legend className="catalog-filter__block-title">????????, ???</legend>
      <div className="catalog-filter__price-range">
        <div className="form-input">
          <label className="visually-hidden" htmlFor="priceMin">?????????????????????? ????????</label>
          <input type="number" placeholder={getNumberWithSpaceBetween(MIN_PRICE_VALUE)} id="priceMin" name="????"
            onChange={handlePriceChange}
            onKeyDown={handleEnterKeydown}
            ref={minPriceInput}
            value={!priceRangeFrom && blankInputAfterChange === minPriceInput.current ? '' : priceRangeFrom}
          />
        </div>
        <div className="form-input">
          <label className="visually-hidden" htmlFor="priceMax">???????????????????????? ????????</label>
          <input type="number" placeholder={getNumberWithSpaceBetween(MAX_PRICE_VALUE)} id="priceMax" name="????"
            onChange={handlePriceChange}
            onKeyDown={handleEnterKeydown}
            ref={maxPriceInput}
            value={!priceRangeTo && blankInputAfterChange === maxPriceInput.current ? '' : priceRangeTo}
          />
        </div>
      </div>
    </fieldset>
  );
}

export default FilterPrice;
