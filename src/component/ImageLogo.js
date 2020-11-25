import React from "react";
import { Image } from "react-bootstrap";
import logoKail from "../assets/img/logo-kail.JPG";

const ComponentImage = (props) => {
  return (
    <Image
      src={logoKail}
      alt="Balobe"
      roundedCircle
      style={{
        width: props.width,
        height: props.height,
        // width: "25%",
        // height: "auto",
      }}
    />
  );
};

export default ComponentImage;
