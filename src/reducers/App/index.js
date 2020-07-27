import {
  SEARCH_CHANGE,
  SEARCH_SUBMIT,
  START_FETCH,
  FETCH_SUCCESSFUL,
  FETCH_FAILED,
  DISMISS,
} from "../../constants";

const hackerNewsAPIReducer = (state, action) => {
  switch (action.type) {
    case SEARCH_CHANGE:
      return {
        ...state,
        searchTerm: action.target,
      };
    case SEARCH_SUBMIT:
      return {
        ...state,
        searchKey: action.term,
      };
    case START_FETCH:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_SUCCESSFUL:
      return {
        ...state,
        results: action.results,
        isLoading: false,
      };
    case FETCH_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    case DISMISS:
      return {
        ...state,
        results: {
          ...state.results,
          [state.searchKey]: { hits: action.hits, page: action.page },
        },
      };
    default:
      throw new Error();
  }
};

export default hackerNewsAPIReducer;
