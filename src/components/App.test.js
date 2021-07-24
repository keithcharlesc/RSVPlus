import React from "react";
import { render } from "@testing-library/react";
import MockApp from "./MockApp";

it("App renders without crashing", () => {
  const {} = render(<MockApp />);
});
