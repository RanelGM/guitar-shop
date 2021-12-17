import { CatalogScreen } from 'components/page-screens/page-screens';

type AppProps = {
  isServerError: boolean,
}

function App({ isServerError }: AppProps): JSX.Element {
  if (isServerError) {
    return (
      <div>Сервер недоступен на текущий момент. Попробуйте позднее</div>
    );
  }

  return (
    <CatalogScreen />
  );
}

export default App;
