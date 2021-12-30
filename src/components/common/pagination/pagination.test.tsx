import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Action, Store } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createMemoryHistory } from 'history';

import { State } from 'types/state';
import Pagination from './pagination';
import { createAPI } from 'api/api';
import { getGuitarMock } from 'utils/mocks';
import { NameSpace } from 'store/root-reducer';
import { INDEX_ADJUSTMENT_VALUE } from 'utils/const';
import { setCurrentPage } from 'store/action';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action, ThunkDispatch<State, typeof api, Action>>(middlewares);

const history = createMemoryHistory();

const getStore = (page: number) => mockStore({
  [NameSpace.query]: {
    currentPage: page,
  },
});

const onLinkClick = jest.fn();

const getCartMock = (store: Store, maxPageCount: number) => {
  const currentPage = store.getState()[NameSpace.query].currentPage;

  return (
    <Provider store={store}>
      <Router history={history}>
        <Pagination
          currentPage={currentPage}
          maxPageCount={maxPageCount}
          onLinkClick={onLinkClick}
        />
      </Router>
    </Provider>
  );
};

describe('Pagination Component', () => {
  const maxCardOnPageCount = 3;
  const maxPaginationCount = 3;
  const getCurrentActiveElement = () => screen.getAllByRole('listitem').find((item) => item.classList.contains('pagination__page--active'));

  it('should render Pagination component from 1 to maxPaginationCount, without next/prev link when current page is 1', () => {
    const guitars = Array.from({ length: maxCardOnPageCount * maxPaginationCount }, () => getGuitarMock());
    const page = 1;
    const maxPageCount = Math.ceil(guitars.length / maxCardOnPageCount);
    const pages = Array.from({ length: maxPageCount }, (item, index) => index + INDEX_ADJUSTMENT_VALUE);

    const store = getStore(page);
    const mockComponent = getCartMock(store, maxPageCount);

    render(mockComponent);

    expect(screen.getAllByRole('link').length).toBe(maxPaginationCount);
    screen.getAllByRole('link').forEach((link, index) => {
      expect(Number(link.textContent)).toBe(pages[index]);
    });
  });

  it('should redirect to new page when clicking to it', async () => {
    const guitars = Array.from({ length: maxCardOnPageCount * maxPaginationCount }, () => getGuitarMock());
    const page = 2;
    const maxPageCount = Math.ceil(guitars.length / maxCardOnPageCount);
    const pages = Array.from({ length: maxPageCount }, (item, index) => index + INDEX_ADJUSTMENT_VALUE);

    const store = getStore(page);
    const mockComponent = getCartMock(store, maxPageCount);

    render(mockComponent);

    const currentPageElement = screen.getByText(page);
    const afterCurrentPageElement = screen.getByText(pages[page]);
    const lastPageElement = screen.getByText(pages.length);

    expect(getCurrentActiveElement()?.contains(currentPageElement)).toBe(true);

    userEvent.click(afterCurrentPageElement);
    expect(history.location.pathname === `/${afterCurrentPageElement.textContent}`).toBe(true);

    userEvent.click(lastPageElement);
    expect(history.location.pathname === `/${lastPageElement.textContent}`).toBe(true);

    expect(store.getActions()).toEqual([
      setCurrentPage(Number(afterCurrentPageElement.textContent)),
      setCurrentPage(Number(lastPageElement.textContent)),
    ]);
  });

  it('should render Pagination component with set of pages from 4 to  when current page is 5, with next and prev link available to navigate', () => {
    const guitars = Array.from({ length: 27 }, () => getGuitarMock());
    const page = 5;
    const maxPageCount = Math.ceil(guitars.length / maxCardOnPageCount);
    let pages = Array.from({ length: maxPageCount }, (item, index) => index + INDEX_ADJUSTMENT_VALUE);
    const sliceFromValue = maxPaginationCount * Math.floor((page - INDEX_ADJUSTMENT_VALUE) / maxPaginationCount);
    const sliceToValue = sliceFromValue + maxPaginationCount;
    pages = pages.slice(sliceFromValue, sliceToValue);

    const store = getStore(page);
    const mockComponent = getCartMock(store, maxPageCount);

    render(mockComponent);

    const prevLinkElement = screen.getByText(/Назад/i);
    const nextLinkElement = screen.getByText(/Далее/i);

    expect(prevLinkElement).toBeInTheDocument();
    expect(nextLinkElement).toBeInTheDocument();
    pages.forEach((pageFromList) => {
      expect(screen.getByText(pageFromList)).toBeInTheDocument();
    });

    userEvent.click(nextLinkElement);
    expect(history.location.pathname === `/${pages[pages.length - 1] + 1}`).toBe(true);

    userEvent.click(prevLinkElement);
    expect(history.location.pathname === `/${pages.shift() as number - 1}`).toBe(true);
  });
});
