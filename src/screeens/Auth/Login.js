import React, { Component } from "react";
import { connect } from "react-redux";
import { postData } from "../../helpers/CRUD";
import jwtDecode from "jwt-decode";
import { Cookies } from "react-cookie";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import Alert from "../../component/Alert";
import ImageLogo from "../../component/Image";
import Spinner from "../../component/Spinner";
import ActionType from "../../redux/reducer/globalActionType";
import Button from "../../component/Button";

const cookie = new Cookies();

class Login extends Component {
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

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
      alert: "",
    }));
    try {
      const response = await postData(`/auth/login`, this.state.form);
      // console.log(response);
      if (response.status === 200) {
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
          message: "Login is success!",
          alert: "success",
        }));
        this.setLogin();
      } else {
        this.setState((prevState) => ({
          ...prevState,
          message: "Login is failed!",
          alert: "danger",
        }));
      }
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: false,
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

  componentDidMount() {
    if (this.props.isLogin) {
      this.props.history.push("/user");
    }
    document.title = `Login - Balobe`;
  }

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

            {this.state.alert === "danger" && (
              <Alert variant={this.state.alert} info={this.state.message} />
            )}

            {this.props.isLogin && this.redirect() && (
              <Alert variant={this.state.alert} info={this.state.message} />
            )}

            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Your Username"
                  value={this.state.form.username}
                  onChange={this.handleInput}
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Your Password"
                  value={this.state.form.password}
                  onChange={this.handleInput}
                />
              </Form.Group>
              <Form.Group as={Row} controlId="formHorizontalCheck">
                <Col
                  sm={12}
                  style={{
                    textAlign: "right",
                  }}
                >
                  <Link to={`/forgotPass`}>Forgot password?</Link>
                </Col>
              </Form.Group>
              <Button variant="primary" type="submit" name="Submit" />
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

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogin: () => dispatch({ type: ActionType.IS_LOGIN }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
