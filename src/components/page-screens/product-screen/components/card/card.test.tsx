import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import Card from './card';
import { NameSpace } from 'store/root-reducer';
import { getGuitarMock } from 'utils/mocks';
import { TabGroup } from 'utils/const';


const expandedGuitar = getGuitarMock();

const mockStore = configureMockStore<State, Action, ThunkDispatch<State, undefined, Action>>();

const store = mockStore({
  [NameSpace.product]: {
    expandedGuitar: expandedGuitar,
  },
});

const history = createMemoryHistory();

const mockComponent = (
  <Provider store={store}>
    <Router history={history}>
      <Card />
    </Router>
  </Provider>
);

describe('Card component', () => {
  it('should render component', () => {
    render(mockComponent);

    expect(screen.getByText(expandedGuitar.name)).toBeInTheDocument();
    expect(screen.getByText(expandedGuitar.vendorCode)).toBeInTheDocument();
    expect(screen.getByText(/Количество струн:/i)).toBeInTheDocument();
    expect(screen.getByText(/Добавить в корзину/i)).toBeInTheDocument();
  });

  it('should switch tabs when clicking on it', () => {
    render(mockComponent);

    const charTab = screen.getByText(TabGroup.Characteristics.label);
    const descriptionTab = screen.getByText(TabGroup.Description.label);

    userEvent.click(charTab);
    expect(charTab.classList.contains('button--black-border')).toBe(false);
    expect(descriptionTab.classList.contains('button--black-border')).toBe(true);

    userEvent.click(descriptionTab);
    expect(charTab.classList.contains('button--black-border')).toBe(true);
    expect(descriptionTab.classList.contains('button--black-border')).toBe(false);
  });
});
