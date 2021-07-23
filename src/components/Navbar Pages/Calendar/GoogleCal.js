import React, { useState } from "react";
import { ReactEmbeddedGoogleCalendar } from "react-embedded-google-calendar";
import { Row, Col, Button } from "react-bootstrap";
import firebase from "../../../firebase";
import { BrowserRouter, Link } from "react-router-dom";

const MoonPhasesCalendar =
  "https://calendar.google.com/calendar/embed?src=ht3jlfaac5lfd6263ulfh4tql8%40group.calendar.google.com&ctz=Europe%2FRome";

export default function GoogleCal() {
  const db = firebase.firestore();
  const currentUserEmail = firebase.auth().currentUser?.email;
  const [loading, setLoader] = useState(false);
  const [loadingTwo, setLoaderTwo] = useState(false);
  const [loadingThree, setLoaderThree] = useState(false);
  const [loadingFour, setLoaderFour] = useState(false);

  const [url, setUrl] = useState("");
  const onUrlChange = (event) => {
    setUrl(event.target.value);
  };
  const onClick = (event) => {
    event.preventDefault();
    setLoaderFour(true);
    return Promise.resolve(setUrl(MoonPhasesCalendar))
      .then(() => {
        setLoaderFour(false);
        //console.log("Sample URL has been set");
      })
      .catch((error) => {
        alert(error.message);
        setLoaderFour(false);
      });
  };
  const onClear = (event) => {
    setLoader(true);
    return Promise.resolve(setUrl(""))
      .then(() => {
        setLoader(false);
        //console.log("URL cleared");
      })
      .catch((error) => {
        alert(error.message);
        setLoader(false);
      });
  };

  //const uid = firebase.auth().currentUser?.uid;

  //Storing Google Calendar URL
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoaderTwo(true);
    db.collection("userAccounts")
      .doc(currentUserEmail)
      .update({
        url: url,
      })
      .then(() => {
        setLoaderTwo(false);
        alert("Your URL has been stored");
      })
      .catch((error) => {
        alert(error.message);
        setLoaderTwo(false);
      });
  };

  //-- Reading Data from Firestore--
  const handleLoadUrl = (e) => {
    e.preventDefault();
    setLoaderThree(true);
    var docRef = db.collection("userAccounts").doc(currentUserEmail);
    onClear();

    docRef
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          typeof doc.data().url !== "undefined" &&
          doc.data().url !== ""
        ) {
          setUrl(doc.data().url);
          setLoaderThree(false);
          //console.log(doc.data().url);
        } else {
          // doc.data() will be undefined in this case
          setUrl(MoonPhasesCalendar);
          setLoaderThree(false);
          alert("No data found, using sample Url instead");
        }
      })
      .catch((error) => {
        setLoaderThree(false);
        console.log("Error getting document:", error);
      });
  };
  //---------------------------------------

  return (
    <>
      <form>
        <label>
          <strong>Input Google Calendar Link Below:</strong>
          <BrowserRouter>
            <Link className="ml-2" to="/calendar-guide">
              Guide
            </Link>
          </BrowserRouter>
          <Row className="mt-2">
            <Col sm={9}>
              <input
                type="text"
                placeholder="Paste a public URL of your calendar"
                onChange={onUrlChange}
                value={url}
                className="mb-1"
                style={{ width: "105%" }}
              ></input>
            </Col>
            <Col sm={3}>
              <Button
                variant="danger"
                className="d-flex align-items-center justify-content-center ml-2"
                style={{ width: 74, height: 30 }}
                onClick={onClear}
                disabled={loading}
              >
                Reset
              </Button>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Button
                variant="danger"
                className="d-flex align-items-center justify-content-center"
                style={{ height: 30 }}
                onClick={handleSubmit}
                disabled={loadingTwo}
              >
                SaveURL
              </Button>
            </Col>
            <Col>
              <Button
                variant="danger"
                className="d-flex align-items-center justify-content-center mb-1"
                style={{ height: 30 }}
                onClick={handleLoadUrl}
                disabled={loadingThree}
              >
                Fetch
              </Button>
            </Col>
            <Col>
              <Button
                variant="danger"
                className="d-flex align-items-center justify-content-center"
                style={{ width: 200, height: 30 }}
                onClick={onClick}
                disabled={loadingFour}
              >
                Use Sample Calendar
              </Button>
            </Col>
          </Row>
        </label>
      </form>
      <hr></hr>
      <div style={{ height: "500px" }}>
        <ReactEmbeddedGoogleCalendar publicUrl={url} />
      </div>
    </>
  );
}
