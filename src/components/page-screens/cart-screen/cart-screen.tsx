import { useSelector } from 'react-redux';

import { Card, Promocode } from './components/components';
import { Breadcrumbs, Footer, Header } from 'components/common/common';
import { getCart } from 'store/order-data/selectors';
import { getNumberWithSpaceBetween, getTotalPrice } from 'utils/utils';

function CartScreen(): JSX.Element {
  const promoDiscount = 0;

  const cart = useSelector(getCart);
  const isGuitarsInCart = cart !== null && cart.length > 0;
  const undiscountedPrice = cart ? getTotalPrice(cart) : 0;
  const discountPrice = undiscountedPrice * promoDiscount / 100;
  const discountedPrice = undiscountedPrice - discountPrice;

  const adaptedUndicountedPrice = getNumberWithSpaceBetween(undiscountedPrice);
  const adaptedDiscountPrice = getNumberWithSpaceBetween(discountPrice);
  const adaptedDiscountedPrice = getNumberWithSpaceBetween(discountedPrice);

  return (
    <div className='wrapper'>
      <Header />

      <main className="page-content">
        <div className="container">
          <h1 className="title title--bigger page-content__title">Корзина</h1>

          <Breadcrumbs />

          {!isGuitarsInCart && (
            <div>
              <p>Корзина пуста.</p>
              <p>Воспользуйтесь каталогом, чтобы найти нужный товар.</p>
            </div>
          )}

          {isGuitarsInCart && (
            <div className="cart">
              {cart.map((guitar) => (
                <Card key={`cart-key-${guitar.id}`} guitar={guitar}/>
              ))}

              <div className="cart__footer">
                <Promocode />

                <div className="cart__total-info">
                  <p className="cart__total-item">
                    <span className="cart__total-value-name">Всего:</span>
                    <span className="cart__total-value">{adaptedUndicountedPrice} ₽</span>
                  </p>
                  <p className="cart__total-item">
                    <span className="cart__total-value-name">Скидка:</span>
                    <span className="cart__total-value cart__total-value--bonus">- {adaptedDiscountPrice} ₽</span>
                  </p>
                  <p className="cart__total-item">
                    <span className="cart__total-value-name">К оплате:</span>
                    <span className="cart__total-value cart__total-value--payment">{adaptedDiscountedPrice} ₽</span>
                  </p>
                  <button className="button button--red button--big cart__order-button">Оформить заказ</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>

  );
}

export default CartScreen;
