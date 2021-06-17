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
import InviteList from "./InviteList";

export default function Channels() {
  const nameRef = useRef();
  const descriptionRef = useRef();
  const locationRef = useRef();
  const startDateRef = useRef();
  const endDateRef = useRef();

  const db = firebase.firestore();
  //console.log(db)
  const [loading, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //Pop up submission
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoader(true);
    setError("");
    setSuccess("");
    const emails = findAll();
    db.collection("channelsCreatedByUser")
      .add({
        name: nameRef.current.value,
        description: descriptionRef.current.value,
        location: locationRef.current.value,
        start_date: startDateRef.current.value,
        end_date: endDateRef.current.value,
        emails: emails,
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
  //End of Pop up submission

  //-------------------------------------------//

  const [buttonPopup, setButtonPopup] = useState(false);

  //-------------------------------------------//
  const [channels, setChannels] = useState([]);
  const [loadingx, setLoading] = useState(false);

  const ref = firebase.firestore().collection("channelsCreatedByUser");

  function findAll() {
    const emailAddresses = [];
    var inputs = document.getElementsByName("emailAddress");
    for (var i = 0; i < inputs.length; i++) {
      emailAddresses.push(inputs[i].value);
      //console.log(inputs[i].value);
    }

    //console.log(emailAddresses.toString());
    return emailAddresses;
  }

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
              {channels.map((channel, index) => (
                //Rendered Channels
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-center mb-4"
                >
                  <Card style={{ width: 800 }}>
                    <Card.Header className="d-flex justify-content-center">
                      <Card.Title>
                        <h2>{channel.name}</h2>
                      </Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <div className="details">
                        <Card.Text>
                          Description:{" "}
                          {channel.description != null
                            ? channel.description
                            : "N/A"}
                        </Card.Text>
                        <Card.Text>
                          Location:{" "}
                          {channel.location != null ? channel.location : "N/A"}
                        </Card.Text>
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
                        <Card.Text>Invited List: {channel.emails}</Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                //End of Rendered Channels
              ))}

              {/*Pop up */}
              <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <Card.Body>
                  <h3 className="text-center mb-4">
                    Create a channel for your event!
                  </h3>
                  {success && <Alert variant="success">{success}</Alert>}
                  {error && <Alert variant="danger">{error}</Alert>}
                  <form className="text-white" onSubmit={handleSubmit}>
                    <Form.Group id="name">
                      <Form.Label>Name of event</Form.Label>
                      <Form.Control
                        required
                        type="name"
                        ref={nameRef}
                        placeholder="eg. Study Session"
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group id="description">
                      <Form.Label>Description of event</Form.Label>
                      <Form.Control
                        required
                        type="description"
                        ref={descriptionRef}
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
                      <Form.Label>Number of People to Invite: (1-9)</Form.Label>
                      <InviteList />
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
              {/*End of Pop up */}
            </Container>
          </Row>
        </Container>
      </div>
    </div>
  );
}
