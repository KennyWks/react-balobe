import React, { Component } from "react";
import { format } from "date-fns";
import { MdPlace } from "react-icons/md";
import {
  BsFillInfoCircleFill,
  BsFillShieldFill,
  BsStarFill,
} from "react-icons/bs";
import { Container, Row, Col, Form, Card, Media } from "react-bootstrap";
import { getData, postData } from "../../helpers/CRUD";
import ColoredLine from "../../component/ColoredLine";
import user from "../../assets/img/user.JPG";
import Spinner from "../../component/Spinner";
import Button from "../../component/Button";

class DetailProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailProduct: {},
      review: {},
      load: true,
      carts: {
        id_item: "",
        name_item: "",
        total_item: "",
        price: "",
      },
      onSubmit: false,
      onCheck: "",
      weight: "",
      city: {},
      resultCourier: {},
      form: {
        destination: "",
        courier: "",
        origin: "",
        weight: "",
      },
    };
  }

  getDetailProduct = async () => {
    this.setState((prevState) => ({
      ...prevState,
      load: true,
    }));
    try {
      const response = await getData(`/item/${this.props.match.params.id}`);
      const cityDesti = await getData(`/api/rajaongkir/city`);
      if (response) {
        this.setState((prevState) => ({
          ...prevState,
          detailProduct: response.data.data,
          weight: response.data.data.weight,
          city: cityDesti.data.data.rajaongkir.results,
        }));
      }
      const responseReview = await getData(
        `/item/review/item/${this.props.match.params.id}`
      );
      if (responseReview) {
        this.setState((prevState) => ({
          ...prevState,
          review: responseReview.data.data,
        }));
      }
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      load: false,
    }));
  };

  componentDidMount() {
    this.getDetailProduct();
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
    }));
    try {
      const response = await postData(`/carts`, this.state.carts);
      // console.log(response)
      this.setState((prevState) => ({
        ...prevState,
        carts: {
          id_item: "",
          name_item: "",
          total_item: "",
          price: "",
        },
      }));
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: false,
    }));
  };

  handleInput = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      carts: {
        ...prevState.carts,
        id_item: this.state.detailProduct.id_item,
        name_item: this.state.detailProduct.name_product,
        total_item: e.target.value,
        price: this.state.detailProduct.price,
      },
    }));
  };

  handleDestination = (e) => {
    const value = e.target.value;
    this.setState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        destination: value,
        origin: 14,
        weight: this.state.weight,
      },
    }));
  };

  handleCourier = (e) => {
    const value = e.target.value;
    this.setState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        courier: value,
      },
    }));
    this.handleCekOngkir();
  };

  handleCekOngkir = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onCheck: "check",
    }));
    try {
      const response = await postData(`/api/rajaongkir/cost`, this.state.form);
      console.log(response);
      if (response) {
        this.setState((prevState) => ({
          ...prevState,
          resultCourier: response.data.data.rajaongkir,
        }));
      }
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      onCheck: "endCheck",
    }));
  };

  Star = (rating) => {
    let star = [];
    for (let i = 0; i < rating; i++) {
      star.push(<BsStarFill />);
    }
    return star;
  };

  render() {
    const {
      detailProduct,
      review,
      load,
      city,
      onCheck,
      resultCourier,
    } = this.state;
    console.log(this.props);
    return (
      <div>
        {load && <Spinner />}
        {!load && (
          <div>
            {Object.keys(detailProduct).length > 0 && (
              <Container>
                <ColoredLine margin="40px" color="#F8F9FA" />
                <Row>
                  <Col md={12}>
                    <div className="card mb-3" style={{ maxWidth: "auto" }}>
                      <div className="row no-gutters">
                        <div className="col-md-4">
                          <img
                            src={`https://firebasestorage.googleapis.com/v0/b/balobe-d2a28.appspot.com/o/${detailProduct.image.replace(
                              "/",
                              "%2F"
                            )}?alt=media`}
                            className="card-img"
                            alt={detailProduct.name}
                          />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h2
                              style={{
                                textTransform: "capitalize",
                              }}
                              className="card-title"
                            >
                              {detailProduct.name_product}
                            </h2>

                            <Row className="mt-5">
                              <Col md={5}>
                                <h5
                                  style={{
                                    textTransform: "capitalize",
                                  }}
                                  className="card-title text-primary"
                                >
                                  Rp {detailProduct.price}
                                </h5>
                              </Col>
                              <Col md={5}>
                                <h5
                                  style={{
                                    textTransform: "capitalize",
                                    color: "red",
                                  }}
                                  className="card-title"
                                >
                                  Stock {detailProduct.quantity}
                                </h5>
                              </Col>
                            </Row>

                            <p className="card-text">
                              <small className="text-muted">
                                <BsFillShieldFill /> Product Guarantee, 100%
                                money back, if damaged or not original
                              </small>
                            </p>

                            <ColoredLine margin="20px" color="#F8F9FA" />

                            <Row>
                              <Col md={3}>
                                <div className="text-muted">
                                  Pelapak location
                                </div>
                                <Row>
                                  <Col>
                                    <div className="text-bold">
                                      {detailProduct.location}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                              <Col md={5}>
                                <div className="text-muted">
                                  Location to send (City)
                                </div>
                                <Row>
                                  <Col>
                                    <Form.Group controlId="destination">
                                      <Form.Control
                                        as="select"
                                        name="destination"
                                        value={this.state.form.destination}
                                        onChange={this.handleDestination}
                                      >
                                        <option value="">Select</option>
                                        {city.map((v, i) => (
                                          <option key={i} value={v.city_id}>
                                            {v.city_name}
                                          </option>
                                        ))}
                                      </Form.Control>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col md={4}>
                                <div className="text-muted">Courier</div>
                                <Row>
                                  <Col>
                                    <Form.Group controlId="courier">
                                      <Form.Control
                                        as="select"
                                        name="courier"
                                        value={this.state.form.courier}
                                        onChange={this.handleCourier}
                                      >
                                        <option value="">Select</option>
                                        <option value="jne">JNE</option>
                                        <option value="tiki">TIKI</option>
                                        <option value="pos">
                                          Pos Indonesia
                                        </option>
                                      </Form.Control>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            <Row>
                              <Col>
                                {onCheck === "check" && <Spinner />}

                                {onCheck === "" && (
                                  <div
                                    style={{
                                      textAlign: "center",
                                      margin: "10px",
                                    }}
                                  >
                                    -
                                  </div>
                                )}
                              </Col>
                            </Row>

                            <Form onSubmit={this.handleSubmit}>
                              <input
                                type="hidden"
                                name="id_item"
                                value={detailProduct.id_item}
                              />
                              <input
                                type="hidden"
                                name="name_item"
                                value={detailProduct.name_product}
                              />
                              <input
                                type="hidden"
                                name="price"
                                value={detailProduct.price}
                              />

                              <Row>
                                <Col md={4}>
                                  <Form.Group controlId="total_item">
                                    <Form.Control
                                      type="number"
                                      name="total_item"
                                      placeholder="Your Total Order"
                                      value={this.state.carts.total_item}
                                      onChange={this.handleInput}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <div className="d-inline">
                                <Button
                                  variant="outline-dark"
                                  className="mr-3"
                                  size="lg"
                                  type="submit"
                                  name="Chat"
                                />

                                <Button
                                  variant="outline-dark"
                                  className="mr-3"
                                  size="lg"
                                  type="submit"
                                  name="Add to Carts"
                                />

                                <Button
                                  variant="outline-primary"
                                  className="mr-3"
                                  size="lg"
                                  type="submit"
                                  name="Buy Now"
                                >
                                  </Button>
                              </div>
                            </Form>

                            <div className="mt-4">
                              <h6>
                                <BsFillInfoCircleFill /> Pay before 13:00 WIB so
                                that the goods are shipped today
                              </h6>
                              <h6>
                                <BsFillInfoCircleFill /> Processing Time 5
                                Working Days
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <ColoredLine margin="10px" color="#F8F9FA" />
                <Card>
                  <Card.Body>
                    <Row>
                      <Col>
                        <h3>Description</h3>
                      </Col>
                      <Col>
                        <ul className="list-unstyled">
                          <Media as="li">
                            <div className="mx-3">
                              <Media.Body>
                                <h5>
                                  Category : {detailProduct.name_category}
                                </h5>
                                <div>HS Code : {detailProduct.hs_code}</div>
                                <p className="card-text">
                                  Weight : {detailProduct.weight}
                                </p>
                                <p
                                  className="card-text"
                                  style={{ textTransform: "capitalize" }}
                                >
                                  {detailProduct.description}
                                </p>
                              </Media.Body>
                            </div>
                          </Media>
                        </ul>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                <ColoredLine margin="10px" color="#F8F9FA" />
                <Card>
                  <Card.Body>
                    <Row>
                      <Col>
                        <h3>Pelapak</h3>
                      </Col>
                      <Col>
                        <ul className="list-unstyled">
                          <Media as="li">
                            <div>
                              <img
                                width={64}
                                height={64}
                                className="mr-3 rounded-circle"
                                src={user}
                                alt="Generic placeholder"
                              />
                            </div>
                            <div className="mx-3">
                              <Media.Body>
                                <h5>{detailProduct.name_pelapak}</h5>
                                <div>
                                  <MdPlace /> {detailProduct.location}
                                </div>
                                <p
                                  className="card-text"
                                  style={{ textTransform: "capitalize" }}
                                >
                                  {detailProduct.desc_pelapak}
                                </p>
                              </Media.Body>
                            </div>
                          </Media>
                        </ul>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Container>
            )}

            {!(Object.keys(detailProduct).length > 0) && (
              <p style={{ textAlign: "center" }}>Data is empty</p>
            )}

            <Container>
              <ColoredLine margin="10px" color="#F8F9FA" />
              <Card>
                <Card.Body>
                  <Row>
                    <Col>
                      <h3>Review</h3>
                    </Col>
                    <Col>
                      {review.length > 0 &&
                        review.map((v) => (
                          <div className="mb-2">
                            <ul className="list-unstyled">
                              <Media as="li">
                                <div>
                                  <img
                                    width={64}
                                    height={64}
                                    className="mr-3 rounded-circle"
                                    src={user}
                                    alt="Generic placeholder"
                                  />
                                </div>
                                <div className="mx-3">
                                  <Media.Body>
                                    <h5>{v.username}</h5>
                                    <div style={{ color: "yellow" }}>
                                      {this.Star(v.rating)}
                                    </div>
                                    <p className="text-muted">
                                      Writed at{" "}
                                      {format(
                                        new Date(v.created_at),
                                        "dd MMM yyyy"
                                      )}
                                    </p>
                                    <p
                                      className="card-text"
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {v.review}
                                    </p>
                                  </Media.Body>
                                </div>
                              </Media>
                            </ul>
                          </div>
                        ))}

                      {!(Object.keys(review).length > 0) && (
                        <p>Review for this item is empty</p>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Container>
          </div>
        )}
      </div>
    );
  }
}

export default DetailProduct;
