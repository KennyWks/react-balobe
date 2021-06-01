import React, { Component } from "react";
import ImageLogo from "../../component/Image";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

class AccessWarn extends Component {
  componentDidUpdate() {
    document.title = `Access - Balobe`;
  }

  render() {
    return (
      <Container className="mt-4">
        <Row>
          <Col md={2}></Col>
          <Col md={8}>
            <div className="text-center">
              <Link to={`/`}>
                <ImageLogo height="auto" width="25%" />
              </Link>
            </div>
            <h5 className="text-center my-4">
              Please <Link to={"/signin"}>Login</Link>/
              <Link to={"/signup"}>Register</Link> some account before access
              the page.
            </h5>
          </Col>
          <Col md={2}></Col>
        </Row>
      </Container>
    );
  }
}

export default AccessWarn;
