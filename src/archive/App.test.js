import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer"; //for snapshot testing: checking the look
import Enzyme, { shallow } from "enzyme"; //for unit testing components: checking the functions by matching expected outputs of state
import Adapter from "enzyme-adapter-react-16";
import App, {
  Search,
  Button,
  Table,
  Sort,
  updateSearchTopStoriesState,
} from "./App";

Enzyme.configure({ adapter: new Adapter() });

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

describe("Search", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Search>Search</Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  test("has a valid snapshot", () => {
    const component = renderer.create(<Search>Search</Search>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

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

//Table test suite with sample data
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

/*
//Testing HOC with prescribed previous state and arguments
describe("updateSearchTopStoriesState", () => {
  const prevState = {
    searchKey: "REACT",
    results: {
      REACT: {
        hits: [
          {
            title: "3",
            author: "3",
            num_comments: 4,
            points: 5,
            objectID: "a",
          },
        ],
        page: 0,
      },
    },
  };
  const hits = [
    { title: "1", author: "1", num_comments: 1, points: 2, objectID: "y" },
    { title: "2", author: "2", num_comments: 1, points: 2, objectID: "z" },
  ];
  const page = 0;

  it("shows three items in list", () => {
    const res = updateSearchTopStoriesState(hits, page)(prevState);
    expect(res["REACT"].hits.length).toBe(2);
  });
});
*/
