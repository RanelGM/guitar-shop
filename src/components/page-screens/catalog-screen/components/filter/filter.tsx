import { FormEvent, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GuitarType, GuitarKey } from 'types/product';
import { ThunkActionDispatch } from 'types/action';
import { getGuitarType } from 'store/query-data/selectors';
import { setGuitarType } from 'store/action';
import { loadFilteredGuitarsAction } from 'store/api-actions';
import { FilterPrice } from '../components';
import { updateArray } from 'utils/utils';
import { GuitarGroup } from 'utils/const';

const GuitarGroupValues = Object.values(GuitarGroup);

const getUniqueStringsFromTypes = (types: GuitarType[]): number[] => {
  const stringSet = new Set<number>();

  types.forEach((type) => {
    const stringsCount = GuitarGroupValues.find((group) => group.type === type) as typeof GuitarGroup[GuitarKey];
    stringsCount.strings.forEach((count) => stringSet.add(count));
  });

  return Array.from(stringSet);
};

const getUniqueTypesFromStringsCount = (stringsCount: number[]): GuitarType[] => {
  const groups = GuitarGroupValues.filter((group) => group.strings.some((count) => stringsCount.includes(count)));
  return groups.map((type) => type.type);
};

function Filter(): JSX.Element {
  const dispatch = useDispatch() as ThunkActionDispatch;
  const [availableStringsCount, setAvailableStringsCount] = useState<number[] | null>(null);
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [checkedStringsCount, setCheckedStringsCount] = useState<number[] | null>(null);
  const checkedGuitarsTypes = useSelector(getGuitarType);

  useEffect(() => {
    if (!isUpdateRequired) {
      return;
    }

    dispatch(loadFilteredGuitarsAction());
    setIsUpdateRequired(false);
  }, [dispatch, isUpdateRequired]);

  const guitarsTypes = GuitarGroupValues.map((group) => group.type);
  const stringsCount = getUniqueStringsFromTypes(guitarsTypes).sort((first, second) => first - second);
  const isGuitarTypeCheckboxActive = checkedGuitarsTypes !== null && checkedGuitarsTypes.length > 0;
  const isStringCountCheckboxActive = checkedStringsCount !== null && checkedStringsCount.length > 0;

  const handleCheckboxChange = (evt: FormEvent) => {
    const input = evt.target as HTMLInputElement;
    const typeInput = input.closest('.catalog-filter__block-guitar-type');
    const stringInput = input.closest('.catalog-filter__block-guitar-string');

    if (typeInput) {
      const type = input.id as GuitarType;
      const checkedTypes = updateArray<GuitarType>(checkedGuitarsTypes, type);
      const availableTypes = isStringCountCheckboxActive ? getUniqueTypesFromStringsCount(checkedStringsCount) : checkedTypes;
      const availableStrings = checkedTypes.length ? getUniqueStringsFromTypes(checkedTypes) : getUniqueStringsFromTypes(availableTypes);

      if (isStringCountCheckboxActive) {
        const availableToCheckCount = checkedStringsCount.filter((count) => availableStrings.includes(count));
        setCheckedStringsCount(availableToCheckCount);
      }

      dispatch(setGuitarType(checkedTypes));
      setAvailableStringsCount(availableStrings);
    }

    if (stringInput) {
      const stringCount = Number(input.id.split('-')[0]);
      const checkedStrings = updateArray<number>(checkedStringsCount, stringCount);
      const availableStrings = isGuitarTypeCheckboxActive ? getUniqueStringsFromTypes(checkedGuitarsTypes) : checkedStrings;

      setCheckedStringsCount(checkedStrings);
      setAvailableStringsCount(availableStrings);
    }

    setIsUpdateRequired(true);
  };

  return (
    <form className="catalog-filter">
      <h2 className="title title--bigger catalog-filter__title">Фильтр</h2>
      <FilterPrice />

      <fieldset className="catalog-filter__block">
        <legend className="catalog-filter__block-title">Тип гитар</legend>

        {GuitarGroupValues.map((groupItem) => {
          const isChecked = checkedGuitarsTypes !== null && checkedGuitarsTypes.includes(groupItem.type);

          return (
            <div key={groupItem.type} className="form-checkbox catalog-filter__block-item">
              <input className="visually-hidden catalog-filter__block-guitar-type" type="checkbox"
                id={groupItem.type}
                name={groupItem.type}
                onChange={handleCheckboxChange}
                checked={isChecked}
              />
              <label htmlFor={groupItem.type}>{groupItem.label}</label>
            </div>
          );
        })}

      </fieldset>
      <fieldset className="catalog-filter__block">
        <legend className="catalog-filter__block-title">Количество струн</legend>

        {stringsCount.map((count) => {
          const isAvailable = availableStringsCount !== null && availableStringsCount.includes(count);
          const isChecked = checkedStringsCount !== null && checkedStringsCount.includes(count);

          return (
            <div key={`${count}-string`} className="form-checkbox catalog-filter__block-item">
              <input onChange={handleCheckboxChange} className="visually-hidden catalog-filter__block-guitar-string" type="checkbox" id={`${count}-strings`} name={`${count}-strings`}
                disabled={!isAvailable && isGuitarTypeCheckboxActive}
                checked={isAvailable && isChecked}
              />
              <label htmlFor={`${count}-strings`}>{count}</label>
            </div>
          );
        })}
      </fieldset>
    </form>
  );
}

export default Filter;
