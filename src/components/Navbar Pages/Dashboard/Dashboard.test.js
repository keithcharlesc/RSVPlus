import React from "react";
import { render, getByTestId } from "@testing-library/react";
import { toHaveTextContent } from "@testing-library/jest-dom";
import TestRenderer from "react-test-renderer";
import MockDashBoard from "./MockDashBoard";

it("renders without crashing", () => {
  const { getByText } = render(<MockDashBoard />);
  getByText("DASHBOARD");
  expect(getByTestId(document.documentElement, "buttonOne")).toHaveTextContent(
    "DISPLAY UPCOMING EVENTS"
  );
});

it("matches snapshot", () => {
  const tree = TestRenderer.create(<MockDashBoard />).toJSON();
  expect(tree).toMatchSnapshot();
});
