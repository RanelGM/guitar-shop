import { Footer, Header } from 'components/common/common';

function UnderConstructionScreen(): JSX.Element {
  return (
    <div className="wrapper">
      <Header />
      <main className="page-content">
        <div className="container">
          <h1 className="page-content__title title">
            Страница находится на этапе разработки
            <br />
            (Реализация на следующем этапе)
          </h1>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default UnderConstructionScreen;
