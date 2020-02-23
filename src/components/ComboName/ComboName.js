import React from "react";
import { Input } from "antd";
import "./ComboName.css";

function ComboName(props) {
  return (
    <div className="nameContainer">
      <Input className="comboInput" placeholder="Enter combo name" />
    </div>
  );
}

export default ComboName;
