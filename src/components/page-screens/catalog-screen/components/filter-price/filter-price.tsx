
import { useRef, useState, FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { Guitar, SortType } from 'types/product';
import { getGuitars } from 'store/product-data/selectors';
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
  const guitars = useSelector(getGuitars) as Guitar[];

  const minPriceValue = sortGuitarsByPrice(guitars, SortGroup.Ascending.type)[0].price;
  const maxPriceValue = sortGuitarsByPrice(guitars, SortGroup.Descending.type)[0].price;

  const [minPriceInputValue, setMinPriceValue] = useState<string>('');
  const [maxPriceInputValue, setMaxPriceValue] = useState<string>('');
  const minPriceInput = useRef<HTMLInputElement | null>(null);
  const maxPriceInput = useRef<HTMLInputElement | null>(null);

  const handlePriceBlur = (evt: FormEvent) => {
    const input = evt.target as HTMLInputElement;

    if (input.value === '') {
      return;
    }

    const isMinPriceInput = input === minPriceInput.current;
    const isMaxPriceInput = input === maxPriceInput.current;
    let value = isMinPriceInput ? Number(minPriceInput.current?.value) : Number(maxPriceInput.current?.value);
    value = value < minPriceValue ? minPriceValue : value;
    let updatingValue = '';

    if (isMinPriceInput) {
      updatingValue = value.toString();
      setMinPriceValue(updatingValue);
    }

    if (isMaxPriceInput) {
      updatingValue = value > maxPriceValue ? maxPriceValue.toString() : value.toString();
      setMaxPriceValue(updatingValue);
    }
  };

  const handlePriceChange = (evt: FormEvent) => {
    const input = evt.target as HTMLInputElement;
    const nonNegativeValue = input.value === '' ? '' : Math.abs(Number(input.value));

    if (input === minPriceInput.current) {
      setMinPriceValue(nonNegativeValue.toString());
    }

    if (input === maxPriceInput.current) {
      setMaxPriceValue(nonNegativeValue.toString());
    }
  };

  return (
    <fieldset onBlur={handlePriceBlur} className="catalog-filter__block">
      <legend className="catalog-filter__block-title">Цена, ₽</legend>
      <div className="catalog-filter__price-range">
        <div className="form-input">
          <label className="visually-hidden">Минимальная цена</label>
          <input type="number" placeholder={getNumberWithSpaceBetween(minPriceValue)} id="priceMin" name="от"
            onChange={handlePriceChange}
            ref={minPriceInput}
            value={minPriceInputValue}
          />
        </div>
        <div className="form-input">
          <label className="visually-hidden">Максимальная цена</label>
          <input type="number" placeholder={getNumberWithSpaceBetween(maxPriceValue)} id="priceMax" name="до"
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
