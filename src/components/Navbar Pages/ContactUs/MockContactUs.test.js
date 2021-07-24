import React from "react";
import MockContactUs from "./MockContactUs";
import { render } from "@testing-library/react";

test("renders without crashing", () => {
  const { getByText } = render(<MockContactUs />);
  getByText("Form");
  getByText("Name");
  getByText("Email");
  getByText("Message");
});
