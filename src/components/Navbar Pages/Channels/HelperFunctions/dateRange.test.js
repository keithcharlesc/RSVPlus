import dateRange from "./dateRange";

test("obtains proper date range in between two dates", () => {
  expect(dateRange("2021-07-22", "2021-07-24")).toStrictEqual([
    "2021-07-22",
    "2021-07-23",
    "2021-07-24",
  ]);
});
