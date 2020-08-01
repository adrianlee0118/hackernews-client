import { SORT } from "../../constants";

const tableReducer = (state, action) => {
  switch (action.type) {
    case SORT:
      return {
        ...state,
        sortKey: action.key,
        isSortReverse: state.sortKey === action.key && !state.isSortReverse,
      };
    default:
      throw new Error();
  }
};

export default tableReducer;
