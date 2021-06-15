import React, { useRef, useState, Component } from "react";
import { Container, Form, Card, Button, Alert } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import { firebase } from "@firebase/app";
import CreateChannel from "./CreateChannel"

export default function ViewChannel() {

  
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
              <h2>oompa loompa</h2>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}
