import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThunkActionDispatch } from 'types/action';
import { Footer, Header } from 'components/common/common';
import { setGuitarType, setPriceRangeFrom, setPriceRangeTo } from 'store/action';
import { loadFilteredGuitarsAction } from 'store/api-actions';
import { AppRoute } from 'utils/const';

function NotFoundScreen(): JSX.Element {
  const dispatch = useDispatch<ThunkActionDispatch>();

  const handleLinkClick = () => {
    dispatch(setPriceRangeFrom(''));
    dispatch(setPriceRangeTo(''));
    dispatch(setGuitarType(null));
    dispatch(loadFilteredGuitarsAction());
  };

  return (
    <div className="wrapper">
      <Header isError />
      <main className="page-content">
        <div className="container">
          <h1 className="page-content__title title">Запрашиваемая страница не найдена</h1>
          <Link to={AppRoute.Home} onClick={handleLinkClick}>Вернуться на главную</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NotFoundScreen;
