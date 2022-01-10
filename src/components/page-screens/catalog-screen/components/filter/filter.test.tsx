import { Action, Store } from 'redux';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import { GuitarType } from 'types/product';
import Filter, { getUniqueStringsFromTypes } from './filter';
import { createAPI } from 'api/api';
import { setGuitarType, setIsUpdateLoaded } from 'store/action';
import { NameSpace } from 'store/root-reducer';
import { GuitarGroup } from 'utils/const';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const getStore = (types: GuitarType[] | null) => mockStore({
  [NameSpace.product]: {
    defaultServerGuitars: [],
    isUpdateLoaded: true,
  },
  [NameSpace.query]: {
    priceRangeFrom: '',
    priceRangeTo: '',
    guitarType: types,
  },
});

const history = createMemoryHistory();

const fakeHistory = {
  location: { pathname: '' },
  push(path: string) {
    this.location.pathname = path;
  },
};

jest.mock('store/browser-history', () => fakeHistory);

const getFilterMock = (store: Store) => (
  <Provider store={store}>
    <Router history={history}>
      <Filter />
    </Router>
  </Provider>
);

describe('Filter Component', () => {
  it('should render component', () => {
    const store = getStore(null);
    const filterComponent = getFilterMock(store);

    render(filterComponent);

    expect(screen.getByText(/Фильтр/i)).toBeInTheDocument();
    expect(screen.getByText(/Тип гитар/i)).toBeInTheDocument();
    expect(screen.getByText(/Количество струн/i)).toBeInTheDocument();
    expect(screen.getByText(/Цена, ₽/i)).toBeInTheDocument();
  });

  it('should render unchecked types input and not disabled strings input when types is not provided', () => {
    const store = getStore(null);
    const filterComponent = getFilterMock(store);
    const guitarTypes = Object.values(GuitarGroup).map((group) => group.type);
    const strings = getUniqueStringsFromTypes(guitarTypes);

    render(filterComponent);

    const electricLabel = screen.getByLabelText(GuitarGroup.Electric.label);
    const ukuleleLabel = screen.getByLabelText(GuitarGroup.Ukulele.label);
    const acousticLabel = screen.getByLabelText(GuitarGroup.Acoustic.label);

    expect(electricLabel).not.toBeChecked();
    expect(ukuleleLabel).not.toBeChecked();
    expect(acousticLabel).not.toBeChecked();
    strings.forEach((string) => expect(screen.getByLabelText(string)).not.toBeDisabled());
  });

  it('should render type input as checked if appropriate type is in state and disable not corresponding string input', () => {
    const checkedTypes = [GuitarGroup.Acoustic.type, GuitarGroup.Ukulele.type];
    const store = getStore(checkedTypes);
    const filterComponent = getFilterMock(store);

    const strings = getUniqueStringsFromTypes(Object.values(GuitarGroup).map((group) => group.type));
    const checkedStrings = getUniqueStringsFromTypes(checkedTypes);
    const unchekedStrings = strings.filter((string) => !checkedStrings.some((checkedString) => checkedString === string));

    render(filterComponent);

    expect(screen.getByLabelText(GuitarGroup.Acoustic.label)).toBeChecked();
    expect(screen.getByLabelText(GuitarGroup.Ukulele.label)).toBeChecked();
    expect(screen.getByLabelText(GuitarGroup.Electric.label)).not.toBeChecked();

    checkedStrings.forEach((string) => expect(screen.getByLabelText(string)).not.toBeDisabled());
    unchekedStrings.forEach((string) => expect(screen.getByLabelText(string)).toBeDisabled());
  });

  it('should dispatch types input when user checking corresponding input', () => {
    const store = getStore(null);
    const filterComponent = getFilterMock(store);

    render(filterComponent);

    expect(store.getActions()).toEqual([]);

    const electricLabel = screen.getByLabelText(GuitarGroup.Electric.label);
    const ukuleleLabel = screen.getByLabelText(GuitarGroup.Ukulele.label);
    const acousticLabel = screen.getByLabelText(GuitarGroup.Acoustic.label);

    userEvent.click(electricLabel);

    expect(store.getActions()).toEqual([
      setGuitarType([GuitarGroup.Electric.type]),
      setIsUpdateLoaded(false),
    ]);

    userEvent.click(ukuleleLabel);
    userEvent.click(acousticLabel);

    expect(store.getActions()).toEqual([
      setGuitarType([GuitarGroup.Electric.type]),
      setIsUpdateLoaded(false),
      setGuitarType([GuitarGroup.Ukulele.type]),
      setIsUpdateLoaded(false),
      setGuitarType([GuitarGroup.Acoustic.type]),
      setIsUpdateLoaded(false),
    ]);
  });
});
