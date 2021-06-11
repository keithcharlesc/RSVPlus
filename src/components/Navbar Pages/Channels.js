import React from "react";
import { Container } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import ReactDOM from 'react-dom';

export default function Channels() {
      return (
        <div>
          <NavigationBar />
          <div className="p-3 mb-2 bg-dark text-white">
            <Container
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "100vh" }}
            >
              <form>
                <h1> Form to create an event </h1>
                <p>Name of event :</p>
                <input
                  type='text'
                />
                <p className= "mt-2">Location of your event :</p>
                <input
                  type='text'
                />
                <p className= "mt-2">Start date :</p>
                <input
                  type='text'
                />
                <p className= "mt-2">End date :</p>
                <input
                  type='text'
                />
                <p className= "mt-2">Email adresses of people you wish to invite :</p>
                <input
                  type='text'
                />
              </form>
            </Container>
          </div>
        </div>
      );
    }
