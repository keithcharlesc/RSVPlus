import React from "react";
import { Form } from "react-bootstrap";
//Component used in Channels.js
export default class InviteList extends React.Component {
  constructor() {
    super();
    this.state = {
      inputSize: 0,
    };
  }

  handleOnChange(value) {
    this.setState({
      inputSize: value.target.value,
    });
  }

  renderInputs(value) {
    const inputs = [];
    for (let i = 0; i < value; i++) {
      inputs.push(
        <div key={i}>
          <Form.Control
            type="email"
            name="emailAddress"
            placeholder="Gmail Address of RSVP+ User"
            required
          />
        </div>
      );
    }
    return inputs;
  }

  render() {
    //console.log(this.state.inputSize);
    return (
      <div>
        <Form.Control
          type="tel"
          name="quantity"
          min="1"
          max="9"
          maxLength="1"
          required
          placeholder="Input a number from 1 to 9"
          onChange={(value) => this.handleOnChange(value)}
        />
        <div>{this.renderInputs(this.state.inputSize)}</div>
      </div>
    );
  }
}
