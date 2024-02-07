import React from "react";
import { Row, Col, Card } from "react-bootstrap";

function DetailArticle(props) {
  const { article_name, category_name, image, description } =
    props.location.state;
  return (
    <div>
      <Row className="mx-5 my-2" style={{ marginTop: 10 }}>
        <Col className="sm-mb-4" md={12}>
          <h1
            style={{
              marginTop: 10,
              marginBottom: 10,
              width: "900px",
            }}
          >
            {article_name}
          </h1>
          <Card className="bg-dark text-white" style={{ width: "900px" }}>
            <Card.Img
              src={image}
              alt="Card image"
              style={{ height: "500px" }}
            />
          </Card>

          <Row>
            <Col>
              <div style={{ marginBottom: 5 }}>
                {"Category " + category_name}
              </div>
              <p
                style={{
                  textAlign: "justify",
                  width: "900px",
                }}
              >
                {description}
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default DetailArticle;
