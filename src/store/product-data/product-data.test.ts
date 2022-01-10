import { datatype } from 'faker';
import { ActionType } from 'types/action';
import reducer, { initialState } from 'store/product-data/product-data';
import { getGuitarMock } from 'utils/mocks';

const state = Object.assign(initialState);

describe('Product Data reducer', () => {
  const guitars = Array.from({ length: 2 }, () => getGuitarMock());
  const getExpectedPayload = (updatingState: string) => (
    Object.assign(
      {},
      state,
      {
        [updatingState]: guitars,
      },
    ));

  it('should return initial state without additional parameters', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' }))
      .toEqual(initialState);
  });

  it('should update defaultServerGuitars state with guitars when using loadProductData action', () => {
    const loadProductData = {
      type: ActionType.LoadProductData,
      payload: guitars,
    };

    expect(reducer(state, loadProductData))
      .toEqual(getExpectedPayload('defaultServerGuitars'));
  });

  it('should update isUpdateLoaded from true to false when using setIsUpdateLoaded action', () => {
    const updateStatus = false;

    const setIsUpdateLoaded = {
      type: ActionType.setIsUpdateLoaded,
      payload: updateStatus,
    };

    const expectingState = Object.assign(
      {},
      state,
      {
        'isUpdateLoaded': updateStatus,
      },
    );

    expect(reducer(state, setIsUpdateLoaded))
      .toEqual(expectingState);
  });

  it('should update guitarsToRender state with guitars when using setGuitarsToRender action', () => {
    const setGuitarsToRender = {
      type: ActionType.SetGuitarsToRender,
      payload: guitars,
    };

    expect(reducer(state, setGuitarsToRender))
      .toEqual(getExpectedPayload('guitarsToRender'));
  });

  it('should update similarAtSearch state with guitars when using setSearchSimilar action', () => {
    const setSearchSimilar = {
      type: ActionType.SetSimilarAtSearch,
      payload: guitars,
    };

    expect(reducer(state, setSearchSimilar))
      .toEqual(getExpectedPayload('similarAtSearch'));
  });

  it('should update guitarsTotalCount state with count when using setGuitarsTotalCount action', () => {
    const count = datatype.number();
    const setGuitarsTotalCount = {
      type: ActionType.SetGuitarsTotalCount,
      payload: count,
    };

    expect(reducer(state, setGuitarsTotalCount))
      .toEqual(Object.assign(
        {},
        state,
        {
          guitarsTotalCount: count,
        },
      ));
  });
});

