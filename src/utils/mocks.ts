import { datatype, image, lorem, name, random } from 'faker';
import { Comment, Guitar, GuitarKey, GuitarType } from 'types/product';
import { GuitarGroup } from './const';

const guitarTypes = Object.values(GuitarGroup).map((group) => group.type);

const getGuitarComment = (id: number): Comment => ({
  'id': datatype.uuid(),
  'userName': name.firstName(),
  'advantages': lorem.words(),
  'disadvantages': lorem.words(),
  'comment': lorem.sentence(),
  'rating': datatype.number({ min: 1, max: 5 }),
  'createAt': datatype.datetime().toString(),
  'guitarId': id,
});

export const getGuitarMock = (): Guitar => {
  const id = datatype.number();
  const type = random.arrayElement(guitarTypes) as GuitarType;
  const keys = Object.keys(GuitarGroup) as GuitarKey[];
  const currentKey = keys.find((key) => GuitarGroup[key].type === type) as GuitarKey;

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
    'comments': [getGuitarComment(id), getGuitarComment(id), getGuitarComment(id)],
  });
};
