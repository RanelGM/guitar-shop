import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThunkActionDispatch } from 'types/action';
import { setPriceRangeFrom, setPriceRangeTo, setGuitarType } from 'store/action';
import { loadFilteredGuitarsAction } from 'store/api-actions';
import { AppRoute } from 'utils/const';

function Breadcrumbs(): JSX.Element {
  const dispatch = useDispatch<ThunkActionDispatch>();

  const handleLinkClick = () => {
    dispatch(setPriceRangeFrom(''));
    dispatch(setPriceRangeTo(''));
    dispatch(setGuitarType(null));
    dispatch(loadFilteredGuitarsAction());
  };

  return (
    <ul className="breadcrumbs page-content__breadcrumbs">
      <li className="breadcrumbs__item">
        <Link to={AppRoute.Home} onClick={handleLinkClick} className="link">Главная</Link>
      </li>
      <li className="breadcrumbs__item">
        <a href="#todo" className="link">Каталог</a>
      </li>
    </ul>
  );
}

export default Breadcrumbs;
