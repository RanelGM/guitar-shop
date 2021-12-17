import { CatalogScreen, ErrorScreen } from 'components/page-screens/page-screens';

type AppProps = {
  isServerError: boolean,
}

function App({ isServerError }: AppProps): JSX.Element {
  if (isServerError) {
    return <ErrorScreen />;
  }

  return (
    <CatalogScreen />
  );
}

export default App;
