import { SearchForm, Cart } from './components/components';
import { Logo } from 'components/common/common';
import browserHistory from 'store/browser-history';
import { AppRoute, INITIAL_CATALOG_PAGE } from 'utils/const';
import { Link } from 'react-router-dom';

type HeaderProps = {
  isError?: boolean,
  onUpdateRequest?: () => void,
}

function Header({ isError, onUpdateRequest }: HeaderProps): JSX.Element {
  const isCatalogPage = browserHistory.location.pathname.includes(AppRoute.Catalog);

  return (
    <header className="header" id="header">
      <div className="container header__wrapper">
        <Logo isMainPage={isCatalogPage} />

        <nav className="main-nav">
          <ul className="main-nav__list">
            <li>
              <Link
                to={`${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`}
                className={`link main-nav__link ${isCatalogPage ? 'link--current' : ''}`}
              >
                Каталог
              </Link>
            </li>
            <li>
              <a className="link main-nav__link" href="#todo">Где купить?</a>
            </li>
            <li>
              <a className="link main-nav__link" href="#todo">О компании</a>
            </li>
          </ul>
        </nav>

        {!isError && <SearchForm onUpdateRequest={onUpdateRequest} />}
        {!isError && <Cart />}
      </div>
    </header>
  );
}

export default Header;
