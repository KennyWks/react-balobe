import React, { Component } from "react";
import { getData, postData } from "../../helpers/CRUD";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form as FormBootstrap,
  Button,
} from "react-bootstrap";
import Spinner from "../../component/Spinner";
import Alert from "../../component/Alert";
import ImageLogo from "../../component/Image";
import queryString from "query-string";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const changePassFormSchema = Yup.object().shape({
  password: Yup.string()
    .required("Please enter your password")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords don't match."),
});

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onLoad: false,
      message: "",
      alert: "",
      url: "",
      form: {
        password: "",
      },
    };
  }

  componentDidMount() {
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
        `/auth/confirmPass${this.props.location.search}`
      );
      console.log(response);
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          url: response.data.data.link,
        }));
      }
      document.title = `Change Password - Balobe`;
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

  handleSubmit = async () => {
    const params = queryString.parse(this.props.location.search);
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await postData(`/auth/updatePass/${params.id_user}`, this.state.form);
      console.log(response);
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

  initialValues() {
    return {
      password: "",
      confirmPassword: "",
    };
  }

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

            <h5 className="text-center my-4">Change Password</h5>

            {this.state.onLoad && <Spinner class="text-center my-3" />}

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

            {this.state.url !== "" && (
              <Formik
                initialValues={this.initialValues()}
                validationSchema={changePassFormSchema}
                onSubmit={(values, actions) => {
                  this.setState((prevState) => ({
                    ...prevState,
                    form: {
                      ...prevState.form,
                      password: values.password,
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
                    <FormBootstrap.Group controlId="password">
                      <Field
                        type="password"
                        name="password"
                        placeholder="Your new password"
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
                    <FormBootstrap.Group controlId="confirmPassword">
                      <Field
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your new password"
                        className={`form-control ${
                          props.errors.confirmPassword ? `is-invalid` : ``
                        }`}
                        value={props.confirmPassword}
                      />
                      <ErrorMessage
                        component="div"
                        name="confirmPassword"
                        className="invalid-feedback"
                      />
                    </FormBootstrap.Group>
                    <div
                      style={{
                        width: "auto",
                      }}
                    >
                      <Button type="submit" className="btn btn-primary">
                        Submit
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
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

export default ChangePassword;
