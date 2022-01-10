import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './components/app/app';
import { Loader } from 'components/common/common';
import browserHistory from 'store/browser-history';
import { loadProductAction } from 'store/api-actions';
import store from 'store/store';

let isServerError = false;

const initiateBoard = async () => {
  ReactDOM.render(
    <Loader />,
    document.getElementById('root'));

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
