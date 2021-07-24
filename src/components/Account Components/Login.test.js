import React from "react";
import MockLogin from "./MockLogin";
import { render, getByTestId } from "@testing-library/react";
import { toHaveTextContent } from "@testing-library/jest-dom";
import TestRenderer from "react-test-renderer";

it("renders without crashing", () => {
  const { getByText } = render(<MockLogin />);
  getByText("Welcome to");
  getByText("RSVP+");
  getByText("!");
  expect(getByTestId(document.documentElement, "button")).toHaveTextContent(
    "Login with Google!"
  );
});

it("matches snapshot", () => {
  const tree = TestRenderer.create(<MockLogin />).toJSON();
  expect(tree).toMatchSnapshot();
});
