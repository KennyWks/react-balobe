import React, { Component } from "react";
import { getData } from "../../helpers/CRUD";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, CardDeck, Spinner } from "react-bootstrap";
import { BsStarFill } from "react-icons/bs";
import bodyProduct from "../../assets/css/styleCustom.module.css";
import Cards from "../../component/Cards";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listProduct: {
        data: [],
        metadata: {},
        q: {},
        load: true,
      },
    };
  }

  getProduct = async (props) => {
    this.setState((prevState) => ({
      ...prevState,
      load: true,
    }));
    try {
      const response = await getData(`/item${!props ? "" : props}`);
      this.setState((prevState) => ({
        ...prevState,
        listProduct: response.data.data,
      }));
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      load: false,
    }));
  };

  componentDidMount() {
    this.getProduct(this.props.location.search);
  }

  star = (rating) => {
    let star = [];
    for (let i = 0; i < rating; i++) {
      star.push(<BsStarFill />);
    }
    return star;
  };

  render() {
    const { listProduct, load } = this.state;
    return (
      <div>
        <Cards />
        {load && (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        <Row className="mt-4 mx-2">
          {listProduct.length > 0 &&
            listProduct.map((v, i) => (
              <Col md={3}>
                <CardDeck>
                  <Card
                    style={{
                      boxShadow:
                        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                    }}
                    className="my-1"
                  >
                    <Link
                      to={`item/${v.id_item}`}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={`https://firebasestorage.googleapis.com/v0/b/balobe-d2a28.appspot.com/o/${v.image.replace(
                          "/",
                          "%2F"
                        )}?alt=media`}
                      />
                      <Card.Body className={bodyProduct.productBody}>
                        <div
                          style={{
                            fontFamily: "Hind Madurai, sans-serif",
                            style: "normal",
                            weight: 400,
                            size: "14px",
                            lineHeight: "21px",
                            color: "#141414",
                          }}
                        >
                          {v.name}
                        </div>
                        <Row>
                          <Col md={6}>
                            <div
                              style={{
                                fontFamily: "Hind Madurai, sans-serif",
                                style: "normal",
                                weight: 600,
                                size: "20px",
                                lineHeight: "24px",
                                color: "#141414",
                              }}
                            >
                              Rp {v.price}
                            </div>
                          </Col>
                          <Col className="text-right" md={6}>
                            <small className="text-bold">
                              {v.rating === null ? (
                                "Not Rating"
                              ) : (
                                <div style={{ color: "yellow" }}>
                                  {this.star(v.rating)}
                                </div>
                              )}
                            </small>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Link>
                  </Card>
                </CardDeck>
              </Col>
            ))}
        </Row>
      </div>
    );
  }
}

export default Home;
