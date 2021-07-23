import React from "react";
import ReactDOM from "react-dom";
import MockFAQ from "./MockFAQ";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<MockFAQ />, div);
  ReactDOM.unmountComponentAtNode(div);
});
