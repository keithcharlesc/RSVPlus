import React from "react";
import ReactDOM from "react-dom";
import GoogleCal from "./GoogleCal";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<GoogleCal />, div);
  ReactDOM.unmountComponentAtNode(div);
});
