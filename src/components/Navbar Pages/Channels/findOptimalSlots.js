export default async function findOptimalSlots(channel, db) {
  ///*
  //If everyone has fully responded, give the most optimal date and time below:
  let beginningIndex = parseInt(channel.startTimeToLookForIndex);
  let endTime = parseInt(channel.endTimeToLookForIndex);

  let timeToBePushed = [
    "12AM - 1AM",
    "1AM - 2AM",
    "2AM - 3AM",
    "3AM - 4AM",
    "4AM - 5AM",
    "5AM - 6AM",
    "6AM - 7AM",
    "7AM - 8AM",
    "8AM - 9AM",
    "9AM - 10AM",
    "10AM - 11AM",
    "11AM - 12PM",
    "12PM - 1PM",
    "1PM - 2PM",
    "2PM - 3PM",
    "3PM - 4PM",
    "4PM - 5PM",
    "5PM - 6PM",
    "6PM - 7PM",
    "7PM - 8PM",
    "8PM - 9PM",
    "9PM - 10PM",
    "10PM - 11PM",
    "11PM - 12AM",
  ];
  let latestUpdatedTotalOptimalDates;
  await db
    .collection("channelsCreatedByUser")
    .doc(channel.documentID)
    .get()
    .then((doc) => {
      latestUpdatedTotalOptimalDates = doc.data().decidedOutcome; //can be replaced with channel.decidedOutcome
    });

  //console.log("Latest optimal dates: " + latestUpdatedTotalOptimalDates);

  var dateIndex;
  for (dateIndex = 0; dateIndex < channel.dateRange.length; dateIndex++) {
    let date = channel.dateRange[dateIndex];
    let busyHoursForThatDateOfChannel;
    let pushedTimeForDisplay = [];
    await db
      .collection("channelsCreatedByUser")
      .doc(channel.documentID)
      .collection("busyDatesWithTimeBlocks")
      .doc(date)
      .get()
      .then((doc) => {
        //console.log(doc.data().busyHours);
        //console.log("Channel Hours for " + date);
        busyHoursForThatDateOfChannel = doc.data().busyHours;
      });

    for (
      var loopIndex = beginningIndex;
      loopIndex <= endTime - 1;
      loopIndex++
    ) {
      if (busyHoursForThatDateOfChannel[loopIndex] === 0) {
        pushedTimeForDisplay.push(timeToBePushed[loopIndex]);
      }
    }

    //console.log(pushedTimeForDisplay);
    let newCompressedTimeArr = simplifyTimeBlocks(pushedTimeForDisplay);
    //console.log(newCompressedTimeArr);

    if (newCompressedTimeArr.length > 0) {
      //console.log(latestUpdatedTotalOptimalDates[dateIndex]);
      latestUpdatedTotalOptimalDates[dateIndex] =
        latestUpdatedTotalOptimalDates[dateIndex].concat(
          newCompressedTimeArr.join(", ")
        );
    } else {
      latestUpdatedTotalOptimalDates[dateIndex] =
        latestUpdatedTotalOptimalDates[dateIndex].concat("No timeslots found!");
    }
  }
  //Push update after getting all the arrays
  db.collection("channelsCreatedByUser")
    //.doc(currentUserEmail)
    // .collection("channels")
    .doc(channel.documentID)
    .update({
      decidedOutcome: latestUpdatedTotalOptimalDates, //Adding documentID to document (Purpose: to update)
    });
}

//----------Function to get the Simplified Outputs instead of 1H slots//
function simplifyTimeBlocks(arr) {
  var index = 0;
  for (var k = 0; k < arr.length; k++) {
    // only if arr length is greater than 1
    for (var i = index; i < arr.length - 1; i) {
      //console.log("i position at : " + i);
      let currentElement = arr[index];
      //console.log(currentElement);
      let currentElementSplit = currentElement.split(" - "); //let splitStrings = arr[0].split(" - "); //12AM - 1AM" gives [ '12AM', '1AM' ]
      let nextElement = arr[index + 1];
      //console.log(nextElement);
      let nextElementSplit = nextElement.split(" - ");
      if (currentElementSplit[1] === nextElementSplit[0]) {
        //console.log("currentElementSplit[1] : " + currentElementSplit[1]);
        //console.log("nextElementSplit[0] : " + nextElementSplit[0]);
        let newElement = currentElementSplit[0] + " - " + nextElementSplit[1];
        //console.log("new currentElement[0]: " + newElement);
        arr[index] = newElement;
        arr.splice(index + 1, 1); //remove next element
      } else {
        break;
      }
      //console.log("New array length: " + arr.length);
    }
    index++;
  }

  return arr;
}
/*---------------------------------------------------*/
