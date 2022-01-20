import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AxiosError } from 'axios';

import { ThunkActionDispatch } from 'types/action';
import { Breadcrumbs, Footer, Header, Loader } from 'components/common/common';
import { Card, ReviewsList } from './components/components';
import { ErrorScreen, NotFoundScreen } from '../page-screens';
import { loadExpandedGuitarAction } from 'store/api-actions';
import { getExpandedGuitar } from 'store/product-data/selectors';
import { getPageFromLocation } from 'utils/utils';
import { ResponseCode } from 'utils/const';

function ProductScreen(): JSX.Element {
  const dispatch = useDispatch<ThunkActionDispatch>();
  const [prevPageId, setPrevPageId] = useState<number | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [isNotFoundError, setIsNotFoundError] = useState(false);
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const product = useSelector(getExpandedGuitar);
  const pageId = getPageFromLocation();

  useEffect(() => {
    async function loadGuitar() {
      try {
        await dispatch(loadExpandedGuitarAction(pageId));
        setPrevPageId(pageId);
      }
      catch (error) {
        const errorCode = (error as AxiosError).response?.status;

        if (errorCode === ResponseCode.NotFound) {
          setIsNotFoundError(true);
        } else {
          setIsServerError(true);
        }

      }
      finally { setIsDataLoading(false); }
    }

    if (isServerError || isNotFoundError) { return; }

    if (!isDataLoading && (pageId !== prevPageId || isUpdateRequired)) {
      setIsDataLoading(true);
      setIsUpdateRequired(false);
      loadGuitar();
    }
  }, [dispatch, pageId, prevPageId, isUpdateRequired, isDataLoading, isServerError, isNotFoundError]);

  const handleUpdateRequest = () => {
    setIsUpdateRequired(true);
  };

  if (isServerError) {
    return <ErrorScreen />;
  }

  if (isNotFoundError) {
    return <NotFoundScreen />;
  }

  return (
    <div className="wrapper">
      <Header onUpdateRequest={handleUpdateRequest} />
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
              <ReviewsList product={product} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProductScreen;
