import { useDispatch, useSelector } from 'react-redux';

import { ThunkActionDispatch } from 'types/action';
import { GuitarInCart } from 'types/product';
import { Card, Promocode } from './components/components';
import { Breadcrumbs, Footer, Header } from 'components/common/common';
import { setCart } from 'store/action';
import { getCart, getDiscount } from 'store/order-data/selectors';
import { getNumberWithSpaceBetween, getTotalPrice, replaceItemInArrayByIndex } from 'utils/utils';

function CartScreen(): JSX.Element {
  const cart = useSelector(getCart);
  const promoDiscount = useSelector(getDiscount);
  const dispatch = useDispatch<ThunkActionDispatch>();
  const isGuitarsInCart = cart !== null && cart.length > 0;

  const isDiscount = promoDiscount > 0;
  const undiscountedPrice = cart ? getTotalPrice(cart) : 0;
  const discountPrice = undiscountedPrice * promoDiscount / 100;
  const discountedPrice = undiscountedPrice - discountPrice;

  const adaptedUndicountedPrice = getNumberWithSpaceBetween(undiscountedPrice);
  const adaptedDiscountPrice = getNumberWithSpaceBetween(discountPrice);
  const adaptedDiscountedPrice = getNumberWithSpaceBetween(discountedPrice);

  const handleCartUpdate = (updatingCount: number, guitar: GuitarInCart) => {
    if (!cart) { return; }

    const updatedGuitar = Object.assign({}, guitar, {
      count: updatingCount,
    });

    const index = cart.indexOf(guitar);
    const updatedCart = replaceItemInArrayByIndex(updatedGuitar, cart, index);

    dispatch(setCart(updatedCart));
  };

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
                <Card key={`cart-key-${guitar.id}`} guitar={guitar} onCartUpdate={handleCartUpdate} />
              ))}

              <div className="cart__footer">
                <Promocode />

                <div className="cart__total-info">
                  <p className="cart__total-item">
                    <span className="cart__total-value-name">Всего:</span>
                    <span className="cart__total-value" data-testid="total-value">{adaptedUndicountedPrice} ₽</span>
                  </p>
                  <p className="cart__total-item">
                    <span className="cart__total-value-name">Скидка:</span>
                    <span data-testid="discount-value" className={`cart__total-value
                    ${isDiscount ? 'cart__total-value--bonus' : ''}`}
                    >{isDiscount ? '- ' : ''}{adaptedDiscountPrice} ₽
                    </span>
                  </p>
                  <p className="cart__total-item">
                    <span className="cart__total-value-name">К оплате:</span>
                    <span className="cart__total-value cart__total-value--payment"
                      data-testid="total-discounted-value"
                    >{adaptedDiscountedPrice} ₽
                    </span>
                  </p>
                  <button className="button button--red button--big cart__order-button">Оформить заказ</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main >

      <Footer />
    </div >

  );
}

export default CartScreen;
