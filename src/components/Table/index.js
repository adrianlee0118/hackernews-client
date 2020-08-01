import React, { useReducer } from "react";
import Sort from "../Sort";
import Button from "../Button";
import PropTypes from "prop-types";
import tableReducer from "../../reducers/Table";
import {
  SORT,
  smallColumn,
  midColumn,
  largeColumn,
  SORTS,
} from "../../constants";
import "./index.css";

const Table = ({ list, onDismiss }) => {
  const [state, dispatch] = useReducer(tableReducer, {
    sortKey: "NONE",
    isSortReverse: false,
  });
  return (
    <div className="table">
      <div className="table-header">
        <span style={largeColumn}>
          <Sort
            sortKey={"TITLE"}
            onSort={(key) => dispatch({ type: SORT, key: key })}
            activeSortKey={state.sortKey}
          >
            Title
          </Sort>
        </span>
        <span style={midColumn}>
          <Sort
            sortKey={"AUTHOR"}
            onSort={(key) => dispatch({ type: SORT, key: key })}
            activeSortKey={state.sortKey}
          >
            Author
          </Sort>
        </span>
        <span style={smallColumn}>
          <Sort
            sortKey={"COMMENTS"}
            onSort={(key) => dispatch({ type: SORT, key: key })}
            activeSortKey={state.sortKey}
          >
            Comments
          </Sort>
        </span>
        <span style={smallColumn}>
          <Sort
            sortKey={"POINTS"}
            onSort={(key) => dispatch({ type: SORT, key: key })}
            activeSortKey={state.sortKey}
          >
            Points
          </Sort>
        </span>
        <span style={smallColumn}>Archive</span>
      </div>
      {(state.isSortReverse
        ? SORTS[state.sortKey](list).reverse()
        : SORTS[state.sortKey](list)
      ).map((item) => (
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

export default Table;
