import React, { Component } from "react";
import { connect } from "react-redux";
import { postData } from "../../helpers/CRUD";
import {
  Container,
  Row,
  Col,
  Form as FormBootstrap,
  Button,
} from "react-bootstrap";
import ImageLogo from "../../component/Image";
import { Link } from "react-router-dom";
import Alert from "../../component/Alert";
import Spinner from "../../component/Spinner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const signupFormSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required!")
    .min(5, "Username must be 5 characters at minimum!"),
  password: Yup.string()
    .required("Password is required!")
    .min(5, "Password must be 5 characters at minimum!"),
  fullname: Yup.string().required("Fullname is required!"),
  gender: Yup.string().required("Gender is required!"),
  address: Yup.string().required("Address is required!"),
  email: Yup.string()
    .required("Email is required!")
    .email("Invalid email address!"),
  phone: Yup.string()
    .required("Phone is required!")
    .min(11, "Phone must be 11 characters at minimum!")
    .max(12, "Phone must be 12 characters at maximum!"),
});

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: "",
        password: "",
        role_id: 3,
        fullname: "",
        gender: "",
        picture: "img-users/default.png",
        address: "",
        email: "",
        phone: "",
        balance: 0,
      },
      onSubmit: false,
      message: "",
      alert: "",
    };
  }

  componentDidMount() {
    document.title = `Register Account - Balobe`;
  }

  handleSubmit = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await postData("/auth/signup", this.state.form);
      if (response.status === 201) {
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
      onSubmit: false,
    }));
  };

  initialValues() {
    return {
      username: "",
      password: "",
      fullname: "",
      gender: "",
      address: "",
      email: "",
      phone: "",
    };
  }

  render() {
    return (
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="text-center">
              <Link to={`/`}>
                <ImageLogo height="auto" width="20%" />
              </Link>
            </div>

            <h5 className="text-center my-2">Register new account now</h5>

            {!this.state.onSubmit && (
              <Alert variant={this.state.alert} info={this.state.message} />
            )}

            <Formik
              initialValues={this.initialValues()}
              validationSchema={signupFormSchema}
              onSubmit={(values, actions) => {
                this.setState((prevState) => ({
                  ...prevState,
                  form: {
                    ...prevState.form,
                    username: values.username,
                    password: values.password,
                    fullname: values.fullname,
                    gender: values.gender,
                    address: values.address,
                    email: values.email,
                    phone: values.phone,
                  },
                }));

                setTimeout(() => {
                  actions.setSubmitting(false);
                  // actions.resetForm();
                  this.handleSubmit();
                }, 900);
              }}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit}>
                  <FormBootstrap.Group controlId="username.ControlInput1">
                    <Field
                      type="text"
                      name="username"
                      placeholder="Your Username"
                      value={props.username}
                      className={`form-control ${
                        props.errors.username ? `is-invalid` : ``
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="username"
                      className="invalid-feedback"
                    />
                  </FormBootstrap.Group>
                  <FormBootstrap.Group controlId="password.ControlInput2">
                    <Field
                      type="password"
                      name="password"
                      placeholder="Your Password"
                      className={`form-control ${
                        props.errors.password ? `is-invalid` : ``
                      }`}
                      value={props.password}
                    />
                    <ErrorMessage
                      component="div"
                      name="password"
                      className="invalid-feedback"
                    />
                  </FormBootstrap.Group>
                  <FormBootstrap.Group controlId="fullname.ControlInput3">
                    <Field
                      type="text"
                      name="fullname"
                      placeholder="Full Name"
                      value={props.fullname}
                      className={`form-control ${
                        props.errors.fullname ? `is-invalid` : ``
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="fullname"
                      className="invalid-feedback"
                    />
                  </FormBootstrap.Group>

                  <FormBootstrap.Group controlId="gender.ControlInput4">
                    <Row>
                      <Col md>
                        <Row>
                          <Col md={2}>
                            <FormBootstrap.Check>
                              <Field
                                className="form-check-input"
                                type="radio"
                                name="gender"
                                id="male"
                                value="Male"
                              />
                              <FormBootstrap.Label>Male</FormBootstrap.Label>
                            </FormBootstrap.Check>
                          </Col>
                          <Col md={2}>
                            <div className="form-check ">
                              <Field
                                className="form-check-input"
                                type="radio"
                                name="gender"
                                id="female"
                                value="Female"
                              />
                              <FormBootstrap.Label>Female</FormBootstrap.Label>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </FormBootstrap.Group>

                  <FormBootstrap.Group controlId="address.ControlTextarea5">
                    <FormBootstrap.Label>Address</FormBootstrap.Label>
                    <Field
                      as="textarea"
                      name="address"
                      rows={3}
                      value={props.address}
                      className={`form-control ${
                        props.errors.address ? `is-invalid` : ``
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="address"
                      className="invalid-feedback"
                    />
                  </FormBootstrap.Group>
                  <FormBootstrap.Group controlId="email.ControlInput6">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={props.email}
                      className={`form-control ${
                        props.errors.email ? `is-invalid` : ``
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="email"
                      className="invalid-feedback"
                    />
                    <FormBootstrap.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </FormBootstrap.Text>
                  </FormBootstrap.Group>
                  <FormBootstrap.Group controlId="phone.ControlInput7">
                    <Field
                      type="text"
                      name="phone"
                      placeholder="Your Phone Number"
                      value={props.phone}
                      className={`form-control ${
                        props.errors.phone ? `is-invalid` : ``
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="phone"
                      className="invalid-feedback"
                    />
                  </FormBootstrap.Group>
                  <FormBootstrap.Group as={Row} controlId="formHorizontalCheck">
                    <Col>
                      <FormBootstrap.Check
                        required
                        label={
                          "I have read and prohibited use and Balobe's Privacy Policy."
                        }
                      />
                    </Col>
                  </FormBootstrap.Group>

                  <div className="d-inline">
                    {!this.state.onSubmit && (
                      <Button
                        type="submit"
                        className="btn btn-primary mr-3 mb-2"
                      >
                        Submit
                      </Button>
                    )}
                    {this.state.onSubmit && (
                      <Spinner class="text-center my-0" />
                    )}
                  </div>
                </Form>
              )}
            </Formik>
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
