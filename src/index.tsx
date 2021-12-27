import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import App from './components/app/app';
import { createAPI } from 'api/api';
import browserHistory from 'store/browser-history';
import { rootReducer } from 'store/root-reducer';
import { loadProductAction } from 'store/api-actions';

let isServerError = false;

const api = createAPI();

export const store = configureStore({
  reducer: rootReducer,
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
          <Router history={browserHistory}>
            <App isServerError={isServerError} />
          </Router >
        </Provider>
      </React.StrictMode>,
      document.getElementById('root'));
  }
};

initiateBoard();

export const handleServerError = () => {
  isServerError = true;
  initiateBoard();
};
