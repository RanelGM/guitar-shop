function SearchForm(): JSX.Element {
  return (
    <div className="form-search">
      <form className="form-search__form">
        <button className="form-search__submit" type="submit">
          <svg className="form-search__icon" width="14" height="15" aria-hidden="true">
            <use xlinkHref="#icon-search"></use>
          </svg><span className="visually-hidden">Начать поиск</span>
        </button>
        <input className="form-search__input" id="search" type="text" autoComplete="off" placeholder="что вы ищите?" />
        <label className="visually-hidden" htmlFor="search">Поиск</label>
      </form>
      <ul className="form-search__select-list hidden">
        <li className="form-search__select-item" tabIndex={0}>Четстер Plus</li>
        <li className="form-search__select-item" tabIndex={0}>Четстер UX</li>
        <li className="form-search__select-item" tabIndex={0}>Четстер UX2</li>
        <li className="form-search__select-item" tabIndex={0}>Четстер UX3</li>
        <li className="form-search__select-item" tabIndex={0}>Четстер UX4</li>
        <li className="form-search__select-item" tabIndex={0}>Четстер UX5</li>
      </ul>
    </div>
  );
}

export default SearchForm;
