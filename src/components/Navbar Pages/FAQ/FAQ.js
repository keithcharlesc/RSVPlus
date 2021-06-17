//NOT REQUIRED PAGE
import React from "react";
import { Container } from "react-bootstrap";
import NavigationBar from "../../Navbar Pages/NavigationBar/NavigationBar";

export default function FAQ() {
  return (
    <>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">FAQ</h2>
          </div>
        </Container>
      </div>
    </>
  );
}
