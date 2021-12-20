import { createAction } from '@reduxjs/toolkit';
import { ActionType } from 'types/action';
import { Guitar } from 'types/product';

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
