import React, { useEffect, useReducer } from "react";
import axios from "axios";
import Search from "../Search";
import Table from "../Table";
import { ButtonWithLoading } from "../Button";
import hackerNewsAPIReducer from "../../reducers/App";
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
  SEARCH_CHANGE,
  SEARCH_SUBMIT,
  START_FETCH,
  FETCH_SUCCESSFUL,
  FETCH_FAILED,
  DISMISS,
} from "../../constants";
import "./index.scss";

const App = () => {
  const [state, dispatch] = useReducer(hackerNewsAPIReducer, {
    results: [],
    searchKey: DEFAULT_QUERY,
    searchTerm: DEFAULT_QUERY,
    error: null,
    isLoading: false,
  });

  const fetchSearchTopStories = async (searchTerm, page = 0) => {
    dispatch({ type: START_FETCH });
    try {
      const result = await axios(
        `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
      );
      setSearchTopStories(result.data);
    } catch (error) {
      dispatch({ type: FETCH_FAILED, error: error });
    }
  };

  useEffect(() => {
    if (needsToSearchTopStories(state.searchKey)) {
      fetchSearchTopStories(state.searchKey);
    }
  }, [state.searchKey]);

  const needsToSearchTopStories = (term) => {
    return state.results[term] ? false : true;
  };

  const setSearchTopStories = (result) => {
    const { hits, page } = result;
    const updates = updateSearchTopStoriesState(
      hits,
      page,
      state.searchKey,
      state.results
    );
    dispatch({ type: FETCH_SUCCESSFUL, results: updates });
  };

  const onSearchChange = (event) => {
    dispatch({ type: SEARCH_CHANGE, target: event.target.value });
  };

  const onSearchSubmit = (event) => {
    dispatch({ type: SEARCH_SUBMIT, term: state.searchTerm });
    if (needsToSearchTopStories(state.searchKey)) {
      fetchSearchTopStories(state.searchKey);
    }
    event.preventDefault();
  };

  const onDismiss = (id) => {
    const { hits, page } = state.results[state.searchKey];
    const updatedHits = hits.filter((item) => item.objectID !== id);
    dispatch({ type: DISMISS, hits: updatedHits, page: page });
  };

  return (
    <div className="page">
      <div className="interactions">
        <Search
          value={state.searchTerm}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
        >
          Search
        </Search>
      </div>
      {state.error ? (
        <div className="interactions">Something went wrong.</div>
      ) : (
        <Table
          list={
            (state.results &&
              state.results[state.searchKey] &&
              state.results[state.searchKey].hits) ||
            []
          }
          onDismiss={onDismiss}
        />
      )}
      <div className="interactions">
        <ButtonWithLoading
          isLoading={state.isLoading}
          onClick={() =>
            fetchSearchTopStories(
              state.searchKey,
              ((state.results &&
                state.results[state.searchKey] &&
                state.results[state.searchKey].page) ||
                0) + 1
            )
          }
        >
          More
        </ButtonWithLoading>
      </div>
    </div>
  );
};

//HOC function used to update results using imperative value (prevState for class) of results
const updateSearchTopStoriesState = (hits, page, searchKey, results) => {
  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
  const updatedHits = [...oldHits, ...hits];
  return {
    ...results,
    [searchKey]: { hits: updatedHits, page },
  };
};

export default App;
