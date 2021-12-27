import { Switch, Route, Redirect } from 'react-router-dom';
import { CatalogScreen, ErrorScreen, UnderConstructionScreen, NotFoundScreen } from 'components/page-screens/page-screens';
import { AppRoute, INITIAL_CATALOG_PAGE } from 'utils/const';

type AppProps = {
  isServerError: boolean,
}

function App({ isServerError }: AppProps): JSX.Element {
  if (isServerError) {
    return <ErrorScreen />;
  }

  return (
    <Switch>
      <Route exact path={AppRoute.Home}>
        <Redirect to={`${AppRoute.Catalog}/${INITIAL_CATALOG_PAGE}`} />
      </Route>
      <Route exact path={`${AppRoute.Catalog}/:id`}>
        <CatalogScreen />
      </Route>
      <Route exact path={`${AppRoute.Product}/:id`}>
        <UnderConstructionScreen />
      </Route>
      <Route exact path={AppRoute.Cart}>
        <UnderConstructionScreen />
      </Route>
      <Route>
        <NotFoundScreen />
      </Route>
    </Switch>
  );
}

export default App;
