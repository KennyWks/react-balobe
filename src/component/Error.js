import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const Error = (props) => {
  console.log(props);
  return (
    <Container>
      <Row className="justify-content-center text-center mt-3">
        <Col md={8}>
          <h1 style={{ color: "red" }}>404</h1>
          <div>
            Page not found!&nbsp;
            <Button
              className="m-0 p-0"
              variant="link"
              onClick={() => props.history.go(-1)}
            >
              Go Back
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Error;
