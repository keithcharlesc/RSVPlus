import { simplifyTimeBlocks } from "./findOptimalSlots";

test("simplify the timeblocks into a condensed form", () => {
  expect(
    simplifyTimeBlocks([
      "9AM - 10AM",
      "10AM - 11AM",
      "11AM - 12PM",
      "12PM - 1PM",
      "1PM - 2PM",
    ])
  ).toStrictEqual(["9AM - 2PM"]);
});
