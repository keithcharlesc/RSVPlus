import React from "react";
//Component used in Channels
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
          <input type="text" name="emailAddress" placeholder="Gmail Address" />
        </div>
      );
    }
    return inputs;
  }

  render() {
    //console.log(this.state.inputSize);
    return (
      <div>
        <input
          type="tel"
          name="quantity"
          min="1"
          max="9"
          maxLength="1"
          onChange={(value) => this.handleOnChange(value)}
        />
        <div>{this.renderInputs(this.state.inputSize)}</div>
      </div>
    );
  }
}
