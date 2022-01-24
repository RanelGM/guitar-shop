import { MouseEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ErrorScreen } from 'components/page-screens/page-screens';
import { getExpandedGuitar } from 'store/product-data/selectors';
import { AppRoute, DEFAULT_ACTIVE_TAB, GuitarGroup, MAX_STARS_COUNT, TabGroup } from 'utils/const';
import { adaptImageSrc, getNumberWithSpaceBetween } from 'utils/utils';

type TabKey = keyof typeof TabGroup;
type TabType = typeof TabGroup[TabKey]['type'];

const tabs = Object.values(TabGroup);
const stars = Array.from({ length: MAX_STARS_COUNT }, (item, index) => index);

function Card(): JSX.Element {
  const product = useSelector(getExpandedGuitar);
  const [activeTab, setActiveTab] = useState<TabType>(DEFAULT_ACTIVE_TAB);

  if (product === null) { return <ErrorScreen />; }

  const { id, name, vendorCode, type, description, previewImg, stringCount, rating, price, comments } = product;

  const adaptedImageSrc = adaptImageSrc(previewImg);
  const adaptedPrice = getNumberWithSpaceBetween(price);
  const adaptedType = Object.values(GuitarGroup).find((group) => group.type === type)?.labelSingular;

  const isCharacterTabActive = activeTab === TabGroup.Characteristics.type;
  const isDescriptionTabActive = activeTab === TabGroup.Description.type;

  const handleTabClick = (evt: MouseEvent) => {
    evt.preventDefault();

    const tabLink = evt.target as HTMLAnchorElement;
    const tabGroup = tabs.find((tab) => tab.label === tabLink.innerHTML);

    if (!tabGroup || tabGroup.type === activeTab) { return; }

    setActiveTab(tabGroup.type);
  };

  return (
    <div className="product-container">
      <img className="product-container__img" width="90" height="235" alt={`Изображение ${product.name}`}
        src={adaptedImageSrc}
      />

      <div className="product-container__info-wrapper">
        <h2 className="product-container__title title title--big title--uppercase">
          {name}
        </h2>

        <div className="rate product-container__rating" aria-hidden="true"><span className="visually-hidden">Рейтинг:</span>
          {stars.map((item, index) => {
            const isFullStar = index < rating;

            return (
              <svg key={`${id}-${item}`} width="12" height="11" aria-hidden="true">
                <use xlinkHref={isFullStar ? '#icon-full-star' : '#icon-star'}></use>
              </svg>
            );
          })}

          <span className="rate__count">{comments.length}</span><span className="rate__message"></span>
        </div>

        <div className="tabs">
          {tabs.map((tab) => (
            <a href={`#${tab.type}`}
              key={`${tab.type}-${tab.label}`}
              onClick={handleTabClick}
              className={`button button--medium tabs__button
              ${activeTab === tab.type ? '' : 'button--black-border'}`}
            >{tab.label}
            </a>
          ))}

          <div className="tabs__content" id="characteristics">
            <table className={`tabs__table
            ${isCharacterTabActive ? '' : 'hidden'}`}
            >
              <tbody>
                <tr className="tabs__table-row">
                  <td className="tabs__title">Артикул:</td>
                  <td className="tabs__value">{vendorCode}</td>
                </tr>
                <tr className="tabs__table-row">
                  <td className="tabs__title">Тип:</td>
                  <td className="tabs__value">{adaptedType}</td>
                </tr>
                <tr className="tabs__table-row">
                  <td className="tabs__title">Количество струн:</td>
                  <td className="tabs__value">{stringCount} струнная</td>
                </tr>
              </tbody>
            </table>

            <p className={`tabs__product-description
            ${isDescriptionTabActive ? '' : 'hidden'}`}
            >
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="product-container__price-wrapper">
        <p className="product-container__price-info product-container__price-info--title">Цена:</p>
        <p className="product-container__price-info product-container__price-info--value">
          {adaptedPrice} ₽
        </p>
        <Link to={AppRoute.Cart} className="button button--red button--big product-container__button">Добавить в корзину
        </Link>
      </div>
    </div>
  );
}

export default Card;
