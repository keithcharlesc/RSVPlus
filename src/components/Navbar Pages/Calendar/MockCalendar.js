import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import MockNavigationBar from "../NavigationBar/MockNavigationBar";
import "./Calendar.css";
import GoogleCal from "./GoogleCal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/*----- GAPI------*/
var gapi = { auth2: {}, client: {} };
var CLIENT_ID =
  "1011248109211-umpu5g48dj5p4hqlnhvuvl6f4c9qdhn3.apps.googleusercontent.com";
var API_KEY = "AIzaSyD3-pnAPnBMzBqL_dAZYYyVGretc42zUnA";
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
var SCOPES = "https://www.googleapis.com/auth/calendar.events";

gapi.load = (a, f) => f();
/*---------------*/

export default function Calendar() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------------- ADDING EVENT -------------*/
  const handleClick = (e) => {
    e.preventDefault();
    setLoader(true);
    setError("");
    setSuccess("");

    gapi.auth2
      .getAuthInstance()
      .then(() => {
        var event = {
          summary: "data.name",
          location: "data.location",
          description: "data.description",
          start: {
            dateTime:
              startDate.toLocaleDateString("en-CA") +
              "T" +
              startDate.toLocaleTimeString("it-IT").slice(0, 5) +
              ":00+08:00", //requires time input
            timeZone: "Asia/Singapore",
          },
          end: {
            dateTime:
              endDate.toLocaleDateString("en-CA") +
              "T" +
              endDate.toLocaleTimeString("it-IT").slice(0, 5) +
              ":00+08:00", //requires time input
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

        if (
          startDate.toLocaleDateString("en-CA") ===
          endDate.toLocaleDateString("en-CA")
        ) {
          let startDateHoursAndMinutes = startDate
            .toLocaleTimeString("it-IT")
            .slice(0, 5);

          let endDateHoursAndMinutes = endDate
            .toLocaleTimeString("it-IT")
            .slice(0, 5);

          let minutesForStartDate = getMinutes(startDateHoursAndMinutes);
          let minutesForEndDate = getMinutes(endDateHoursAndMinutes);

          if (minutesForEndDate < minutesForStartDate) {
            setError(
              "Error! Start Time must be earlier than End Time for same date!"
            );
            return;
          }
        }

        var request = gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });

        setSuccess("Event successfully created!");

        request.execute((event) => {
          //console.log(event);
          window.open(event.htmlLink);
        });
      })
      .then(() => {
        setLoader(false);
      });
  };
  /* ----------Handle Form Input to use in API---------*/
  const [data, setData] = useState({
    name: "",
    description: "",
    location: "",
  });

  function handleSubmitForm(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
    //console.log(newData);
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
  return (
    <>
      <MockNavigationBar />
      <div
        className="p-3 mb-2 bg-dark text-white"
        style={{ minHeight: "100vh" }}
      >
        <h2 className="page-header text-center mb-5">CALENDAR</h2>

        <Container className="" style={{ minHeight: "75vh" }}>
          <Row>
            <Col md={7} className="mb-3">
              <GoogleCal />
            </Col>
            <Col md={{ span: 4, offset: 1 }}>
              <section className="create-event-section">
                <Form className="create-event-form">
                  <h1 className="mb-1"> Create an Event </h1>
                  <h6 className="text-center mb-3">(Google Calendar)</h6>
                  {success && (
                    <Alert
                      className="d-flex align-items-center justify-content-center"
                      variant="success"
                    >
                      {success}
                    </Alert>
                  )}
                  {error && <Alert variant="danger">{error}</Alert>}
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
                    <DatePicker
                      selected={startDate}
                      minDate={new Date()}
                      required
                      placeholderText=""
                      onChange={(date) => setStartDate(date)}
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      showTimeInput
                    />
                  </div>
                  <div className="input-group">
                    <label>End Date</label>
                    <DatePicker
                      selected={endDate}
                      minDate={new Date()}
                      required
                      onChange={(date) => setEndDate(date)}
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      showTimeInput
                    />
                  </div>
                  <Button
                    data-testid="buttonToTest"
                    className="mt-2"
                    disabled={loading}
                    variant="danger"
                    style={{ width: 110, height: 50 }}
                    onClick={(e) => handleClick(e)}
                  >
                    Add Event
                  </Button>
                </Form>
              </section>
            </Col>
          </Row>
          {/* CREATE EVENT FORM */}

          {/* END OF CREATE EVENT FORM */}
        </Container>
      </div>
    </>
  );
}
