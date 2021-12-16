function Breadcrumbs(): JSX.Element {
  return (
    <ul className="breadcrumbs page-content__breadcrumbs">
      <li className="breadcrumbs__item"><a className="link" href="./main.html">Главная</a>
      </li>
      <li className="breadcrumbs__item"><a href="#todo" className="link">Каталог</a>
      </li>
    </ul>
  );
}

export default Breadcrumbs;
