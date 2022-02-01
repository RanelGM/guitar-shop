import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCart } from 'store/order-data/selectors';
import { AppRoute } from 'utils/const';

function Cart(): JSX.Element {
  const cart = useSelector(getCart);
  const isCart = cart !== null && cart.length > 0;

  return (
    <Link to={AppRoute.Cart} className="header__cart-link" aria-label="Корзина">
      <svg className="header__cart-icon" width="14" height="14" aria-hidden="true">
        <use xlinkHref="#icon-basket"></use>
      </svg>
      <span className="visually-hidden">Перейти в корзину</span>

      {isCart && (
        <span className="header__cart-count">{cart.length}</span>
      )}

    </Link>
  );
}

export default Cart;
