export const addWordInToArray = (word: string, array: string[], addToIndex = 1, separator = '/', deleteCount = 0): string => {
  array.splice(addToIndex, deleteCount, word);
  return array.join(separator);
};

export const getNumberWithSpaceBetween = (number: number | string, betweenEvery = 3): string => {
  const reg = `\\B(?=(\\d{${betweenEvery}})+(?!\\d))`;
  const regExp = new RegExp(reg, 'g');

  return number.toString().replace(regExp, ' ');
};
