import React from "react";
import MockCalendar from "./MockCalendar";
import MockCalGuide from "./CalGuide/MockCalGuide";
import MockGoogleCal from "./MockGoogleCal";
import { render, getByTestId } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import { toHaveTextContent } from "@testing-library/jest-dom";

it("renders CalGuide without crashing and has correct text", () => {
  const { getByText } = render(<MockCalGuide />);
  getByText("Calendar How-To");
  getByText("Back to Calendar");
  expect(getByText("Back to Calendar").href).toBe("http://localhost/calendar");
  getByText("Step 1");
  getByText("Going to Google Calendar.");
  getByText("Step 2");
  getByText("Getting public URL.");
  getByText("Step 3");
  getByText("Saving URL in RSVP+ for future logins to fetch from.");
});

it("matches snapshot", () => {
  const tree = TestRenderer.create(<MockCalGuide />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders GoogleCal without crashing and has correct text", () => {
  const { getByText } = render(<MockGoogleCal />);
  getByText("Input Google Calendar Link Below:");
  getByText("Guide");
  expect(getByText("Guide").href).toBe("http://localhost/calendar-guide");
  expect(getByTestId(document.documentElement, "buttonOne")).toHaveTextContent(
    "Reset"
  );
  expect(getByTestId(document.documentElement, "buttonTwo")).toHaveTextContent(
    "SaveURL"
  );
  expect(
    getByTestId(document.documentElement, "buttonThree")
  ).toHaveTextContent("Fetch");
  expect(getByTestId(document.documentElement, "buttonFour")).toHaveTextContent(
    "Use Sample Calendar"
  );
});

it("matches snapshot", () => {
  const tree = TestRenderer.create(<MockGoogleCal />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders without crashing", () => {
  const { getByText } = render(<MockCalendar />);
  getByText("CALENDAR");
  getByText("Create an Event");
  getByText("(Google Calendar)");
  getByText("Name");
  getByText("Description");
  getByText("Location");
  getByText("Start Date");
  getByText("End Date");
  expect(
    getByTestId(document.documentElement, "buttonToTest")
  ).toHaveTextContent("Add Event");
});
