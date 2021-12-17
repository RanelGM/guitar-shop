import { createAction } from '@reduxjs/toolkit';
import { ActionType } from 'types/action';
import { Guitar } from 'types/guitar';

export const loadProductData = createAction(
  ActionType.LoadProductData,
  (guitars: Guitar[]) => ({ payload: guitars }),
);
