import React, { Component } from "react";
import { postData } from "../../helpers/CRUD";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Spinner from "../../component/Spinner";
import Alert from "../../component/Alert";
import ImageLogo from "../../component/ImageLogo";

class ForgotPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        email: "",
      },
      onSubmit: false,
      message: "",
      alert: ""
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: "proccess",
    }));
    try {
      const response = await postData("/auth/forgotPass", this.state.form);
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          message: "Please check your email!",
          alert: "primary",
        }));
      } else {
        this.setState((prevState) => ({
          ...prevState,
          message: "Network is error! Try again later",
          alert: "danger",
        }));
      }
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: "end",
    }));
  };

  handleInput = async (e) => {
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

  render() {
    const { form } = this.state;
    return (
      <div>
        <Container className="mt-4">
          <Row>
            <Col md={3}></Col>
            <Col md={6}>
              <div className="text-center">
                <Link to={`/`}>
                  <ImageLogo height="auto" width="25%" />
                </Link>
              </div>

              <h5 className="text-center my-4">Reset password</h5>

              {this.state.onSubmit === "proccess" && <Spinner />}

              {this.state.onSubmit === "end" && (
                <Alert variant={this.state.alert} info={this.state.message} />
              )}

              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Control
                    type="text"
                    name="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={this.handleInput}
                  />
                </Form.Group>
                <div
                  style={{
                    width: "auto",
                  }}
                >
                  <Button type="submit" className="btn btn-primary">
                    Send
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <h6 className="my-3">
                  Back to page <Link to={`/signin`}>login</Link> or{" "}
                  <Link to={`/signup`}>register</Link>
                </h6>
              </div>
            </Col>
            <Col md={3}></Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ForgotPass;
