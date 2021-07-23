import React from "react";
import ReactDOM from "react-dom";
import timeToConvert from "./timeToConvert";

test("converts time index to AM/PM", () => {
  expect(timeToConvert("16")).toBe("4PM");
});
