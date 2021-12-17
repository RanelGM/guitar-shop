import { useSelector } from 'react-redux';
import { getCart } from 'store/order-data/selectors';

function Cart(): JSX.Element {
  const cart = useSelector(getCart);
  const count = cart ? cart.length : 0;

  return (
    <a className="header__cart-link" href="#todo" aria-label="Корзина">
      <svg className="header__cart-icon" width="14" height="14" aria-hidden="true">
        <use xlinkHref="#icon-basket"></use>
      </svg><span className="visually-hidden">Перейти в корзину</span><span className="header__cart-count">{count}</span>
    </a>
  );
}

export default Cart;
