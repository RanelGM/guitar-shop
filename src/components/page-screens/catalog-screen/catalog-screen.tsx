import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Guitar } from 'types/product';
import { ThunkActionDispatch } from 'types/action';
import { Breadcrumbs, Footer, Header, Pagination } from 'components/common/common';
import { Filter, Sort, Card } from './components/components';
import { NotFoundScreen } from '../page-screens';
import { getGuitarsFiltered, getGuitarsToRender } from 'store/product-data/selectors';
import { setCurrentPage } from 'store/action';
import { loadFilteredGuitarsAction } from 'store/api-actions';
import { MAX_CARD_ON_PAGE_COUNT } from 'utils/const';

function CatalogScreen(): JSX.Element {
  const dispatch = useDispatch() as ThunkActionDispatch;
  const location = useLocation();
  const guitarsToRender = useSelector(getGuitarsToRender) as Guitar[];
  const guitarsFromServer = useSelector(getGuitarsFiltered) as Guitar[];
  const currentPage = Number(location.pathname.split('/').pop());
  const maxPageCount = Math.ceil(guitarsFromServer.length / MAX_CARD_ON_PAGE_COUNT);

  dispatch(setCurrentPage(currentPage));

  const handlePaginationClick = () => {
    dispatch(loadFilteredGuitarsAction(true));
  };

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
