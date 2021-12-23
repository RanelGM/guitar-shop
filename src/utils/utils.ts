import { Group, GroupKey, GroupType, GroupLabel, GuitarType } from 'types/product';

export const addWordInToArray = (word: string, array: string[], addToIndex = 1, separator = '/', deleteCount = 0): string => {
  array.splice(addToIndex, deleteCount, word);
  return array.join(separator);
};

export const getNumberWithSpaceBetween = (number: number | string, betweenEvery = 3): string => {
  const reg = `\\B(?=(\\d{${betweenEvery}})+(?!\\d))`;
  const regExp = new RegExp(reg, 'g');

  return number.toString().replace(regExp, ' ');
};

export const convertLabelToType = <
  TLabel extends GroupLabel,
  TGroup extends Group>
  (label: TLabel, group: TGroup): GroupType => {
  const groupItem = Object.values(group).find((item) => item['label'] === label) as GroupKey;
  return groupItem.type;
};

export const updateArray = <TItem extends GuitarType | number>(array: TItem[] | null, item: TItem): TItem[] => {
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
