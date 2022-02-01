import { datatype, image, lorem, name, random } from 'faker';
import { Comment, Guitar, GuitarInCart, GuitarKey, GuitarType } from 'types/product';
import { GuitarGroup } from './const';

const guitarTypes = Object.values(GuitarGroup).map((group) => group.type);

export const getGuitarComment = (id: number): Comment => ({
  'id': datatype.uuid(),
  'userName': name.firstName(),
  'advantage': lorem.words(),
  'disadvantage': lorem.words(),
  'comment': lorem.sentence(),
  'rating': datatype.number({ min: 1, max: 5 }),
  'createAt': datatype.datetime().toString(),
  'guitarId': id,
});

export const getGuitarMock = (commentCount?: number): Guitar => {
  const id = datatype.number();
  const type = random.arrayElement(guitarTypes) as GuitarType;
  const keys = Object.keys(GuitarGroup) as GuitarKey[];
  const currentKey = keys.find((key) => GuitarGroup[key].type === type) as GuitarKey;
  const randomDefaultCount = 3;
  commentCount = commentCount ? commentCount : randomDefaultCount;

  const comments = Array.from({ length: commentCount }, () => getGuitarComment(id));

  return ({
    'id': id,
    'name': lorem.word(),
    'vendorCode': datatype.string(),
    'type': type,
    'description': lorem.sentence(),
    'previewImg': image.imageUrl(),
    'stringCount': random.arrayElement(GuitarGroup[currentKey].strings),
    'rating': datatype.number({ min: 1, max: 5 }),
    'price': datatype.number({ min: 1700, max: 35000 }),
    'comments': comments,
  });
};

export const getGuitarInCartMock = (guitar?: Guitar): GuitarInCart => {
  const guitarInCart = guitar ? guitar : getGuitarMock();

  return Object.assign({}, guitarInCart, {
    count: 1,
  });
};
