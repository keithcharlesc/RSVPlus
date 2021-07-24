import React from "react";
import { render, getByTestId } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import { toHaveTextContent } from "@testing-library/jest-dom";
import MockChannels from "./MockChannels";
import Popup from "./Popup";
import InviteList from "./InviteList";

it("renders without crashing", () => {
  const { getByText } = render(<MockChannels />);
  getByText("Loading...");
});

it("Channels matches snapshot", () => {
  const tree = TestRenderer.create(<MockChannels />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders without crashing", () => {
  const {} = render(<Popup />);
});

it("Popup matches snapshot", () => {
  const tree = TestRenderer.create(<Popup />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders without crashing", () => {
  const {} = render(<InviteList />);
});

it("InviteList matches snapshot", () => {
  const tree = TestRenderer.create(<InviteList />).toJSON();
  expect(tree).toMatchSnapshot();
});
