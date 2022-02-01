import { Switch, Route, Redirect } from 'react-router-dom';
import { CartScreen,CatalogScreen, ProductScreen, NotFoundScreen } from 'components/page-screens/page-screens';
import { AppRoute, INITIAL_CATALOG_PAGE } from 'utils/const';

function App(): JSX.Element {
  return (
    <Switch>
      <Route exact path={AppRoute.Home}>
        <Redirect to={`${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`} />
      </Route>
      <Route exact path={`${AppRoute.Catalog}/:id`}>
        <CatalogScreen />
      </Route>
      <Route exact path={`${AppRoute.Product}/:id`}>
        <ProductScreen />
      </Route>
      <Route exact path={AppRoute.Cart}>
        <CartScreen />
      </Route>
      <Route>
        <NotFoundScreen />
      </Route>
    </Switch>
  );
}

export default App;
