import React, { Component } from "react";
import { postData } from "../../helpers/CRUD";
import {
  Container,
  Row,
  Col,
  Image,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import logoKail from "../../assets/img/logo-kail.JPG";
import { Link } from "react-router-dom";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: "",
        password: "",
        role_id: "4",
        fullname: "",
        gender: "",
        picture: "default.jpg",
        address: "",
        email: "",
        phone: "",
        balance: "0",
      },
      onSubmit: false,
      message: "",
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
    }));
    try {
      const response = await postData("/auth/signup", this.state.form);
      // console.log(response.data.error.msg);
      this.setState((prevState) => ({
        ...prevState,
        message: response.data.error.msg,
      }));
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
      <>
        <Container className="mt-4">
          <Row>
            <Col md={3}></Col>
            <Col md={6}>
              <div className="text-center">
                <Link to={`/`}>
                  <Image
                    src={logoKail}
                    alt="Balobe"
                    rounded
                    style={{
                      width: "20%",
                      height: "auto",
                    }}
                  />
                </Link>
              </div>

              <h5 className="text-center my-4">Register new account now</h5>

              {this.state.onSubmit === "end" && (
                <div className="d-inline">
                  <Alert variant="primary" className="text-center">
                    {this.state.message}
                  </Alert>
                </div>
              )}

              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Your Username"
                    value={form.username}
                    onChange={this.handleInput}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Your Password"
                    onChange={this.handleInput}
                    value={form.password}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput3">
                  <Form.Control
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    value={form.fullname}
                    onChange={this.handleInput}
                  />
                </Form.Group>

                <Form.Group controlId="exampleForm.ControlInput4">
                  <Row>
                    <Col md>
                      <Row>
                        <Col md={2}>
                          <Form.Check>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              id="male"
                              value="Male"
                              onChange={this.handleInput}
                            />
                            <Form.Label>Male</Form.Label>
                          </Form.Check>
                        </Col>
                        <Col md={2}>
                          <div className="form-check ">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              id="female"
                              value="Female"
                              onChange={this.handleInput}
                            />
                            <Form.Label>Female</Form.Label>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group controlId="exampleForm.ControlTextarea5">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="address"
                    rows={3}
                    value={form.address}
                    onChange={this.handleInput}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput6">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={this.handleInput}
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput7">
                  <Form.Control
                    type="number"
                    name="phone"
                    placeholder="Your Phone Number"
                    value={form.phone}
                    onChange={this.handleInput}
                  />
                </Form.Group>
                <Form.Group as={Row} controlId="formHorizontalCheck">
                  <Col>
                    <Form.Check
                      required
                      label={
                        "I have read and prohibited use and Balobe's Privacy Policy."
                      }
                    />
                  </Col>
                </Form.Group>

                <div className="d-inline">
                  <Button type="submit" className="btn btn-primary mr-3">
                    Submit
                  </Button>
                  {this.state.onSubmit && (
                    <Spinner animation="border" variant="primary" />
                  )}
                </div>
              </Form>
            </Col>
            <Col md={3}></Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Signup;
