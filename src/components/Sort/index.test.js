import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer"; //for snapshot testing: checking the look
import Sort from "./index";

describe("Sort", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Sort>Title</Sort>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  test("has a valid snapshot", () => {
    const component = renderer.create(<Sort>Title</Sort>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
