import { Link } from 'react-router-dom';
import { AppRoute } from 'utils/const';

function Breadcrumbs(): JSX.Element {
  return (
    <ul className="breadcrumbs page-content__breadcrumbs">
      <li className="breadcrumbs__item">
        <Link to={AppRoute.Home} className="link">Главная</Link>
      </li>
      <li className="breadcrumbs__item">
        <a href="#todo" className="link">Каталог</a>
      </li>
    </ul>
  );
}

export default Breadcrumbs;
