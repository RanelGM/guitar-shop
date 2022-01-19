import browserHistory from 'store/browser-history';
import { Comment, Group, GroupKey, GroupType, GroupLabel, GuitarType, Guitar, SortType } from 'types/product';
import { SortGroup } from './const';

export const addWordInToArray = (word: string, array: string[], addToIndex = 1, separator = '/', deleteCount = 0): string => {
  array.splice(addToIndex, deleteCount, word);
  return array.join(separator);
};

export const getNumberWithSpaceBetween = (number: number | string, betweenEvery = 3): string => {
  const reg = `\\B(?=(\\d{${betweenEvery}})+(?!\\d))`;
  const regExp = new RegExp(reg, 'g');

  return number.toString().replace(regExp, ' ');
};

export const adaptImageSrc = (src: string): string => {
  const adaptingPath = 'content';
  return `/${addWordInToArray(adaptingPath, src.split('/'))}`;
};

export const convertLabelToType = <
  TLabel extends GroupLabel,
  TGroup extends Group>
  (label: TLabel, group: TGroup): GroupType => {
  const groupItem = Object.values(group).find((item) => item['label'] === label) as GroupKey;
  return groupItem.type;
};

export const updateArray = <TItem extends GuitarType | number | Guitar>(array: TItem[] | null, item: TItem): TItem[] => {
  const isItemInArray = array?.includes(item);
  const updatingArray = array ? array.slice() : [];

  if (!isItemInArray) {
    updatingArray.push(item);
  }

  if (isItemInArray) {
    const index = updatingArray.indexOf(item);
    updatingArray.splice(index, 1);
  }

  return updatingArray;
};

export const sortGuitarsByPrice = (array: Guitar[], sortType: SortType) => {
  switch (sortType) {
    case SortGroup.Ascending.type:
      return array.slice().sort((first, second) => first.price - second.price);
    case SortGroup.Descending.type:
      return array.slice().sort((first, second) => second.price - first.price);
    default:
      return array;
  }
};

export const sortGuitarsByLetter = (array: Guitar[], letter: string) => array.slice().sort((first, second) => {
  const letterInAInput = first.name.search(letter);
  const letterInBInput = second.name.search(letter);

  if (letterInAInput < 0) {
    return 1;
  }

  if (letterInBInput < 0) {
    return -1;
  }

  return letterInAInput - letterInBInput;
});

export const sortCommentsByDate = (comments: Comment[]) => comments.slice().sort(
  (first, second) => new Date(first.createAt).getTime() - new Date(second.createAt).getTime(),
);

export const getPageFromLocation = () => Number(browserHistory.location.pathname.split('/').pop()?.split('&').shift());
export const getQueryPath = (currentPage: string) => browserHistory.location.pathname.split('/').pop()?.slice(currentPage.length);
