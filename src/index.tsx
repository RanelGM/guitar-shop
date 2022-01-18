import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './components/app/app';
import browserHistory from 'store/browser-history';
import store from 'store/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={browserHistory}>
        <App />
      </Router >
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'));
