import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action, Store } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import { Guitar } from 'types/product';
import SearchForm from './search-form';
import { createAPI } from 'api/api';
import { NameSpace } from 'store/root-reducer';
import { APIQuery, APIRoute } from 'utils/const';
import { getGuitarMock } from 'utils/mocks';
import { setSearchSimilar } from 'store/action';
import { sortGuitarsByLetter } from 'utils/utils';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const history = createMemoryHistory();

const getStore = (guitars: Guitar[] | null) => mockStore({
  [NameSpace.product]: {
    similarAtSearch: [],
  },
});

const getSearchFormMock = (store: Store) => (
  <Provider store={store}>
    <Router history={history}>
      <SearchForm />
    </Router>
  </Provider>
);

describe('Search Form Component', () => {
  it('should render component, similar list should be hidden', () => {
    const store = getStore(null);
    const searchFormComponent = getSearchFormMock(store);

    render(searchFormComponent);

    expect(screen.getByLabelText(/Поиск/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/что вы ищите?/i)).toBeInTheDocument();
    expect(screen.getByRole('list').classList.contains('hidden')).toBe(true);
  });

  it('should update store with loaded guitars (and render their names) when typing in search input and server response is OK', async () => {
    const guitars = [getGuitarMock(), getGuitarMock(), getGuitarMock()];
    const inputValue = 'foo';
    const sortedGuitars = sortGuitarsByLetter(guitars, inputValue);
    const store = getStore(null);
    const searchFormComponent = getSearchFormMock(store);

    mockAPI
      .onGet(`${APIRoute.Guitar}?${APIQuery.Similar}=${inputValue}`)
      .reply(200, guitars);


    render(searchFormComponent);

    const input = screen.getByPlaceholderText(/что вы ищите?/i);

    userEvent.type(input, inputValue);

    expect(screen.getByLabelText(/Поиск/i)).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    await waitFor(() => expect(store.getActions()).toEqual([setSearchSimilar(sortedGuitars)]));
    await waitFor(() => expect(screen.getByRole('list').classList.contains('hidden')).toBe(false));
  });

  it('should render error message when typing in search input and server response is NOT OK', async () => {
    const inputValue = 'foo';
    const errorMessage = 'Произошла ошибка при загрузке данных. Попробуйте позднее.';
    const store = getStore(null);
    const searchFormComponent = getSearchFormMock(store);

    mockAPI
      .onGet(`${APIRoute.Guitar}?${APIQuery.Similar}=${inputValue}`)
      .reply(500);

    render(searchFormComponent);

    const input = screen.getByPlaceholderText(/что вы ищите?/i);

    userEvent.type(input, inputValue);

    expect(screen.getByLabelText(/Поиск/i)).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('list').classList.contains('hidden')).toBe(false));
    await screen.findByText(errorMessage);
  });
});

