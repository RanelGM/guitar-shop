function Card(): JSX.Element {
  return (
    <div className="product-card"><img src="img/content/guitar-2.jpg" width="75" height="190" alt="СURT Z30 Plus Acoustics" />
      <div className="product-card__info">
        <div className="rate product-card__rate" aria-hidden="true"><span className="visually-hidden">Рейтинг:</span>
          <svg width="12" height="11" aria-hidden="true">
            <use xlinkHref="#icon-full-star"></use>
          </svg>
          <svg width="12" height="11" aria-hidden="true">
            <use xlinkHref="#icon-full-star"></use>
          </svg>
          <svg width="12" height="11" aria-hidden="true">
            <use xlinkHref="#icon-full-star"></use>
          </svg>
          <svg width="12" height="11" aria-hidden="true">
            <use xlinkHref="#icon-full-star"></use>
          </svg>
          <svg width="12" height="11" aria-hidden="true">
            <use xlinkHref="#icon-star"></use>
          </svg><span className="rate__count">9</span><span className="rate__message"></span>
        </div>
        <p className="product-card__title">СURT Z30 Plus Acoustics</p>
        <p className="product-card__price"><span className="visually-hidden">Цена:</span>129 500 ₽
        </p>
      </div>
      <div className="product-card__buttons"><a href="#todo" className="button button--mini">Подробнее</a><a className="button button--red button--mini button--add-to-cart" href="#todo">Купить</a>
      </div>
    </div>
  );
}

export default Card;
