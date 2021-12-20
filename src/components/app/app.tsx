import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { CatalogScreen, ErrorScreen, UnderConstructionScreen } from 'components/page-screens/page-screens';
import { AppRoute } from 'utils/const';

type AppProps = {
  isServerError: boolean,
}

function App({ isServerError }: AppProps): JSX.Element {
  if (isServerError) {
    return <ErrorScreen />;
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={AppRoute.Home}>
          <Redirect to={AppRoute.Catalog} />
        </Route>
        <Route exact path={AppRoute.Catalog}>
          <CatalogScreen />
        </Route>
        <Route exact path={`${AppRoute.Product}/:id`}>
          <UnderConstructionScreen />
        </Route>
        <Route exact path={AppRoute.Cart}>
          <UnderConstructionScreen />
        </Route>
      </Switch>
    </BrowserRouter >
  );
}

export default App;
