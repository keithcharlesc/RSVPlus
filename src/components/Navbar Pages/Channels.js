import React from "react";
import { Container } from "react-bootstrap";
import NavigationBar from "./NavigationBar";

export default function Channels() {
  return (
    <div>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <h1>Channels</h1>
        </Container>
      </div>
    </div>
  );
}
