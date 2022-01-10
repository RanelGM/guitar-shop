import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThunkActionDispatch } from 'types/action';
import { setGuitarType, setPriceRangeFrom, setPriceRangeTo } from 'store/action';
import { loadFilteredGuitarsAction } from 'store/api-actions';
import { AppRoute } from 'utils/const';

type LogoProps = {
  isMainPage?: boolean,
}

function Logo({ isMainPage }: LogoProps): JSX.Element {
  const dispatch = useDispatch<ThunkActionDispatch>();

  const handleLogoClick = () => {
    dispatch(setPriceRangeFrom(''));
    dispatch(setPriceRangeTo(''));
    dispatch(setGuitarType(null));
    dispatch(loadFilteredGuitarsAction());
  };

  if (isMainPage) {
    return (
      <div className="header__logo logo" data-testid="logo">
        <img className="logo__img" width="70" height="70" src="/img/svg/logo.svg" alt="Логотип" />
      </div>
    );
  }

  return (
    <Link className="header__logo logo"
      to={AppRoute.Home}
      onClick={handleLogoClick}
      data-testid="logo"
    >
      <img className="logo__img" width="70" height="70" src="/img/svg/logo.svg" alt="Логотип" />
    </Link>
  );
}

export default Logo;
