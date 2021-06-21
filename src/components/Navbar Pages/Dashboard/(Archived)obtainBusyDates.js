//Archived old obtainBusyDates to obtain dates only

/*export default function obtainBusyDates(events) {
  console.log(events);

  let combinedArray = [];
  //Obtains Array of in-between dates for each event
  for (var i = 0; i < events.length; i++) {
    let currentEvent = events[i];
    let startDate =
      currentEvent.start.date != null
        ? currentEvent.start.date
        : currentEvent.start.dateTime.slice(0, 10);
    let endDate =
      currentEvent.end.date != null
        ? currentEvent.end.date //-1 for day might need to implement since full day event = day itself and day after
        : currentEvent.end.dateTime.slice(0, 10);
    //console.log(currentEvent);
    //console.log(startDate);
    //console.log(endDate);
    let dates = dateRange(startDate, endDate);
    //console.log(dates);
    combinedArray = combinedArray.concat(dates);
  }

  //Sort dd/mm/yyyy dates
  combinedArray.sort(function (a, b) {
    // '01/03/2014'.split('/')
    // gives ["01", "03", "2014"]
    a = a.split("/");
    b = b.split("/");
    return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
  });

  //console.log(combinedArray);
  //Remove duplicates from Array
  let uniq = [...new Set(combinedArray)];

  //Converts dd/mm/yyyy back into yyyy-mm-dd
  for (i = 0; i < uniq.length; i++) {
    uniq[i] = uniq[i].split("/").reverse().join("-");
  }
  //console.log(uniq);
  return uniq;
}

//Function to obtain Date In-between
function dateRange(startDate, endDate, steps = 1) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Using UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  //Converts UTC into DD/MM/YYYY then YYYY-MM-DD (To match Google Cal Format)
  for (var i = 0; i < dateArray.length; i++) {
    dateArray[i] = dateArray[i].toLocaleDateString();
  }

  return dateArray;
}
*/
