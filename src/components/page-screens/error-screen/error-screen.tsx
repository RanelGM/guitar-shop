import { Footer, Header } from 'components/common/common';

function ErrorScreen(): JSX.Element {
  return (
    <div className="wrapper">
      <Header />
      <main className="page-content">
        <div className="container">
          <h1 className="page-content__title title">Возникла ошибка при загрузке данных с сервера. Попробуйте позднее</h1>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ErrorScreen;
