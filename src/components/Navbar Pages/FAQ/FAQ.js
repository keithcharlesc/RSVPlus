//NOT REQUIRED PAGE
import React from "react";
import { Container, Accordion, Card } from "react-bootstrap";
import NavigationBar from "../../Navbar Pages/NavigationBar/NavigationBar";

export default function FAQ() {
  return (
    <>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <h2 className="text-center mb-4">Dashboard</h2>
        <Container
          className="d-flex justify-content-center mt-5"
          style={{ minHeight: "100vh" }}
        >
          <Accordion style={{ width: 700 }}>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                Click me!
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>Hello! I'm the body</Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="1">
                Click me!
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body>Hello! I'm another body</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Container>
      </div>
    </>
  );
}
