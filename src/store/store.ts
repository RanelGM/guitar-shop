import { configureStore } from '@reduxjs/toolkit';
import { createAPI } from 'api/api';
import { rootReducer } from 'store/root-reducer';

const api = createAPI();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

export default store;
