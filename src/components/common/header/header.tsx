import { SearchForm, Cart } from './components/components';
import { Logo } from 'components/common/common';

type HeaderProps = {
  isMainPage?: boolean,
  isError?: boolean
}

function Header({ isMainPage, isError }: HeaderProps): JSX.Element {
  return (
    <header className="header" id="header">
      <div className="container header__wrapper">
        <Logo isMainPage={isMainPage} />

        <nav className="main-nav">
          <ul className="main-nav__list">
            <li>
              <a className="link main-nav__link link--current" href="#todo">Каталог</a>
            </li>
            <li>
              <a className="link main-nav__link" href="#todo">Где купить?</a>
            </li>
            <li>
              <a className="link main-nav__link" href="#todo">О компании</a>
            </li>
          </ul>
        </nav>

        {!isError && <SearchForm />}
        {!isError && <Cart />}
      </div>
    </header>
  );
}

export default Header;
