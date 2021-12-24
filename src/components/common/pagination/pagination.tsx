import { MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setCurrentPage } from 'store/action';
import { INDEX_ADJUSTMENT_VALUE } from 'utils/const';

const MAX_PAGINATION_COUNT = 3;

type PagionationProps = {
  currentPage: number,
  maxPageCount: number,
  onLinkClick: () => void,
}

function Pagination({ currentPage, maxPageCount, onLinkClick }: PagionationProps): JSX.Element {
  const dispatch = useDispatch();
  const pages = Array.from({ length: maxPageCount }, (item, index) => index + INDEX_ADJUSTMENT_VALUE);
  const sliceFromValue = MAX_PAGINATION_COUNT * Math.floor((currentPage - INDEX_ADJUSTMENT_VALUE) / MAX_PAGINATION_COUNT);
  const sliceToValue = sliceFromValue + MAX_PAGINATION_COUNT;
  const isNextPageAvailable = sliceToValue + INDEX_ADJUSTMENT_VALUE < maxPageCount;
  const isPreviousPageAvailable = sliceFromValue !== 0;

  const handleLinkClick = (evt: MouseEvent) => {
    const linkElement = (evt.target as HTMLElement).closest('.link') as HTMLAnchorElement;

    if (linkElement) {
      const pageNumberPath = Number(linkElement.href.split('/').pop());

      dispatch(setCurrentPage(pageNumberPath));
      onLinkClick();
    }
  };

  return (
    <div className="pagination page-content__pagination">
      <ul onClick={handleLinkClick} className="pagination__list">
        {isPreviousPageAvailable && (
          <li className="pagination__page pagination__page--prev" id="prev">
            <Link className="link pagination__page-link" to={`${sliceToValue - MAX_PAGINATION_COUNT}`}>
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
              <Link to={`${page}`} className="link pagination__page-link">
                {page}
              </Link>
            </li>
          ))}

        {isNextPageAvailable && (
          <li className="pagination__page pagination__page--next" id="next">
            <Link className="link pagination__page-link" to={`${sliceFromValue + MAX_PAGINATION_COUNT + INDEX_ADJUSTMENT_VALUE}`}>
              Далее
            </Link>
          </li>
        )}


      </ul>
    </div>
  );
}

export default Pagination;
