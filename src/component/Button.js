import React from "react";
import { Button } from "react-bootstrap";

const ComponentButton = (props) => {
  return (
    <Button
      variant={props.variant}
      className={props.className}
      size={props.size}
      type={props.type}
    >
      {props.name}
    </Button>
  );
};

export default ComponentButton;
