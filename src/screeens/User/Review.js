import React, { Component } from "react";
import { getData, patchData } from "../../helpers/CRUD";
import {
  Container,
  Row,
  Col,
  Card,
  Media,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { BsStarFill } from "react-icons/bs";
import ReactStars from "react-rating-stars-component";
import user from "../../assets/img/user.JPG";
import Spinner from "../../component/Spinner";
import Alert from "../../component/Alert";
import "../../assets/css/style.css";
// import "../../assets/js/script.js";

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataReview: {
        data: [],
        metadata: {},
      },
      onLoad: false,
      show: false,
      onLoadForm: false,
      message: "",
      alert: "",
      onSubmit: "",
      form: {
        id: "",
        review: "-",
        rating: 0,
      },
    };
  }

  componentDidMount() {
    document.title = `My Review - Balobe`;
    this.getReview();
  }

  getReview = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await getData(`/item/review/user`);
      this.setState((prevState) => ({
        ...prevState,
        dataReview: response.data,
      }));
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
      onLoad: false,
    }));
  };

  handleStarRating = (rating) => {
    let star = [];
    for (let i = 0; i < rating; i++) {
      star.push(<BsStarFill key={i} />);
    }
    return star;
  };

  handleShow = async (e) => {
    this.setState((prevState) => ({
      ...prevState,
      onLoadForm: true,
    }));
    const id = e.target.id;
    try {
      const response = await getData(`/item/review/${id}`);
      this.setState((prevState) => ({
        ...prevState,
        form: {
          id: response.data.data.id,
          review: response.data.data.review,
          rating: response.data.data.rating,
        },
      }));
    } catch (error) {
      if (!error.response) {
        alert("Server error! please try again.");
      } else {
        if (error.response.status === 500) {
          alert("Something error! please try again.");
        } else {
          alert(error.response.data.error.msg);
        }
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      onLoadForm: false,
    }));
    this.setState((prevState) => ({
      ...prevState,
      show: true,
    }));
  };

  handleClose = () => {
    this.setState((prevState) => ({
      ...prevState,
      show: false,
    }));
  };

  handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [name]: value,
      },
    }));
  };

  handleRatingChanged = (newRating) => {
    this.setState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        rating: newRating,
      },
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await patchData(
        `/item/review/${this.state.form.id}`,
        this.state.form
      );
      // console.log(response);
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          form: {
            review: "",
            rating: "",
          },
          message: response.data.data.msg,
          alert: "success",
        }));
      }
      this.getReview();
      this.handleClose();
    } catch (error) {
      if (!error.response) {
        alert("Server error! please try again.");
      } else {
        if (error.response.status === 500) {
          alert("Something error! please try again.");
        } else {
          this.setState((prevState) => ({
            ...prevState,
            message: error.response.data.error.msg,
            alert: "danger",
          }));
        }
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: false,
    }));
  };

  render() {
    const { dataReview } = this.state;
    return (
      <Container>
        <Row>
          <Col>
            <Card.Body>
              {this.state.onLoad && (
                <div className="text-center my-2">
                  <Spinner class="text-center my-3" />
                </div>
              )}

              {this.state.alert === "success" && (
                <Alert
                  variant={this.state.alert}
                  info={this.state.message}
                  className="mt-2"
                />
              )}

              {this.state.alert === "danger" && (
                <Alert
                  variant={this.state.alert}
                  info={this.state.message}
                  className="mt-2"
                />
              )}

              {!this.state.onLoad &&
                dataReview.data.length > 0 &&
                dataReview.data.map((v, i) => (
                  <ul className="list-unstyled" key={i}>
                    <Media as="li">
                      <img
                        width={64}
                        height={64}
                        className="mr-3 rounded-circle"
                        src={user}
                        alt="icon user"
                      />
                      <Media.Body>
                        <h5 style={{ color: "yellow" }}>
                          {this.handleStarRating(v.rating)}
                        </h5>
                        <p>{v.review}</p>
                      </Media.Body>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={this.handleShow}
                      >
                        {this.state.onLoadForm && (
                          <Spinner class="text-center my-0" />
                        )}
                        {!this.state.onLoadForm && <span id={v.id}>Edit</span>}
                      </Button>

                      <Modal
                        show={this.state.show}
                        onHide={this.handleClose}
                        animation={false}
                      >
                        <Form onSubmit={this.handleSubmit}>
                          <Modal.Header closeButton>
                            <Modal.Title>Edit review</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form.Group controlId="review">
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name="review"
                                value={this.state.form.review}
                                onChange={this.handleInput}
                              />
                            </Form.Group>
                            <ReactStars
                              count={5}
                              onChange={this.handleRatingChanged}
                              size={24}
                              activeColor="#ffd700"
                            />
                          </Modal.Body>
                          <Modal.Footer>
                            <Button type="submit" className="btn btn-primary">
                              {this.state.onSubmit && (
                                <Spinner class="text-center my-0" />
                              )}
                              {!this.state.onSubmit && <span>Save</span>}
                            </Button>
                          </Modal.Footer>
                        </Form>
                      </Modal>
                    </Media>
                  </ul>
                ))}
            </Card.Body>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Review;
