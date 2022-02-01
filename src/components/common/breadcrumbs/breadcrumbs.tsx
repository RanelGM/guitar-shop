import { Link } from 'react-router-dom';
import browserHistory from 'store/browser-history';
import { AppRoute, INITIAL_CATALOG_PAGE } from 'utils/const';

type BreadcrumbsProps = {
  productName?: string
}

function Breadcrumbs({ productName }: BreadcrumbsProps): JSX.Element {
  const isProductPage = browserHistory.location.pathname.includes(AppRoute.Product) && productName !== undefined;
  const isCartPage = browserHistory.location.pathname.includes(AppRoute.Cart);

  return (
    <ul className="breadcrumbs page-content__breadcrumbs">
      <li className="breadcrumbs__item">
        <Link to={AppRoute.Home} className="link">Главная</Link>
      </li>
      <li className="breadcrumbs__item">
        <Link className="link" to={{
          pathname: `${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`,
          state: { 'redirect': true },
        }}
        >Каталог
        </Link>
      </li>

      {isProductPage && (
        <li className="breadcrumbs__item">
          <a href='#todo' className="link">{productName}</a>
        </li>
      )}

      {isCartPage && (
        <li className="breadcrumbs__item">
          <a href='#todo' className="link">Корзина</a>
        </li>
      )}
    </ul >
  );
}

export default Breadcrumbs;
