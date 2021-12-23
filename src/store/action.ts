import { createAction } from '@reduxjs/toolkit';
import { ActionType } from 'types/action';
import { Guitar, GuitarType, SortType } from 'types/product';

export const loadProductData = createAction(
  ActionType.LoadProductData,
  (guitars: Guitar[]) => ({ payload: guitars }),
);

export const setGuitars = createAction(
  ActionType.SetGuitars,
  (guitars: Guitar[]) => ({ payload: guitars }),
);

export const setCart = createAction(
  ActionType.SetCart,
  (cart: Guitar[]) => ({ payload: cart }),
);

export const setSearchSimilar = createAction(
  ActionType.SetSimilarAtSearch,
  (similarAtSearch: Guitar[]) => ({ payload: similarAtSearch }),
);

export const setSortType = createAction(
  ActionType.SetSortType,
  (sortType: SortType) => ({ payload: sortType }),
);

export const setOrderType = createAction(
  ActionType.SetOrderType,
  (orderType: SortType) => ({ payload: orderType }),
);

export const setPriceRangeFrom = createAction(
  ActionType.SetPriceRangeFrom,
  (from: string) => ({ payload: from }),
);

export const setPriceRangeTo = createAction(
  ActionType.SetPriceRangeTo,
  (to: string) => ({ payload: to }),
);

export const setGuitarType = createAction(
  ActionType.SetGuitarType,
  (guitarType: GuitarType[]) => ({ payload: guitarType }),
);
