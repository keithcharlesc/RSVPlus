import React, { useState } from "react";
import { ReactEmbeddedGoogleCalendar } from "react-embedded-google-calendar";
import { Row, Col } from "react-bootstrap";
import { firebase } from "@firebase/app";
import { Link } from "react-router-dom";

const MoonPhasesCalendar =
  "https://calendar.google.com/calendar/embed?src=ht3jlfaac5lfd6263ulfh4tql8%40group.calendar.google.com&ctz=Europe%2FRome";

export default function GoogleCal() {
  const [url, setUrl] = useState();
  const onUrlChange = (event) => {
    setUrl(event.target.value);
  };
  const onClick = (event) => {
    setUrl(MoonPhasesCalendar);
  };
  const onClear = (event) => {
    setUrl("");
  };

  const db = firebase.firestore();
  //const uid = firebase.auth().currentUser?.uid;
  const currentUserEmail = firebase.auth().currentUser?.email;

  //Storing Google Calendar URL
  const handleSubmit = (e) => {
    e.preventDefault();

    db.collection("displayCalendarURL")
      .doc(currentUserEmail)
      .set({
        url: url,
      })
      .then(() => {
        alert("Your URL has been stored");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  //-- Reading Data from Firestore--
  const handleLoadUrl = (e) => {
    e.preventDefault();
    var docRef = db.collection("displayCalendarURL").doc(currentUserEmail);
    onClear();

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUrl(doc.data().url);
          //console.log(doc.data().url);
          console.log("Document read!");
        } else {
          // doc.data() will be undefined in this case
          setUrl(MoonPhasesCalendar);
          alert("No data found, using sample Url instead");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };
  //---------------------------------------

  return (
    <>
      <form>
        <label>
          Input Google Calendar Link Below:
          <Link className="ml-2" to="/calendar-guide">
            Guide
          </Link>
          <Row className="mt-2">
            <Col sm={9}>
              <input
                type="text"
                placeholder="Paste a public URL of your calendar"
                onChange={onUrlChange}
                value={url}
                style={{ width: "105%" }}
              ></input>
            </Col>
            <Col sm={3}>
              <input type="button" onClick={onClear} value="Reset"></input>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <button onClick={handleSubmit}>SaveURL</button>
            </Col>
            <Col>
              <button onClick={handleLoadUrl}>Fetch</button>
            </Col>
            <Col>
              <input
                type="button"
                onClick={onClick}
                value="Use Sample Calendar"
              ></input>
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
