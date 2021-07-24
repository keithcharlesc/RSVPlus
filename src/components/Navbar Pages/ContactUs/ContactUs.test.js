import React from "react";
import MockContactUs from "./MockContactUs";
import { render, getByTestId } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import { toHaveTextContent } from "@testing-library/jest-dom";

test("renders without crashing", () => {
  const { getByText } = render(<MockContactUs />);
  getByText("Form");
  getByText("Name");
  getByText("Email");
  getByText("Message");
  expect(
    getByTestId(document.documentElement, "submit-button")
  ).toHaveTextContent("Send Message!");
});

it("matches snapshot", () => {
  const tree = TestRenderer.create(<MockContactUs />).toJSON();
  expect(tree).toMatchSnapshot();
});
