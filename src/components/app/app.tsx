import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { CatalogScreen, ErrorScreen, UnderConstructionScreen } from 'components/page-screens/page-screens';
import browserHistory from 'store/browser-history';
import { AppRoute } from 'utils/const';

type AppProps = {
  isServerError: boolean,
}

function App({ isServerError }: AppProps): JSX.Element {
  if (isServerError) {
    return <ErrorScreen />;
  }

  return (
    <Router history={browserHistory}>
      <Switch>
        <Route exact path={AppRoute.Home}>
          <Redirect to={AppRoute.CatalogStart} />
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
      </Switch>
    </Router >
  );
}

export default App;
