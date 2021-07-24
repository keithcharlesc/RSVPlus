import React from "react";
import MockNavigationBar from "./MockNavigationBar";
import { render, getByTestId } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import { toHaveTextContent } from "@testing-library/jest-dom";

it("renders without crashing, has correct text, and correct urls for navigation tabs", () => {
  const { getByText } = render(<MockNavigationBar />);
  getByText("Home");
  expect(getByText("Home").href).toBe("http://localhost/");
  getByText("Channels");
  expect(getByText("Channels").href).toBe("http://localhost/channels");
  getByText("Calendar");
  expect(getByText("Calendar").href).toBe("http://localhost/calendar");
  getByText("FAQ");
  expect(getByText("FAQ").href).toBe("http://localhost/faq");
  getByText("Contact Us");
  expect(getByText("Contact Us").href).toBe("http://localhost/contact-us");
  getByText("Signed in as: Bob");
  expect(getByTestId(document.documentElement, "button")).toHaveTextContent(
    "Log Out"
  );
});

it("matches snapshot", () => {
  const tree = TestRenderer.create(<MockNavigationBar />).toJSON();
  expect(tree).toMatchSnapshot();
});
