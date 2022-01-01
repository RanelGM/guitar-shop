import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import Filter, { getUniqueStringsFromTypes } from './filter';
import store from 'store/store';
import { setGuitarType } from 'store/action';
import { GuitarGroup } from 'utils/const';

const history = createMemoryHistory();

const fakeHistory = {
  location: { pathname: '' },
  push(path: string) {
    this.location.pathname = path;
  },
};

jest.mock('store/browser-history', () => fakeHistory);

const getFilterMock = () => (
  <Provider store={store}>
    <Router history={history}>
      <Filter />
    </Router>
  </Provider>
);

describe('Filter Component', () => {
  beforeEach(() => store.dispatch(setGuitarType(null)));

  it('should render component', () => {
    const filterComponent = getFilterMock();
    render(filterComponent);

    expect(screen.getByText(/Фильтр/i)).toBeInTheDocument();
    expect(screen.getByText(/Тип гитар/i)).toBeInTheDocument();
    expect(screen.getByText(/Количество струн/i)).toBeInTheDocument();
    expect(screen.getByText(/Цена, ₽/i)).toBeInTheDocument();
  });

  it('should check / uncheck type input when it is clicked, disable not corresponding string input', () => {
    const filterComponent = getFilterMock();
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

    userEvent.click(electricLabel);
    expect(electricLabel).toBeChecked();
    expect(ukuleleLabel).not.toBeChecked();
    expect(acousticLabel).not.toBeChecked();

    GuitarGroup.Electric.strings.forEach((string) => expect(screen.getByLabelText(string)).not.toBeDisabled());
    expect(screen.getByLabelText('12')).toBeDisabled();

    userEvent.click(acousticLabel);
    userEvent.click(electricLabel);
    userEvent.click(ukuleleLabel);
    expect(electricLabel).not.toBeChecked();
    expect(ukuleleLabel).toBeChecked();
    expect(acousticLabel).toBeChecked();
    strings.forEach((string) => expect(screen.getByLabelText(string)).not.toBeDisabled());


    userEvent.click(ukuleleLabel);
    expect(electricLabel).not.toBeChecked();
    expect(ukuleleLabel).not.toBeChecked();
    expect(acousticLabel).toBeChecked();
    GuitarGroup.Acoustic.strings.forEach((string) => expect(screen.getByLabelText(string)).not.toBeDisabled());
    expect(screen.getByLabelText('4')).toBeDisabled();
  });

  it('should render type input as checked if appropriate type is in state and disable not corresponding string input', () => {
    const filterComponent = getFilterMock();
    const GuitarGroupValues = Object.values(GuitarGroup);
    const guitarTypes = GuitarGroupValues.map((group) => group.type);
    const strings = getUniqueStringsFromTypes(guitarTypes);

    const checkedTypes = [GuitarGroup.Electric.type, GuitarGroup.Ukulele.type];
    const checkedStrings = getUniqueStringsFromTypes(checkedTypes);
    const unchekedStrings = strings.filter((string) => !checkedStrings.some((checkedString) => checkedString === string));

    store.dispatch((setGuitarType(checkedTypes)));

    render(filterComponent);

    expect(screen.getByLabelText(GuitarGroup.Electric.label)).toBeChecked();
    expect(screen.getByLabelText(GuitarGroup.Ukulele.label)).toBeChecked();
    expect(screen.getByLabelText(GuitarGroup.Acoustic.label)).not.toBeChecked();

    checkedStrings.forEach((string) => expect(screen.getByLabelText(string)).not.toBeDisabled());
    unchekedStrings.forEach((string) => expect(screen.getByLabelText(string)).toBeDisabled());
  });
});
