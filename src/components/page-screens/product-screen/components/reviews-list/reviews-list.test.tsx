import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action, Store } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import { Guitar } from 'types/product';
import ReviewsList from './reviews-list';
import { getGuitarMock } from 'utils/mocks';
import { MAX_COMMENTS_COUNT } from 'utils/const';
import { NameSpace } from 'store/root-reducer';

const mockStore = configureMockStore<State, Action, ThunkDispatch<State, undefined, Action>>();

const getStore = (expandedGuitar: Guitar) => mockStore({
  [NameSpace.product]: {
    expandedGuitar: expandedGuitar,
  },
});

const history = createMemoryHistory();

const getMockedComponent = (store: Store) => (
  <Provider store={store}>
    <Router history={history}>
      <ReviewsList />
    </Router>
  </Provider>
);

describe('Reviews List component', () => {
  it('should render component WITHOUT show more button when comments count less or equal than max count to render', () => {
    const guitar = getGuitarMock(MAX_COMMENTS_COUNT);
    const store = getStore(guitar);
    const mockComponent = getMockedComponent(store);

    render(mockComponent);

    expect(screen.getByText(/Отзывы/i)).toBeInTheDocument();
    expect(screen.getByText(/Оставить отзыв/i)).toBeInTheDocument();
    expect(screen.queryByText(/Показать еще отзывы/i)).not.toBeInTheDocument();
  });

  it(`should render only max count to render comments WITH show more button available to click and show another comments
   when comments count more than max count to render`, () => {
    const commentsCount = MAX_COMMENTS_COUNT + 1;
    const guitar = getGuitarMock(commentsCount);
    const store = getStore(guitar);
    const mockComponent = getMockedComponent(store);

    render(mockComponent);

    const showMoreBtn = screen.getByText(/Показать еще отзывы/i);

    expect(showMoreBtn).toBeInTheDocument();
    expect(screen.getByText(/Оставить отзыв/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Достоинства/i).length).toEqual(MAX_COMMENTS_COUNT);

    userEvent.click(showMoreBtn);
    expect(screen.getAllByText(/Достоинства/i).length).toEqual(commentsCount);
  });

  it('should render Review Popup when clicking on button', () => {
    const commentsCount = MAX_COMMENTS_COUNT + 1;
    const guitar = getGuitarMock(commentsCount);
    const store = getStore(guitar);
    const mockComponent = getMockedComponent(store);

    render(mockComponent);

    const button = screen.getByText(/Оставить отзыв/i);

    expect(screen.queryByText(/Отправить отзыв/i)).not.toBeInTheDocument();

    userEvent.click(button);
    expect(screen.getByText(/Отправить отзыв/i)).toBeInTheDocument();
  });
});
