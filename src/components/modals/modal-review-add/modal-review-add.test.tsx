import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';


import { State } from 'types/state';
import ModalReviewAdd from './modal-review-add';
import { createAPI } from 'api/api';
import { NameSpace } from 'store/root-reducer';
import { getGuitarMock } from 'utils/mocks';
import { APIQuery, APIRoute } from 'utils/const';

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

const mockHandlerGroup = {
  handleCloseBtnClick: jest.fn(),
  handleOverlayClick: jest.fn(),
  handleModalDidMount: jest.fn(),
  handleModalDidUnmount: jest.fn(),
  handleSuccessEvent: jest.fn(),
};

const mockComponent = (
  <Provider store={store}>
    <Router history={history}>
      <ModalReviewAdd
        product={expandedGuitar}
        handlerGroup={mockHandlerGroup}
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

describe('Modal Review Add component', () => {
  it('should render component and call handleModalDidMount callback', () => {
    expect(mockHandlerGroup.handleModalDidMount).not.toBeCalled();

    render(mockComponent);

    expect(screen.getByLabelText(/Ваше имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Достоинства/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Недостатки/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Комментарий/i)).toBeInTheDocument();
    expect(screen.getByText(/Отправить отзыв/i)).toBeInTheDocument();
    expect(mockHandlerGroup.handleModalDidMount).toBeCalled();
  });

  it('should call handleCloseBtnClick and handleOverlayClick when clicking on close button or overlay', () => {
    render(mockComponent);

    const closeButton = screen.getByLabelText(/Закрыть/i);
    const overlay = screen.getByTestId('overlay');

    expect(mockHandlerGroup.handleCloseBtnClick).not.toBeCalled();
    expect(mockHandlerGroup.handleOverlayClick).not.toBeCalled();

    userEvent.click(closeButton);
    userEvent.click(overlay);

    expect(mockHandlerGroup.handleCloseBtnClick).toBeCalled();
    expect(mockHandlerGroup.handleOverlayClick).toBeCalled();
  });

  it('should not call handleSuccessEvent when clicking on submit button but required inputs are not filled', () => {
    render(mockComponent);

    const submitBtn = screen.getByText(/Отправить отзыв/i);

    userEvent.click(submitBtn);

    expect(mockHandlerGroup.handleSuccessEvent).toBeCalledTimes(0);
    expect(screen.getAllByText(/Заполните поле/i).length).toBeTruthy();
  });

  it('should call handleSuccessEvent when clicking on submit button and required inputs are filled / server response is OK', async () => {
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

    expect(mockHandlerGroup.handleSuccessEvent).toBeCalledTimes(0);

    fillForm(text, rating);
    userEvent.click(submitBtn);

    await waitFor(() => expect(mockHandlerGroup.handleSuccessEvent).toBeCalledTimes(1));
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
    expect(mockHandlerGroup.handleSuccessEvent).toBeCalledTimes(0);
  });
});
