import React, { useState } from "react";
import { Container, Button, Alert, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import firebase from "../../firebase";
import "./Login.css";

export default function MockLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

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
  /* ------------ Login with gapi Auth and firebase -------------*/
  async function login() {
    const googleAuth = gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();
    //console.log(googleUser);
    const token = googleUser.getAuthResponse().id_token;
    const credential = firebase.auth.GoogleAuthProvider.credential(token);
    const db = firebase.firestore();

    await firebase
      .auth()
      .signInWithCredential(credential)
      .then(({ user }) => {
        db.collection("userAccounts")
          .doc(user.email)
          .get()
          .then((doc) => {
            if (doc.exists) {
              //console.log("Document read!");
            } else {
              db.collection("userAccounts")
                .doc(user.email)
                .set({
                  email: user.email,
                })
                .then(() => {
                  //console.log("Email added to database!");
                })
                .catch((error) => {
                  //console.error("Error writing document: ", error);
                });
            }
          })
          .catch((error) => {
            //console.log("Error getting document:", error);
          });

        //console.log(user);
        /*console.log("firebase: user signed in!", {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });*/
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
          <div className="w-100" style={{ maxWidth: "460px" }}>
            <Row> {error && <Alert className="alert-fail">{error}</Alert>}</Row>
            <Row>
              <Col>
                {" "}
                <div>
                  <h1 className="welcome-text text-center">Welcome to </h1>
                  <h1 className="app-text text-danger">RSVP+</h1>
                  <h1 className="welcome-text">!</h1>
                </div>
              </Col>
              <Col>
                <div className="vl">
                  <div className="ml-4">
                    <Button
                      variant="danger"
                      disabled={loading}
                      className="login-button mt-4 w-100"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Login with Google!
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
}
