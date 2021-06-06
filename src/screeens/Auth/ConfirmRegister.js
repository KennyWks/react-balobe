import React, { Component } from "react";
import { getData } from "../../helpers/CRUD";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Spinner from "../../component/Spinner";
import Alert from "../../component/Alert";
import ImageLogo from "../../component/Image";

class ConfirmRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onLoad: undefined,
      message: "",
      alert: "",
    };
  }

  componentDidMount() {
    document.title = `Confirm Account - Balobe`;
    this.handleConfirm();
  }

  handleConfirm = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await getData(
        `/auth/confirmAccount${this.props.location.search}`
      );
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          message: response.data.data.msg,
          alert: "success",
        }));
      }
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
      onLoad: false,
    }));
  };

  render() {
    return (
      <Container className="mt-4">
        <Row>
          <Col md={3}></Col>
          <Col md={6}>
            <div className="text-center">
              <Link to={`/`}>
                <ImageLogo height="auto" width="25%" />
              </Link>
            </div>

            <h5 className="text-center my-4">Confirm Account</h5>

            {this.state.onLoad && <Spinner class="text-center my-3" />}

            {!this.state.onLoad && (
              <Alert variant={this.state.alert} info={this.state.message} />
            )}

            <div className="text-center">
              <h6 className="my-3">
                Back to <Link to={`/signin`}>Login</Link>
              </h6>
            </div>
          </Col>
          <Col md={3}></Col>
        </Row>
      </Container>
    );
  }
}

export default ConfirmRegister;
