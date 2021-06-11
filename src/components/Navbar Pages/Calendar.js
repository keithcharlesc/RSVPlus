import React from "react";
import { Container } from "react-bootstrap";
import NavigationBar from "./NavigationBar";

export default function Calendar() {
  var gapi = window.gapi;
  var CLIENT_ID =
    "1011248109211-umpu5g48dj5p4hqlnhvuvl6f4c9qdhn3.apps.googleusercontent.com";
  var API_KEY = "AIzaSyD3-pnAPnBMzBqL_dAZYYyVGretc42zUnA";
  var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];
  var SCOPES = "https://www.googleapis.com/auth/calendar.events";

  /* ---------------- ADDING EVENT -------------*/
  const handleClick = () => {
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
        var event = {
          summary: "Awesome Event!",
          location: "800 Howard St., San Francisco, CA 94103",
          description: "Really great refreshments",
          start: {
            dateTime: "2021-06-28T09:00:00-07:00",
            timeZone: "Asia/Singapore",
          },
          end: {
            dateTime: "2021-06-28T17:00:00-07:00",
            timeZone: "Asia/Singapore",
          },
          recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 24 * 60 },
              { method: "popup", minutes: 10 },
            ],
          },
        };

        var request = gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });

        request.execute((event) => {
          console.log(event);
          window.open(event.htmlLink);
        });
      });
    });
  };
  /* -------------- RETRIEVING EVENTS ------------*/
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
          });
      });
    });
  };
  /* --------------------------------------------*/
  return (
    <div>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <h1>Calendar</h1>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <button style={{ width: 100, height: 50 }} onClick={handleClick}>
            Add Event
          </button>
          <button
            style={{ width: 100, height: 50 }}
            onClick={handleSecondClick}
          >
            Fetch Events
          </button>
        </Container>
      </div>
    </div>
  );
}
