import { datatype, lorem } from 'faker';
import { ActionType } from 'types/action';
import reducer, { initialState } from 'store/query-data/query-data';

const state = Object.assign(initialState);

describe('Query Data reducer', () => {
  it('should return initial state without additional parameters', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' }))
      .toEqual(initialState);
  });

  it('should update sortType state with type when using setSortType action', () => {
    const type = lorem.word();
    const setSortTypeAction = {
      type: ActionType.SetSortType,
      payload: type,
    };

    expect(reducer(state, setSortTypeAction))
      .toEqual(Object.assign(
        {},
        state,
        {
          sortType: type,
        },
      ));
  });

  it('should update orderType state with type when using setOrderType action', () => {
    const type = lorem.word();
    const setOrderType = {
      type: ActionType.SetOrderType,
      payload: type,
    };

    expect(reducer(state, setOrderType))
      .toEqual(Object.assign(
        {},
        state,
        {
          orderType: type,
        },
      ));
  });

  it('should update priceRangeFrom state with price when using setPriceRangeFrom action', () => {
    const price = datatype.number();
    const setPriceRangeFrom = {
      type: ActionType.SetPriceRangeFrom,
      payload: price,
    };

    expect(reducer(state, setPriceRangeFrom))
      .toEqual(Object.assign(
        {},
        state,
        {
          priceRangeFrom: price,
        },
      ));
  });

  it('should update priceRangeTo state with price when using setPriceRangeTo action', () => {
    const price = datatype.number();
    const setPriceRangeTo = {
      type: ActionType.SetPriceRangeTo,
      payload: price,
    };

    expect(reducer(state, setPriceRangeTo))
      .toEqual(Object.assign(
        {},
        state,
        {
          priceRangeTo: price,
        },
      ));
  });

  it('should update guitarType state with type when using setGuitarType action', () => {
    const type = lorem.word();
    const setGuitarType = {
      type: ActionType.SetGuitarType,
      payload: type,
    };

    expect(reducer(state, setGuitarType))
      .toEqual(Object.assign(
        {},
        state,
        {
          guitarType: type,
        },
      ));
  });

  it('should update stringCount state with type when using setStringCount action', () => {
    const strings = [datatype.number(), datatype.number()];
    const setStringCount = {
      type: ActionType.SetStringCount,
      payload: strings,
    };

    expect(reducer(state, setStringCount))
      .toEqual(Object.assign(
        {},
        state,
        {
          stringCount: strings,
        },
      ));
  });

  it('should update currentPage state with page when using setCurrentPage action', () => {
    const page = datatype.number();
    const setCurrentPage = {
      type: ActionType.SetCurrentPage,
      payload: page,
    };

    expect(reducer(state, setCurrentPage))
      .toEqual(Object.assign(
        {},
        state,
        {
          currentPage: page,
        },
      ));
  });

  it('should update isServerError state for true when using setIsServerError action', () => {
    const setIsServerError = {
      type: ActionType.SetIsServerError,
      payload: true,
    };

    expect(reducer(state, setIsServerError))
      .toEqual(Object.assign(
        {},
        state,
        {
          isServerError: true,
        },
      ));
  });

  it('should update isDataLoading state for true when using setIsDataLoading action', () => {
    const setIsDataLoading = {
      type: ActionType.SetIsDataLoading,
      payload: true,
    };

    expect(reducer(state, setIsDataLoading))
      .toEqual(Object.assign(
        {},
        state,
        {
          isDataLoading: true,
        },
      ));
  });
});
