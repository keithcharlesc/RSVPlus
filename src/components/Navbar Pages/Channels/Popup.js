import React from "react";
import "./Popup.css";
import Channels from "./Channels";

function Popup(props) {
  return props.trigger ? (
    <div className="backdrop">
      <div className="popup">
        <div className="popup-inner">
          <button className="close-btn" onClick={() => props.setTrigger(false)}>
            {" "}
            X{" "}
          </button>
          {props.children}
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;
