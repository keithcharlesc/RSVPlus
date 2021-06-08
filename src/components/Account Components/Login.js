import React, { useState } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    //Prevent form from refreshing
    event.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login();
    } catch {
      setError("Failed to log in.");
    }
    setLoading(false);
  }

  return (
    <>
      <div className="p-3 mb-2 bg-dark text-white">
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <h1 className="text-center mb-5">
              Welcome to <em className="text-danger">RSVP+</em>
            </h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button
              disabled={loading}
              className="w-100"
              type="button"
              onClick={handleSubmit}
            >
              Log In With Google!
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
}
