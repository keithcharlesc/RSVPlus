// Function to obtain Date In-between
// Used in Channels.js and obtainBusyDates.js

export default function dateRange(startDate, endDate, steps = 1) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Using UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  //console.log("date array");
  //console.log(dateArray);

  //Converts UTC into DD/MM/YYYY then YYYY-MM-DD (To match Google Cal Format)
  for (var i = 0; i < dateArray.length; i++) {
    dateArray[i] = dateArray[i].toLocaleDateString("en-CA");
  }

  //console.log("updated date array");
  //console.log(dateArray);

  return dateArray;
}
