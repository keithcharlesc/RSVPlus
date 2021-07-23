import React from "react";
import ReactDOM from "react-dom";
import InviteList from "./InviteList";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<InviteList />, div);
  ReactDOM.unmountComponentAtNode(div);
});
