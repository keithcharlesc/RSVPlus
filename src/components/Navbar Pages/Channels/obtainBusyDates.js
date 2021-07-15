export default async function obtainBusyDates(events, db, currentUserEmail) {
  //1. Delete any documents if they exist to fetch the new latest data.
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  await sleep(500);

  await db
    .collection("userAccounts")
    .doc(currentUserEmail)
    .collection("busyDatesWithTimeBlocks")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((snapshot) => {
        snapshot.ref.delete();
      });
    });

  //await db.collection("busyDates").doc(currentUserEmail).delete();

  //For User Perspective
  /*  
    1. Takes in the entire collection of events
    2.Start iterating through each event
                                            */
  //console.log(events);
  //Goes through each events
  for (var eventIndex = 0; eventIndex < events.length; eventIndex++) {
    //let currentEvent = events[1];
    let currentEvent = events[eventIndex];
    let rawStartDate = //Raw Form of startTime, used to get the 24h blocks
      currentEvent.start.date != null
        ? currentEvent.start.date
        : currentEvent.start.dateTime;
    let rawEndDate = //Raw form of endTime, used to get the 24h blocks
      currentEvent.end.date != null
        ? currentEvent.end.date
        : currentEvent.end.dateTime;
    let startDate;
    let endDate;

    if ((rawStartDate.length === 25) & (rawEndDate.length === 25)) {
      //It has timestamp
      startDate = rawStartDate.slice(0, 10); //Used for obtaining date inbetween
      endDate = rawEndDate.slice(0, 10); //Used for obtaining date inbetween
    } else {
      startDate = rawStartDate;
      endDate = rawEndDate;
    }
    //console.log("Raw Start Date : " + rawStartDate);
    //console.log("Raw End Date : " + rawEndDate);
    //console.log("Start Date :" + startDate);
    //console.log("End Date :" + endDate);

    //Obtain dates in between the start date and end date of that event
    //Then convert them into YYYY-MM-DD
    let dateRangeForCurrentEvent = dateRange(startDate, endDate);
    //Drop the last date (end time ) which isnt needed (since its next day already)
    //Only if it doesnt have time

    if ((rawStartDate.length === 10) & (rawEndDate.length === 10)) {
      dateRangeForCurrentEvent.pop();
      //console.log("Popped : " + rawEndDate);
      rawEndDate =
        dateRangeForCurrentEvent[dateRangeForCurrentEvent.length - 1];
      endDate = dateRangeForCurrentEvent[dateRangeForCurrentEvent.length - 1];
      //console.log("New: " + endDate);
    }

    /*
    if (rawEndDate.length === 25 && rawEndDate.slice(11, 19) === "00:00:00") {
      console.log("Drop rawEndDate: " + rawEndDate);
      dateRangeForCurrentEvent.pop();
    }
    */

    //Range of dates between start and end for that event
    //console.log(dateRangeForCurrentEvent);
    const datesRef = db.collection("userAccounts").doc(currentUserEmail);

    //Creates documents for dates if the dates havent been initialized
    async function initializeBlocks() {
      for (var i = 0; i < dateRangeForCurrentEvent.length; i++) {
        let date = dateRangeForCurrentEvent[i];
        //Does the initialization if document doesnt exist for that date yet.
        await initializeTimeBlocksForEachDate(datesRef, date);
      }
    }

    await initializeBlocks();
    await sleep(500);

    //Obtaining of time blocks to update
    //(2nd Major Scenario): Date (Date Only)

    //Maybe can do three awaits for update instead..
    //startDate
    //dates in the middle (if they exist)
    //endDate or do if conditions early on here to check for two diff scenarios

    //Takes the dates inbetween and increment the 24HR blocks by 1.

    async function updateBlocks() {
      for (var k = 0; k < dateRangeForCurrentEvent.length; k++) {
        //For each date in the dateRange, start incrementing their blocks by 1.
        let date = dateRangeForCurrentEvent[k];
        //console.log("Date for incrementing: " + date);
        if (date === startDate && startDate === endDate) {
          await incrementDateInBetweenTwoSlotsOnSameDay(
            datesRef,
            date,
            rawStartDate,
            rawEndDate
          );
        }
        //Updates start date
        //if end date is the same it doesnt update again
        else if (date === startDate) {
          //console.log(date);
          //console.log(startDate);
          await incrementStartDateBlocks(datesRef, startDate, rawStartDate);
        } else if (
          date !== startDate &&
          date !== endDate &&
          dateRangeForCurrentEvent.length > 2
        ) {
          //updates dates in between
          await incrementDateInBetweenBlocks(datesRef, date);
        } else if (date === endDate) {
          //updates end date
          //console.log("Updating endDate of : " + endDate);
          await incrementEndDateBlocks(datesRef, endDate, rawEndDate);
        }
      }
    }

    await updateBlocks();
  }
  console.log("Done fetching latest data!");
}

//Function to initialize documents should those dates and their respective blocks not exist.
async function initializeTimeBlocksForEachDate(datesRef, date) {
  await datesRef
    .collection("busyDatesWithTimeBlocks")
    .doc(date)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //console.log("Document for that date exists already, no need for initializing");
        //console.log(date);
      } else {
        // doc.data() will be undefined in this case

        datesRef
          .collection("busyDatesWithTimeBlocks")
          .doc(date)
          .set({
            date: date,
            hours: new Array(24).fill(0),
          });

        //console.log("created document for that date!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

//Function to update same startDate and endDate
async function incrementDateInBetweenTwoSlotsOnSameDay(
  datesRef,
  date,
  rawStartDate,
  rawEndDate
) {
  //console.log("startDate: " + startDate);
  //console.log("rawEndDate: " + rawEndDate);
  await datesRef
    .collection("busyDatesWithTimeBlocks")
    .doc(date)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //console.log("test");
        let updatedHours = [...doc.data().hours];
        //All-time days - all blocks filled
        if (rawStartDate.length === 10) {
          //console.log(updatedHours);
          for (var i = 0; i < updatedHours.length; i++) {
            updatedHours[i]++;
          }
        }

        if (rawStartDate.length === 25) {
          let startDateHours = rawStartDate.slice(11, 13);
          //console.log("startDateHours: " + startDateHours);
          if (startDateHours.charAt(0) === "0") {
            startDateHours = startDateHours.substring(1);
          }
          //console.log("sliced startDateHours: " + startDateHours);
          let endDateHours = rawEndDate.slice(11, 13);
          //console.log("endDateHours: " + endDateHours);
          if (endDateHours.charAt(0) === "0") {
            endDateHours = endDateHours.substring(1);
          }
          //console.log("sliced endDateHours: " + endDateHours);

          startDateHours = parseInt(startDateHours); //RMB TO CONVERT TO INT
          endDateHours = parseInt(endDateHours); //RMB TO CONVERT TO INT
          //console.log(startNum);
          //console.log(endNum);
          //Account for Minutes for that Hour,
          // if > 0 Mins Include that Hour to be busy too

          let minutesForThatHour = rawEndDate.slice(14, 16);
          if (minutesForThatHour !== "00") {
            endDateHours = endDateHours + 1;
          }
          //console.log("Minutes: " + minutesForThatHour);

          for (var k = startDateHours; k < endDateHours; k++) {
            //console.log(k);
            updatedHours[k]++;
          }
        }

        //probably need to put await here
        datesRef.collection("busyDatesWithTimeBlocks").doc(date).update({
          hours: updatedHours,
        });
        //console.log("updated same start date and end date!");
      } else {
        // doc.data() will be undefined in this case
        alert("Update failed. Please fetch again!");
        //console.log("No such document! for : " + startDate);
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

//Function to update start date
async function incrementStartDateBlocks(datesRef, startDate, rawStartDate) {
  //console.log("startDate: " + startDate);
  //console.log("rawStartDate: " + rawStartDate);
  await datesRef
    .collection("busyDatesWithTimeBlocks")
    .doc(startDate)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //console.log("test");
        let updatedHours = [...doc.data().hours];
        //All-time days - all blocks filled
        if (rawStartDate.length === 10) {
          //console.log(updatedHours);
          for (var i = 0; i < updatedHours.length; i++) {
            updatedHours[i]++;
          }
        }

        if (rawStartDate.length === 25) {
          let startDateHours = rawStartDate.slice(11, 13);
          //console.log("startDateHours: " + startDateHours);
          if (startDateHours.charAt(0) === "0") {
            startDateHours = startDateHours.substring(1);
          }
          startDateHours = parseInt(startDateHours);
          //console.log("sliced startDateHours: " + startDateHours);
          for (var k = startDateHours; k < updatedHours.length; k++) {
            updatedHours[k]++;
          }
        }

        //probably need to put await here
        datesRef.collection("busyDatesWithTimeBlocks").doc(startDate).update({
          hours: updatedHours,
        });
        //console.log("updated start date!");
      } else {
        // doc.data() will be undefined in this case
        alert("Update failed. Please fetch again!");
        //console.log("No such document! for : " + startDate);
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

//Function to update dates in between
async function incrementDateInBetweenBlocks(datesRef, date) {
  await datesRef
    .collection("busyDatesWithTimeBlocks")
    .doc(date)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let updatedHours = [...doc.data().hours];
        //console.log(updatedHours);
        //All-time days in between - all blocks filled
        for (var i = 0; i < updatedHours.length; i++) {
          updatedHours[i]++;
        }

        datesRef.collection("busyDatesWithTimeBlocks").doc(date).update({
          hours: updatedHours,
        });
        //console.log("updated dates in between start and end of range!");
      } else {
        // doc.data() will be undefined in this case
        alert("Update failed. Please fetch again!");
        //console.log("No such document! for : " + startDate);
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

//Function to update end date
async function incrementEndDateBlocks(datesRef, endDate, rawEndDate) {
  //console.log("endDate: " + endDate);
  //console.log("rawEndDate: " + rawEndDate);
  await datesRef
    .collection("busyDatesWithTimeBlocks")
    .doc(endDate)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //check if rawEndDate that has time is at 00:00:00, if it is don't update the 0hr block
        if (
          rawEndDate.length === 25 &&
          rawEndDate.slice(11, 19) === "00:00:00"
        ) {
          //console.log("nothing to update since date is at 12AM");
          return;
        }

        let updatedHours = [...doc.data().hours];
        //All-time days - all blocks filled
        if (rawEndDate.length === 10) {
          //console.log(doc.data().hours);
          for (var i = 0; i < updatedHours.length; i++) {
            updatedHours[i]++;
          }
        }

        if (rawEndDate.length === 25) {
          let endDateHours = rawEndDate.slice(11, 13);
          //console.log("endDateHours: " + endDateHours);
          if (endDateHours.charAt(0) === "0") {
            endDateHours = endDateHours.substring(1);
          }
          endDateHours = parseInt(endDateHours);
          //console.log("sliced endDateHours: " + endDateHours);
          //Account for Minutes for that Hour,
          // if > 0 Mins Include that Hour to be busy too
          let minutesForThatHour = rawEndDate.slice(14, 16);
          if (minutesForThatHour !== "00") {
            endDateHours = endDateHours + 1;
          }
          //console.log("Minutes: " + minutesForThatHour);

          for (var k = endDateHours - 1; k >= 0; k--) {
            updatedHours[k]++;
          }
        }
        //Have to account for same startDate and endDate (check length of array)
        datesRef.collection("busyDatesWithTimeBlocks").doc(endDate).update({
          hours: updatedHours,
        });
        //console.log("updated end date!");
      } else {
        // doc.data() will be undefined in this case
        alert("Update failed. Please fetch again!");
        //console.log("No such document! for : " + startDate);
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
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
    dateArray[i] = dateArray[i].toLocaleDateString("en-CA");
  }

  return dateArray;
}
