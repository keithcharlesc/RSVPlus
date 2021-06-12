import React, { useState } from "react";
import { Button, Container, Card, Row, Col } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import { firebase } from "@firebase/app";

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
  console.log("loaded client!");

  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
  });

  gapi.client.load("calendar", "v3", () => console.log("entry!"));
});
/*---------------*/

export default function Dashboard() {
  /*
  function displayFirestore() {
    //-- Reading Data from Firestore on Initial Load--
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    var docRef = db.collection("calendarEvents").doc(uid);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());

        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }
  */
  /*---------------------------------*/

  /* -------------- RETRIEVING EVENTS ------------*/
  const [events, setEvents] = useState(null);

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
          console.log("EVENTS: ", events);
          //setEvents(events);

          const uid = firebase.auth().currentUser?.uid;
          console.log("uid: " + uid);

          /*-- Upload to Firestore --*/
          const db = firebase.firestore();
          console.log("db: " + db);
          db.collection("calendarEvents")
            .doc(uid)
            .set({
              events: events,
            })
            .then(() => {
              console.log("Document successfully written!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
          /*----------*/

          /*-- Reading Data from Firestore--*/
          var docRef = db.collection("calendarEvents").doc(uid);

          docRef
            .get()
            .then((doc) => {
              if (doc.exists) {
                console.log("Document data:", doc.data());
                setEvents(doc.data().events);
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            })
            .catch((error) => {
              console.log("Error getting document:", error);
            });

          /*---------------------------------*/
        });
    });
  };
  /*---------------------------------------------------*/
  return (
    <>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <h2 className="text-center mb-4">Dashboard</h2>
        <Container fluid>
          <Row className="d-flex align-items-center justify-content-center mb-4">
            {" "}
            <Button
              variant="warning"
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
                        className="card text-dark bg-light mb-3"
                        style={{ maxWidth: "18rem" }}
                        key={index}
                      >
                        <div className="event">
                          <Card.Header>Event {index + 1}</Card.Header>
                          <Card.Body>
                            <Card.Title>
                              {event.summary != null ? event.summary : "N/A"}
                            </Card.Title>
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
                                {event.start.date != null
                                  ? event.start.date
                                  : event.start.dateTime.slice(0, 10)}
                                {/*console.log(event.start.date)*/}
                              </Card.Text>
                              <Card.Text>
                                End date:{" "}
                                {event.end.date != null
                                  ? event.end.date
                                  : event.end.dateTime.slice(0, 10)}
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
