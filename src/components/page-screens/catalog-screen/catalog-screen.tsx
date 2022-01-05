import { useDispatch, useSelector } from 'react-redux';
import { Guitar } from 'types/product';
import { ThunkActionDispatch } from 'types/action';
import { Breadcrumbs, Footer, Header, Pagination } from 'components/common/common';
import { Filter, Sort, Card } from './components/components';
import { ErrorScreen, NotFoundScreen } from '../page-screens';
import { getGuitarsTotalCount, getGuitarsToRender } from 'store/product-data/selectors';
import { setCurrentPage } from 'store/action';
import { loadFilteredGuitarsAction } from 'store/api-actions';
import { getIsServerError } from 'store/query-data/selectors';
import { INITIAL_CATALOG_PAGE, MAX_CARD_ON_PAGE_COUNT } from 'utils/const';
import { getPageFromLocation } from 'utils/utils';

function CatalogScreen(): JSX.Element {
  const dispatch = useDispatch<ThunkActionDispatch>();
  const isServerError = useSelector(getIsServerError) as boolean;
  const guitarsToRender = useSelector(getGuitarsToRender) as Guitar[];
  const guitarsTotalCount = useSelector(getGuitarsTotalCount) as number;
  const currentPage = getPageFromLocation();
  const maxPageCount = guitarsTotalCount !== 0 ? Math.ceil(guitarsTotalCount / MAX_CARD_ON_PAGE_COUNT) : INITIAL_CATALOG_PAGE;

  dispatch(setCurrentPage(currentPage));

  const handlePaginationClick = () => {
    dispatch(loadFilteredGuitarsAction(true));
  };

  if (isServerError) {
    return <ErrorScreen />;
  }

  if (currentPage > maxPageCount) {
    return <NotFoundScreen />;
  }

  return (
    <div className="wrapper">
      <Header isMainPage />

      <main className="page-content">
        <div className="container">
          <h1 className="page-content__title title title--bigger">Каталог гитар</h1>

          <Breadcrumbs />

          <div className="catalog">
            <Filter />
            <Sort />

            <div className="cards catalog__cards">
              {guitarsToRender.map((guitar) => <Card key={guitar.id} guitar={guitar} />)}
            </div>

            <Pagination
              currentPage={currentPage}
              maxPageCount={maxPageCount}
              onLinkClick={handlePaginationClick}
            />
          </div>
        </div>
      </main>

      <Footer isMainPage />
    </div>
  );
}

export default CatalogScreen;
