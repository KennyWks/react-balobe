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
  Pagination,
} from "react-bootstrap";
import { BsStarFill } from "react-icons/bs";
import ReactStars from "react-rating-stars-component";
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
      page: 1,
      onLoad: false,
      show: false,
      onLoadForm: false,
      message: "",
      alert: "",
      onSubmit: false,
      form: {
        id: "",
        review: "-",
        rating: 0,
      },
    };
  }

  componentDidMount() {
    document.title = `My Review - Balobe`;
    this.getReview(this.props.location.search);
  }

  getReview = async (url) => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await getData(`/item/review/user${url ? url : ""}`);
      // console.log(response);
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

  handleFirstPage = () => {
    this.setState((prevState) => ({
      ...prevState,
      page: 1,
    }));
    this.getReview(`?page=1&limit=5`);
  };

  handleLastPage = () => {
    const { totalPage } = this.state.dataReview.metadata.pagination;
    this.setState((prevState) => ({
      ...prevState,
      page: totalPage,
    }));
    this.getReview(`?page=${totalPage}&limit=5`);
  };

  handlePrev = () => {
    const counter = this.state.page <= 1 ? 1 : this.state.page - 1;
    this.setState((prevState) => ({
      ...prevState,
      page: counter,
    }));
    this.getReview(`?page=${counter}&limit=5`);
  };

  handleNext = () => {
    const { totalPage } = this.state.dataReview.metadata.pagination;
    const counter =
      this.state.page === totalPage ? totalPage : this.state.page + 1;

    this.setState((prevState) => ({
      ...prevState,
      page: counter,
    }));
    this.getReview(`?page=${counter}&limit=5`);
  };

  handleEllipsis = () => {
    const { currentPage } = this.state.dataReview.metadata.pagination;
    const counter = Math.floor(currentPage / 5);
    this.setState((prevState) => ({
      ...prevState,
      page: counter,
    }));
    this.getReview(`?page=${counter}&limit=5`);
  };

  paginationItem = () => {
    let pagination = [];
    for (let i = 1; i <= 5; i++) {
      pagination.push(<Pagination.Item>{i}</Pagination.Item>);
    }
    return pagination;
  };

  render() {
    const { data, metadata } = this.state.dataReview;
    const url =
      process.env.REACT_APP_ENVIROMENT === "production"
        ? process.env.REACT_APP_URL_IMAGES_PRODUCTION
        : process.env.REACT_APP_URL_IMAGES_DEVELOPMENT;
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

              {!this.state.onLoad && !data.length > 0 && (
                <p style={{ textAlign: "center" }}>Review's is empty</p>
              )}

              {!this.state.onLoad &&
                data.length > 0 &&
                data.map((v, i) => (
                  <ul className="list-unstyled" key={i}>
                    <Media as="li">
                      <img
                        width={70}
                        height={70}
                        className="mr-3 rounded-circle"
                        // src={`${url}/${v.image.replace(
                        //   "/",
                        //   "%2F"
                        // )}?alt=media`}
                        src={`${url}/${
                          process.env.REACT_APP_ENVIROMENT === "production"
                            ? `${v.image.replace("/", "%2F")}?alt=media`
                            : v.image
                        }`}
                        alt="icon user"
                      />
                      <Media.Body>
                        <h5>{v.name_item}</h5>
                        <small className="text-muted my-0">
                          {v.name_pelapak}
                        </small>
                        <Row>
                          <Col md={10}>
                            <h5 style={{ color: "yellow" }}>
                              {this.handleStarRating(v.rating)}
                            </h5>
                            <p>{v.review}</p>
                          </Col>
                          <Col md={2}>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={this.handleShow}
                            >
                              {this.state.onLoadForm && (
                                <Spinner class="text-center my-0" />
                              )}
                              {!this.state.onLoadForm && (
                                <span id={v.id}>Edit</span>
                              )}
                            </Button>
                          </Col>
                        </Row>
                      </Media.Body>

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

        {Object.keys(metadata).length > 0 && (
          <Row className="justify-content-center mt-3">
            <Pagination>
              {metadata.pagination.prevPage && (
                <>
                  <Pagination.First onClick={this.handleFirstPage} />
                  <Pagination.Prev onClick={this.handlePrev} />
                </>
              )}

              {metadata.pagination.currentPage - 1 >= 5 && (
                <>
                  <Pagination.Ellipsis onClick={this.handleEllipsis} />
                </>
              )}

              <Pagination.Item active>
                {metadata.pagination.currentPage}
              </Pagination.Item>

              {metadata.pagination.totalPage - metadata.pagination.currentPage >
                5 && <>{this.paginationItem}</>}

              {metadata.pagination.totalPage -
                metadata.pagination.currentPage >=
                5 && (
                <>
                  <Pagination.Ellipsis onClick={this.handleEllipsis} />
                </>
              )}

              {metadata.pagination.nextPage && (
                <>
                  <Pagination.Next onClick={this.handleNext} />
                  <Pagination.Last onClick={this.handleLastPage} />
                </>
              )}
            </Pagination>
          </Row>
        )}
      </Container>
    );
  }
}

export default Review;
