import React, { Component } from "react";
import { getData } from "../../helpers/CRUD";
import { Container, Row, Col, Card, Media, Spinner } from "react-bootstrap";
import { BsStarFill } from "react-icons/bs";
import user from "../../assets/img/user.JPG";

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataReview: {
        data: [],
      },
      load: false,
      message: "",
      alert: "",
    };
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

  componentDidMount() {
    this.getReview();
  }

  star = (rating) => {
    let star = [];
    for (let i = 0; i < rating; i++) {
      star.push(<BsStarFill />);
    }
    return star;
  };

  render() {
    const { dataReview } = this.state;
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <Card.Body>
                {this.state.load && (
                  <div className="text-center my-2">
                    <Spinner animation="border" variant="primary" />
                  </div>
                )}
                {dataReview.data.length > 0 &&
                  dataReview.data.map((v) => (
                    <ul className="list-unstyled">
                      <Media as="li">
                        <img
                          width={64}
                          height={64}
                          className="mr-3 rounded-circle"
                          src={user}
                          alt="Generic placeholder"
                        />
                        <Media.Body>
                          <h5 style={{ color: "yellow" }}>
                            {this.star(v.rating)}
                          </h5>
                          <p>{v.review}</p>
                        </Media.Body>
                      </Media>
                    </ul>
                  ))}
              </Card.Body>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Review;
