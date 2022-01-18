import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkActionDispatch } from 'types/action';
import { Breadcrumbs, Footer, Header, Loader, Pagination } from 'components/common/common';
import { Filter, Sort, Card } from './components/components';
import { ErrorScreen, NotFoundScreen } from '../page-screens';
import { getGuitarsTotalCount, getGuitarsToRender, getIsUpdateLoaded } from 'store/product-data/selectors';
import { setCurrentPage, setGuitarType, setIsServerError, setPriceRangeFrom, setPriceRangeTo, setStringCount } from 'store/action';
import { loadFilteredGuitarsAction, loadProductAction } from 'store/api-actions';
import { getGuitarType, getIsServerError, getPriceRangeFrom, getPriceRangeTo, getStringCount } from 'store/query-data/selectors';
import { INITIAL_CATALOG_PAGE, MAX_CARD_ON_PAGE_COUNT } from 'utils/const';
import { getPageFromLocation, getQueryPath } from 'utils/utils';
import browserHistory from 'store/browser-history';

function CatalogScreen(): JSX.Element {
  const dispatch = useDispatch<ThunkActionDispatch>();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const isServerError = useSelector(getIsServerError);
  const guitarsToRender = useSelector(getGuitarsToRender);
  const guitarsTotalCount = useSelector(getGuitarsTotalCount);
  const isUpdateLoaded = useSelector(getIsUpdateLoaded);
  const types = useSelector(getGuitarType);
  const strings = useSelector(getStringCount);
  const priceFrom = useSelector(getPriceRangeFrom);
  const priceTo = useSelector(getPriceRangeTo);
  const currentPage = getPageFromLocation();
  const maxPageCount = guitarsTotalCount !== 0 ? Math.ceil(guitarsTotalCount / MAX_CARD_ON_PAGE_COUNT) : INITIAL_CATALOG_PAGE;
  const isGuitars = guitarsToRender.length > 0;

  const filterParams = getQueryPath(currentPage.toString());
  const isRedirectFromAnotherPage = browserHistory.action === 'REPLACE';
  const isTypesEmpty = types === null || types.length === 0;
  const isStringsEmpty = strings === null || strings.length === 0;
  const isPriceFromEmpty = priceFrom === '';
  const isPriceToEmpty = priceTo === '';

  dispatch(setCurrentPage(currentPage));

  async function fetchGuitars() {
    try {
      setIsDataLoading(true);
      await dispatch(loadProductAction());
      setIsDataLoaded(true);
    }
    catch {
      dispatch(setIsServerError(true));
    }
    finally {
      setIsDataLoading(false);
    }
  }

  useEffect(() => {
    if (isDataLoaded || isRedirectFromAnotherPage || isDataLoading || isServerError) { return; }

    fetchGuitars();
  });

  useEffect(() => {
    if (filterParams || !isRedirectFromAnotherPage || isDataLoading || isDataLoaded || isServerError) { return; }
    if (!isTypesEmpty) { dispatch(setGuitarType(null)); }
    if (!isStringsEmpty) { dispatch(setStringCount(null)); }
    if (!isPriceFromEmpty) { dispatch(setPriceRangeFrom('')); }
    if (!isPriceToEmpty) { dispatch(setPriceRangeTo('')); }

    fetchGuitars();
  });

  const handlePaginationClick = () => {
    dispatch(loadFilteredGuitarsAction(true));
  };

  if (isServerError) {
    return <ErrorScreen />;
  }

  if (isDataLoading) {
    return <Loader />;
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

            {!isUpdateLoaded && (
              <Loader />
            )}

            {isUpdateLoaded && (
              <div className="cards catalog__cards">
                {!isGuitars && (
                  <div className='cards__empty'>В каталоге не найдено гитар в соответствии с заданными параметрами</div>
                )}

                {guitarsToRender.map((guitar) => <Card key={guitar.id} guitar={guitar} />)}
              </div>
            )}

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
