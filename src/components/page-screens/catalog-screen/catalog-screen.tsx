import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Guitar } from 'types/product';
import { Breadcrumbs, Footer, Header, Pagination } from 'components/common/common';
import { Filter, Sort, Card } from './components/components';
import { getDefaultServerGuitars, getGuitars } from 'store/product-data/selectors';
import { setCurrentPage } from 'store/action';
import { MAX_CARD_ON_PAGE_COUNT, INDEX_ADJUSTMENT_VALUE } from 'utils/const';

function CatalogScreen(): JSX.Element {
  let guitarsToRender = useSelector(getGuitars) as Guitar[] | null;
  const guitarsFromServer = useSelector(getDefaultServerGuitars) as Guitar[];
  const location = useLocation();
  const dispatch = useDispatch();
  const currentPage = Number(location.pathname.split('/').pop());
  const maxPageCount = Math.ceil(guitarsFromServer.length / MAX_CARD_ON_PAGE_COUNT);

  guitarsToRender = guitarsToRender !== null
    ? guitarsToRender
    : guitarsFromServer.slice(MAX_CARD_ON_PAGE_COUNT * (currentPage - INDEX_ADJUSTMENT_VALUE), MAX_CARD_ON_PAGE_COUNT * currentPage);

  dispatch(setCurrentPage(currentPage));

  return (
    <div className="wrapper">
      <Header />

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
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CatalogScreen;
