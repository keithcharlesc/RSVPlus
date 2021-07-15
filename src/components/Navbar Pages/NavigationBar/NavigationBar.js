import React, { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import "./NavigationBar.css";

export default function NavigationBar() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.pushState("/login");
    } catch {
      setError("Failed to log out.");
    }
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
        <Navbar.Brand href="/" className="nav-bar-appName text-danger">
          RSVP+
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link className="nav-bar-text px-3" href="/">
              Home
            </Nav.Link>
            <Nav.Link className="nav-bar-text px-3" href="/channels">
              Channels
            </Nav.Link>
            <Nav.Link className="nav-bar-text px-3" href="/calendar">
              Calendar
            </Nav.Link>
            <Nav.Link className="nav-bar-text px-3" href="/faq">
              FAQ
            </Nav.Link>
            <Nav.Link className="nav-bar-text px-3" href="/contact-us">
              Contact Us
            </Nav.Link>
          </Nav>
          <Nav>
            <Navbar.Text className="nav-bar-name">
              Signed in as: {currentUser.displayName}
              <Image
                className="photo ml-2"
                src={currentUser.photoURL}
                roundedCircle
              />
            </Navbar.Text>
          </Nav>
        </Navbar.Collapse>
        <Button
          variant="outline-primary"
          className="ml-3"
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </Navbar>
      <div>{error}</div>
    </div>
  );
}
