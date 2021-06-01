import React, { Component } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import Header from "../Layout/AdminTemplates";
import { Footer } from "../Layout/Templates";
import { getData } from "../../helpers/CRUD";
import Spinner from "../../component/Spinner";
import FormSearch from "../../component/FormSearch";
import { connect } from "react-redux";

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: props.isLogin,
      data: {
        id_user: props.id_user,
        username: props.username,
        role_id: props.role_id,
      },
      listCustomers: {
        data: [],
        metadata: {},
      },
      onLoad: false,
    };
  }

  componentDidMount() {
    if (!this.state.isLogin) {
      this.props.history.push("/restricted");
    } else {
      if (this.state.data.role_id !== 2) {
        this.props.history.push("/restricted");
      } else {
        document.title = `Admin - Balobe`;
        this.getCustomers();
      }
    }
  }

  getCustomers = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await getData(
        `/profile/user/all${
          this.props.location.search ? this.props.location.search : ""
        }`
      );
      this.setState((prevState) => ({
        ...prevState,
        listCustomers: {
          ...prevState.listCustomers,
          data: response.data.data,
          metadata: response.data.metadata.pagination,
        },
      }));
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      onLoad: false,
    }));
  };

  render() {
    const { onLoad, listCustomers } = this.state;
    return (
      <div>
        <Header />
        <Container className="mt-3">
          <FormSearch path={`/admin/customers`} />
          {onLoad && <Spinner class="text-center my-3" />}
          <Row className="justify-content-center mt-2">
            {!onLoad && (
              <Col md={11}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Fullname</th>
                      <th>Gender</th>
                      <th>Address</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Balance</th>
                      <th>Picture</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listCustomers.data.length > 0 &&
                      listCustomers.data.map((v, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{v.fullname}</td>
                          <td>{v.gender}</td>
                          <td>{v.address}</td>
                          <td>{v.email}</td>
                          <td>{v.phone}</td>
                          <td>{v.balance}</td>
                          <td>
                            <img
                              width="auto"
                              height="100px"
                              className="mr-2 rounded"
                              src={`https://firebasestorage.googleapis.com/v0/b/balobe-d2a28.appspot.com/o/${v.picture.replace(
                                "/",
                                "%2F"
                              )}?alt=media`}
                              alt={v.name}
                            />
                          </td>
                          <td>{v.status}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
            )}
          </Row>
        </Container>
        <Footer />
      </div>
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

export default connect(mapStateToProps)(Customers);
