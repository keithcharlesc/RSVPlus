import React, { useRef, useState, useEffect } from "react";
import {
  Container,
  Form,
  Card,
  Button,
  Alert,
  Row,
  Badge,
  Col,
} from "react-bootstrap";
import NavigationBar from "../NavigationBar/NavigationBar";
import { firebase } from "@firebase/app";
import Popup from "./Popup";
import InviteList from "./InviteList";
import "./Channels.css";
import dateRange from "./dateRange";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import obtainBusyDates from "./obtainBusyDates";
import findOptimalSlots from "./findOptimalSlots";
import decrementDates from "./decrementDates";

/*----------------------- GAPI INITIALIZAITON----------------------*/
var gapi = window.gapi;
var CLIENT_ID =
  "1011248109211-umpu5g48dj5p4hqlnhvuvl6f4c9qdhn3.apps.googleusercontent.com";
var API_KEY = "AIzaSyD3-pnAPnBMzBqL_dAZYYyVGretc42zUnA";
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
var SCOPES = "https://www.googleapis.com/auth/calendar.events";

gapi.load("client:auth2", () => {
  //console.log("loaded auth2 client!");

  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
  });

  gapi.client.load(
    "calendar",
    "v3",
    () => console.log()
    //console.log("loaded calendar v3, entry!")
  );
});
/*---------------------------------------------------------------------*/
export default function Channels() {
  const db = firebase.firestore();
  const hostName = firebase.auth().currentUser?.displayName;
  const currentUserEmail = firebase.auth().currentUser?.email;

  //Create Channel [HOST]
  const nameRef = useRef(); //Used for CREATE channel
  const descriptionRef = useRef(); //Used for CREATE channel
  const locationRef = useRef(); //Used for CREATE channel
  const channelIDRef = useRef(); //Used for CREATE channel
  const [loading, setLoader] = useState(false); //Creating
  const [error, setError] = useState(""); //Creating
  const [success, setSuccess] = useState(""); //Creating
  const [buttonPopup, setButtonPopup] = useState(false); //Creating a channel

  //Date Picker for Create Channel
  const [dateRangeForPicker, setDateRangeForPicker] = useState([null, null]);
  const [startDate, endDate] = dateRangeForPicker;
  const [startOfTime, setStartOfTime] = useState(new Date());
  const [endOfTime, setEndOfTime] = useState(new Date());

  //Delete channel [HOST]
  const [loadingTwo, setLoaderTwo] = useState(false);
  const [errorTwo, setErrorTwo] = useState("");
  const [successTwo, setSuccessTwo] = useState("");
  const [buttonPopupTwo, setButtonPopupTwo] = useState(false);

  //Add or Remove User to a Channel [HOST]
  const channelIDForModifyRef = useRef();
  const emailForModifyRef = useRef();
  const [loadingThree, setLoaderThree] = useState(false);
  const [errorThree, setErrorThree] = useState("");
  const [successThree, setSuccessThree] = useState("");
  const [buttonPopupThree, setButtonPopupThree] = useState(false);

  //Join a Channel [USER]
  const channelIDForJoinRef = useRef();
  const [loadingFour, setLoaderFour] = useState(false);
  const [errorFour, setErrorFour] = useState("");
  const [successFour, setSuccessFour] = useState("");

  //Leaving a Channel [USER]
  const [loadingFive, setLoaderFive] = useState(false);

  //Refreshing a Channel
  const [loadingSix, setLoaderSix] = useState(false);

  /* -------------- GET EVENTS (BUSY DATES AND TIMINGS) ------------*/
  async function handleSecondClick(channel) {
    setLoader(true);
    const btn = document.querySelector(".button");
    btn.classList.add("button--loading");

    gapi.auth2.getAuthInstance().then(() => {
      gapi.client.calendar.events
        .list({
          calendarId: "primary",
          timeMin: channel.start_date + "T00:00:00+08:00",
          timeMax: channel.end_date + "T23:59:00+08:00",
          showDeleted: false,
          singleEvents: true,
          maxResults: 100,
          orderBy: "startTime",
        })
        .then((response) => {
          const events = response.result.items;
          return Promise.resolve(
            obtainBusyDates(events, db, currentUserEmail, channel)
          ).then(() => {
            handleAgreeToSync(channel, btn);
          });
        });
    });
  }
  /*----------------------------------------------------------------------*/

  //-------------------------------------------- (CREATING AN EVENT FUNCTION)-------------------------//
  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    setLoader(true);
    setError("");
    setSuccess("");

    //Array of Emails with Host Email appended to Invite List Array from Form
    const emails = [currentUserEmail, ...findAll()];
    //console.log(emails);

    //Handles the validation of Emails in the Array of Emails
    let validation = [true, ""];
    await validateEmails(emails).then((result) => {
      validation[0] = result[0];
      validation[1] = result[1];
    });
    //console.log("validation:" + validation);
    if (validation[0] === false) {
      setError(validation[1] + " is not a user of RSVP+!");
      setLoader(false);
      return;
    }

    let duplicate = hasDuplicates(emails);
    if (duplicate) {
      setError(
        "Duplicate email address found, please remove the duplicate (remove your own email/the duplicate email from the invite list!)"
      );
      setLoader(false);
      return;
    }

    //Get Date Range (In proper format from UTC to YYYY-MM-DD)
    const dates = dateRange(
      startDate.toLocaleDateString("en-CA"),
      endDate.toLocaleDateString("en-CA")
    );

    //-----Checks whether input for End Time Slot (Range) is later than Start Time Slot-------//
    let startDateHoursAndMinutes = startOfTime.toLocaleTimeString("it-IT");
    let endDateHoursAndMinutes = endOfTime.toLocaleTimeString("it-IT");

    let minutesForStartDate = getMinutes(startDateHoursAndMinutes);
    //console.log("minutesForStartDate: " + minutesForStartDate);
    let minutesForEndDate = getMinutes(endDateHoursAndMinutes);
    //console.log("minutesForEndDate: " + minutesForEndDate);

    if (minutesForEndDate <= minutesForStartDate) {
      setError(
        "Error! End time of time range must minimally be 1 hour later than start time slot!"
      );
      setLoader(false);
      return;
    }

    if (minutesForStartDate % 60 !== 0) {
      setError(
        "Error! Start time of time range must not contain any minutes. HH:00 only! Please reselect"
      );
      setLoader(false);
      return;
    }

    if (minutesForEndDate % 60 !== 0) {
      setError(
        "Error! End time of time range must not contain any minutes. HH:00 only! Please reselect"
      );
      setLoader(false);
      return;
    }
    //---------------------------------------//
    db.collection("channelsCreatedByUser")
      .add({
        host: hostName, //User who created Channel
        hostEmail: currentUserEmail,
        name: nameRef.current.value, //Name of Event
        description: descriptionRef.current.value, //Description of Event
        location: locationRef.current.value, //Location of Event
        start_date: startDate.toLocaleDateString("en-CA"), //Start Date of Event
        end_date: endDate.toLocaleDateString("en-CA"), // End Date of Event
        dateRange: dates, //Dates in between Start Date & End Date of Event
        invitedEmails: emails, //List of Invited Users
        respondedEmails: [], //List of Responded Users
        pendingEmails: emails, //List of Pending Users
        decidedOutcome: new Array(dates.length).fill(""), //Outcome
        startTimeToLookFor: startOfTime,
        startTimeToLookForIndex: startOfTime
          .toLocaleTimeString("it-IT")
          .slice(0, 2),
        endTimeToLookFor: endOfTime,
        endTimeToLookForIndex: endOfTime
          .toLocaleTimeString("it-IT")
          .slice(0, 2),
      })
      .then((docRef) => {
        //console.log(docRef);
        //console.log(docRef.id);
        db.collection("channelsCreatedByUser")
          //.doc(currentUserEmail)
          // .collection("channels")
          .doc(docRef.id)
          .update({
            documentID: docRef.id, //Adding documentID to document (Purpose: to update)
          });

        let totalOptimalDateStrings = new Array(dates.length).fill("");

        for (var i = 0; i < dates.length; i++) {
          let date = dates[i];
          //Appends date to the front of each date for output later on
          let optimalDateString = date + ": ";

          //Creates dates documents with the busy hours blocks for those date range of the channel created
          db.collection("channelsCreatedByUser")
            .doc(docRef.id)
            .collection("busyDatesWithTimeBlocks")
            .doc(date)
            .set({
              date: date,
              busyHours: new Array(24).fill(0),
              busyUsersForHours: new Array(24).fill(""),
            });

          totalOptimalDateStrings[i] = optimalDateString;
        }

        //Adding documentID to document (Purpose: to update)
        db.collection("channelsCreatedByUser")
          //.doc(currentUserEmail)
          // .collection("channels")
          .doc(docRef.id)
          .update({
            decidedOutcome: totalOptimalDateStrings,
          });

        setLoader(false);
        setSuccess("Your channel has been created!");
        //console.log("Channel requisite information has been added to firestore");
      })
      .catch((error) => {
        //console.log(error);
        setError("Your channel has not been created, please try again!");
        setLoader(false);
      });
  }
  //--------------------  END OF CREATING EVENT    --------------------//

  //-------------------------------------------//
  const [channels, setChannels] = useState([]);
  const [loadingx, setLoading] = useState(false);

  //---Checks for duplicates--//
  function hasDuplicates(array) {
    return new Set(array).size !== array.length;
  }

  //---------------------Obtaining emailAddresses by form input fields (Getting emails in an array from invite List)---------------------//
  function findAll() {
    const emailAddresses = [];
    var inputs = document.getElementsByName("emailAddress");
    for (var i = 0; i < inputs.length; i++) {
      emailAddresses.push(inputs[i].value);
      //console.log(inputs[i].value);
    }
    //console.log(emailAddresses.toString());
    return emailAddresses;
  }

  //---------------------Display Invited List (For the emails)---------------------//
  //For invited and responded list
  function displayUsersList(arr) {
    const userList = arr.map((email, index) => <li key={index}>{email}</li>);
    return userList;
  }

  //For pending list
  function displayPendingList(arr) {
    if (arr.length === 0) {
      return " None!";
    }
    const userList = arr.map((email, index) => <li key={index}>{email}</li>);
    return userList;
  }

  //------------------------------------------*** MAIN:[Agree to Sync Implementation] ***------------------------------------------//
  async function handleAgreeToSync(channel, btn) {
    //Check if user is under responded list already
    const respondedEmails = [...channel.respondedEmails]; //Responded Emails Array
    const userHasResponded = respondedEmails.includes(currentUserEmail);

    if (userHasResponded === true) {
      setLoader(false);
      btn.classList.remove("button--loading");
      alert("You already responded!");
      return;
    }

    //console.log(userHasResponded);
    //console.log(channel.documentID);
    const invitedEmails = [...channel.invitedEmails]; //Invited Emails Array
    //console.log(respondedEmails);
    respondedEmails.push(currentUserEmail); //Update Responded Email Array
    const pendingEmails = invitedEmails.filter(
      //Filter out duplicates (Invited - Responded) for Pending
      //Update Pending List
      (val) => !respondedEmails.includes(val)
    );
    //console.log(pendingEmails);
    const dateRange = [...channel.dateRange]; //dateRange Array
    //console.log(dateRange);

    //-------------- SUB OF MAIN <For Loop Algo: To update Dates>-----------
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
          channelHoursForThatDate[hourIndex]++;
        }
      }

      //console.log("------For Date: " + date + "-------");
      //console.log("New Updated channelHours is:");
      //console.log(channelHoursForThatDate);
      //console.log("-----------------------------------");

      //updateBusyUsersForDates[index] += currentUserEmail + " "; //Append user email to the array element (busy)
      //Have to retrieve the array for it as well another await db if needed to be implemented.

      //Updates the hours for that date document for channel
      db.collection("channelsCreatedByUser")
        .doc(channel.documentID)
        .collection("busyDatesWithTimeBlocks")
        .doc(date)
        .update({
          busyHours: channelHoursForThatDate,
        });
    }
    //----------------End of For Loop Algo: to update Channel Dates------------

    db.collection("channelsCreatedByUser").doc(channel.documentID).update({
      invitedEmails: invitedEmails, //List of Invited Users
      respondedEmails: respondedEmails, //List of Responded Users
      pendingEmails: pendingEmails, //List of Pending Users
      //decidedOutcome: "None yet", //Outcome
    });

    if (respondedEmails.length !== invitedEmails.length) {
      setLoader(false);
      btn.classList.remove("button--loading");
      return;
    }

    //If everyone has respnded, find the optimal slots and output them
    if (respondedEmails.length === invitedEmails.length) {
      findOptimalSlots(channel, db);
      setLoader(false);
      btn.classList.remove("button--loading");
    }
    //*/
  }
  // ------------------------------------------*** End of Sync Implementation ***---------------------------------------//

  //------Function to Convert 24H into 9AM-----------------/
  function timeToConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }

  /*-------------Get minutes from HH:MM (hours and minutes 24 hr form)-----------------*/
  function getMinutes(time) {
    let str = time;
    let arr = str.split(":");
    let minutes = +arr[0] * 60 + +arr[1];
    //console.log(minutes);
    return minutes;
  }
  /*-----------Function to validateEmails against RSVP+ Database----------------*/
  async function validateEmails(emailArr) {
    var arrayValues = [true, ""];
    for (var i = 0; i < emailArr.length; i++) {
      let currentEmail = emailArr[i];
      await db
        .collection("userAccounts")
        .doc(currentEmail)
        .get()
        .then((doc) => {
          if (doc.exists) {
            //console.log(currentEmail);
            //console.log("Email exists in database");
            arrayValues[0] = true;
            arrayValues[1] = currentEmail;
          } else {
            //console.log(currentEmail);
            //console.log("Email don't exist in database");
            arrayValues[0] = false;
            arrayValues[1] = currentEmail;
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
      if (arrayValues[0] === false) {
        break;
      }
    }
    return arrayValues;
  }
  //*-----------------Display Channels useEffect Hook---------------------//
  useEffect(() => {
    //Ref snapshot
    const ref = firebase.firestore().collection("channelsCreatedByUser");
    const currentUserEmail = firebase.auth().currentUser?.email;
    //Load channels details REF SNAPSHOT
    function getChannels() {
      setLoading(true);
      ref.onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          const emails = doc.data().invitedEmails; //arr of Invited Emails
          //console.log(emails);
          const boolean = emails.indexOf(currentUserEmail) > -1; //Check if logged in user email belongs to Invited Emails
          if (boolean === true) {
            //Push channels if belongs
            items.push(doc.data());
          }
          //console.log(doc.id);
        });
        setChannels(items);
        //console.log(items);
        setLoading(false);
      });
    }
    getChannels();
  }, []);

  if (loadingx) {
    return (
      <div className="bg-dark" style={{ minHeight: "100vh" }}>
        <h1>Loading...</h1>
      </div>
    );
  }
  //*-----------------------(DELETING CHANNEL FUNCTION)[HOST]------------------------*/
  async function handleDeleteChannel(e) {
    e.preventDefault();
    e.stopPropagation();
    setLoaderTwo(true);
    setErrorTwo("");
    setSuccessTwo("");
    let channelID = channelIDRef.current.value;
    let hostEmail;

    await db
      .collection("channelsCreatedByUser")
      .doc(channelID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          hostEmail = doc.data().hostEmail;
          //console.log(hostEmail);
        } else {
          hostEmail = "null";
        }
      });

    if (hostEmail === "null") {
      setErrorTwo("Channel does not exist!");
      setLoaderTwo(false);
      return;
    } else if (currentUserEmail === hostEmail) {
      let responded = [];

      await db
        .collection("channelsCreatedByUser")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            //console.log(doc.data().respondedEmails);
            responded = doc.data().respondedEmails;
            //console.log(responded);
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

      for (let i = 0; i < responded.length; i++) {
        let email = responded[i];
        //console.log(email);
        await db
          .collection("channelsCreatedByUser")
          .doc(channelID)
          .collection("userAccounts")
          .doc(email)
          .collection("busyDatesWithTimeBlocks")
          .get()
          .then((querySnapshot) => {
            querySnapshot.docs.forEach((snapshot) => {
              //console.log(email);
              snapshot.ref.delete();
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });

        await db
          .collection("channelsCreatedByUser")
          .doc(channelID)
          .collection("userAccounts")
          .doc(email)
          .delete()
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      }

      await db
        .collection("channelsCreatedByUser")
        .doc(channelID)
        .collection("busyDatesWithTimeBlocks")
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((snapshot) => {
            snapshot.ref.delete();
          });
        });
      await db.collection("channelsCreatedByUser").doc(channelID).delete();
      setSuccessTwo("Channel successfully deleted!");
      setLoaderTwo(false);
      return;
    } else {
      setErrorTwo("Failed to delete channel, you are not the host!");
      setLoaderTwo(false);
      return;
    }
  }
  //*------------------------(JOINING CHANNEL FUNCTION)[USER]---------------------------*/
  async function handleJoiningChannel(e) {
    e.preventDefault();
    e.stopPropagation();
    setLoaderFour(true);
    setErrorFour("");
    setSuccessFour("");
    let channelID = channelIDForJoinRef.current.value;
    let invitedEmailsList = [];
    let pendingEmailsList = [];
    let respondedEmailsList = [];

    try {
      await db
        .collection("channelsCreatedByUser")
        .doc(channelID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            invitedEmailsList = doc.data().invitedEmails;
            pendingEmailsList = doc.data().pendingEmails;
            respondedEmailsList = doc.data().respondedEmails;
            if (invitedEmailsList.indexOf(currentUserEmail) > -1) {
              setErrorFour(
                "Failed to join channel, you are already in the channel!"
              );
              setLoaderFour(false);
              return;
            } else if (
              respondedEmailsList.length === invitedEmailsList.length
            ) {
              setErrorFour(
                "Failed to join channel, optimal time slots have already been determined!"
              );
              setLoaderFour(false);
              return;
            } else {
              invitedEmailsList.push(currentUserEmail);
              pendingEmailsList.push(currentUserEmail);
              db.collection("channelsCreatedByUser").doc(channelID).update({
                invitedEmails: invitedEmailsList, //List of Invited Users
                pendingEmails: pendingEmailsList, //List of Pending Users
              });
              setSuccessFour("Successfully joined channel!");
              setLoaderFour(false);
              return;
            }
          } else {
            setErrorFour("Channel does not exist!");
            setLoaderFour(false);
            return;
          }
        });
    } catch (err) {
      setErrorFour("Channel field cannot be blank.");
      setLoaderFour(false);
      return;
    }
  }
  //*----------------------(LEAVING CHANNEL FUNCTION) [USER]-------------------------------*/
  async function handleLeavingChannel(channelTwo) {
    setLoaderFive(true);
    let channelID = channelTwo.documentID;
    let invitedEmailsList = [];
    let pendingEmailsList = [];
    let respondedEmailsList = [];
    let channel;
    let hostEmail;

    await db
      .collection("channelsCreatedByUser")
      .doc(channelID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          hostEmail = doc.data().hostEmail;
        } else {
          hostEmail = "null";
        }
      });

    await db
      .collection("channelsCreatedByUser")
      .doc(channelID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          invitedEmailsList = doc.data().invitedEmails;
          pendingEmailsList = doc.data().pendingEmails;
          respondedEmailsList = doc.data().respondedEmails;
          channel = doc.data();

          if (hostEmail === currentUserEmail) {
            alert(
              "Failed to leave channel, you are the host of the channel. Please delete it if it has no use anymore!"
            );
            setLoaderFive(false);
            return;
          } else if (respondedEmailsList.indexOf(currentUserEmail) > -1) {
            decrementDates(channel, db, currentUserEmail);

            invitedEmailsList = invitedEmailsList.filter(
              (email) => email !== currentUserEmail
            );

            respondedEmailsList = respondedEmailsList.filter(
              (email) => email !== currentUserEmail
            );

            db.collection("channelsCreatedByUser").doc(channelID).update({
              invitedEmails: invitedEmailsList, //List of Invited Users
              respondedEmails: respondedEmailsList,
            });

            alert("Successfully left channel!");
            setLoaderFive(false);
            return;
          } else {
            //if user is still pending or
            if (
              pendingEmailsList.indexOf(currentUserEmail) > -1 ||
              respondedEmailsList.length === invitedEmailsList.length
            ) {
              invitedEmailsList = invitedEmailsList.filter(
                (email) => email !== currentUserEmail
              );
              pendingEmailsList = pendingEmailsList.filter(
                (email) => email !== currentUserEmail
              );
            }
            db.collection("channelsCreatedByUser").doc(channelID).update({
              invitedEmails: invitedEmailsList, //List of Invited Users
              pendingEmails: pendingEmailsList, //List of Pending Users
            });
            //------------ Find optimal slots
            if (respondedEmailsList.length === invitedEmailsList.length) {
              findOptimalSlots(channel, db);
            }
            //------------
            alert("Successfully left channel!");
            setLoaderFive(false);
            return;
          }
        } else {
          alert("Channel does not exist!");
          setLoaderFive(false);
          return;
        }
      });
  }
  //*--------------------(HANDLE REFRESHING A CHANNEL) -------------------*//
  async function handleRefreshChannel(channel, db, currentUserEmail) {
    setLoaderSix(true);
    const btnTwo = document.querySelector(".buttonTwo");
    btnTwo.classList.add("buttonTwo--loading");
    const respondedEmailsList = channel.respondedEmails;
    const hasResponded = respondedEmailsList.indexOf(currentUserEmail) > -1;

    if (hasResponded === false) {
      alert(
        "You have yet to respond, refresh is to be used only if you have synced to the channel before but have new changes made to your Google Calendar!"
      );
      btnTwo.classList.remove("buttonTwo--loading");
      setLoaderSix(false);
      return;
    }
    //1.1 Decrement and delete documents
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

      for (
        var hourIndex = 0;
        hourIndex < channelHoursForThatDate.length;
        hourIndex++
      ) {
        if (userBusyHoursForThatDate[hourIndex] > 0) {
          channelHoursForThatDate[hourIndex]--;
        }
      }

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
    //1.2 Obtain the latest events from Google and Obtain the Latest Busy Dates
    gapi.auth2.getAuthInstance().then(() => {
      gapi.client.calendar.events
        .list({
          calendarId: "primary",
          timeMin: channel.start_date + "T00:00:00+08:00",
          timeMax: channel.end_date + "T23:59:00+08:00", //might need to one day here
          showDeleted: false,
          singleEvents: true,
          maxResults: 100,
          orderBy: "startTime",
        })
        .then((response) => {
          const events = response.result.items;
          return Promise.resolve(
            obtainBusyDates(events, db, currentUserEmail, channel)
          )
            .then(async () => {
              //1.3 Update channel with increment
              var indexTwo = 0;
              for (indexTwo = 0; indexTwo < dateRange.length; indexTwo++) {
                let date = dateRange[indexTwo];
                let channelHoursForThatDateTwo = [];
                let userBusyHoursForThatDateTwo = [];

                //Retrieves the busyHours of that Date Document of that CHANNEL
                await db
                  .collection("channelsCreatedByUser")
                  .doc(channel.documentID)
                  .collection("busyDatesWithTimeBlocks")
                  .doc(date)
                  .get()
                  .then((doc) => {
                    channelHoursForThatDateTwo = doc.data().busyHours;
                  });

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
                      userBusyHoursForThatDateTwo = doc.data().hours;
                    } else {
                      //console.log("User don't have busy hours for that date, giving blank array instead: ");
                      userBusyHoursForThatDateTwo = new Array(24).fill(0);
                    }
                  });

                for (
                  var hourIndexTwo = 0;
                  hourIndexTwo < channelHoursForThatDateTwo.length;
                  hourIndexTwo++
                ) {
                  if (userBusyHoursForThatDateTwo[hourIndexTwo] > 0) {
                    channelHoursForThatDateTwo[hourIndexTwo]++;
                  }
                }

                await db
                  .collection("channelsCreatedByUser")
                  .doc(channel.documentID)
                  .collection("busyDatesWithTimeBlocks")
                  .doc(date)
                  .update({
                    busyHours: channelHoursForThatDateTwo,
                  });
              }
              //
            })
            .then(async () => {
              await findOptimalSlots(channel, db);
              btnTwo.classList.remove("buttonTwo--loading");
              setLoaderSix(false);
            });
        });
    });
  }
  //*--------------------(HANDLING ADDING OF INVITEES FUNCTION) [HOST] MODIFY CHANNEL----*/
  async function handleAddingOfInvitee(e) {
    e.preventDefault();
    e.stopPropagation();
    setLoaderThree(true);
    setErrorThree("");
    setSuccessThree("");
    let channelID = channelIDForModifyRef.current.value;
    let userEmail = emailForModifyRef.current.value;
    let invitedEmailsList = [];
    let pendingEmailsList = [];
    let respondedEmailsList = [];
    let hostEmail;

    //Validation of email
    let emails = [userEmail];
    let validation = [true, ""];
    try {
      await validateEmails(emails).then((result) => {
        validation[0] = result[0];
        validation[1] = result[1];
      });

      if (validation[0] === false) {
        setErrorThree(validation[1] + " is not a user of RSVP+!");
        setLoaderThree(false);
        return;
      }
    } catch (err) {
      setErrorThree("Field cannot be blank!");
      setLoaderThree(false);
      return;
    }
    //End of validation

    if (userEmail === currentUserEmail) {
      setErrorThree("You can't add yourself!");
      setLoaderThree(false);
      return;
    }

    try {
      await db
        .collection("channelsCreatedByUser")
        .doc(channelID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            hostEmail = doc.data().hostEmail;
          } else {
            hostEmail = "null";
          }
        });
    } catch (err) {
      setErrorThree("Field cannot be blank!");
      setLoaderThree(false);
      return;
    }

    if (hostEmail === currentUserEmail) {
      try {
        await db
          .collection("channelsCreatedByUser")
          .doc(channelID)
          .get()
          .then((doc) => {
            if (doc.exists) {
              invitedEmailsList = doc.data().invitedEmails;
              pendingEmailsList = doc.data().pendingEmails;
              respondedEmailsList = doc.data().respondedEmails;
              if (invitedEmailsList.indexOf(userEmail) > -1) {
                setErrorThree(
                  "Failed to add user, user is already in the channel!"
                );
                setLoaderThree(false);
                return;
              } else if (
                respondedEmailsList.length === invitedEmailsList.length
              ) {
                setErrorThree(
                  "Failed to add user, optimal time slots have already been determined for the channel!"
                );
                setLoaderThree(false);
                return;
              } else {
                invitedEmailsList.push(userEmail);
                pendingEmailsList.push(userEmail);
                db.collection("channelsCreatedByUser").doc(channelID).update({
                  invitedEmails: invitedEmailsList, //List of Invited Users
                  pendingEmails: pendingEmailsList, //List of Pending Users
                });
                setSuccessThree("Successfully added user to channel!");
                setLoaderThree(false);
                return;
              }
            } else {
              setErrorThree("Channel does not exist!");
              setLoaderThree(false);
              return;
            }
          });
      } catch (err) {
        setErrorThree("Field cannot be blank!");
        setLoaderThree(false);
        return;
      }
    } else {
      setErrorThree("You are not host of the channel!");
      setLoaderThree(false);
      return;
    }
  }
  //*--------------------(HANDLING REMOVAL OF INVITEES FUNCTION) [HOST] MODIFY CHANNEL----*/
  async function handleRemovalOfInvitee(e) {
    e.preventDefault();
    e.stopPropagation();
    setLoaderThree(true);
    setErrorThree("");
    setSuccessThree("");
    let channelID = channelIDForModifyRef.current.value;
    let userEmail = emailForModifyRef.current.value;
    let invitedEmailsList = [];
    let pendingEmailsList = [];
    let respondedEmailsList = [];
    let hostEmail;
    let channel;

    //Validation of email
    let emails = [userEmail];
    let validation = [true, ""];

    try {
      await validateEmails(emails).then((result) => {
        validation[0] = result[0];
        validation[1] = result[1];
      });

      if (validation[0] === false) {
        setErrorThree(validation[1] + " is not a user of RSVP+!");
        setLoaderThree(false);
        return;
      }
    } catch (err) {
      setErrorThree("Field cannot be blank!");
      setLoaderThree(false);
      return;
    }
    //End of validation
    try {
      await db
        .collection("channelsCreatedByUser")
        .doc(channelID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            hostEmail = doc.data().hostEmail;
          } else {
            hostEmail = "null";
          }
        });
    } catch (err) {
      setErrorThree("Field cannot be blank!");
      setLoaderThree(false);
      return;
    }

    if (hostEmail === currentUserEmail) {
      try {
        await db
          .collection("channelsCreatedByUser")
          .doc(channelID)
          .get()
          .then((doc) => {
            if (doc.exists) {
              if (userEmail === currentUserEmail) {
                setErrorThree(
                  "You can't remove yourself! Please delete the channel if you are not organizing anymore."
                );
                setLoaderThree(false);
                return;
              }
              channel = doc.data();
              invitedEmailsList = doc.data().invitedEmails;
              pendingEmailsList = doc.data().pendingEmails;
              respondedEmailsList = doc.data().respondedEmails;
              if (respondedEmailsList.indexOf(userEmail) > -1) {
                decrementDates(channel, db, userEmail);

                invitedEmailsList = invitedEmailsList.filter(
                  (email) => email !== userEmail
                );

                respondedEmailsList = respondedEmailsList.filter(
                  (email) => email !== userEmail
                );

                db.collection("channelsCreatedByUser").doc(channelID).update({
                  invitedEmails: invitedEmailsList, //List of Invited Users
                  respondedEmails: respondedEmailsList,
                });

                setSuccessThree("Successfully removed user!");
                setLoaderThree(false);
                return;
              } else {
                if (pendingEmailsList.indexOf(userEmail) > -1) {
                  invitedEmailsList = invitedEmailsList.filter(
                    (email) => email !== userEmail
                  );
                  pendingEmailsList = pendingEmailsList.filter(
                    (email) => email !== userEmail
                  );
                  db.collection("channelsCreatedByUser").doc(channelID).update({
                    invitedEmails: invitedEmailsList, //List of Invited Users
                    pendingEmails: pendingEmailsList, //List of Pending Users
                  });
                  if (respondedEmailsList.length === invitedEmailsList.length) {
                    findOptimalSlots(channel, db);
                  }
                  setSuccessThree("Successfully removed user from channel!");
                  setLoaderThree(false);
                  return;
                }
              }
            } else {
              setErrorThree("Channel does not exist!");
              setLoaderThree(false);
              return;
            }
          });
      } catch (err) {
        setErrorThree("Field cannot be blank!");
        setLoaderThree(false);
        return;
      }
    } else {
      setErrorThree("You are not host of the channel!");
      setLoaderThree(false);
      return;
    }
  }
  //*-------------------------------------------------------------------------------------------*/

  return (
    <div>
      <NavigationBar />
      <div
        className="p-3 mb-2 bg-dark text-white"
        style={{ minHeight: "100vh" }}
      >
        <h2 className="page-header text-center mb-4">CHANNELS</h2>
        <Container fluid>
          <Row className="d-flex align-items-center justify-content-center mb-4">
            {successFour && (
              <div className="d-flex align-items-center justify-content-center w-50">
                <Alert variant="success" className="text-center">
                  {successFour}
                </Alert>
              </div>
            )}
            {errorFour && (
              <div className="d-flex align-items-center justify-content-center w-50">
                <Alert variant="danger" className="text-center">
                  {errorFour}
                </Alert>
              </div>
            )}
            <div>
              <Col className="d-flex align-items-center justify-content-center">
                <Form.Control
                  className="mr-3"
                  style={{ width: 200, height: 30 }}
                  required
                  type="channelID"
                  ref={channelIDForJoinRef}
                  placeholder="Channel ID"
                />
                <Button
                  style={{ width: 60, height: 30 }}
                  variant="danger"
                  className="d-flex align-items-center justify-content-center"
                  disabled={loadingFour}
                  onClick={handleJoiningChannel}
                >
                  Join
                </Button>
              </Col>
            </div>
          </Row>
          <Row className="d-flex align-items-center justify-content-center mb-4">
            <button
              className="d-flex align-items-center justify-content-center fetch-events-button mr-4 mb-2"
              style={{ width: 250, height: 30 }}
              onClick={() => setButtonPopup(true)}
            >
              CREATE A CHANNEL
            </button>
            <button
              className="d-flex align-items-center justify-content-center fetch-events-button mr-4 mb-2"
              style={{ width: 250, height: 30 }}
              onClick={() => setButtonPopupTwo(true)}
            >
              DELETE A CHANNEL
            </button>
            <button
              className="d-flex align-items-center justify-content-center fetch-events-button mr-4 mb-2"
              style={{ width: 250, height: 30 }}
              onClick={() => setButtonPopupThree(true)}
            >
              MODIFY INVITES
            </button>
          </Row>
          <Row>
            {channels.map((channel, index) => (
              //Rendered Channels
              <div
                key={index}
                className="d-flex align-items-center justify-content-center mb-4"
              >
                <Card style={{ width: 860 }}>
                  <Card.Header className="d-flex justify-content-center">
                    <Card.Title>
                      <h2>{channel.name} </h2>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <div className="details">
                      <Row>
                        <Col xs={12} md={8}>
                          <Card.Text>
                            Description:{" "}
                            {channel.description != null
                              ? channel.description
                              : "N/A"}
                          </Card.Text>
                          <Card.Text>
                            Location:{" "}
                            {channel.location != null
                              ? channel.location
                              : "N/A"}
                          </Card.Text>
                          <Card.Text>
                            Date Range:{" "}
                            <Badge pill variant="dark">
                              {" "}
                              {channel.start_date}
                            </Badge>
                            {"  "}to{"  "}
                            <Badge pill variant="dark">
                              {channel.end_date}
                            </Badge>
                            {/*console.log(event.start.date)*/}
                          </Card.Text>
                          <Card.Text>
                            Timeslots Range:{" "}
                            <Badge pill variant="dark">
                              {timeToConvert(channel.startTimeToLookForIndex)} —{" "}
                              {timeToConvert(channel.endTimeToLookForIndex)}
                            </Badge>
                          </Card.Text>
                          <Card.Text>
                            <button
                              type="button"
                              className="button mt-1"
                              style={{ width: 250, height: 30 }}
                              disabled={loading}
                              onClick={() => handleSecondClick(channel)}
                            >
                              <span className="button__text">
                                Agree to Sync Calendar Data
                              </span>
                            </button>

                            <button
                              className="buttonTwo mt-2"
                              style={{ width: 70, height: 30 }}
                              disabled={loadingSix}
                              onClick={() =>
                                handleRefreshChannel(
                                  channel,
                                  db,
                                  currentUserEmail
                                )
                              }
                            >
                              <span className="buttonTwo__text">
                                <small>Refresh</small>
                              </span>
                            </button>
                          </Card.Text>
                        </Col>
                        <Col xs={6} md={4}>
                          <Card.Text>
                            Invited List:{" "}
                            {displayUsersList(channel.invitedEmails)}
                          </Card.Text>
                          <Card.Text>
                            Responded:
                            {displayUsersList(channel.respondedEmails)}
                          </Card.Text>
                          <Card.Text>
                            Pending:{displayPendingList(channel.pendingEmails)}
                          </Card.Text>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        {" "}
                        <Card.Text>
                          <strong>Available Timeslots: </strong>
                          {displayUsersList(channel.decidedOutcome)}
                        </Card.Text>
                      </Row>
                      <div className="mt-2 float-right">
                        <Row className="float-right">
                          <Card.Text className="font-italic">
                            <small>Channel ID: {channel.documentID}</small>
                          </Card.Text>
                        </Row>
                        <br></br>
                        <Row>
                          <Card.Text className="font-italic">
                            <small>Host: {channel.hostEmail}</small>
                          </Card.Text>
                        </Row>
                        <Row className="float-right mt-2">
                          <button
                            className="leave-button mt-2"
                            style={{ width: 63, height: 30 }}
                            disabled={loadingFive}
                            onClick={() => handleLeavingChannel(channel)}
                          >
                            <small>Leave</small>
                          </button>
                        </Row>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              //End of Rendered Channels
            ))}
          </Row>
        </Container>
      </div>

      {/*Start of Pop up one - Creating a channel  */}
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <Card.Body>
          <h3 className="text-center mb-4 text-white">
            Create a channel for your event!
          </h3>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <form className="text-white" onSubmit={handleSubmit}>
            <Form.Group id="name">
              <Form.Label>Name of Event</Form.Label>
              <Form.Control
                required
                type="name"
                ref={nameRef}
                placeholder="eg. Study Session"
              />
            </Form.Group>
            <br></br>
            <Form.Group id="description">
              <Form.Label>Description of Event</Form.Label>
              <Form.Control
                required
                type="description"
                ref={descriptionRef}
                placeholder="eg. Study meet with Rebecca"
              />
            </Form.Group>
            <br></br>
            <Form.Group id="location">
              <Form.Label>Location of Event</Form.Label>
              <Form.Control
                required
                type="location"
                ref={locationRef}
                placeholder="eg. NUS Central Library 4th floor"
              />
            </Form.Group>
            <br></br>
            <Form.Group id="startDateEndDate">
              <Form.Label className="mr-3">Date Range: </Form.Label>
              <DatePicker
                className="date-picker"
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                placeholderText="eg. 07/08/2021 - 07/12/2021"
                required
                onChange={(update) => {
                  setDateRangeForPicker(update);
                }}
                isClearable={true}
              />
            </Form.Group>
            <Form.Group id="idealStartOfTimeRange">
              <Form.Label className="mr-3">
                Start Time of Time Range:
              </Form.Label>
              <DatePicker
                className="time-picker"
                selected={startOfTime}
                onChange={(date) => setStartOfTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            </Form.Group>
            <Form.Group id="idealEndOfTimeRange">
              <Form.Label className="mr-3">End Time of Time Range:</Form.Label>
              <DatePicker
                className="time-picker ml-2"
                selected={endOfTime}
                onChange={(date) => setEndOfTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            </Form.Group>
            <small className="create-channel-text">
              Specify the dates and possible timings you are looking at
            </small>
            <p>
              {" "}
              <small className="create-channel-text">
                {" "}
                (eg. Finding avail 2PM - 4PM slots for the dates in the range!)
              </small>
            </p>

            <Form.Group id="emailInvite" className="mt-4">
              <Form.Label>
                Number of People to Invite: 1 - 9 (Excluding yourself!)
              </Form.Label>
              <InviteList />
            </Form.Group>
            <br></br>
            <Button
              variant="danger"
              disabled={loading}
              className="w-100"
              type="submit"
            >
              Create channel
            </Button>
          </form>
        </Card.Body>
      </Popup>
      {/*End of Pop up */}

      {/*Start of Pop up Two - Deleting a channel*/}
      <Popup trigger={buttonPopupTwo} setTrigger={setButtonPopupTwo}>
        <Card.Body>
          <h3 className="text-center mb-4 text-white">Delete a channel!</h3>
          {successTwo && <Alert variant="success">{successTwo}</Alert>}
          {errorTwo && <Alert variant="danger">{errorTwo}</Alert>}
          <form className="text-white" onSubmit={handleDeleteChannel}>
            <Form.Group id="channelID">
              <Form.Label>Channel ID</Form.Label>
              <Form.Control required type="channelID" ref={channelIDRef} />
            </Form.Group>
            <small>
              Only works if the Channel ID exists and you are the host.
            </small>
            <br></br>
            <Button
              variant="danger"
              disabled={loadingTwo}
              className="w-100 mt-3"
              type="submit"
            >
              Delete channel
            </Button>
          </form>
        </Card.Body>
      </Popup>
      {/*End of Pop up Two*/}

      {/*Start of Pop up Three - Modifying a channel*/}
      <Popup trigger={buttonPopupThree} setTrigger={setButtonPopupThree}>
        <Card.Body>
          <h3 className="text-center mb-4 text-white">
            Modify Invites (Add or Remove)
          </h3>
          {successThree && <Alert variant="success">{successThree}</Alert>}
          {errorThree && <Alert variant="danger">{errorThree}</Alert>}
          <form className="text-white">
            <Form.Group id="channelID">
              <Form.Label>Channel ID</Form.Label>
              <Form.Control
                required
                type="channelID"
                ref={channelIDForModifyRef}
              />
            </Form.Group>
            <small>Only works if you're host of that channel.</small>
            <br></br>
            <Form.Group id="user">
              <Form.Label className="mt-3">User's Email</Form.Label>
              <Form.Control required type="email" ref={emailForModifyRef} />
            </Form.Group>
            <Row>
              <Col>
                {" "}
                <Button
                  variant="danger"
                  disabled={loadingThree}
                  className="w-100 mt-3"
                  onClick={handleAddingOfInvitee}
                >
                  Add User
                </Button>
              </Col>
              <Col>
                {" "}
                <Button
                  variant="danger"
                  disabled={loadingThree}
                  className="w-100 mt-3"
                  onClick={handleRemovalOfInvitee}
                >
                  Remove User
                </Button>
              </Col>
            </Row>
          </form>
        </Card.Body>
      </Popup>
      {/*End of Pop up Three*/}
    </div>
  );
}
