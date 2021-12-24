const MAX_PAGINATION_COUNT = 3;
const INDEX_ADJUSTMENT_VALUE = 1;

type PagionationProps = {
  currentPage: number,
  maxPageCount: number,
}

function Pagination({ currentPage, maxPageCount }: PagionationProps): JSX.Element {
  const pages = Array.from({ length: maxPageCount }, (item, index) => index + INDEX_ADJUSTMENT_VALUE);
  const sliceFromValue = MAX_PAGINATION_COUNT * Math.floor((currentPage - INDEX_ADJUSTMENT_VALUE) / MAX_PAGINATION_COUNT);
  const sliceToValue = sliceFromValue + MAX_PAGINATION_COUNT;
  const isNextPageAvailable = sliceToValue + INDEX_ADJUSTMENT_VALUE < maxPageCount;
  const isPreviousPageAvailable = sliceFromValue !== 0;

  return (
    <div className="pagination page-content__pagination">
      <ul className="pagination__list">
        {isPreviousPageAvailable && (
          <li className="pagination__page pagination__page--prev" id="prev">
            <a className="link pagination__page-link" href={`${sliceToValue - MAX_PAGINATION_COUNT}`}>Назад</a>
          </li>
        )}

        {pages
          .slice(sliceFromValue, sliceToValue)
          .map((page) => (
            <li key={`page-number-${page}`}
              className={`pagination__page ${page === currentPage ? 'pagination__page--active' : ''}`}
            >
              <a className="link pagination__page-link" href={`${page}`}>{page}</a>
            </li>
          ))}

        {isNextPageAvailable && (
          <li className="pagination__page pagination__page--next" id="next">
            <a className="link pagination__page-link" href={`${sliceFromValue + MAX_PAGINATION_COUNT + INDEX_ADJUSTMENT_VALUE}`}>Далее</a>
          </li>
        )}


      </ul>
    </div>
  );
}

export default Pagination;
