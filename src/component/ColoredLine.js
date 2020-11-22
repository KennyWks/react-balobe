import React from "react";

const ColoredLine = ({ color, margin }) => (
  <hr
    style={{
      color: color,
      height: 5,
      marginTop: margin,
    }}
  />
);

export default ColoredLine;
