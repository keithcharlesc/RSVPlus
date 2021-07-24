import React from "react";
import ReactDOM from "react-dom";
import MockCalendar from "./MockCalendar";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<MockCalendar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
