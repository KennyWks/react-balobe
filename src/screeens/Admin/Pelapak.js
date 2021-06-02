import React, { Component } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import Header from "../Layout/AdminTemplates";
import { Footer } from "../Layout/Templates";
import { getData } from "../../helpers/CRUD";
import Spinner from "../../component/Spinner";
import FormSearch from "../../component/FormSearch";
import { connect } from "react-redux";

class Pelapak extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: props.isLogin,
      data: {
        id_user: props.id_user,
        username: props.username,
        role_id: props.role_id,
      },
      listPelapak: {
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
        this.getPelapak();
      }
    }
  }

  getPelapak = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await getData(
        `/pelapak${
          this.props.location.search ? this.props.location.search : ""
        }`
      );
      this.setState((prevState) => ({
        ...prevState,
        listPelapak: {
          ...prevState.listPelapak,
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
    const { onLoad, listPelapak } = this.state;
    return (
      <div>
        <Header />
        <Container className="mt-3">
          <FormSearch path={`/admin/pelapak`} />
          {onLoad && <Spinner class="text-center my-3" />}
          <Row className="justify-content-center mt-2">
            {!onLoad && (
              <Col md={11}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Address</th>
                      <th>Logo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPelapak.data.length > 0 &&
                      listPelapak.data.map((v, i) => (
                        <tr key={i}>
                          <td>{v.id_pelapak}</td>
                          <td>{v.name}</td>
                          <td>{v.description}</td>
                          <td>{v.address}</td>
                          <td>
                            <img
                              width="auto"
                              height="100px"
                              className="mr-2 rounded"
                              src={`https://firebasestorage.googleapis.com/v0/b/balobe-d2a28.appspot.com/o/${v.logo.replace(
                                "/",
                                "%2F"
                              )}?alt=media`}
                              alt={v.name}
                            />
                          </td>
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

export default connect(mapStateToProps)(Pelapak);
