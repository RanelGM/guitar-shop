import { useState, MouseEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SortLabel } from 'types/product';
import { ThunkActionDispatch } from 'types/action';
import { getSortType, getOrderType } from 'store/query-data/selectors';
import { setSortType, setOrderType } from 'store/action';
import { DEFAULT_SORT_ORDER, DEFAULT_SORT_TYPE, SortGroup } from 'utils/const';
import { convertLabelToType } from 'utils/utils';
import { loadFilteredGuitarsAction } from 'store/api-actions';

function Sort(): JSX.Element {
  const dispatch = useDispatch<ThunkActionDispatch>();
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  let sortType = useSelector(getSortType);
  let orderType = useSelector(getOrderType);

  const isSortByPrice = sortType === SortGroup.Price.type;
  const isSortByRating = sortType === SortGroup.Rating.type;
  const isSortByAscendingOrder = orderType === SortGroup.Ascending.type;
  const isSortByDescendingOrder = orderType === SortGroup.Descending.type;

  useEffect(() => {
    if (!isUpdateRequired) {
      return;
    }

    dispatch(loadFilteredGuitarsAction());
  }, [dispatch, isUpdateRequired, orderType, sortType]);

  const handleSortClick = async (evt: MouseEvent) => {
    const sortButton = (evt.target as HTMLButtonElement).closest('button');

    if (!sortButton) {
      return;
    }

    const type = convertLabelToType<SortLabel, typeof SortGroup>(sortButton.getAttribute('aria-label') as SortLabel, SortGroup);
    const isSortUpdate = type === SortGroup.Price.type || type === SortGroup.Rating.type;
    const isOrderUpdate = type === SortGroup.Ascending.type || type === SortGroup.Descending.type;

    if (isSortUpdate) {
      orderType = orderType !== null ? orderType : DEFAULT_SORT_ORDER;
      dispatch(setSortType(type));
      dispatch(setOrderType(orderType));
    }

    if (isOrderUpdate) {
      sortType = sortType !== null ? sortType : DEFAULT_SORT_TYPE;
      dispatch(setSortType(sortType));
      dispatch(setOrderType(type));
    }

    setIsUpdateRequired(true);
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
        >{SortGroup.Price.label.toLowerCase()}
        </button>
        <button
          aria-label={SortGroup.Rating.label}
          tabIndex={isSortByRating ? -1 : 0}
          className={`catalog-sort__type-button
          ${isSortByRating ? 'catalog-sort__type-button--active' : ''}`}
        >{SortGroup.Rating.label.toLowerCase()}
        </button>
      </div>
      <div className="catalog-sort__order">
        <button
          aria-label={SortGroup.Ascending.label}
          tabIndex={isSortByAscendingOrder ? -1 : 0}
          className={`catalog-sort__order-button catalog-sort__order-button--up
          ${isSortByAscendingOrder ? 'catalog-sort__order-button--active' : ''}`}
        >
        </button>
        <button
          aria-label={SortGroup.Descending.label}
          tabIndex={isSortByDescendingOrder ? -1 : 0}
          className={`catalog-sort__order-button catalog-sort__order-button--down
          ${isSortByDescendingOrder ? 'catalog-sort__order-button--active' : ''}`}
        >
        </button>
      </div>
    </div>
  );
}

export default Sort;
