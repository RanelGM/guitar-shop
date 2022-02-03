import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCart } from 'store/order-data/selectors';
import { AppRoute } from 'utils/const';
import { GuitarInCart } from 'types/product';

function Cart(): JSX.Element {
  const cart = useSelector(getCart);
  const isCart = cart !== null && cart.length > 0;

  const reducer = (sum: number, guitar: GuitarInCart) => sum += guitar.count;
  const count = isCart ? cart.reduce(reducer, 0) : 0;

  return (
    <Link to={AppRoute.Cart} className="header__cart-link" aria-label="Корзина">
      <svg className="header__cart-icon" width="14" height="14" aria-hidden="true">
        <use xlinkHref="#icon-basket"></use>
      </svg>
      <span className="visually-hidden">Перейти в корзину</span>

      {isCart && (
        <span className="header__cart-count">{count}</span>
      )}

    </Link>
  );
}

export default Cart;
