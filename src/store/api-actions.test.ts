import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { State } from 'types/state';
import { createAPI } from 'api/api';
import { loadSearchSimilarAction } from './api-actions';
import { setSearchSimilar } from './action';
import { getGuitarMock } from 'utils/mocks';
import { APIRoute, APIQuery } from 'utils/const';


describe('Async actions', () => {
  const api = createAPI();
  const mockAPI = new MockAdapter(api);
  const middlewares = [thunk.withExtraArgument(api)];
  const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

  it('should dispatch setSearchSimilar when using loadSearchSimilarAction', async () => {
    const store = mockStore();
    const inputValue = 'Ч';
    const guitars = [getGuitarMock(), getGuitarMock(), getGuitarMock()];

    mockAPI
      .onGet(`${APIRoute.Guitar}?${APIQuery.Similar}=${inputValue}`)
      .reply(200, guitars);

    expect(store.getActions()).toEqual([]);

    await (store.dispatch(loadSearchSimilarAction(inputValue)));

    expect(store.getActions()).toEqual([
      setSearchSimilar(guitars),
    ]);
  });
});
