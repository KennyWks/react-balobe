import React, { Component } from "react";
import { connect } from "react-redux";
import { postData } from "../../helpers/CRUD";
import jwtDecode from "jwt-decode";
import { Cookies } from "react-cookie";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form as FormBootstrap } from "react-bootstrap";
import Alert from "../../component/Alert";
import ImageLogo from "../../component/Image";
import Spinner from "../../component/Spinner";
import ActionType from "../../redux/reducer/globalActionType";
import Button from "../../component/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const cookie = new Cookies();

const signinFormSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required!")
    .min(5, "Username must be 5 characters at minimum!"),
  password: Yup.string()
    .required("Password is required!")
    .min(5, "Password must be 5 characters at minimum!"),
});

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: props.isLogin,
      form: {
        username: "",
        password: "",
      },
      onSubmit: false,
      message: "",
      alert: "",
    };
  }

  componentDidMount() {
    if (this.props.isLogin) {
      this.props.history.push("/user");
    }
    document.title = `Signin - Balobe`;
  }

  handleSubmit = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await postData(`/auth/login`, this.state.form);
      if (response.status === 201) {
        // const token = jwtDecode(response.data.data.accesToken);
        cookie.set("accessToken", response.data.data.accesToken, {
          path: "/",
          expires: "",
        });
        this.setState((prevState) => ({
          ...prevState,
          form: {
            username: "",
            password: "",
          },
          message: response.data.data.msg,
          alert: "success",
        }));
        this.setLogin();
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

  setLogin = () => {
    this.props.handleLogin();
  };

  redirect = () => {
    const accessToken = cookie.get("accessToken");
    const token = jwtDecode(accessToken);
    if (token.role_id === 2) {
      return setTimeout(() => this.props.history.push("/admin"), 1000);
    } else {
      return setTimeout(() => this.props.history.push("/"), 1000);
    }
  };

  initialValues() {
    return {
      username: "",
      password: "",
    };
  }

  render() {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={4}>
            <div className="text-center">
              <Link to={`/`}>
                <ImageLogo height="auto" width="25%" />
              </Link>
            </div>

            <h6 className="text-center mt-5 mb-2">
              Please log in to your account
            </h6>

            <h6 className="text-left mt-5 mb-3">
              Don't have account? <Link to={"/signup"}>Register here!</Link>
            </h6>

            {this.state.onSubmit && <Spinner class="text-center my-3" />}

            {this.state.alert === "success" && this.redirect() && (
              <Alert variant={this.state.alert} info={this.state.message} />
            )}

            {this.state.alert === "danger" && (
              <Alert variant={this.state.alert} info={this.state.message} />
            )}

            <Formik
              initialValues={this.initialValues()}
              validationSchema={signinFormSchema}
              onSubmit={(values, actions) => {
                this.setState((prevState) => ({
                  ...prevState,
                  form: {
                    ...prevState.form,
                    username: values.username,
                    password: values.password,
                  },
                }));

                setTimeout(() => {
                  actions.setSubmitting(false);
                  // actions.resetForm();
                  this.handleSubmit();
                }, 1000);
              }}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit}>
                  <FormBootstrap.Group controlId="username">
                    <FormBootstrap.Label>Username</FormBootstrap.Label>
                    <Field
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Your Username"
                      className={`form-control ${
                        props.errors.username ? `is-invalid` : ``
                      }`}
                      value={props.username}
                    />
                    <ErrorMessage
                      component="div"
                      name="username"
                      className="invalid-feedback"
                    />
                  </FormBootstrap.Group>
                  <FormBootstrap.Group controlId="password">
                    <FormBootstrap.Label>Password</FormBootstrap.Label>
                    <Field
                      type="password"
                      id="password"
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
                  <FormBootstrap.Group as={Row} controlId="formHorizontalCheck">
                    <Col
                      sm={12}
                      style={{
                        textAlign: "right",
                      }}
                    >
                      <Link to={`/forgotPass`}>Forgot password?</Link>
                    </Col>
                  </FormBootstrap.Group>
                  <Button variant="primary" type="submit" name="Submit" />
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

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogin: () => dispatch({ type: ActionType.IS_LOGIN }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
