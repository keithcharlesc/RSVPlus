import React, { useRef, useState } from "react";
import { Container, Form, Card, Button, Alert } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import { firebase } from "@firebase/app";

export default function Channels() {

  const nameRef = useRef();
  const locationRef = useRef();
  const startDateRef = useRef();
  const endDateRef = useRef();
  const emailInviteRef1 = useRef();
  const emailInviteRef2 = useRef();
  const emailInviteRef3 = useRef();

  const db = firebase.firestore();
  
  console.log(db)
  const [loading, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoader(true);
    setError("");
    setSuccess("");
    db.collection("form")
      .add({
        name: nameRef.current.value,
        location: locationRef.current.value,
        start_date: startDateRef.current.value,
        end_date: endDateRef.current.value,
        name1: emailInviteRef1.current.value,
        name2: emailInviteRef2.current.value,
        name3: emailInviteRef3.current.value,
      })
      .then(() => {
        setLoader(false);
        setSuccess("Your channel has been created");
        console.log("Channel requisite information has been added to firestore")
      })
      .catch((error) => {
        setError("Your channel has not been created, please try again!");
        setLoader(false);
      });
  };




  return (
    <div>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <Card className="mt-5">
            <Card.Body>
              <h3 className="text-center mb-4">Create a channel for your event!</h3>
              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <form className="text-dark" onSubmit={handleSubmit}>
                <Form.Group id="name">
                  <Form.Label>Name of event</Form.Label>
                  <Form.Control required type="name" ref={nameRef} placeholder = "eg. Study meet with Rebecca"/>
                </Form.Group>
                <br></br>
                <Form.Group id="location">
                <Form.Label>Location of event</Form.Label>
                <Form.Control required type="location" ref={locationRef} placeholder = "eg. NUS Central Library 4th floor" />
                </Form.Group>
                <br></br>
                <Form.Group id="startDate">
                <Form.Label>Start date</Form.Label>
                <Form.Control required type="startDate" ref={startDateRef} placeholder = "YYYY-MM-DD" />
                </Form.Group>
                <br></br>
                <Form.Group id="endDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control required type="endDate" ref={endDateRef} placeholder = "YYYY-MM-DD" />
                </Form.Group> 
                <br></br>
                <Form.Group id="emailInvite">
                <Form.Label>Email addresses of people you wish to invite</Form.Label>
                  <Form.Control type="emailInvite" ref={emailInviteRef1} placeholder="name@example.com" />
                  <Form.Control type="emailInvite" ref={emailInviteRef2} placeholder="name@example.com" />
                  <Form.Control type="emailInvite" ref={emailInviteRef3} placeholder="name@example.com" />
                </Form.Group>
                <br></br>
                <Button
                  variant="danger"
                  disabled={loading}
                  className="w-100"
                  type="submit"
                >
                Create channel
                </Button>
              </form>
            </Card.Body>
          </Card>  
        </Container>
      </div>
    </div>
  );
}
