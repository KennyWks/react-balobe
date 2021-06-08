import React, { Component } from "react";
import { postData } from "../../helpers/CRUD";
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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const forgotPassFormSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required!")
    .email("Email address invalid!"),
});

class ForgotPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        email: "",
      },
      onSubmit: undefined,
      message: "",
      alert: "",
    };
  }

  componentDidMount() {
    document.title = `Forgot Password - Balobe`;
  }

  handleSubmit = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await postData("/auth/forgotPass", this.state.form);
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
      email: "",
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

            <h5 className="text-center my-4">Reset password</h5>

            {this.state.onSubmit && <Spinner class="text-center my-3" />}

            {!this.state.onSubmit && (
              <Alert variant={this.state.alert} info={this.state.message} />
            )}

            <Formik
              initialValues={this.initialValues()}
              validationSchema={forgotPassFormSchema}
              onSubmit={(values, actions) => {
                this.setState((prevState) => ({
                  ...prevState,
                  form: {
                    ...prevState.form,
                    email: values.email,
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
                  <FormBootstrap.Group controlId="email">
                    <Field
                      type="text"
                      name="email"
                      placeholder="Your email"
                      className={`form-control ${
                        props.errors.email ? `is-invalid` : ``
                      }`}
                      value={props.email}
                    />
                    <ErrorMessage
                      component="div"
                      name="email"
                      className="invalid-feedback"
                    />
                  </FormBootstrap.Group>
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
              )}
            </Formik>
            <div className="text-center">
              <h6 className="my-3">
                Back to <Link to={`/signin`}>Login</Link> or{" "}
                <Link to={`/signup`}>Register</Link>
              </h6>
            </div>
          </Col>
          <Col md={3}></Col>
        </Row>
      </Container>
    );
  }
}

export default ForgotPass;
