import React, { useRef, useState } from "react";
import { Container, Form, Card, Button, Alert } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import { firebase } from "@firebase/app";
import "./ContactUs.css";

export default function ContactUs() {
  const nameRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();

  const db = firebase.firestore();
  const [loading, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    setError("");
    setSuccess("");
    db.collection("contactUs")
      .add({
        name: nameRef.current.value,
        email: emailRef.current.value,
        message: messageRef.current.value,
      })
      .then(() => {
        setLoader(false);
        setSuccess("Your message has been submitted");
      })
      .catch((error) => {
        setError(error.message);
        setLoader(false);
      });
  };

  return (
    <>
      <NavigationBar />
      <div
        className="p-3 mb-2 bg-dark text-white"
        style={{ minHeight: "100vh" }}
      >
        <h2 className="text-center">Contact Us</h2>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "75vh" }}
        >
          <Card className="mt-5">
            <Card.Body>
              <h3 className="text-center mb-4">Form</h3>
              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form className="text-dark" onSubmit={handleSubmit}>
                <Form.Group id="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="name" ref={nameRef} />
                </Form.Group>
                <br></br>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} />
                </Form.Group>
                <br></br>
                <Form.Group id="message">
                  <Form.Label>Message</Form.Label>
                  <Form.Control type="message" ref={messageRef} />
                </Form.Group>
                <br></br>
                <Button
                  variant="danger"
                  disabled={loading}
                  className="w-100"
                  type="submit"
                >
                  Send Message!
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}
