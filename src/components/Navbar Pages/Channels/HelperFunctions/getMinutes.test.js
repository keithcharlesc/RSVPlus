import React from "react";
import ReactDOM from "react-dom";
import getMinutes from "./getMinutes";

test("converts time index to AM/PM", () => {
  expect(getMinutes("10:25")).toBe(625);
});
