import React, { Component } from "react";
import { connect } from "react-redux";
import { postData } from "../../helpers/CRUD";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ImageLogo from "../../component/Image";
import { Link } from "react-router-dom";
import Alert from "../../component/Alert";
import Spinner from "../../component/Spinner";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: "",
        password: "",
        role_id: "3",
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
      alert: "",
    };
  }

  componentDidMount() {
    document.title = `Register Account - Balobe`;
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
    }));
    try {
      const response = await postData("/auth/signup", this.state.form);
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          message: "Your acoount is registerd. please check your for confirm",
          alert: "primary",
        }));
      } else {
        this.setState((prevState) => ({
          ...prevState,
          message: "Your account can't register",
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
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="text-center">
              <Link to={`/`}>
                <ImageLogo height="auto" width="20%" />
              </Link>
            </div>

            <h5 className="text-center my-4">Register new account now</h5>

            {this.state.onSubmit === "end" && (
              <Alert variant={this.state.alert} info={this.state.message} />
            )}

            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="username.ControlInput1">
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Your Username"
                  value={form.username}
                  onChange={this.handleInput}
                />
              </Form.Group>
              <Form.Group controlId="password.ControlInput2">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Your Password"
                  onChange={this.handleInput}
                  value={form.password}
                />
              </Form.Group>
              <Form.Group controlId="fullname.ControlInput3">
                <Form.Control
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  value={form.fullname}
                  onChange={this.handleInput}
                />
              </Form.Group>

              <Form.Group controlId="gender.ControlInput4">
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

              <Form.Group controlId="address.ControlTextarea5">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  name="address"
                  rows={3}
                  value={form.address}
                  onChange={this.handleInput}
                />
              </Form.Group>
              <Form.Group controlId="email.ControlInput6">
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
              <Form.Group controlId="phone.ControlInput7">
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
                {!this.state.onSubmit && (
                  <Button type="submit" className="btn btn-primary mr-3">
                    Submit
                  </Button>
                )}
                {this.state.onSubmit && <Spinner class="text-center my-0" />}
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.isLogin,
  };
};

export default connect(mapStateToProps)(Signup);
