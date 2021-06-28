import React, { useState } from "react";
import { Container, Card, Row, Badge } from "react-bootstrap";
import NavigationBar from "../NavigationBar/NavigationBar";
import "./Dashboard.css";

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

export default function Dashboard() {
  /* -------------- RETRIEVING AND DISPLAY EVENTS ------------*/
  const [loading, setLoader] = useState(false);
  const [events, setEvents] = useState(null);

  const handleSecondClick = () => {
    setLoader(true);

    const btn = document.querySelector(".button");
    btn.classList.add("button--loading");

    gapi.auth2.getAuthInstance().then(() => {
      gapi.client.calendar.events
        .list({
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 20,
          orderBy: "startTime",
        })
        .then((response) => {
          const events = response.result.items;
          //console.log("Google Events Fetched: ", events);
          setEvents(events);
          btn.classList.remove("button--loading");
          setLoader(false);

          //let busyDates = [];
          //Prevents Button Spamming

          /*
          if (events.length > 0) {
            busyDates = obtainBusyDates(events, db, currentUserEmail);
          }
          console.log(busyDates);
          */
          //const uid = firebase.auth().currentUser?.uid;
          //console.log("uid: " + uid);

          /*-- Upload to Firestore --*/

          //LATEST CHANGE BELOW
          /*
          db.collection("calendarEvents")
            .doc(currentUserEmail)
            .set({
              events: events,
            })
            .then(() => {
              console.log("Google events successfully stored!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });

          db.collection("busyDates")
            .doc(currentUserEmail)
            .set({
              dates: busyDates,
            })
            .then(() => {
              console.log("Busy dates successfully stored!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            }); */
          //END OF CHANGE
          /*----------*/

          /*-- Reading Data from Firestore--
          var docRef = db.collection("calendarEvents").doc(uid);

          docRef
            .get()
            .then((doc) => {
              if (doc.exists) {
                //console.log("Document data:", doc.data());
                //console.log(doc.data().events);
                //setEvents(doc.data().events);
                //console.log(doc.data().events[0]);
                console.log("Document read!");
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            })
            .catch((error) => {
              console.log("Error getting document:", error);
            });

          ---------------------------------*/
        });
    });
  };
  /*---------------------------------------------------*/
  function tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }

  /*---------------------------------------------------*/
  return (
    <>
      <NavigationBar />
      <div
        className="p-3 mb-2 bg-dark text-white"
        style={{ minHeight: "100vh" }}
      >
        <h2 className="page-header text-center mb-4">DASHBOARD</h2>
        <Container fluid>
          <Row className="d-flex align-items-center justify-content-center mb-4">
            {" "}
            <button
              className="d-flex align-items-center justify-content-center button"
              style={{ width: 250, height: 30 }}
              onClick={handleSecondClick}
              disabled={loading}
            >
              <span className="button__text">DISPLAY UPCOMING EVENTS</span>
            </button>
          </Row>
          <Row>
            <Container className="d-flex justify-content-center">
              {/* FETCH EVENT FORM */}
              <div className="events">
                {events &&
                  events.map((event, index) => {
                    return (
                      <Card
                        className="cardDesign mb-3"
                        style={{ maxWidth: "23rem" }}
                        key={index}
                      >
                        <div className="event">
                          <Card.Header className="d-flex justify-content-center">
                            <Card.Title>
                              {event.summary != null ? event.summary : "N/A"}
                            </Card.Title>
                          </Card.Header>
                          <Card.Body>
                            <div className="details">
                              <Card.Text>
                                Description:{" "}
                                {event.description != null
                                  ? event.description
                                  : "N/A"}
                              </Card.Text>
                              <Card.Text>
                                Location:{" "}
                                {event.location != null
                                  ? event.location
                                  : "N/A"}
                              </Card.Text>
                              <Card.Text>
                                Start Date:{" "}
                                <Badge pill variant="dark">
                                  {" "}
                                  {event.start.date != null
                                    ? event.start.date
                                    : event.start.dateTime.slice(0, 10) +
                                      " (" +
                                      tConvert(
                                        event.start.dateTime.slice(11, 16)
                                      ) +
                                      ")"}
                                </Badge>
                                {/*console.log(event.start.date)*/}
                              </Card.Text>
                              <Card.Text>
                                End Date:{" "}
                                <Badge pill variant="dark">
                                  {event.end.date != null
                                    ? event.end.date //-1 for day might need to implement since full day event = day itself and day after
                                    : event.end.dateTime.slice(0, 10) +
                                      " (" +
                                      tConvert(
                                        event.end.dateTime.slice(11, 16)
                                      ) +
                                      ")"}
                                </Badge>
                              </Card.Text>
                            </div>
                          </Card.Body>
                        </div>
                      </Card>
                    );
                  })}
              </div>
              {/* END OF FETCH EVENT FORM */}
            </Container>
            {/*Welcome Message*/}
            <Row>
              <Container fluid className="d-flex justify-content-center">
                <div>
                  <Card>
                    <Card.Body className="text-white h6">
                      <small>
                        <p>Hey, thanks for visiting RSVP+! 😃</p>
                        <p className="mt-4">
                          To get started on how to use RSVP+, check out our user
                          guide (poster) using either one of these links !
                        </p>
                        <ul>
                          <li>
                            <a
                              href="https://www.figma.com/file/zI65CDPZoYCcvUK7Bw4GuZ/RSVPlus-Milestone-2?node-id=0%3A1"
                              target="_blank"
                              rel="noreferrer"
                              className="mr-2"
                            >
                              Figma
                            </a>
                            <a
                              href="https://drive.google.com/file/d/1iSB9UaBqE0AyVJVUmLtc2BbF1cqWHY7f/view?usp=sharing"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Google Drive
                            </a>
                          </li>
                        </ul>
                        <strong>New features for each tab! 🔥</strong>
                        <ol>
                          <li className="mt-4 mb-1">
                            Home (Dashboard)
                            <ul>
                              <li className="mt-2">
                                Display upcoming events from your Google
                                Calendar to see what's on your schedule! (Does
                                not show past events)
                              </li>
                            </ul>
                          </li>
                          <li className="mb-1 mt-4">
                            Channels
                            <ul>
                              <li className="mt-2">
                                Create your own channel for a meet-up or event
                                and invite your friends of RSVP+.
                              </li>
                              <li className="mt-2">
                                View channels you have been invited to or have
                                created.
                              </li>
                              <li className="mt-2">
                                Delete a channel that you are the host of should
                                you wish to remove it.
                              </li>
                              <li className="mt-2">
                                Derive optimal time slots for an event (channel)
                                for specified dates and time range after
                                everyone has "Agreed to Sync"! ✨
                              </li>
                            </ul>
                          </li>{" "}
                          <li className="mb-1 mt-4">
                            Calendar{" "}
                            <ul>
                              <li className="mt-2">
                                View your logged in Gmail's primary Google
                                Calendar by saving your URL! (Guide provided)
                              </li>
                              <li className="mt-2">
                                Create a custom event that will be automatically
                                added to your Google Calendar!
                              </li>
                            </ul>
                          </li>{" "}
                          <li className="mb-1 mt-4">
                            FAQ{" "}
                            <ul>
                              <li className="mt-2">
                                View frequently asked questions or answers to
                                questions you might have in mind!
                              </li>
                            </ul>
                          </li>{" "}
                          <li className="mb-1 mt-4">
                            Contact Us
                            <ul>
                              <li className="mt-2">
                                A platform to give feedback to the developers!
                              </li>
                            </ul>
                          </li>
                        </ol>
                        <p className="mt-4">
                          Other new updates includes: Google Login, input
                          handling and a nicer design!
                        </p>
                        <p className="mt-4">
                          Get started by clicking the "Display Upcoming Events"
                          button you see above and explore the other tabs!
                        </p>
                      </small>
                    </Card.Body>
                  </Card>
                </div>
              </Container>
            </Row>
            {/*Welcome Message*/}
          </Row>
        </Container>
      </div>
    </>
  );
}
