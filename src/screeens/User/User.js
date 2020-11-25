import React, { Component } from "react";
import { Container, Row, Col, Card, Tabs } from "react-bootstrap";
import jwtDecode from "jwt-decode";
import { Cookies } from "react-cookie";
import Buyer from "./Users/Buyer";
import Seler from "./Users/Seler";
import ImageLogo from "../../component/ImageLogo";

const cookie = new Cookies();

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      data: {
        id_user: "",
        username: "",
      },
    };
  }

  updateLogin = (status, token) => {
    this.setState({
      isLogin: true,
      data: {
        id_user: token.id_user,
        username: token.username,
      },
    });
  };

  handleLogout = () => {
    this.updateLogin(false);
    cookie.remove("accessToken");
  };

  componentDidMount(props) {
    const accessToken = cookie.get("accessToken");

    if (accessToken === undefined) {
      this.props.history.push("/loginWarn");
    } else {
      const token = jwtDecode(accessToken);

      if (token.role_id === 3 || token.role_id === 4) {
        this.updateLogin(true, token);
      } else {
        this.props.history.push("/loginWarn");
      }
    }
  }

  render() {
    return (
      <div>
        <Container>
          <Card className="mb-2">
            <Card.Body>
              <div className="text-center">
                <ImageLogo height="70px" width="70" />
              </div>
              <h4 className="text-center mt-4">
                Hallo {this.state.data.username}!
              </h4>
            </Card.Body>
          </Card>
          <Row>
            <Col>
              <Tabs
                justify
                defaultActiveKey="Buyer"
                transition={false}
                id="noanim-tab-example"
              >
                <Tabs eventKey="Buyer" title="Buyer">
                  <Buyer
                    username={this.state.data.username}
                    idUser={this.state.data.id_user}
                  />
                </Tabs>
                <Tabs eventKey="Seler" title="Seler">
                  <Seler />
                </Tabs>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default User;
