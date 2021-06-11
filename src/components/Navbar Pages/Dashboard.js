import React from "react";
import { Container } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import NavigationBar from "./NavigationBar";

export default function Dashboard() {
  const { currentUser } = useAuth();

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
            <p className="d-flex align-items-center justify-content-center">
              {currentUser.displayName}
            </p>
          </div>
        </Container>
      </div>
    </>
  );
}
