import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ThunkActionDispatch } from 'types/action';
import { Breadcrumbs, Footer, Header, Loader } from 'components/common/common';
import { Card, ReviewsList } from './components/components';
import { loadExpandedGuitarAction } from 'store/api-actions';
import { getExpandedGuitar } from 'store/product-data/selectors';
import { getPageFromLocation } from 'utils/utils';
import { ErrorScreen } from '../page-screens';

function ProductScreen(): JSX.Element {
  const dispatch = useDispatch<ThunkActionDispatch>();
  const [prevPageId, setPrevPageId] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const product = useSelector(getExpandedGuitar);
  const pageId = getPageFromLocation();

  useEffect(() => {
    async function loadGuitar() {
      try {
        await dispatch(loadExpandedGuitarAction(pageId));
        setPrevPageId(pageId);
      }
      catch { setIsError(true); }
      finally { setIsDataLoading(false); }
    }

    if (pageId !== prevPageId) {
      setIsDataLoading(true);
      loadGuitar();
    }
  }, [dispatch, pageId, prevPageId]);

  if (isError) {
    return <ErrorScreen />;
  }

  return (
    <div className="wrapper">
      <Header />
      <main className="page-content">
        <div className="container">
          <h1 className="page-content__title title title--bigger">Товар</h1>

          {isDataLoading && (
            <Loader>Загружаем данные по гитаре</Loader>
          )}

          {!isDataLoading && product !== null && (
            <div>
              <Breadcrumbs productName={product.name} />
              <Card product={product} />
              <ReviewsList reviews={product.comments} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProductScreen;
