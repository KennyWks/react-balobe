import React, { Component } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

class Seler extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <Card.Body>
                <Card.Title>Come and trade with balobe!</Card.Title>
                <Card.Text>Trade in balobe is simple.</Card.Text>
                <Button variant="primary">Trade Now!</Button>
              </Card.Body>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Seler;
