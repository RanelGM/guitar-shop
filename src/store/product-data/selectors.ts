import { State } from 'types/state';
import { Guitar } from 'types/product';
import { NameSpace } from 'store/root-reducer';
import { sortCommentsByDate } from 'utils/utils';

export const getDefaultServerGuitars = (state: State): Guitar[] | [] => state[NameSpace.product].defaultServerGuitars;
export const getIsUpdateLoaded = (state: State): boolean => state[NameSpace.product].isUpdateLoaded;
export const getGuitarsTotalCount = (state: State): number => state[NameSpace.product].guitarsTotalCount;
export const getGuitarsToRender = (state: State): Guitar[] | [] => state[NameSpace.product].guitarsToRender;
export const getSimilarAtSearch = (state: State): Guitar[] | [] => state[NameSpace.product].similarAtSearch;

export const getExpandedGuitar = (state: State): Guitar | null => {
  const guitar = state[NameSpace.product].expandedGuitar;
  let guitarWithCommentsReversed = null;

  if (guitar) {
    const reversedComments = sortCommentsByDate(guitar.comments).reverse();

    guitarWithCommentsReversed = Object.assign({}, guitar, {
      comments: reversedComments,
    });
  }

  return guitarWithCommentsReversed;
};
