import React, { useState } from "react";
import { Container } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import "./Calendar.css";

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
  const handleClick = (e) => {
    e.preventDefault();
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

        console.log(event.start.dateTime);

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
    console.log(newData);
  }
  /*---------------------------------------------------*/
  return (
    <div>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <h1>Calendar</h1>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <section class="create-event-section">
            <form class="create-event-form" onSubmit={(e) => handleClick(e)}>
              <h1 className="mb-3"> Create an Event </h1>
              <div class="input-group">
                <label for="name">Name</label>
                <input
                  onChange={(e) => handleSubmitForm(e)}
                  id="name"
                  value={data.name}
                  placeholder=""
                  type="text"
                ></input>
              </div>
              <div class="input-group">
                <label for="name">Description</label>
                <input
                  onChange={(e) => handleSubmitForm(e)}
                  id="description"
                  value={data.description}
                  placeholder=""
                  type="text"
                ></input>
              </div>
              <div class="input-group">
                <label for="name">Location</label>
                <input
                  onChange={(e) => handleSubmitForm(e)}
                  id="location"
                  value={data.location}
                  placeholder=""
                  type="text"
                ></input>
              </div>
              <div class="input-group">
                <label for="name">Start Date</label>
                <input
                  onChange={(e) => handleSubmitForm(e)}
                  id="startDate"
                  value={data.startDate}
                  placeholder="YYYY-MM-DD"
                  type="text"
                ></input>
              </div>
              <div class="input-group">
                <label for="name">End Date</label>
                <input
                  onChange={(e) => handleSubmitForm(e)}
                  id="endDate"
                  value={data.endDate}
                  placeholder="YYYY-MM-DD"
                  type="text"
                ></input>
              </div>
              <button
                style={{ width: 100, height: 50 }}
                /*onClick={handleClick}*/
              >
                Add Event
              </button>
            </form>
          </section>
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
