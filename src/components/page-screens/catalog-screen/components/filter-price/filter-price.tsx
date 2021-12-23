
import { useRef, useState, FormEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Guitar, SortType } from 'types/product';
import { getDefaultServerGuitars } from 'store/product-data/selectors';
import { loadFilteredByPriceGutarsAction } from 'store/api-actions';
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
  const guitars = useSelector(getDefaultServerGuitars) as Guitar[];
  const dispatch = useDispatch();

  const MIN_PRICE_VALUE = sortGuitarsByPrice(guitars, SortGroup.Ascending.type)[0].price;
  const MAX_PRICE_VALUE = sortGuitarsByPrice(guitars, SortGroup.Descending.type)[0].price;

  const [blankInputAfterChange, setBlankInputAfterChange] = useState<HTMLInputElement | null>(null);
  const [minPriceInputValue, setMinPriceValue] = useState<string>('');
  const [maxPriceInputValue, setMaxPriceValue] = useState<string>('');
  const minPriceInput = useRef<HTMLInputElement | null>(null);
  const maxPriceInput = useRef<HTMLInputElement | null>(null);

  const handlePriceFocus = (evt: FormEvent) => {
    const input = evt.target as HTMLInputElement;

    if (input.value === '') {
      setBlankInputAfterChange(null);
    }
  };

  const handlePriceBlur = (evt: FormEvent) => {
    const input = evt.target as HTMLInputElement;
    const isMinPriceInput = input === minPriceInput.current;
    const isMaxPriceInput = input === maxPriceInput.current;

    if (input.value === '') {

      if (!blankInputAfterChange) {
        return;
      }

      const priceFrom = blankInputAfterChange === minPriceInput.current ? MIN_PRICE_VALUE.toString() : minPriceInputValue;
      const priceTo = blankInputAfterChange === maxPriceInput.current ? MAX_PRICE_VALUE.toString() : maxPriceInputValue;

      dispatch(loadFilteredByPriceGutarsAction(priceFrom, priceTo));
      return;
    }

    let value = isMinPriceInput ? Number(minPriceInput.current?.value) : Number(maxPriceInput.current?.value);
    value = value < MIN_PRICE_VALUE ? MIN_PRICE_VALUE : value;
    value = value > MAX_PRICE_VALUE ? MAX_PRICE_VALUE : value;
    let updatingValue = '';

    if (isMinPriceInput) {
      updatingValue = value.toString();
      setMinPriceValue(updatingValue);
      dispatch(loadFilteredByPriceGutarsAction(updatingValue, maxPriceInputValue));
    }

    if (isMaxPriceInput) {
      updatingValue = value > Number(minPriceInputValue) ? value.toString() : minPriceInputValue;

      setMaxPriceValue(updatingValue);
      dispatch(loadFilteredByPriceGutarsAction(minPriceInputValue, updatingValue));
    }
  };

  const handlePriceChange = (evt: FormEvent) => {
    const input = evt.target as HTMLInputElement;
    const isValueBlank = input.value === '';
    const nonNegativeValue = isValueBlank ? '' : Math.abs(Number(input.value));

    if (input === minPriceInput.current) {
      setMinPriceValue(nonNegativeValue.toString());
    }

    if (input === maxPriceInput.current) {
      setMaxPriceValue(nonNegativeValue.toString());
    }

    if (isValueBlank) {
      setBlankInputAfterChange(input);
    }
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
            value={minPriceInputValue}
          />
        </div>
        <div className="form-input">
          <label className="visually-hidden">Максимальная цена</label>
          <input type="number" placeholder={getNumberWithSpaceBetween(MAX_PRICE_VALUE)} id="priceMax" name="до"
            onChange={handlePriceChange}
            ref={maxPriceInput}
            value={maxPriceInputValue}
          />
        </div>
      </div>
    </fieldset>
  );
}

export default FilterPrice;
