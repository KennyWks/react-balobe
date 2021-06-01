import React, { Component } from "react";
import { Container, Row, Col, Card, Tabs, Button } from "react-bootstrap";
import { connect } from "react-redux";
import ActionType from "../../redux/reducer/globalActionType";
import Buyer from "./Users/Buyer";
import Seler from "./Users/Seler";
import ImageLogo from "../../component/Image";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: props.isLogin,
      data: {
        id_user: props.id_user,
        username: props.username,
        role_id: props.role_id,
      },
    };
  }

  componentDidMount() {
    if (!this.state.isLogin) {
      this.props.history.push("/restricted");
    } else {
      if (this.state.data.role_id !== 3) {
        this.props.history.push("/restricted");
      } else {
        document.title = `User Services - Balobe`;
      }
    }
  }

  setLogout = () => {
    this.props.handleLogout();
    this.props.history.push("/signin");
  };

  render() {
    return (
      <Container>
        <Card className="mb-2 mt-2">
          <Card.Body>
            <div className="text-center">
              <ImageLogo height="70px" width="70" />
            </div>
            <h4 className="text-center mt-4">
              Hallo {this.state.data.username}! &nbsp;
              <Button
                variant="danger"
                onClick={() => {
                  if (
                    window.confirm("Are you sure to logout from this session?")
                  ) {
                    this.setLogout();
                  }
                }}
              >
                Logout
              </Button>
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.isLogin,
    id_user: state.id_user,
    username: state.username,
    role_id: state.role_id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogout: () => dispatch({ type: ActionType.IS_LOGOUT }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
