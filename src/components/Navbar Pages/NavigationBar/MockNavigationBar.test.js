import React from "react";
import ReactDOM from "react-dom";
import MockNavigationBar from "./MockNavigationBar";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<MockNavigationBar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
