import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer"; //for snapshot testing: checking the look
import App from "./index";

//Testing suite for App component
describe("App", () => {
  //Component test
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  //Snapshot test: render the component and compare to previous snapshot (stored render appearance)
  test("has a valid snapshot", () => {
    const component = renderer.create(<App />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
