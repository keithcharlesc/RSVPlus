import React from "react";
import { render, getByTestId } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import { toHaveTextContent } from "@testing-library/jest-dom";
import MockFAQ from "./MockFAQ";

it("renders without crashing", () => {
  const { getByText } = render(<MockFAQ />);
});

it("matches snapshot", () => {
  const tree = TestRenderer.create(<MockFAQ />).toJSON();
  expect(tree).toMatchSnapshot();
});
