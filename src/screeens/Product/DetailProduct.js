import React, { Component } from "react";
import ReactStars from "react-rating-stars-component";
import ColoredLine from "../../component/ColoredLine";
import Spinner from "../../component/Spinner";
import Button from "../../component/Button";
import Alert from "../../component/Alert";
import user from "../../assets/img/user.JPG";
import Header from "../Layout/Templates";
import { Footer } from "../Layout/Templates";
import { connect } from "react-redux";
import { format } from "date-fns";
import { MdPlace } from "react-icons/md";
import {
  BsFillInfoCircleFill,
  BsFillShieldFill,
  BsStarFill,
} from "react-icons/bs";
import { Container, Row, Col, Form, Card, Media } from "react-bootstrap";
import { getData, postData } from "../../helpers/CRUD";

class DetailProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailProduct: {},
      carts: {
        id_user: "",
        id_item: "",
        id_pelapak: "",
        total_item: 1,
        price: "",
        courier: 0,
      },
      onLoad: true,
      onCheck: false,
      alert: "",
      message: "",
      city: {},
      formSend: {
        origin: "",
        destination: "",
        weight: "",
        courier: "",
      },
      resultCourier: [],
      review: {},
      formReview: {
        id_user: props.isLogin ? props.id_user : "",
        id_item: parseInt(this.props.match.params.id),
        rating: 1,
        review: "-",
      },
      disabled: "false",
    };
  }

  componentDidMount() {
    this.getDetailProduct();
    document.title = `Product - Balobe`;
  }

  getDetailProduct = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const responseItem = await getData(`/item/${this.props.match.params.id}`);
      const responseCity = await getData(`/api/rajaongkir/city`);
      if (responseItem.status === 200 && responseCity.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          detailProduct: responseItem.data.data,
          city: responseCity.data.data.rajaongkir.results,
        }));
        await this.handleSetOriginWeight();
      }
      const responseReview = await getData(
        `/item/review/item/${this.props.match.params.id}`
      );
      if (responseReview.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          review: responseReview.data.data,
        }));
      }
    } catch (error) {
      if (!error.response) {
        alert("Server error! please try again.");
      } else {
        if (error.response.status === 500) {
          alert("Something error! please try again.");
        } else {
          alert(`${error.response.data.data.msg}`);
        }
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      onLoad: false,
    }));
  };

  handleSetOriginWeight = () => {
    this.setState((prevState) => ({
      ...prevState,
      formSend: {
        ...prevState.formSend,
        origin: this.state.detailProduct.city,
        weight: this.state.detailProduct.weight * 1,
      },
    }));
  };

  handleStarRating = (rating) => {
    let star = [];
    for (let i = 0; i < rating; i++) {
      star.push(<BsStarFill key={i} />);
    }
    return star;
  };

  handleInputDestination = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState((prevState) => ({
      ...prevState,
      formSend: {
        ...prevState.formSend,
        [name]: value,
      },
    }));
  };

  handleInputCourier = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      resultCourier: [],
    }));

    const name = e.target.name;
    const value = e.target.value;
    this.setState((prevState) => ({
      ...prevState,
      formSend: {
        ...prevState.formSend,
        [name]: value,
      },
    }));

    setTimeout(() => {
      this.handleCostCheck();
    }, 500);
  };

  handleCostCheck = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onCheck: true,
    }));
    try {
      const response = await postData(
        `/api/rajaongkir/cost`,
        this.state.formSend
      );
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          resultCourier: response.data.data.rajaongkir.results,
        }));
      }
    } catch (error) {
      if (!error.response) {
        alert("Server error! please try again.");
      } else {
        if (error.response.status === 500) {
          alert("Something error! please try again.");
        }
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      onCheck: false,
    }));
  };

  handleInputServices = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState((prevState) => ({
      ...prevState,
      carts: {
        ...prevState.carts,
        [name]: value,
      },
    }));
  };

  handleInputOrder = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      carts: {
        ...prevState.carts,
        courier: 0,
      },
    }));

    const name = e.target.name;
    const value = e.target.value;
    if (value > this.state.detailProduct.quantity || value < 1) {
      this.setState((prevState) => ({
        ...prevState,
        disabled: "true",
      }));
    } else {
      this.setState((prevState) => ({
        carts: {
          ...prevState.carts,
          [name]: value,
        },
      }));
      this.setState((prevState) => ({
        formSend: {
          ...prevState.formSend,
          weight: value * this.state.formSend.weight,
        },
      }));
      setTimeout(() => {
        this.handleCostCheck();
      }, 500);
    }
  };

  handleSetCartsState = () => {
    this.setState((prevState) => ({
      ...prevState,
      carts: {
        ...prevState.carts,
        id_user: this.props.id_user,
        id_item: this.state.detailProduct.id_item,
        id_pelapak: this.state.detailProduct.id_pelapak,
        price: this.state.detailProduct.price,
      },
    }));
  };

  handleSubmitCarts = async (e) => {
    e.preventDefault();
    const element = document.activeElement;
    const buyBtn = element.classList.contains("buy-btn");
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    if (this.props.isLogin) {
      if (this.state.carts.courier !== 0) {
        await this.handleSetCartsState();
        try {
          const response = await postData(`/carts`, this.state.carts);
          // console.log(response)
          this.setState((prevState) => ({
            ...prevState,
            carts: {
              ...prevState.carts,
              total_item: 1,
              courier: 0,
            },
          }));
          if (buyBtn === true) {
            this.props.history.push("/carts");
          } else {
            alert(`${response.data.data.msg}`);
          }
        } catch (error) {
          if (!error.response) {
            alert("Server error! please try again.");
          } else {
            if (error.response.status === 500) {
              alert("Something error! please try again.");
            } else {
              alert(`${error.response.data.data.msg}`);
            }
          }
        }
      } else {
        alert("Please select your courier services");
      }
    } else {
      alert("Please login before continue the process");
    }
    this.setState((prevState) => ({
      ...prevState,
      onLoad: false,
    }));
  };

  handleInputReview = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState((prevState) => ({
      ...prevState,
      formReview: {
        ...prevState.formReview,
        [name]: value,
      },
    }));
  };

  handleRatingChange = (newRating) => {
    this.setState((prevState) => ({
      ...prevState,
      formReview: {
        ...prevState.formReview,
        rating: newRating,
      },
    }));
  };

  handleSubmitReview = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await postData(`/item/review`, this.state.formReview);
      // console.log(response);
      if (response.status === 201) {
        this.setState((prevState) => ({
          ...prevState,
          formReview: {
            ...prevState.formReview,
            rating: 1,
            review: "-",
          },
        }));
        alert(`${response.data.data.msg}`);
      }
    } catch (error) {
      if (!error.response) {
        alert("Server error! please try again.");
      } else {
        if (error.response.status === 500) {
          alert("Something error! please try again.");
        } else {
          alert(`${error.response.data.data.msg}`);
        }
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      onLoad: false,
    }));
    this.getDetailProduct();
  };

  setCityofUser = (city) => {
    const dataCity = this.state.city.filter(function (v) {
      return v.city_id === `${city}`;
    });
    return dataCity[0].city_name;
  };

  render() {
    const { detailProduct, review, onLoad, city, onCheck, resultCourier } =
      this.state;
    const url =
      process.env.REACT_APP_ENVIROMENT === "production"
        ? process.env.REACT_APP_URL_IMAGES_PRODUCTION
        : process.env.REACT_APP_URL_IMAGES_DEVELOPMENT;
    return (
      <div>
        <Header />
        {onLoad && <Spinner class="text-center my-3" />}
        {!onLoad && (
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
                            // src={`${url}/${detailProduct.image.replace(
                            //   "/",
                            //   "%2F"
                            // )}?alt=media`}
                            src={`${url}/${
                              process.env.REACT_APP_ENVIROMENT === "production"
                                ? `${detailProduct.image.replace(
                                    "/",
                                    "%2F"
                                  )}?alt=media`
                                : detailProduct.image
                            }`}
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
                                  IDR {detailProduct.price}
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

                            <div className="card-text">
                              <small className="text-muted">
                                <BsFillShieldFill /> Product Guarantee, 100%
                                money back, if damaged or not original
                              </small>
                            </div>

                            <ColoredLine margin="20px" color="#F8F9FA" />

                            <Row>
                              <Col md={4}>
                                <div className="text-muted">
                                  Pelapak location (City)
                                </div>
                                <Row>
                                  <Col>
                                    <div className="text-bold">
                                      {this.setCityofUser(detailProduct.city)}
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
                                        value={this.state.formSend.destination}
                                        onChange={this.handleInputDestination}
                                        onFocus={this.handleInputDestination}
                                      >
                                        <option defaultValue>
                                          Select destination
                                        </option>
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
                              <Col md={3}>
                                <div className="text-muted">Courier</div>
                                <Row>
                                  <Col>
                                    <Form.Group controlId="courier">
                                      <Form.Control
                                        as="select"
                                        name="courier"
                                        value={this.state.formSend.courier}
                                        onChange={this.handleInputCourier}
                                      >
                                        <option defaultValue>
                                          Select courier
                                        </option>
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
                                {onCheck && (
                                  <Spinner class="text-center my-3" />
                                )}

                                {!onCheck && !resultCourier.length > 0 && (
                                  <div
                                    style={{
                                      textAlign: "center",
                                      margin: "10px",
                                    }}
                                  >
                                    Data courier empty.
                                  </div>
                                )}

                                {!onCheck && resultCourier.length > 0 && (
                                  <Form.Group controlId="exampleForm.SelectCustom">
                                    <Form.Control
                                      as="select"
                                      custom
                                      onChange={this.handleInputServices}
                                      name="courier"
                                    >
                                      <option defaultValue>
                                        Select courier services
                                      </option>
                                      {resultCourier[0].costs.map((v, i) => (
                                        <option
                                          key={i}
                                          value={v.cost.map((val) => val.value)}
                                        >
                                          {v.service} - {v.description} |
                                          {v.cost.map(
                                            (val, index) =>
                                              ` IDR ${val.value} |
                                              Estimasi Pengiriman ${val.etd}
                                              Hari`
                                          )}
                                        </option>
                                      ))}
                                    </Form.Control>
                                  </Form.Group>
                                )}
                              </Col>
                            </Row>

                            <Form onSubmit={this.handleSubmitCarts}>
                              <input
                                type="hidden"
                                name="id_item"
                                value={detailProduct.id_item}
                              />
                              <input
                                type="hidden"
                                name="id_pelapak"
                                value={detailProduct.id_pelapak}
                              />
                              <input
                                type="hidden"
                                name="price"
                                value={detailProduct.price}
                              />

                              <Row>
                                <Col md={2}>
                                  <span>Order</span>
                                </Col>
                                <Col md={2}>
                                  <Form.Group controlId="total_item">
                                    <Form.Control
                                      type="number"
                                      name="total_item"
                                      min="1"
                                      placeholder="Your Total Order"
                                      value={this.state.carts.total_item}
                                      onChange={this.handleInputOrder}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <div className="d-inline">
                                <Button
                                  variant="outline-dark"
                                  className="mr-3 chat-btn"
                                  size="lg"
                                  type="submit"
                                  name="chat"
                                />

                                <Button
                                  variant="outline-dark"
                                  className="mr-3 add-btn"
                                  size="lg"
                                  type="submit"
                                  disabled={this.state.disabled}
                                  name="Add to Carts"
                                />

                                <Button
                                  variant="outline-primary"
                                  className="mr-3 buy-btn"
                                  size="lg"
                                  type="submit"
                                  disabled={this.state.disabled}
                                  name="Buy Now"
                                />
                              </div>
                            </Form>

                            <div className="mt-4">
                              <h6>
                                <BsFillInfoCircleFill /> Pay before 13:00 WIB so
                                that the goods are shipped today
                              </h6>
                              <h6>
                                <BsFillInfoCircleFill /> Processing time 5
                                working days
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
                                  <MdPlace />{" "}
                                  {this.setCityofUser(detailProduct.city)}
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
              <p style={{ textAlign: "center" }}>Items is empty</p>
            )}

            {this.props.isLogin && Object.keys(detailProduct).length > 0 && (
              <Container>
                <ColoredLine margin="10px" color="#F8F9FA" />
                <Card>
                  <Card.Body>
                    <Row>
                      <Col>
                        {!this.state.alert !== "" && (
                          <Alert
                            variant={this.state.alert}
                            info={this.state.message}
                          />
                        )}
                        {!this.state.onSubmit && (
                          <div>
                            <h3>Add Some Review</h3>
                            <Form onSubmit={this.handleSubmitReview}>
                              <Form.Group controlId="review">
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  name="review"
                                  onChange={this.handleInputReview}
                                />
                              </Form.Group>
                              <ReactStars
                                count={5}
                                onChange={this.handleRatingChange}
                                size={24}
                                activeColor="#ffd700"
                              />
                              <Button
                                variant="primary"
                                type="submit"
                                name="Send"
                                className="send-btn"
                              />
                            </Form>
                          </div>
                        )}
                        {this.state.onSubmit && (
                          <div className="text-center my-2">
                            <Spinner class="text-center my-3" />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Container>
            )}

            <Container>
              <ColoredLine margin="10px" color="#F8F9FA" />
              <Card>
                <Card.Body>
                  <Row>
                    <Col>
                      <h3>Review</h3>
                      {!this.props.isLogin && (
                        <small>
                          Please login to say something about this item.
                        </small>
                      )}
                    </Col>
                    <Col>
                      {review.length > 0 &&
                        review.map((v, i) => (
                          <div className="mb-2" key={i}>
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
                                      {this.handleStarRating(v.rating)}
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
                        <p>Review for this item is empty.</p>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Container>
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.isLogin,
    id_user: state.id_user,
  };
};

export default connect(mapStateToProps)(DetailProduct);
