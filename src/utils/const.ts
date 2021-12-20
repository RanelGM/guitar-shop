export enum AppRoute {
  Home = '/',
  Catalog = '/catalog',
  Product = '/product',
  Cart = '/cart',
}

export enum APIRoute {
  Guitars = '/guitars',
  SearchSimilar = '/guitars?name_like',
}

export enum GuitarType {
  Acoustic = 'acoustic',
  Electric = 'electric',
  Ukulele = 'ukulele',
}

export enum SortType {
  Price = 'price',
  Rating = 'rating',
  Ascending = 'asc',
  Descending = 'desc',
}

export enum SortAria {
  Price = 'По цене',
  Rating = 'По популярности',
  Ascending = 'По возрастанию',
  Descending = 'По убыванию',
}
