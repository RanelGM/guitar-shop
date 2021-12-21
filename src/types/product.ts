import { GuitarType, SortGroup } from 'utils/const';

type Comment = {
  'id': string,
  'userName': string,
  'advantages': string,
  'disadvantages': string,
  'comment': string,
  'rating': number,
  'createAt': Date,
  'guitarId': number,
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

export type SortKeys = keyof typeof SortGroup
export type SortType = typeof SortGroup[SortKeys]['type'];
export type SortLabel = typeof SortGroup[SortKeys]['label']
