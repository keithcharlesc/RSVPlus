import dateRange from "../Navbar Pages/Channels/HelperFunctions/dateRange";
import getMinutes from "../Navbar Pages/Channels/HelperFunctions/getMinutes";
import timeToConvert from "../Navbar Pages/Channels/HelperFunctions/timeToConvert";
import { simplifyTimeBlocks } from "../Navbar Pages/Channels/findOptimalSlots";

test("obtains proper date range in between two dates", () => {
  expect(dateRange("2021-07-22", "2021-07-24")).toStrictEqual([
    "2021-07-22",
    "2021-07-23",
    "2021-07-24",
  ]);
});

test("converts hours and minutes to minutes", () => {
  expect(getMinutes("10:25")).toBe(625);
});

test("converts time index to AM/PM", () => {
  expect(timeToConvert("16")).toBe("4PM");
});

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
