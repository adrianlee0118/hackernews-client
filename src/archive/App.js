import React from "react";
import axios from "axios";
import { sortBy } from "lodash";
import classNames from "classnames";
import "./App.css";
import PropTypes from "prop-types";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

const smallColumn = {
  width: "10%",
};
const midColumn = {
  width: "30%",
};
const largeColumn = {
  width: "40%",
};

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  COMMENTS: (list) => sortBy(list, "num_commets").reverse(),
  POINTS: (list) => sortBy(list, "points").reverse(),
};

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
    //used in onSearchSubmit to determine if a new data set needs to be procured
    return !this.state.results[searchTerm];
  }
  setSearchTopStories(result) {
    const { hits, page } = result; //A retrieved result has hits and page on the same level
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
    this.setState({ searchKey: searchTerm }); //The step where teh fluctuant searchTerm within the input field is set as the searchKey for some data
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
      //concatenate or merge an entry in results at key = searchKey with hits as filtered for the current page
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

//HOC function passed to setState() so that exact values of state at point of execution (prevState) are used to find the next state
const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;
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

const Search = ({ value, onChange, onSubmit, children }) => {
  let input;
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        ref={(el) => (input = el)}
      />
      <button type="submit">{children}</button>
    </form>
  );
};

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: "NONE",
      isSortReverse: false,
    };
    this.onSort = this.onSort.bind(this);
  }
  onSort(sortKey) {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }
  render() {
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
      <div className="table">
        <div className="table-header">
          <span style={largeColumn}>
            <Sort
              sortKey={"TITLE"}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Title
            </Sort>
          </span>
          <span style={midColumn}>
            <Sort
              sortKey={"AUTHOR"}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Author
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort
              sortKey={"COMMENTS"}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Comments
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort
              sortKey={"POINTS"}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Points
            </Sort>
          </span>
          <span style={smallColumn}>Archive</span>
        </div>
        {reverseSortedList.map((item) => (
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        ))}
      </div>
    );
  }
}

const Sort = ({ sortKey, onSort, activeSortKey, children }) => {
  const sortClass = classNames("button-inline", {
    "button-active": sortKey === activeSortKey,
  });
  return (
    <Button onClick={() => onSort(sortKey)} className={sortClass}>
      {children}
    </Button>
  );
};

const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

const Loading = () => <div>Loading...</div>;

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);

Button.defaultProps = {
  className: "",
};

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node,
};

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

Sort.propTypes = {
  sortKey: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  activeSortKey: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default App;

export { Button, Search, Table, Sort, updateSearchTopStoriesState };
