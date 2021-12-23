import { useState, MouseEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SortLabel } from 'types/product';
import { getSortType, getOrderType } from 'store/query-data/selectors';
import { setSortType, setOrderType } from 'store/action';
import { SortGroup } from 'utils/const';
import { convertLabelToType } from 'utils/utils';
import { loadFilteredGuitarsAction } from 'store/api-actions';

function Sort(): JSX.Element {
  const [isDataLoaded, setIsDataLoaded] = useState(true);
  const dispatch = useDispatch();
  const sortType = useSelector(getSortType);
  const orderType = useSelector(getOrderType);

  const isSortByPrice = sortType === SortGroup.Price.type;
  const isSortByRating = sortType === SortGroup.Rating.type;
  const isSortByAscendingOrder = orderType === SortGroup.Ascending.type;
  const isSortByDescendingOrder = orderType === SortGroup.Descending.type;

  useEffect(() => {
    if (isDataLoaded) {
      return;
    }

    dispatch(loadFilteredGuitarsAction());
  }, [dispatch, isDataLoaded, orderType, sortType]);

  const handleSortClick = async (evt: MouseEvent) => {
    const sortButton = (evt.target as HTMLButtonElement).closest('button');

    if (!sortButton) {
      return;
    }

    const type = convertLabelToType<SortLabel, typeof SortGroup>(sortButton.ariaLabel as SortLabel, SortGroup);

    switch (type) {
      case SortGroup.Price.type:
      case SortGroup.Rating.type:
        dispatch(setSortType(type));
        setIsDataLoaded(false);
        break;
      case SortGroup.Ascending.type:
      case SortGroup.Descending.type:
        dispatch(setOrderType(type));
        setIsDataLoaded(false);
        break;
      default:
        break;
    }
  };

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
