import { FocusEvent, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThunkActionDispatch } from 'types/action';
import { loadSearchSimilarAction } from 'store/api-actions';
import { getSimilarAtSearch } from 'store/product-data/selectors';
import { AppRoute } from 'utils/const';

type SearchFormProps = {
  onUpdateRequest?: () => void,
}

function SearchForm({ onUpdateRequest }: SearchFormProps): JSX.Element {
  const dispatch = useDispatch<ThunkActionDispatch>();
  const [isSearchError, setIsSearchError] = useState(false);
  const similarGuitars = useSelector(getSimilarAtSearch);

  const parentRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const handleSearchChange = async () => {
    const searchInput = searchRef.current;
    const listElement = listRef.current;

    if (searchInput !== null && listElement !== null && searchInput.value.length === 0) {
      listElement.classList.add('hidden');
      return;
    }

    if (searchInput !== null && listElement !== null) {
      try {
        await dispatch(loadSearchSimilarAction(searchInput.value));
      }
      catch {
        setIsSearchError(true);
      }
      finally {
        listElement.classList.remove('hidden');
      }
    }
  };

  const handleSearchFocus = () => {
    const input = searchRef.current;

    if (input && input.value.length > 0) {
      listRef.current?.classList.remove('hidden');
    }
  };

  const handleSearchBlur = (evt: FocusEvent) => {
    const isBlurOnParentRef = evt.relatedTarget?.closest('.form-search') === parentRef.current;

    if (isBlurOnParentRef) {
      return;
    }

    listRef.current?.classList.add('hidden');
  };

  const handleLinkClick = () => {
    if (onUpdateRequest) {
      onUpdateRequest();
    }
  };

  return (
    <div ref={parentRef} onBlur={handleSearchBlur} className="form-search" >
      <form className="form-search__form">
        <button className="form-search__submit" type="submit">
          <svg className="form-search__icon" width="14" height="15" aria-hidden="true">
            <use xlinkHref="#icon-search"></use>
          </svg><span className="visually-hidden">???????????? ??????????</span>
        </button>
        <input ref={searchRef}
          onFocus={handleSearchFocus}
          onChange={handleSearchChange}
          className="form-search__input" id="search" type="text" autoComplete="off" placeholder="?????? ???? ???????????"
        />
        <label className="visually-hidden" htmlFor="search">??????????</label>
      </form>
      <ul
        ref={listRef}
        className="form-search__select-list hidden"
        style={{
          zIndex: 1,
        }}
      >
        {!isSearchError && similarGuitars.map((guitar) => (
          <li key={`search-${guitar.id}`}>
            <Link onClick={handleLinkClick} to={`${AppRoute.Product}/${guitar.id}`} className="form-search__select-item" >{guitar.name}</Link>
          </li>
        ))}

        {isSearchError && (
          <li>
            ?????????????????? ???????????? ?????? ???????????????? ????????????. ???????????????????? ??????????????.
          </li>
        )}
      </ul>
    </div >
  );
}

export default SearchForm;
