export enum AppRoute {
  Home = '/',
  Catalog = '/catalog',
  CatalogStart = '/catalog/1',
  Product = '/product',
  Cart = '/cart',
}

export enum APIRoute {
  Guitar = '/guitars',
  SimilarGuitar = '/guitars?name_like',
}

export enum APIQuery {
  EmbedComment = '_embed=comments',
  Similar = 'name_like',
  Sort = '_sort',
  Order = '_order',
  PriceFrom = 'price_gte',
  PriceTo = 'price_lte',
  GuitarType = 'type',
  GuitarFrom = '_start',
  GuitarToLimit = '_limit',
}

export const GuitarGroup = {
  Acoustic: { type: 'acoustic', label: 'Акустические гитары', strings: [6, 7, 12] },
  Electric: { type: 'electric', label: 'Электрогитары', strings: [4, 6, 7] },
  Ukulele: { type: 'ukulele', label: 'Укулеле', strings: [4] },
} as const;

export const SortGroup = {
  Price: { type: 'price', label: 'По цене' },
  Rating: { type: 'rating', label: 'По популярности' },
  Ascending: { type: 'asc', label: 'По возрастанию' },
  Descending: { type: 'desc', label: 'По убыванию' },
} as const;

export const DEFAULT_SORT_TYPE = SortGroup.Price.type;
export const DEFAULT_SORT_ORDER = SortGroup.Ascending.type;

export const MAX_CARD_ON_PAGE_COUNT = 9;
export const INDEX_ADJUSTMENT_VALUE = 1;
export const START_FROM_PAGE = 1;
