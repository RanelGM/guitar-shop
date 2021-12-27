
import { useRef, useState, FormEvent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Guitar, SortType } from 'types/product';
import { ThunkActionDispatch } from 'types/action';
import { getDefaultServerGuitars } from 'store/product-data/selectors';
import { loadFilteredGuitarsAction } from 'store/api-actions';
import { setPriceRangeFrom, setPriceRangeTo } from 'store/action';
import { getPriceRangeFrom, getPriceRangeTo } from 'store/query-data/selectors';
import { getNumberWithSpaceBetween } from 'utils/utils';
import { SortGroup } from 'utils/const';

const sortGuitarsByPrice = (array: Guitar[], sortType: SortType) => {
  switch (sortType) {
    case SortGroup.Ascending.type:
      return array.slice().sort((first, second) => first.price - second.price);
    case SortGroup.Descending.type:
      return array.slice().sort((first, second) => second.price - first.price);
    default:
      return array;
  }
};

function FilterPrice(): JSX.Element {
  const dispatch = useDispatch() as ThunkActionDispatch;
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [blankInputAfterChange, setBlankInputAfterChange] = useState<HTMLInputElement | null>(null);

  const priceRangeFrom = useSelector(getPriceRangeFrom);
  const priceRangeTo = useSelector(getPriceRangeTo);
  const minPriceInput = useRef<HTMLInputElement | null>(null);
  const maxPriceInput = useRef<HTMLInputElement | null>(null);

  const guitars = useSelector(getDefaultServerGuitars) as Guitar[];
  const MIN_PRICE_VALUE = sortGuitarsByPrice(guitars, SortGroup.Ascending.type)[0].price;
  const MAX_PRICE_VALUE = sortGuitarsByPrice(guitars, SortGroup.Descending.type)[0].price;

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

      const valueTo = priceRangeTo && priceRangeTo < updatingValue ? '' : priceRangeTo;
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

  return (
    <fieldset onFocus={handlePriceFocus} onBlur={handlePriceBlur} className="catalog-filter__block">
      <legend className="catalog-filter__block-title">Цена, ₽</legend>
      <div className="catalog-filter__price-range">
        <div className="form-input">
          <label className="visually-hidden">Минимальная цена</label>
          <input type="number" placeholder={getNumberWithSpaceBetween(MIN_PRICE_VALUE)} id="priceMin" name="от"
            onChange={handlePriceChange}
            ref={minPriceInput}
            value={blankInputAfterChange === minPriceInput.current ? '' : priceRangeFrom}
          />
        </div>
        <div className="form-input">
          <label className="visually-hidden">Максимальная цена</label>
          <input type="number" placeholder={getNumberWithSpaceBetween(MAX_PRICE_VALUE)} id="priceMax" name="до"
            onChange={handlePriceChange}
            ref={maxPriceInput}
            value={blankInputAfterChange === maxPriceInput.current ? '' : priceRangeTo}
          />
        </div>
      </div>
    </fieldset>
  );
}

export default FilterPrice;
