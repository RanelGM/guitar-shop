import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import Sort from './sort';
import { setOrderType, setSortType } from 'store/action';
import { NameSpace } from 'store/root-reducer';
import { createAPI } from 'api/api';
import { SortGroup } from 'utils/const';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const history = createMemoryHistory();

const store = mockStore({
  [NameSpace.query]: {
    orderType: null,
    sortType: null,
  },
});

const getSortMock = () => (
  <Provider store={store}>
    <Router history={history}>
      <Sort />
    </Router>
  </Provider>
);

describe('Sort component', () => {
  it('should render component', () => {
    const sortComponent = getSortMock();

    render(sortComponent);

    expect(screen.getByText(/Сортировать:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(SortGroup.Ascending.label)).toBeInTheDocument();
    expect(screen.getByLabelText(SortGroup.Descending.label)).toBeInTheDocument();
    expect(screen.getByLabelText(SortGroup.Price.label)).toBeInTheDocument();
    expect(screen.getByLabelText(SortGroup.Rating.label)).toBeInTheDocument();
  });

  it('should dispatch order types when clicking on appropriate button', () => {
    const sortComponent = getSortMock();

    render(sortComponent);

    const ascendingBtn = screen.getByLabelText(SortGroup.Ascending.label);
    const deecendingBtn = screen.getByLabelText(SortGroup.Descending.label);
    const priceBtn = screen.getByLabelText(SortGroup.Price.label);
    const ratingBtn = screen.getByLabelText(SortGroup.Rating.label);

    userEvent.click(ascendingBtn);
    userEvent.click(deecendingBtn);
    userEvent.click(priceBtn);
    userEvent.click(ratingBtn);

    expect(store.getActions()).toEqual([
      setOrderType(SortGroup.Ascending.type),
      setOrderType(SortGroup.Descending.type),
      setSortType(SortGroup.Price.type),
      setSortType(SortGroup.Rating.type),
    ]);
  });
});
