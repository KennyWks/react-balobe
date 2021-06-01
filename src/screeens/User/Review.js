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
      load: false,
      show: false,
      onLoadForm: false,
      message: "",
      alert: "",
      onSubmit: "",
      form: {
        id: "",
        review: "",
        rating: "",
      },
    };
  }

  componentDidUpdate() {
    document.title = `My Review - Balobe`;
  }

  getReview = async () => {
    this.setState((prevState) => ({
      ...prevState,
      load: true,
    }));
    try {
      const response = await getData(`/item/review/user`);
      this.setState((prevState) => ({
        ...prevState,
        dataReview: response.data,
      }));
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      load: false,
    }));
  };

  star = (rating) => {
    let star = [];
    for (let i = 0; i < rating; i++) {
      star.push(<BsStarFill key={i} />);
    }
    return star;
  };

  componentDidMount() {
    this.getReview();
  }

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
      console.log(error);
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

  ratingChanged = (newRating) => {
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
          message: "Your comment is updated!",
          alert: "success",
        }));
      } else {
        this.setState((prevState) => ({
          ...prevState,
          message: "Your comment isn't updated!",
          alert: "danger",
        }));
      }
      this.getReview();
      this.handleClose();
    } catch (error) {
      console.log(error);
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
              {this.state.load && (
                <div className="text-center my-2">
                  <Spinner class="text-center my-3" />
                </div>
              )}

              {!this.state.load &&
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
                          {this.star(v.rating)}
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
                              onChange={this.ratingChanged}
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
