import findOptimalSlots from "./findOptimalSlots";

//Checks the previous slots added to channel and remove them

export default async function decrementDates(channel, db, currentUserEmail) {
  //-------------- SUB OF MAIN <For Loop Algo: To update Dates>-----------
  const dateRange = [...channel.dateRange]; //dateRange Array
  var index = 0;
  for (index = 0; index < dateRange.length; index++) {
    let date = dateRange[index];
    let channelHoursForThatDate = [];
    let userBusyHoursForThatDate = [];

    //Retrieves the busyHours of that Date Document of that CHANNEL
    await db
      .collection("channelsCreatedByUser")
      .doc(channel.documentID)
      .collection("busyDatesWithTimeBlocks")
      .doc(date)
      .get()
      .then((doc) => {
        //console.log(doc.data().busyHours);
        //console.log("Channel Hours for " + date);
        channelHoursForThatDate = doc.data().busyHours;
      });
    //console.log(channelHoursForThatDate);

    //Retrieves the busyHours of that Date Document of that USER
    await db
      .collection("channelsCreatedByUser")
      .doc(channel.documentID)
      .collection("userAccounts")
      .doc(currentUserEmail)
      .collection("busyDatesWithTimeBlocks")
      .doc(date)
      .get()
      .then((doc) => {
        if (doc.exists) {
          //console.log("UserBusyHours for " + date);
          userBusyHoursForThatDate = doc.data().hours;
        } else {
          //console.log("User don't have busy hours for that date, giving blank array instead: ");
          userBusyHoursForThatDate = new Array(24).fill(0);
        }
      });
    //console.log(userBusyHoursForThatDate);

    //Checks if for every hour, if the user has something on (aka > 0),
    //if yes then +1 to the channel hour as well to indicate how many pax is busy
    for (
      var hourIndex = 0;
      hourIndex < channelHoursForThatDate.length;
      hourIndex++
    ) {
      if (userBusyHoursForThatDate[hourIndex] > 0) {
        channelHoursForThatDate[hourIndex]--;
      }
    }

    //console.log("------For Date: " + date + "-------");
    //console.log("New Updated channelHours is:");
    //console.log(channelHoursForThatDate);
    //console.log("-----------------------------------");

    //updateBusyUsersForDates[index] += currentUserEmail + " "; //Append user email to the array element (busy)
    //Have to retrieve the array for it as well another await db if needed to be implemented.

    //Updates the hours for that date document for channel
    await db
      .collection("channelsCreatedByUser")
      .doc(channel.documentID)
      .collection("busyDatesWithTimeBlocks")
      .doc(date)
      .update({
        busyHours: channelHoursForThatDate,
      });

    let totalOptimalDateStrings = new Array(dateRange.length).fill("");
    for (var i = 0; i < dateRange.length; i++) {
      let date = dateRange[i];
      //Appends date to the front of each date for output later on
      let optimalDateString = date + ": ";
      totalOptimalDateStrings[i] = optimalDateString;
    }

    //Adding documentID to document (Purpose: to update)
    await db
      .collection("channelsCreatedByUser")
      //.doc(currentUserEmail)
      // .collection("channels")
      .doc(channel.documentID)
      .update({
        decidedOutcome: totalOptimalDateStrings,
      });
  }

  await db
    .collection("channelsCreatedByUser")
    .doc(channel.documentID)
    .collection("userAccounts")
    .doc(currentUserEmail)
    .collection("busyDatesWithTimeBlocks")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((snapshot) => {
        snapshot.ref.delete();
      });
    });

  await db
    .collection("channelsCreatedByUser")
    .doc(channel.documentID)
    .collection("userAccounts")
    .doc(currentUserEmail)
    .delete();

  findOptimalSlots(channel, db);
  //console.log("ran");
  //----------------End of For Loop Algo: to update Channel Dates------------
}
