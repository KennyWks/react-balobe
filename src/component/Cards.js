import React, { Component } from "react";
import { Row, Col, Card } from "react-bootstrap";
import udang from "../assets/img/udang.jpg";
import cakalang from "../assets/img/cakalang.jpg";
import cumi from "../assets/img/cumi.jpg";

class Cards extends Component {
  render() {
    return (
      <Row style={{ margin: 10 }}>
        <Col className="sm-mb-4" md={5}>
          <Card className="bg-dark text-white ">
            <Card.Img
              src={cumi}
              alt="Card image for squids"
              style={{ height: "400px" }}
            />
          </Card>
        </Col>
        <Col className="sm-mb-4" md={4}>
          <Card className="bg-dark text-white">
            <Card.Img
              src={cakalang}
              alt="Card image for tuna"
              style={{ height: "400px" }}
            />
          </Card>
        </Col>
        <Col className="sm-mb-4" md={3}>
          <Card className="bg-dark text-white ">
            <Card.Img
              src={udang}
              alt="Card image for chimps"
              style={{ height: "400px" }}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Cards;
