import React, { useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import "./Calendar.css";

/*----- GAPI ------*/
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
/*-----------------*/

export default function Calendar() {
  /* ---------------- ADDING EVENT -------------*/
  const handleClick = (e) => {
    e.preventDefault();

    gapi.auth2.getAuthInstance().then(() => {
      var event = {
        summary: data.name,
        location: data.location,
        description: data.description,
        start: {
          dateTime: data.startDate + "T09:00:00+08:00",
          timeZone: "Asia/Singapore",
        },
        end: {
          dateTime: data.endDate + "T17:00:00+08:00",
          timeZone: "Asia/Singapore",
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 10 },
          ],
        },
      };

      //console.log(event.start.dateTime);

      var request = gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      request.execute((event) => {
        console.log(event);
        window.open(event.htmlLink);
      });
    });
  };
  /* -------------- RETRIEVING EVENTS ------------
  const [events, setEvents] = useState(null);

  const handleSecondClick = () => {
    gapi.load("client:auth2", () => {
      console.log("loaded client!");

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.client.load("calendar", "v3", () => console.log("entry!"));

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
            setEvents(events);
          });
      });
    });
  };
  ------------*/
  /* ----------Handle Form Input to use in API---------*/
  const [data, setData] = useState({
    name: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
  });

  function handleSubmitForm(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
    //console.log(newData);
  }
  /*---------------------------------------------------*/
  return (
    <>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <h2 className="text-center mb-4">Calendar</h2>

        {/* FETCH EVENT FORM 
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
                          {event.location != null ? event.location : "N/A"}
                        </Card.Text>
                        <Card.Text>
                          Start Date:{" "}
                          {event.start.date != null
                            ? event.start.date
                            : event.start.dateTime.slice(0, 10)}
                          {//*console.log(event.start.date)
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
       */}

        <Container
          className="d-flex  justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          {/* CREATE EVENT FORM */}
          <section className="create-event-section">
            <form
              className="create-event-form"
              onSubmit={(e) => handleClick(e)}
            >
              <h1 className="mb-3"> Create an Event </h1>
              <div className="input-group">
                <label>Name</label>
                <input
                  onChange={(e) => handleSubmitForm(e)}
                  id="name"
                  value={data.name}
                  placeholder=""
                  type="text"
                ></input>
              </div>
              <div className="input-group">
                <label>Description</label>
                <input
                  onChange={(e) => handleSubmitForm(e)}
                  id="description"
                  value={data.description}
                  placeholder=""
                  type="text"
                ></input>
              </div>
              <div className="input-group">
                <label>Location</label>
                <input
                  onChange={(e) => handleSubmitForm(e)}
                  id="location"
                  value={data.location}
                  placeholder=""
                  type="text"
                ></input>
              </div>
              <div className="input-group">
                <label>Start Date</label>
                <input
                  onChange={(e) => handleSubmitForm(e)}
                  id="startDate"
                  value={data.startDate}
                  placeholder="YYYY-MM-DD"
                  type="text"
                ></input>
              </div>
              <div className="input-group">
                <label>End Date</label>
                <input
                  onChange={(e) => handleSubmitForm(e)}
                  id="endDate"
                  value={data.endDate}
                  placeholder="YYYY-MM-DD"
                  type="text"
                ></input>
              </div>
              <button
                className="mt-2"
                variant="danger"
                style={{ width: 100, height: 50 }}
                /*onClick={handleClick}*/
              >
                Add Event
              </button>
            </form>
          </section>
          {/* END OF CREATE EVENT FORM */}

          {/*}
          <button
            style={{ width: 100, height: 50 }}
            onClick={handleSecondClick}
          >
            Fetch Events
          </button>
          */}
        </Container>
      </div>
    </>
  );
}
