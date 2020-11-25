import React from "react";
import { Alert } from "react-bootstrap";

const ComponentAlert = (props) => {
  return (
    <div className="d-inline">
      <Alert variant={props.variant} className="text-center">
        {props.info}
      </Alert>
    </div>
  );
};

export default ComponentAlert;
