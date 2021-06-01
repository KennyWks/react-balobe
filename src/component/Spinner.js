import React from "react";
import { Spinner } from "react-bootstrap";

const ComponentSpinner = (props) => {
  return (
    <div className={props.class}>
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default ComponentSpinner;
