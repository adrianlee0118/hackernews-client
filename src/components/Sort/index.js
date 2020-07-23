import React from "react";
import Button from "../Button";
import classNames from "classnames";
import PropTypes from "prop-types";
import "./index.css";

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

Sort.propTypes = {
  sortKey: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  activeSortKey: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Sort;
