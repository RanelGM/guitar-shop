import { Breadcrumbs, Footer, Header, Pagination } from 'components/common/common';
import { Filter, Sort, Card } from './components/components';

function CatalogScreen(): JSX.Element {
  return (
    <div className="wrapper">
      <Header />

      <main className="page-content">
        <div className="container">
          <h1 className="page-content__title title title--bigger">Каталог гитар</h1>

          <Breadcrumbs />

          <div className="catalog">
            <Filter />
            <Sort />

            <div className="cards catalog__cards">
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
            </div>

            <Pagination />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CatalogScreen;
