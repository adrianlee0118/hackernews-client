import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "./index.css";

const Search = ({ value, onChange, onSubmit, children }) => {
  let input;
  useEffect(() => {
    if (input) input.focus();
  }, []);
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

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default Search;
