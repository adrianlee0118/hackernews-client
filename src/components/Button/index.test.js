import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer"; //for snapshot testing: checking the look
import Button from "./index";

describe("Button", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Button>Give Me More</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  test("has a valid snapshot", () => {
    const component = renderer.create(<Button>Give Me More</Button>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
