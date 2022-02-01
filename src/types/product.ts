import { GuitarGroup, SortGroup } from 'utils/const';

export type GuitarKey = keyof typeof GuitarGroup;
export type GuitarType = typeof GuitarGroup[GuitarKey]['type'];
export type GuitarLabel = typeof GuitarGroup[GuitarKey]['label'];
export type GuitarStrings = typeof GuitarGroup[GuitarKey]['strings'];

export type SortKey = keyof typeof SortGroup;
export type SortType = typeof SortGroup[SortKey]['type'];
export type SortLabel = typeof SortGroup[SortKey]['label'];

export type Group = typeof GuitarGroup | typeof SortGroup;
export type GroupKey = typeof GuitarGroup[GuitarKey] | typeof SortGroup[SortKey];
export type GroupType = GuitarType | SortType;
export type GroupLabel = GuitarLabel | SortLabel;

export type Comment = {
  'id': string,
  'userName': string,
  'advantage': string,
  'disadvantage': string,
  'comment': string,
  'rating': number,
  'createAt': string,
  'guitarId': number,
}

export type CommentPost = {
  'guitarId': number,
  'userName': string,
  'advantage': string,
  'disadvantage': string,
  'comment': string,
  'rating': number,
}

export type Guitar = {
  'id': number,
  'name': string,
  'vendorCode': string,
  'type': GuitarType,
  'description': string,
  'previewImg': string,
  'stringCount': number,
  'rating': number,
  'price': number,
  'comments': Comment[],
}

export type GuitarInCart = Guitar & {
  'count': number,
}
