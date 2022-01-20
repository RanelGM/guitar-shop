export enum AppRoute {
  Home = '/',
  Catalog = '/catalog',
  Product = '/product',
  Cart = '/cart',
}

export enum APIRoute {
  Guitar = '/guitars',
  SimilarGuitar = '/guitars?name_like',
  Comments = '/comments',
}

export enum APIQuery {
  EmbedComment = '_embed=comments',
  Similar = 'name_like',
  Sort = '_sort',
  Order = '_order',
  PriceFrom = 'price_gte',
  PriceTo = 'price_lte',
  GuitarType = 'type',
  StringCount = 'stringCount',
  GuitarFrom = '_start',
  GuitarToLimit = '_limit',
  TotalCount = 'x-total-count'
}

export enum KeyboardKey {
  Enter = 'Enter',
  Esc = 'Escape',
}

export const GuitarGroup = {
  Acoustic: { type: 'acoustic', label: 'Акустические гитары', labelSingular: 'Акустическая гитара', strings: [6, 7, 12] },
  Electric: { type: 'electric', label: 'Электрогитары', labelSingular: 'Электрогитара', strings: [4, 6, 7] },
  Ukulele: { type: 'ukulele', label: 'Укулеле', labelSingular: 'Укулеле', strings: [4] },
} as const;

export const SortGroup = {
  Price: { type: 'price', label: 'По цене' },
  Rating: { type: 'rating', label: 'По популярности' },
  Ascending: { type: 'asc', label: 'По возрастанию' },
  Descending: { type: 'desc', label: 'По убыванию' },
} as const;

export const TabGroup = {
  Characteristics: { type: 'characteristics', label: 'Характеристики' },
  Description: { type: 'description', label: 'Описание' },
} as const;

export const DEFAULT_ACTIVE_TAB = TabGroup.Characteristics.type;

export const DEFAULT_SORT_TYPE = SortGroup.Price.type;
export const DEFAULT_SORT_ORDER = SortGroup.Ascending.type;

export const MAX_CARD_ON_PAGE_COUNT = 9;
export const INDEX_ADJUSTMENT_VALUE = 1;
export const INITIAL_CATALOG_PAGE = 1;
export const INITIAL_GUITAR_COUNT = 0;

export const MAX_STARS_COUNT = 5;
export const MAX_COMMENTS_COUNT = 3;
