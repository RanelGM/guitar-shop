import { useState, MouseEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SortType, SortAria } from 'utils/const';
import { loadSortedGuitarsAction } from 'store/api-actions';

const convertAriaToType = (ariaLabel: SortAria): SortType | null => {
  switch (ariaLabel) {
    case (SortAria.Price):
      return SortType.Price;
    case (SortAria.Rating):
      return SortType.Rating;
    case (SortAria.Ascending):
      return SortType.Ascending;
    case (SortAria.Descending):
      return SortType.Descending;
    default:
      return null;
  }
};

function Sort(): JSX.Element {
  const [sortType, setSortType] = useState<SortType | null>(null);
  const [orderType, setOrderType] = useState<SortType | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(true);
  const dispatch = useDispatch();

  const isSortByPrice = sortType === SortType.Price;
  const isSortByRating = sortType === SortType.Rating;
  const isSortByAscendingOrder = orderType === SortType.Ascending;
  const isSortByDescendingOrder = orderType === SortType.Descending;

  const handleSortClick = async (evt: MouseEvent) => {
    const sortButton = (evt.target as HTMLButtonElement).closest('button');

    if (!sortButton) {
      return;
    }

    const type = convertAriaToType(sortButton.ariaLabel as SortAria);

    switch (type) {
      case SortType.Price:
      case SortType.Rating:
        setSortType(type);
        setIsDataLoaded(false);
        break;
      case SortType.Ascending:
      case SortType.Descending:
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
          aria-label={SortAria.Price}
          tabIndex={isSortByPrice ? -1 : 0}
          className={`catalog-sort__type-button
          ${isSortByPrice ? 'catalog-sort__type-button--active' : ''}`}
        >по цене
        </button>
        <button
          aria-label={SortAria.Rating}
          tabIndex={isSortByRating ? -1 : 0}
          className={`catalog-sort__type-button
          ${isSortByRating ? 'catalog-sort__type-button--active' : ''}`}
        >по популярности
        </button>
      </div>
      <div className="catalog-sort__order">
        <button
          aria-label={SortAria.Ascending}
          tabIndex={isSortByRating ? -1 : 0}
          className={`catalog-sort__order-button catalog-sort__order-button--up
          ${isSortByAscendingOrder ? 'catalog-sort__order-button--active' : ''}`}
        >
        </button>
        <button
          aria-label={SortAria.Descending}
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
