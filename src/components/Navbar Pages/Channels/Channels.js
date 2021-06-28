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

/*----- GAPI------*/
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
/*---------------*/

export default function Channels() {
  const nameRef = useRef();
  const descriptionRef = useRef();
  const locationRef = useRef();
  const channelIDRef = useRef();

  const db = firebase.firestore();
  //console.log(db)
  const [loading, setLoader] = useState(false);
  const [loadingTwo, setLoaderTwo] = useState(false);
  const [error, setError] = useState("");
  const [errorTwo, setErrorTwo] = useState("");
  const [success, setSuccess] = useState("");
  const [successTwo, setSuccessTwo] = useState("");
  const hostName = firebase.auth().currentUser?.displayName;
  const currentUserEmail = firebase.auth().currentUser?.email;

  const [dateRangeForPicker, setDateRangeForPicker] = useState([null, null]);
  const [startDate, endDate] = dateRangeForPicker;
  const [startOfTime, setStartOfTime] = useState(new Date());
  const [endOfTime, setEndOfTime] = useState(new Date());

  /* -------------- GET EVENTS (BUSY DATES AND TIMINGS) ------------*/
  //const [loading, setLoader] = useState(false);
  //const currentUserEmail = firebase.auth().currentUser?.email;
  //const db = firebase.firestore();

  async function handleSecondClick(channel) {
    setLoader(true);
    const btn = document.querySelector(".button");
    btn.classList.add("button--loading");

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
          //console.log("Google Events Fetched: ", events);
          //let busyDates = [];
          //Prevents Button Spamming
          return Promise.resolve(
            obtainBusyDates(events, db, currentUserEmail)
          ).then(() => {
            handleAgreeToSync(channel, btn);
          });
        });
    });
  }
  /*---------------------------------------------------*/

  //----------------- Pop up submission -----------------//
  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    setLoader(true);
    setError("");
    setSuccess("");
    const emails = [currentUserEmail, ...findAll()];
    //console.log(emails);
    let validation = [true, ""];
    await validateEmails(emails).then((result) => {
      //console.log("value from function:" + x);
      //console.log(result);
      validation[0] = result[0];
      validation[1] = result[1];
    });
    /* let wrongEmail;
    await getWrongEmail(emails).then((doesNotExist) => {
      wrongEmail = doesNotExist;
    });*/
    //console.log("validation:" + validation);
    if (validation[0] === false) {
      setError(validation[1] + " is not a user of RSVP+!");
      setLoader(false);
      return;
    }
    //console.log("emails validated");

    //console.log("Start Date: ");
    //console.log(startDate.toLocaleDateString("en-CA"));
    //console.log("End Date: ");
    //console.log(endDate.toLocaleDateString("en-CA"));

    const dates = dateRange(
      startDate.toLocaleDateString("en-CA"),
      endDate.toLocaleDateString("en-CA")
    );

    //console.log(dates);

    //Checks whether input for End Time Slot (Range) is later than Start Time Slot
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
    //

    db.collection("channelsCreatedByUser")
      //.doc(currentUserEmail)
      //.collection("channels")
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

        db.collection("channelsCreatedByUser")
          //.doc(currentUserEmail)
          // .collection("channels")
          .doc(docRef.id)
          .update({
            decidedOutcome: totalOptimalDateStrings, //Adding documentID to document (Purpose: to update)
          });

        setLoader(false);
        setSuccess("Your channel has been created");
        //console.log("Channel requisite information has been added to firestore");
      })
      .catch((error) => {
        //console.log(error);
        setError("Your channel has not been created, please try again!");
        setLoader(false);
      });
  }
  //End of Pop up submission
  //-------------------------------------------//

  const [buttonPopup, setButtonPopup] = useState(false);
  const [buttonPopupTwo, setButtonPopupTwo] = useState(false);

  //-------------------------------------------//
  const [channels, setChannels] = useState([]);
  const [loadingx, setLoading] = useState(false);

  //---------------------Obtaining emailAddresses by form input fields---------------------//
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

  //---------------------Display Invited List---------------------//
  function displayUsersList(arr) {
    const userList = arr.map((email, index) => <li key={index}>{email}</li>);
    return userList;
  }

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
        .collection("busyDates")
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
    //----------------End of For Loop Algo: to update Dates------------

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

    if (respondedEmails.length === invitedEmails.length) {
      var dateIndex;
      for (dateIndex = 0; dateIndex < dateRange.length; dateIndex++) {
        let date = dateRange[dateIndex];
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
            latestUpdatedTotalOptimalDates[dateIndex].concat(
              "No timeslots found!"
            );
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
      setLoader(false);
      btn.classList.remove("button--loading");
    }
    //*/
  }
  // ------------------------------------------*** End of Sync Implementation ***---------------------------------------//

  //------Combining fetch user data and updating channel data ----//
  /*
  async function syncCombined(channel) {
    setLoader(true);
    const btn = document.querySelector(".button");
    btn.classList.add("button--loading");
    /*
    return Promise.resolve(handleSecondClick(channel)).then(() => {
      return Promise.resolve(handleAgreeToSync(channel)).then(() => {
        setLoader(false);
        btn.classList.remove("button--loading");
      });
    });
    handleSecondClick(channel);
    handleAgreeToSync(channel);

    setLoader(false);
    btn.classList.remove("button--loading");
  }
  */

  //Convert 24H into 9AM
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

  /*---------------------------------------------------*/
  //Get minutes from HH:MM (hours and minutes 24 hr form)
  function getMinutes(time) {
    let str = time;
    let arr = str.split(":");
    let minutes = +arr[0] * 60 + +arr[1];
    //console.log(minutes);
    return minutes;
  }
  /*---------------------------------------------------*/

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

      //console.log(emailCheck);

      if (arrayValues[0] === false) {
        break;
      }
    }
    //console.log("emailcheck : " + emailCheck);

    return arrayValues;
  }

  /*---------------------------------------------------*/

  useEffect(() => {
    //------------------------REF SNAPSHOT----------------------//
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
  //*-----------------------Function for Delete Channel Pop up----*/

  async function handleSubmitTwo(e) {
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
        } else {
          hostEmail = "null";
        }
      });
    //console.log(channelID);
    //console.log(hostEmail);
    if (hostEmail === "null") {
      setErrorTwo("Channel does not exist!");
      setLoaderTwo(false);
      return;
    } else if (currentUserEmail === hostEmail) {
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
            {/*<button
              type="button"
              className="d-flex align-items-center justify-content-center button mr-4"
              style={{ width: 250, height: 30 }}
              onClick={handleSecondClick}
              disabled={loading}
            >
              <span className="button__text">FETCH LATEST DATA</span>
            </button>*/}
            <button
              className="d-flex align-items-center justify-content-center fetch-events-button mr-4"
              style={{ width: 250, height: 30 }}
              onClick={() => setButtonPopup(true)}
            >
              CREATE A CHANNEL
            </button>
            <button
              className="d-flex align-items-center justify-content-center fetch-events-button"
              style={{ width: 250, height: 30 }}
              onClick={() => setButtonPopupTwo(true)}
            >
              DELETE A CHANNEL
            </button>
          </Row>
          <Row>
            {channels.map((channel, index) => (
              //Rendered Channels
              <div
                key={index}
                className="d-flex align-items-center justify-content-center mb-4"
              >
                <Card style={{ width: 800 }}>
                  <Card.Header className="d-flex justify-content-center">
                    <Card.Title>
                      <h2>{channel.name}</h2>
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
                              className="button"
                              style={{ width: 250, height: 30 }}
                              disabled={loading}
                              onClick={() => handleSecondClick(channel)}
                            >
                              <span className="button__text">
                                Agree to Sync Calendar Data
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
                        <Row className="float-right">
                          <Card.Text className="font-italic">
                            <small>Host: {channel.hostEmail}</small>
                          </Card.Text>
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

      {/*Pop up */}
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

      {/*Start of Pop up Two*/}
      <Popup trigger={buttonPopupTwo} setTrigger={setButtonPopupTwo}>
        <Card.Body>
          <h3 className="text-center mb-4 text-white">Delete a channel!</h3>
          {successTwo && <Alert variant="success">{successTwo}</Alert>}
          {errorTwo && <Alert variant="danger">{errorTwo}</Alert>}
          <form className="text-white" onSubmit={handleSubmitTwo}>
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
    </div>
  );
}
