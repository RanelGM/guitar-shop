import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';


import { State } from 'types/state';
import ModalReview from './modal-review';
import { createAPI } from 'api/api';
import { NameSpace } from 'store/root-reducer';
import { getGuitarMock } from 'utils/mocks';
import { APIQuery, APIRoute, KeyboardKey } from 'utils/const';

const expandedGuitar = getGuitarMock();

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const store = mockStore({
  [NameSpace.product]: {
    expandedGuitar: expandedGuitar,
  },
});

const history = createMemoryHistory();

const handleModalClose = jest.fn();
const handleSuccessPost = jest.fn();

const mockComponent = (
  <Provider store={store}>
    <Router history={history}>
      <ModalReview
        product={expandedGuitar}
        onModalClose={handleModalClose}
        onSuccessPost={handleSuccessPost}
      />
    </Router>
  </Provider>
);

const fillForm = (text?: string, rating?: number) => {
  const randomRating = 4;
  const randomText = 'foo';

  rating = rating ? rating : randomRating;
  text = text ? text : randomText;

  const ratingInput = screen.getByLabelText(rating);
  const nameInput = screen.getByLabelText(/Ваше имя/i);
  const prosInput = screen.getByLabelText(/Достоинства/i);
  const consInput = screen.getByLabelText(/Недостатки/i);
  const commentInput = screen.getByLabelText(/Комментарий/i);

  userEvent.click(ratingInput);
  userEvent.type(nameInput, text);
  userEvent.type(prosInput, text);
  userEvent.type(consInput, text);
  userEvent.type(commentInput, text);
};

describe('Reviews List component', () => {
  it('should render component with scroll lock on Body', () => {
    render(mockComponent);

    expect(screen.getByLabelText(/Ваше имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Достоинства/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Недостатки/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Комментарий/i)).toBeInTheDocument();
    expect(screen.getByText(/Отправить отзыв/i)).toBeInTheDocument();
    expect(document.body.classList.contains('scroll-lock')).toBe(true);
  });

  it('should call close callback when Esc keydown, click on close button or overlay', () => {
    render(mockComponent);

    const closeButton = screen.getByLabelText(/Закрыть/i);
    const overlay = screen.getByTestId('overlay');

    expect(handleModalClose).toBeCalledTimes(0);

    userEvent.click(closeButton);
    userEvent.click(overlay);
    fireEvent.keyDown(document, { key: KeyboardKey.Esc });

    expect(handleModalClose).toBeCalledTimes(3);
  });

  it('should not call success callback when clicking on submit button but required inputs are not filled', () => {
    render(mockComponent);

    const submitBtn = screen.getByText(/Отправить отзыв/i);

    userEvent.click(submitBtn);

    expect(handleSuccessPost).toBeCalledTimes(0);
    expect(screen.getAllByText(/Заполните поле/i).length).toBeTruthy();
  });

  it('should call success callback when clicking on submit button and required inputs are filled / server response is OK', async () => {
    const text = 'foo';
    const rating = 4;

    const comment = {
      'guitarId': expandedGuitar.id,
      'userName': text,
      'advantage': text,
      'disadvantage': text,
      'comment': text,
      'rating': Number(rating),
    };

    mockAPI
      .onPost(APIRoute.Comments)
      .reply(200);

    mockAPI
      .onGet(`${APIRoute.Guitar}/${comment.guitarId}?${APIQuery.EmbedComment}`)
      .reply(200, expandedGuitar);

    render(mockComponent);

    const submitBtn = screen.getByText(/Отправить отзыв/i);

    expect(handleSuccessPost).toBeCalledTimes(0);

    fillForm(text, rating);
    userEvent.click(submitBtn);

    await waitFor(() => expect(handleSuccessPost).toBeCalledTimes(1));
  });

  it('should render error message when clicking on submit button and server response is NOT OK', async () => {
    const errorMessage = 'Возникла ошибка при отправке комментария. Попробуйте позднее.';

    mockAPI
      .onPost(APIRoute.Comments)
      .reply(500);

    render(mockComponent);

    const submitBtn = screen.getByText(/Отправить отзыв/i);

    fillForm();
    userEvent.click(submitBtn);

    await screen.findByText(errorMessage);
    expect(handleSuccessPost).toBeCalledTimes(0);
  });
});
