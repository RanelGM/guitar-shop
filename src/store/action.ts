import { createAction } from '@reduxjs/toolkit';
import { ActionType } from 'types/action';
import { Guitar, GuitarInCart, GuitarType, SortType } from 'types/product';

export const setDefaultProductData = createAction(
  ActionType.LoadProductData,
  (guitars: Guitar[]) => ({ payload: guitars }),
);

export const setIsUpdateLoaded = createAction(
  ActionType.setIsUpdateLoaded,
  (loadedState: boolean) => ({ payload: loadedState }),
);

export const setGuitarsTotalCount = createAction(
  ActionType.SetGuitarsTotalCount,
  (guitars: number) => ({ payload: guitars }),
);

export const setGuitarsToRender = createAction(
  ActionType.SetGuitarsToRender,
  (guitars: Guitar[]) => ({ payload: guitars }),
);

export const setCart = createAction(
  ActionType.SetCart,
  (cart: GuitarInCart[]) => ({ payload: cart }),
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
  (guitarType: GuitarType[] | null) => ({ payload: guitarType }),
);

export const setStringCount = createAction(
  ActionType.SetStringCount,
  (strings: number[] | null) => ({ payload: strings }),
);

export const setCurrentPage = createAction(
  ActionType.SetCurrentPage,
  (page: number) => ({ payload: page }),
);

export const setIsServerError = createAction(
  ActionType.SetIsServerError,
  (is: boolean) => ({ payload: is }),
);

export const setIsDataLoading = createAction(
  ActionType.SetIsDataLoading,
  (is: boolean) => ({ payload: is }),
);

export const setExpandedGuitar = createAction(
  ActionType.SetExpandedGuitar,
  (guitar: Guitar) => ({ payload: guitar }),
);

export const setDiscount = createAction(
  ActionType.SetDiscount,
  (discount: number) => ({ payload: discount }),
);
