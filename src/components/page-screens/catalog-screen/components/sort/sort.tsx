import { useState, MouseEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SortType, SortLabel } from 'types/product';
import { SortGroup } from 'utils/const';
import { convertLabelToType } from 'utils/utils';
import { loadSortedGuitarsAction } from 'store/api-actions';

function Sort(): JSX.Element {
  const [sortType, setSortType] = useState<SortType | null>(null);
  const [orderType, setOrderType] = useState<SortType | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(true);
  const dispatch = useDispatch();

  const isSortByPrice = sortType === SortGroup.Price.type;
  const isSortByRating = sortType === SortGroup.Rating.type;
  const isSortByAscendingOrder = orderType === SortGroup.Ascending.type;
  const isSortByDescendingOrder = orderType === SortGroup.Descending.type;

  const handleSortClick = async (evt: MouseEvent) => {
    const sortButton = (evt.target as HTMLButtonElement).closest('button');

    if (!sortButton) {
      return;
    }

    const type = convertLabelToType<SortLabel, typeof SortGroup>(sortButton.ariaLabel as SortLabel, SortGroup);

    switch (type) {
      case SortGroup.Price.type:
      case SortGroup.Rating.type:
        setSortType(type);
        setIsDataLoaded(false);
        break;
      case SortGroup.Ascending.type:
      case SortGroup.Descending.type:
        setOrderType(type);
        setIsDataLoaded(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isDataLoaded) {
      return;
    }

    dispatch(loadSortedGuitarsAction(sortType, orderType));
  }, [dispatch, isDataLoaded, orderType, sortType]);

  return (
    <div className="catalog-sort" onClick={handleSortClick}>
      <h2 className="catalog-sort__title">Сортировать:</h2>
      <div className="catalog-sort__type">
        <button
          aria-label={SortGroup.Price.label}
          tabIndex={isSortByPrice ? -1 : 0}
          className={`catalog-sort__type-button
          ${isSortByPrice ? 'catalog-sort__type-button--active' : ''}`}
        >по цене
        </button>
        <button
          aria-label={SortGroup.Rating.label}
          tabIndex={isSortByRating ? -1 : 0}
          className={`catalog-sort__type-button
          ${isSortByRating ? 'catalog-sort__type-button--active' : ''}`}
        >по популярности
        </button>
      </div>
      <div className="catalog-sort__order">
        <button
          aria-label={SortGroup.Ascending.label}
          tabIndex={isSortByRating ? -1 : 0}
          className={`catalog-sort__order-button catalog-sort__order-button--up
          ${isSortByAscendingOrder ? 'catalog-sort__order-button--active' : ''}`}
        >
        </button>
        <button
          aria-label={SortGroup.Descending.label}
          tabIndex={isSortByRating ? -1 : 0}
          className={`catalog-sort__order-button catalog-sort__order-button--down
          ${isSortByDescendingOrder ? 'catalog-sort__order-button--active' : ''}`}
        >
        </button>
      </div>
    </div>
  );
}

export default Sort;
