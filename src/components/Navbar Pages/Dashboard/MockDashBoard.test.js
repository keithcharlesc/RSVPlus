import React from "react";
import ReactDOM from "react-dom";
import MockDashBoard from "./MockDashBoard";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<MockDashBoard />, div);
  ReactDOM.unmountComponentAtNode(div);
});
