import { Link } from 'react-router-dom';
import { AppRoute } from 'utils/const';

type LogoProps = {
  isMainPage?: boolean,
}

function Logo({ isMainPage }: LogoProps): JSX.Element {
  if (isMainPage) {
    return (
      <div className="header__logo logo" data-testid="logo">
        <img className="logo__img" width="70" height="70" src="/img/svg/logo.svg" alt="Логотип" />
      </div>
    );
  }

  return (
    <Link to={AppRoute.Home} className="header__logo logo" data-testid="logo">
      <img className="logo__img" width="70" height="70" src="/img/svg/logo.svg" alt="Логотип" />
    </Link>
  );
}

export default Logo;
