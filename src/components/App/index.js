import React, { useEffect, useReducer } from "react";
import axios from "axios";
import Search from "../Search";
import Table from "../Table";
import { ButtonWithLoading } from "../Button";
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
} from "../../constants";
import "./index.css";

const hackerNewsAPIReducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_CHANGE":
      return {
        ...state,
        searchTerm: action.target,
      };
    case "SEARCH_SUBMIT":
      return {
        ...state,
        searchKey: action.term,
      };
    case "START_FETCH":
      return {
        ...state,
        isLoading: true,
      };
    case "FETCH_SUCCESSFUL":
      return {
        ...state,
        results: action.results,
        isLoading: false,
      };
    case "FETCH_FAILED":
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    case "DISMISS":
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

const App = () => {
  const [state, dispatch] = useReducer(hackerNewsAPIReducer, {
    results: [],
    searchKey: "",
    searchTerm: DEFAULT_QUERY,
    error: null,
    isLoading: false,
  });
  const fetchSearchTopStories = (searchTerm, page = 0) => {
    dispatch({ type: "START_FETCH" });
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then((result) => setSearchTopStories(result.data))
      .catch((error) => dispatch({ type: "FETCH_FAILED", error: error }));
  };

  useEffect(() => {
    fetchSearchTopStories(state.searchTerm);
  }, [state.searchKey]);

  const needsToSearchTopStories = (term) => {
    return state.results[term];
  };

  const setSearchTopStories = (result) => {
    const { hits, page } = result;
    const updates = updateSearchTopStoriesState(
      hits,
      page,
      state.searchKey,
      state.results
    );
    dispatch({ type: "FETCH_SUCCESSFUL", results: updates.results });
  };

  const onSearchChange = (event) => {
    dispatch({ type: "SEARCH_CHANGE", target: event.target.value });
  };

  const onSearchSubmit = (event) => {
    dispatch({ type: "SEARCH_SUBMIT", term: state.searchTerm });
    if (needsToSearchTopStories(state.searchTerm)) {
      fetchSearchTopStories(state.searchTerm);
    }
    event.preventDefault();
  };

  const onDismiss = (id) => {
    const { hits, page } = state.results[state.searchKey];
    const updatedHits = hits.filter((item) => item.objectID !== id);
    dispatch({ type: "DISMISS", hits: updatedHits, page: page });
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
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page },
    },
    isLoading: false,
  };
};

/*
const App = () => {
  const [results, setResults] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchTerm, setSearchTerm] = useState(DEFAULT_QUERY);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSearchTopStories = (searchTerm, page = 0) => {
    setIsLoading(true);
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then((result) => setSearchTopStories(result.data))
      .catch((error) => setError(error));
  };

  useEffect(() => {
    fetchSearchTopStories(searchTerm);
  }, [searchKey]);

  const needsToSearchTopStories = (term) => {
    return results[term];
  };
  const setSearchTopStories = (result) => {
    const { hits, page } = result;
    const updates = updateSearchTopStoriesState(hits, page, searchKey, results);
    setResults(updates.results);
    setIsLoading(updates.isLoading);
  };

  const onSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const onSearchSubmit = (event) => {
    setSearchKey(searchTerm);
    if (needsToSearchTopStories(searchTerm)) {
      fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  };
  const onDismiss = (id) => {
    const { hits, page } = results[searchKey];
    const updatedHits = hits.filter((item) => item.objectID !== id);
    setResults({ ...results, [searchKey]: { hits: updatedHits, page } });
  };

  return (
    <div className="page">
      <div className="interactions">
        <Search
          value={searchTerm}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
        >
          Search
        </Search>
      </div>
      {error ? (
        <div className="interactions">Something went wrong.</div>
      ) : (
        <Table
          list={
            (results && results[searchKey] && results[searchKey].hits) || []
          }
          onDismiss={onDismiss}
        />
      )}
      <div className="interactions">
        <ButtonWithLoading
          isLoading={isLoading}
          onClick={() =>
            fetchSearchTopStories(
              searchKey,
              ((results && results[searchKey] && results[searchKey].page) ||
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
*/

//=================================================================================================

/*
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }
  setSearchTopStories(result) {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then((result) => this.setSearchTopStories(result.data))
      .catch((error) => this.setState({ error }));
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const updatedHits = hits.filter((item) => item.objectID !== id);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
    });
  }
  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {error ? (
          <div className="interactions">Something went wrong.</div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}
*/

export default App;
