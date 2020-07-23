import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer"; //for snapshot testing: checking the look
import Table from "./index";
import Enzyme, { shallow } from "enzyme"; //for unit testing components: checking the functions by matching expected outputs of state
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Table", () => {
  const props = {
    list: [
      { title: "1", author: "1", num_comments: 1, points: 2, objectID: "y" },
      { title: "2", author: "2", num_comments: 1, points: 2, objectID: "z" },
    ],
  };

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Table {...props} />, div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<Table {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows two items in list", () => {
    const element = shallow(<Table {...props} />); //shallow render = isolated (no child components)
    expect(element.find(".table-row").length).toBe(2);
  });
});
