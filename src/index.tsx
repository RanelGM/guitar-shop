import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import App from './components/app/app';
import { createAPI } from 'api/api';
import reducer from 'store/reducer';
import { loadProductAction } from 'store/api-actions';

let isServerError = false;

const api = createAPI();

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

const initiateBoard = async () => {
  try {
    await store.dispatch(loadProductAction());
  }
  catch {
    isServerError = true;
  }
  finally {
    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <App isServerError={isServerError} />
        </Provider>
      </React.StrictMode>,
      document.getElementById('root'));
  }
};

initiateBoard();


