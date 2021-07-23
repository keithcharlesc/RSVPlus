import React from "react";
import ReactDOM from "react-dom";
import MockApp from "../src/components/MockApp";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<MockApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
