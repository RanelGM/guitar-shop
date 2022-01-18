type LoaderProps = {
  children?: string,
}

function Loader({ children }: LoaderProps): JSX.Element {
  const message = children ? children : 'Загружаем список гитар';

  return (
    <div className="loader">{message}</div>
  );
}

export default Loader;
