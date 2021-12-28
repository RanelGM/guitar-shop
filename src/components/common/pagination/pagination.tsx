import { MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThunkActionDispatch } from 'types/action';
import { setCurrentPage } from 'store/action';
import { INDEX_ADJUSTMENT_VALUE } from 'utils/const';
import { getQueryPath } from 'utils/utils';

type PagionationProps = {
  currentPage: number,
  maxPageCount: number,
  onLinkClick: () => void,
}

const MAX_PAGINATION_COUNT = 3;

function Pagination({ currentPage, maxPageCount, onLinkClick }: PagionationProps): JSX.Element {
  const dispatch = useDispatch() as ThunkActionDispatch;

  const pages = Array.from({ length: maxPageCount }, (item, index) => index + INDEX_ADJUSTMENT_VALUE);
  const sliceFromValue = MAX_PAGINATION_COUNT * Math.floor((currentPage - INDEX_ADJUSTMENT_VALUE) / MAX_PAGINATION_COUNT);
  const sliceToValue = sliceFromValue + MAX_PAGINATION_COUNT;
  const isNextPageAvailable = sliceToValue + INDEX_ADJUSTMENT_VALUE < maxPageCount;
  const isPreviousPageAvailable = sliceFromValue !== 0;

  const filterParams = getQueryPath(currentPage.toString());
  const prevPagePath = `${sliceToValue - MAX_PAGINATION_COUNT}${filterParams}`;
  const nextPagePath = `${sliceFromValue + MAX_PAGINATION_COUNT + INDEX_ADJUSTMENT_VALUE}${filterParams}`;

  const handleLinkClick = (evt: MouseEvent) => {
    const linkElement = (evt.target as HTMLElement).closest('.link') as HTMLAnchorElement;

    if (linkElement) {
      const pageNumberPath = Number(linkElement.href.split('/').pop()?.split('&').shift());

      dispatch(setCurrentPage(pageNumberPath));
      onLinkClick();
    }
  };

  return (
    <div className="pagination page-content__pagination">
      <ul onClick={handleLinkClick} className="pagination__list">
        {isPreviousPageAvailable && (
          <li className="pagination__page pagination__page--prev" id="prev">
            <Link className="link pagination__page-link" to={prevPagePath}>
              Назад
            </Link>
          </li>
        )}

        {pages
          .slice(sliceFromValue, sliceToValue)
          .map((page) => (
            <li key={`page-number-${page}`}
              className={`pagination__page ${page === currentPage ? 'pagination__page--active' : ''}`}
            >
              <Link to={`${page}${filterParams}`} className="link pagination__page-link">
                {page}
              </Link>
            </li>
          ))}

        {isNextPageAvailable && (
          <li className="pagination__page pagination__page--next" id="next">
            <Link className="link pagination__page-link" to={nextPagePath}>
              Далее
            </Link>
          </li>
        )}


      </ul>
    </div>
  );
}

export default Pagination;
