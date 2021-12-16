import { SearchForm, Cart } from './components/components';
import { Logo } from 'components/common/common';

function Header(): JSX.Element {
  return (
    <header className="header" id="header">
      <div className="container header__wrapper">
        <Logo />

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

        <SearchForm />
        <Cart />
      </div>
    </header>
  );
}

export default Header;
