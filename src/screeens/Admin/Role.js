import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form as FormBootstrap,
} from "react-bootstrap";
import Header from "../Layout/AdminTemplates";
import { Footer } from "../Layout/Templates";
import { getData, postData, patchData, deleteData } from "../../helpers/CRUD";
import Spinner from "../../component/Spinner";
import Alert from "../../component/Alert";
import FormSearch from "../../component/FormSearch";
import { connect } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const roleFormSchema = Yup.object().shape({
  name: Yup.string().required("Name of role is required!"),
});

class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: props.isLogin,
      data: {
        id_user: props.id_user,
        username: props.username,
        role_id: props.role_id,
      },
      listRole: {
        data: [],
        metadata: {},
      },
      detailRole: {},
      onSubmit: false,
      onLoad: false,
      showModal: {
        add: false,
        update: false,
      },
      role_id: null,
      form: {
        name: "",
      },
      message: "",
      alert: "",
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
        this.getRole();
      }
    }
  }

  getRole = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await getData(
        `/role${this.props.location.search ? this.props.location.search : ""}`
      );
      this.setState((prevState) => ({
        ...prevState,
        listRole: {
          ...prevState.listRole,
          data: response.data.data,
          metadata: response.data.metadata.pagination,
        },
      }));
    } catch (error) {
      if (!error.response) {
        alert("Server error! please try again.");
      } else {
        if (error.response.status === 500) {
          alert("Something error! please try again.");
        }
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      onLoad: false,
    }));
  };

  getDetailRole = async (id) => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await getData(`/role/${id}`);
      this.setState((prevState) => ({
        ...prevState,
        detailRole: response.data.data,
      }));
    } catch (error) {
      if (!error.response) {
        alert("Server error! please try again.");
      } else {
        if (error.response.status === 500) {
          alert("Something error! please try again.");
        } else {
          alert(error.response.data.error.msg);
        }
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      onLoad: false,
    }));
  };

  setModalShow = async (bool, modal, id = false) => {
    if (modal === "add") {
      this.setState((prevState) => ({
        ...prevState,
        form: {
          ...prevState.form,
          name: "",
        },
        showModal: {
          ...prevState.showModal,
          add: bool,
        },
      }));
    }

    if (modal === "update") {
      if (id !== false) {
        await this.getDetailRole(id);
        const { detailRole } = this.state;
        this.setState((prevState) => ({
          ...prevState,
          role_id: id,
          form: {
            ...prevState.form,
            name: detailRole.name,
          },
        }));
      }
      this.setState((prevState) => ({
        ...prevState,
        showModal: {
          ...prevState.showModal,
          update: bool,
        },
      }));
    }
  };

  handleAddRole = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await postData(`/role`, this.state.form);
      if (response.status === 201) {
        this.setState((prevState) => ({
          ...prevState,
          form: {
            ...prevState.form,
            name: "",
          },
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
    this.setModalShow(false, "add");
    this.getRole();
  };

  handleUpdateRole = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await patchData(
        `/role/${this.state.role_id}`,
        this.state.form
      );
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          role_id: null,
          form: {
            ...prevState.form,
            name: "",
          },
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
    this.setModalShow(false, "update");
    this.getRole();
  };

  handleDelete = async (role_id) => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await deleteData(`/role/${role_id}`);
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
    this.getRole();
  };

  initialValues() {
    return {
      name: "",
    };
  }

  render() {
    const { onLoad, listRole } = this.state;
    return (
      <div>
        <Header />
        <Container className="mt-3">
          <FormSearch path={`/admin/role`} />
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
          {onLoad && <Spinner class="text-center my-3" />}
          <Row className="justify-content-center mt-2">
            {!onLoad && (
              <Col md={11}>
                <Button
                  varian="primary"
                  className="my-2"
                  onClick={() => this.setModalShow(true, "add")}
                >
                  Add
                </Button>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ID Role</th>
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listRole.data.length > 0 &&
                      listRole.data.map((v, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{v.role_id}</td>
                          <td>{v.name}</td>
                          <td>
                            <Button
                              variant="success"
                              className="m-1"
                              onClick={() =>
                                this.setModalShow(true, "update", v.role_id)
                              }
                            >
                              Update
                            </Button>
                            <Button
                              variant="danger"
                              className="m-1"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure to remove this data?"
                                  )
                                ) {
                                  this.handleDelete(v.role_id);
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
            )}

            <Modal
              size="sm"
              show={this.state.showModal.add}
              onHide={() => this.setModalShow(false, "add")}
              aria-labelledby="example-modal-sizes-title-sm"
              animation={false}
            >
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-sm">
                  Add Role
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Formik
                  initialValues={this.initialValues()}
                  validationSchema={roleFormSchema}
                  onSubmit={(values, actions) => {
                    this.setState((prevState) => ({
                      ...prevState,
                      form: {
                        ...prevState.form,
                        name: values.name,
                      },
                    }));

                    setTimeout(() => {
                      actions.setSubmitting(false);
                      // actions.resetForm();
                      this.handleAddRole();
                    }, 900);
                  }}
                >
                  {(props) => (
                    <Form onSubmit={props.handleSubmit}>
                      <FormBootstrap.Group controlId="name">
                        <FormBootstrap.Label>Name</FormBootstrap.Label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="Enter name role"
                          className={`form-control ${
                            props.errors.name ? `is-invalid` : ``
                          }`}
                          value={props.name}
                        />
                        <ErrorMessage
                          component="div"
                          name="name"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
                      <Button variant="primary" type="submit">
                        {this.state.onSubmit && (
                          <Spinner class="text-center my-0" />
                        )}
                        {!this.state.onSubmit && <span> Save</span>}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>

            <Modal
              size="sm"
              show={this.state.showModal.update}
              onHide={() => this.setModalShow(false, "update")}
              aria-labelledby="example-modal-sizes-title-sm"
              animation={false}
            >
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-sm">
                  Update Role
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Formik
                  initialValues={this.state.form}
                  enableReinitialize
                  validationSchema={roleFormSchema}
                  onSubmit={(values, actions) => {
                    this.setState((prevState) => ({
                      ...prevState,
                      form: {
                        ...prevState.form,
                        name: values.name,
                      },
                    }));

                    setTimeout(() => {
                      actions.setSubmitting(false);
                      // actions.resetForm();
                      this.handleUpdateRole();
                    }, 900);
                  }}
                >
                  {(props) => (
                    <Form onSubmit={props.handleSubmit}>
                      <FormBootstrap.Group controlId="name">
                        <FormBootstrap.Label>Name</FormBootstrap.Label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="Enter name category"
                          className={`form-control ${
                            props.errors.name ? `is-invalid` : ``
                          }`}
                          value={props.values.name}
                        />
                        <ErrorMessage
                          component="div"
                          name="name"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
                      <Button variant="primary" type="submit">
                        {this.state.onSubmit && (
                          <Spinner class="text-center my-0" />
                        )}
                        {!this.state.onSubmit && <span> Edit Data</span>}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>
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

export default connect(mapStateToProps)(Role);
