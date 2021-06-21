import React, { useState } from "react";
import { Button, Container, Card, Row, Badge } from "react-bootstrap";
import NavigationBar from "../NavigationBar/NavigationBar";
import { firebase } from "@firebase/app";
import obtainBusyDates from "./obtainBusyDates";
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
  console.log("loaded auth2 client!");

  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
  });

  gapi.client.load("calendar", "v3", () =>
    console.log("loaded calendar v3, entry!")
  );
});
/*---------------*/

export default function Dashboard() {
  /* -------------- RETRIEVING EVENTS ------------*/
  const [events, setEvents] = useState(null);
  const currentUserEmail = firebase.auth().currentUser?.email;
  const db = firebase.firestore();

  const handleSecondClick = () => {
    gapi.auth2.getAuthInstance().then(() => {
      gapi.client.calendar.events
        .list({
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: "startTime",
        })
        .then((response) => {
          const events = response.result.items;
          //console.log("Google Events Fetched: ", events);
          setEvents(events);
          //let busyDates = [];
          obtainBusyDates(events, db, currentUserEmail);
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
  return (
    <>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <h2 className="page-header text-center mb-4">DASHBOARD</h2>
        <Container fluid>
          <Row className="d-flex align-items-center justify-content-center mb-4">
            {" "}
            <Button
              variant="warning"
              className="fetch-events-button"
              style={{ width: 100, height: 60 }}
              onClick={handleSecondClick}
            >
              Fetch Events
            </Button>
          </Row>
          <Row>
            <Container
              className="d-flex justify-content-center"
              style={{ minHeight: "100vh" }}
            >
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
                                    : event.start.dateTime.slice(0, 10)}
                                </Badge>
                                {/*console.log(event.start.date)*/}
                              </Card.Text>
                              <Card.Text>
                                End Date:{" "}
                                <Badge pill variant="dark">
                                  {event.end.date != null
                                    ? event.end.date //-1 for day might need to implement since full day event = day itself and day after
                                    : event.end.dateTime.slice(0, 10)}
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
          </Row>
        </Container>
      </div>
    </>
  );
}
