export enum AppRoute {
  Home = '/',
  Catalog = '/catalog',
  Product = '/product',
  Cart = '/cart',
}

export enum APIRoute {
  Guitars = '/guitars?_embed=comments',
  SearchSimilar = '/guitars?name_like',
}

export enum GuitarType {
  Acoustic = 'acoustic',
  Electric = 'electric',
  Ukulele = 'ukulele',
}

export const SortGroup = {
  Price: { type: 'price', label: 'По цене' },
  Rating: { type: 'rating', label: 'По популярности' },
  Ascending: { type: 'asc', label: 'По возрастанию' },
  Descending: { type: 'desc', label: 'По убыванию' },
} as const;

export const DEFAULT_SORT_TYPE = SortGroup.Price.type;
export const DEFAULT_SORT_ORDER = SortGroup.Ascending.type;
