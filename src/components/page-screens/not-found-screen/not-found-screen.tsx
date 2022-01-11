import { Link } from 'react-router-dom';
import { Footer, Header } from 'components/common/common';
import { AppRoute } from 'utils/const';

function NotFoundScreen(): JSX.Element {
  return (
    <div className="wrapper">
      <Header isError />
      <main className="page-content">
        <div className="container">
          <h1 className="page-content__title title">Запрашиваемая страница не найдена</h1>
          <Link to={AppRoute.Home}>Вернуться на главную</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NotFoundScreen;
