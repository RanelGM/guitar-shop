import { useSelector } from 'react-redux';
import { Guitar } from 'types/guitar';
import { Breadcrumbs, Footer, Header, Pagination } from 'components/common/common';
import { Filter, Sort, Card } from './components/components';
import { getGuitars } from 'store/product-data/selectors';

const MAX_CARD_COUNT = 9;

function CatalogScreen(): JSX.Element {
  const guitars = useSelector(getGuitars) as Guitar[];

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
              {guitars.slice(0, MAX_CARD_COUNT).map((guitar) => <Card key={guitar.id} guitar={guitar} />)}
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
