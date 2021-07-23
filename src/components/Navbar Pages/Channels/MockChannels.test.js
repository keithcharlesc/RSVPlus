import React from "react";
import ReactDOM from "react-dom";
import MockChannels from "./MockChannels";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<MockChannels />, div);
  ReactDOM.unmountComponentAtNode(div);
});
