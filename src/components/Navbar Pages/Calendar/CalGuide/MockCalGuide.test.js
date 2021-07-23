import React from "react";
import ReactDOM from "react-dom";
import MockCalGuide from "./MockCalGuide";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<MockCalGuide />, div);
  ReactDOM.unmountComponentAtNode(div);
});
