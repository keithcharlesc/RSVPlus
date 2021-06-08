import React from "react";
import { Container, Card } from "react-bootstrap";
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
            {/*
            <Card>
              <Card.Body className="text-dark h6">
                <small>
                  <p>Hi, thanks for visiting our website!</p>
                  <p>Currently:</p>
                  <ul>
                    <li>
                      The Channels/Calendar/Contact Us Pages have yet to be
                      build.
                    </li>
                  </ul>
                  <p>Existing features:</p>
                  <ul>
                    <li className="mb-1">
                      <strong>Navigation Bar</strong> that directs you to the
                      different pages (Clicking on icon directs to home page)
                    </li>
                    <li className="mb-1">
                      You can click on the <strong>profile tab</strong> in the
                      navbar to update your email and password!
                    </li>
                    <li className="mb-1">
                      You can see the{" "}
                      <strong>
                        existing logged in email in the top right corner
                      </strong>{" "}
                      and a <strong>logout button</strong> to sign you out!
                    </li>
                    <li>Sign up, Login, Forget/Reset Password features!</li>
                  </ul>
                </small>
              </Card.Body>
            </Card>
            */}
          </div>
        </Container>
      </div>
    </>
  );
}
