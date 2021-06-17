import React, { useRef, useState, useEffect } from "react";
import {
  Container,
  Form,
  Card,
  Button,
  Alert,
  Row,
  Badge,
} from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import { firebase } from "@firebase/app";
import Popup from "./Functions/Popup";

export default function CreateChannel() {
  const nameRef = useRef();
  const locationRef = useRef();
  const startDateRef = useRef();
  const endDateRef = useRef();
  const emailInviteRef1 = useRef();
  const emailInviteRef2 = useRef();
  const emailInviteRef3 = useRef();

  const db = firebase.firestore();
  //console.log(db)
  const [loading, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoader(true);
    setError("");
    setSuccess("");
    db.collection("channelsCreatedByUser")
      .add({
        name: nameRef.current.value,
        location: locationRef.current.value,
        start_date: startDateRef.current.value,
        end_date: endDateRef.current.value,
        name1: emailInviteRef1.current.value,
        name2: emailInviteRef2.current.value,
        name3: emailInviteRef3.current.value,
      })
      .then(() => {
        setLoader(false);
        setSuccess("Your channel has been created");
        console.log(
          "Channel requisite information has been added to firestore"
        );
      })
      .catch((error) => {
        setError("Your channel has not been created, please try again!");
        setLoader(false);
      });
  };

  //-------------------------------------------//

  const [buttonPopup, setButtonPopup] = useState(false);

  //-------------------------------------------//
  const [channels, setChannels] = useState([]);
  const [loadingx, setLoading] = useState(false);

  const ref = firebase.firestore().collection("channelsCreatedByUser");

  function getChannels() {
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setChannels(items);
      setLoading(false);
    });
  }

  useEffect(() => {
    getChannels();
  }, []);

  if (loadingx) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <NavigationBar />
      <div className="p-3 mb-2 bg-dark text-white">
        <h2 className="text-center mb-4">Channels</h2>
        <Container fluid>
          <Row className="d-flex align-items-center justify-content-center mb-4">
            <Button
              style={{ width: 100, height: 60 }}
              onClick={() => setButtonPopup(true)}
            >
              {" "}
              Create an Event!{" "}
            </Button>
          </Row>
          <Row>
            <Container style={{ minHeight: "100vh" }}>
              {channels.map((channel) => (
                <div className="d-flex align-items-center justify-content-center mb-4">
                  <Card>
                    <div key={channel.name}>
                      <Card.Header className="d-flex justify-content-center">
                        <Card.Title>
                          <h2>{channel.name}</h2>
                        </Card.Title>
                      </Card.Header>

                      <Card.Body>
                        <div className="details">
                          <Card.Text>Description: </Card.Text>
                          <Card.Text>Location: {channel.location}</Card.Text>
                          <Card.Text>
                            Start Date:{" "}
                            <Badge pill variant="dark">
                              {" "}
                              {channel.start_date}
                            </Badge>
                            {/*console.log(event.start.date)*/}
                          </Card.Text>
                          <Card.Text>
                            End Date:{" "}
                            <Badge pill variant="dark">
                              {channel.end_date}
                            </Badge>
                          </Card.Text>
                        </div>
                      </Card.Body>

                      <p>
                        Invited {channel.name1}, {channel.name2} and{" "}
                        {channel.name3}{" "}
                      </p>
                      <br></br>
                    </div>
                  </Card>
                </div>
              ))}

              <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <Card.Body>
                  <h3 className="text-center mb-4">
                    Create a channel for your event!
                  </h3>
                  {success && <Alert variant="success">{success}</Alert>}
                  {error && <Alert variant="danger">{error}</Alert>}
                  <form className="text-dark" onSubmit={handleSubmit}>
                    <Form.Group id="name">
                      <Form.Label>Name of event</Form.Label>
                      <Form.Control
                        required
                        type="name"
                        ref={nameRef}
                        placeholder="eg. Study meet with Rebecca"
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group id="location">
                      <Form.Label>Location of event</Form.Label>
                      <Form.Control
                        required
                        type="location"
                        ref={locationRef}
                        placeholder="eg. NUS Central Library 4th floor"
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group id="startDate">
                      <Form.Label>Start date</Form.Label>
                      <Form.Control
                        required
                        type="startDate"
                        ref={startDateRef}
                        placeholder="YYYY-MM-DD"
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group id="endDate">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        required
                        type="endDate"
                        ref={endDateRef}
                        placeholder="YYYY-MM-DD"
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group id="emailInvite">
                      <Form.Label>
                        Email addresses of people you wish to invite
                      </Form.Label>
                      <Form.Control
                        type="emailInvite"
                        ref={emailInviteRef1}
                        placeholder="name@example.com"
                      />
                      <Form.Control
                        type="emailInvite"
                        ref={emailInviteRef2}
                        placeholder="name@example.com"
                      />
                      <Form.Control
                        type="emailInvite"
                        ref={emailInviteRef3}
                        placeholder="name@example.com"
                      />
                    </Form.Group>
                    <br></br>
                    <Button
                      variant="danger"
                      disabled={loading}
                      className="w-100"
                      type="submit"
                    >
                      Create channel
                    </Button>
                  </form>
                </Card.Body>
              </Popup>
            </Container>
          </Row>
        </Container>
      </div>
    </div>
  );
}
