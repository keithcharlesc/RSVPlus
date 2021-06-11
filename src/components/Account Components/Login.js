import React, { useState, useEffect } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import firebase from "../../firebase";

export default function Login() {
  //const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState();

  /*------------- Gapi Initialization --------------*/
  var gapi = window.gapi;

  gapi.load("client:auth2", () => {
    console.log("loaded client");

    gapi.client.init({
      apiKey: "AIzaSyD3-pnAPnBMzBqL_dAZYYyVGretc42zUnA",
      clientId:
        "1011248109211-umpu5g48dj5p4hqlnhvuvl6f4c9qdhn3.apps.googleusercontent.com",
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ],
      scope: "https://www.googleapis.com/auth/calendar",
    });

    gapi.client.load("calendar", "v3", () => console.log("entry!"));
  });
  /* ------------ Login with gapi Auth and firebase -------------*/
  async function login() {
    const googleAuth = gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();
    console.log(googleUser);
    const token = googleUser.getAuthResponse().id_token;
    const credential = firebase.auth.GoogleAuthProvider.credential(token);

    await firebase
      .auth()
      .signInWithCredential(credential)
      .then(({ user }) => {
        console.log(user);
        console.log("firebase: user signed in!", {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        if (errorCode === "auth/account-exists-with-different-credential") {
          alert("Email already associated with another account.");
          // Handle account linking here, if using.
        } else {
          console.error(error);
        }
      });
  }
  /* ---------- Get Calendar (For testing)-------------*/
  async function getCalendar() {
    const events = await gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    });

    console.log(events);

    console.log(events.result.items);
  }

  /*------------ Insert Event (For testing) ------------*/
  async function insertEvent() {
    const insert = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      start: {
        dateTime: hoursFromNow(2),
        timeZone: "Asia/Singapore",
      },
      end: {
        dateTime: hoursFromNow(3),
        timeZone: "Asia/Singapore",
      },
      summary: "Have fun!!!",
      description: "Do some cool stuff",
    });

    getCalendar();
  }

  const hoursFromNow = (n) =>
    new Date(Date.now() + n * 1000 * 60 * 60).toISOString();

  /* ------------ Handlers (For testing)------------*/
  const handleGetCalendar = () => {
    getCalendar();
  };

  const handleInsertEvent = () => {
    insertEvent();
  };
  /*----------Submit Button Functionalities----------*/

  async function handleSubmit(event) {
    //Prevent form from refreshing
    event.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login();
      history.push("/");
    } catch {
      setError("Failed to log in.");
    }
    setLoading(false);
  }

  return (
    <>
      <div className="p-3 mb-2 bg-dark text-white">
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <h1 className="text-center mb-5">
              Welcome to <em className="text-danger">RSVP+</em>
            </h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button
              disabled={loading}
              className="w-100"
              type="button"
              onClick={handleSubmit}
            >
              Log In With Google!
            </Button>
            {/*
            <button
              style={{ width: 100, height: 50 }}
              onClick={handleGetCalendar}
            >
              Fetch Events
            </button>
            <button
              style={{ width: 100, height: 50 }}
              onClick={handleInsertEvent}
            >
              Insert Events
            </button>
            */}
          </div>
        </Container>
      </div>
    </>
  );
}
