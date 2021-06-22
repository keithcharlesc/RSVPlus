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

export default function Channels() {
  const nameRef = useRef();
  const descriptionRef = useRef();
  const locationRef = useRef();

  const db = firebase.firestore();
  //console.log(db)
  const [loading, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const hostName = firebase.auth().currentUser?.displayName;
  const currentUserEmail = firebase.auth().currentUser?.email;

  const [dateRangeForPicker, setDateRangeForPicker] = useState([null, null]);
  const [startDate, endDate] = dateRangeForPicker;

  //----------------- Pop up submission -----------------//
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoader(true);
    setError("");
    setSuccess("");
    const emails = [currentUserEmail, ...findAll()];
    console.log(emails);
    const dates = dateRange(startDate, endDate);

    db.collection("channelsCreatedByUser")
      //.doc(currentUserEmail)
      //.collection("channels")
      .add({
        host: hostName, //User who created Channel
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
        console.log(
          "Channel requisite information has been added to firestore"
        );
      })
      .catch((error) => {
        console.log(error);
        setError("Your channel has not been created, please try again!");
        setLoader(false);
      });
  };
  //End of Pop up submission
  //-------------------------------------------//

  const [buttonPopup, setButtonPopup] = useState(false);

  //-------------------------------------------//
  const [channels, setChannels] = useState([]);
  const [loadingx, setLoading] = useState(false);

  //------------------------REF SNAPSHOT----------------------//
  const ref = firebase.firestore().collection("channelsCreatedByUser");
  //.doc(currentUserEmail) //can't use currentUserEmail here
  //.collection("channels");

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

  //------------------------------------------*** MAIN:[Agree to Sync Implementation] ***------------------------------------------//
  async function handleAgreeToSync(channel) {
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
          console.log("Channel Hours for " + date);
          channelHoursForThatDate = doc.data().busyHours;
        });
      console.log(channelHoursForThatDate);

      //Retrieves the busyHours of that Date Document of that USER
      await db
        .collection("busyDates")
        .doc(currentUserEmail)
        .collection("busyDatesWithTimeBlocks")
        .doc(date)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("UserBusyHours for " + date);
            userBusyHoursForThatDate = doc.data().hours;
          } else {
            console.log(
              "User don't have busy hours for that date, giving blank array instead: "
            );
            userBusyHoursForThatDate = new Array(24).fill(0);
          }
        });
      console.log(userBusyHoursForThatDate);

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

      console.log("------For Date: " + date + "-------");
      console.log("New Updated channelHours is:");
      console.log(channelHoursForThatDate);
      console.log("-----------------------------------");

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

    ///*
    //If everyone has fully responded, give the most optimal date and time below:
    //let startTime = 8;
    //let endTime = 20;

    let latestUpdatedTotalOptimalDates;
    await db
      .collection("channelsCreatedByUser")
      .doc(channel.documentID)
      .get()
      .then((doc) => {
        latestUpdatedTotalOptimalDates = doc.data().decidedOutcome;
      });

    //console.log("Latest optimal dates: " + latestUpdatedTotalOptimalDates);

    if (respondedEmails.length === invitedEmails.length) {
      var dateIndex;
      for (dateIndex = 0; dateIndex < dateRange.length; dateIndex++) {
        let date = dateRange[dateIndex];
        let busyHoursForThatDateOfChannel;
        await db
          .collection("channelsCreatedByUser")
          .doc(channel.documentID)
          .collection("busyDatesWithTimeBlocks")
          .doc(date)
          .get()
          .then((doc) => {
            //console.log(doc.data().busyHours);
            //console.log("Channel Hours for " + date);
            busyHoursForThatDateOfChannel = doc.data().busyHours.toString();
          });

        latestUpdatedTotalOptimalDates[dateIndex] =
          latestUpdatedTotalOptimalDates[dateIndex].concat(
            busyHoursForThatDateOfChannel
          );
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
    //*/
  }
  // ------------------------------------------*** End of Sync Implementation ***---------------------------------------//

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

  useEffect(() => {
    getChannels();
  }, []);

  if (loadingx) {
    return (
      <div className="bg-dark" style={{ minHeight: "100vh" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <h2 className="page-header text-center mb-4">CHANNELS</h2>
        <Container fluid>
          <Row className="d-flex align-items-center justify-content-center mb-4">
            <Button
              className="create-event-button"
              style={{ width: 100, height: 60 }}
              onClick={() => setButtonPopup(true)}
            >
              {""}
              Create an Event!{" "}
            </Button>
          </Row>
          <Row>
            <Container style={{ minHeight: "100vh" }}>
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
                              Start Date:{" "}
                              <Badge pill variant="dark">
                                {" "}
                                {channel.start_date}
                              </Badge>
                              {/*console.log(event.start.date)*/}
                            </Card.Text>
                            <Card.Text>
                              End Date:{" "}
                              <Badge pill variant="dark">
                                {channel.end_date}
                              </Badge>
                            </Card.Text>
                            <Card.Text>
                              <Button
                                variant="danger"
                                style={{ width: 260, height: 40 }}
                                onClick={() => handleAgreeToSync(channel)}
                              >
                                Agree to Sync Calendar Data
                              </Button>
                            </Card.Text>
                            <Card.Text>
                              Decided Outcome:{" "}
                              {displayUsersList(channel.decidedOutcome)}
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
                              Pending:{displayUsersList(channel.pendingEmails)}
                            </Card.Text>
                          </Col>
                        </Row>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                //End of Rendered Channels
              ))}

              {/*Pop up */}
              <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <Card.Body>
                  <h3 className="text-center mb-4">
                    Create a channel for your event!
                  </h3>
                  {success && <Alert variant="success">{success}</Alert>}
                  {error && <Alert variant="danger">{error}</Alert>}
                  <form className="text-white" onSubmit={handleSubmit}>
                    <Form.Group id="name">
                      <Form.Label>Name of event</Form.Label>
                      <Form.Control
                        required
                        type="name"
                        ref={nameRef}
                        placeholder="eg. Study Session"
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group id="description">
                      <Form.Label>Description of event</Form.Label>
                      <Form.Control
                        required
                        type="description"
                        ref={descriptionRef}
                        placeholder="eg. Study meet with Rebecca"
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group id="location">
                      <Form.Label>Location of event</Form.Label>
                      <Form.Control
                        required
                        type="location"
                        ref={locationRef}
                        placeholder="eg. NUS Central Library 4th floor"
                      />
                    </Form.Group>
                    <br></br>

                    <Form.Group id="startDateEndDate">
                      <Form.Label className="mr-3">
                        Start Date & End Date:{" "}
                      </Form.Label>
                      <DatePicker
                        className="date-picker"
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        placeholderText="eg. 06/24/2021 - 06/25/2021"
                        required
                        onChange={(update) => {
                          setDateRangeForPicker(update);
                        }}
                        isClearable={true}
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group id="emailInvite">
                      <Form.Label>Number of People to Invite: (1-9)</Form.Label>
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
            </Container>
          </Row>
        </Container>
      </div>
    </div>
  );
}
