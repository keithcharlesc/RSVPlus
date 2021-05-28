import React, { useState } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import NavigationBar from "./NavigationBar";

export default function Dashboard() {
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
    <>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Welcome</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <p className="d-flex align-items-center justify-content-center">
              {currentUser.email}
            </p>
            <Link to="/profile" className="btn btn-primary w-100 mt-3">
              Update Profile
            </Link>
            <div className="w-100 text-center mt-2">
              <Button variant="link" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
