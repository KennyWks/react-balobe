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
import Alert from "../../component/Alert";
import Spinner from "../../component/Spinner";
import FormSearch from "../../component/FormSearch";
import { connect } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const categoryFormSchema = Yup.object().shape({
  hs_code: Yup.string().required("HS code is required!"),
  name: Yup.string().required("Name is required!"),
});

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: props.isLogin,
      data: {
        id_user: props.id_user,
        username: props.username,
        role_id: props.role_id,
      },
      listCategory: {
        data: [],
        metadata: {},
      },
      detailCategory: {},
      onSubmit: false,
      onLoad: false,
      showModal: {
        add: false,
        update: false,
      },
      id_category: null,
      form: {
        hs_code: 0,
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
        this.getCategory();
      }
    }
  }

  getCategory = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await getData(
        `/category${
          this.props.location.search ? this.props.location.search : ""
        }`
      );
      this.setState((prevState) => ({
        ...prevState,
        listCategory: {
          ...prevState.listCategory,
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

  getDetailCategory = async (id) => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await getData(`/category/${id}`);
      this.setState((prevState) => ({
        ...prevState,
        detailCategory: response.data.data,
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
          hs_code: "",
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
        await this.getDetailCategory(id);
        const { detailCategory } = this.state;
        this.setState((prevState) => ({
          ...prevState,
          id_category: id,
          form: {
            ...prevState.form,
            hs_code: detailCategory.hs_code,
            name: detailCategory.name,
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

  handleAddCategory = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await postData(`/category`, this.state.form);
      if (response.status === 201) {
        this.setState((prevState) => ({
          ...prevState,
          form: {
            ...prevState.form,
            hs_code: "",
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
    this.getCategory();
  };

  handleUpdateCategory = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await patchData(
        `/category/${this.state.id_category}`,
        this.state.form
      );
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          id_category: null,
          form: {
            ...prevState.form,
            hs_code: "",
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
    this.getCategory();
  };

  handleDelete = async (id_category) => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await deleteData(`/category/${id_category}`);
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
    this.getCategory();
  };

  initialValues() {
    return {
      hs_code: "",
      name: "",
    };
  }

  render() {
    const { onLoad, listCategory } = this.state;
    return (
      <div>
        <Header />
        <Container className="mt-3">
          <FormSearch path={`/admin/category`} />
          {onLoad && <Spinner class="text-center my-3" />}
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
                      <th>ID Category</th>
                      <th>HS Code</th>
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listCategory.data.length > 0 &&
                      listCategory.data.map((v, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{v.id_category}</td>
                          <td>{v.hs_code}</td>
                          <td>{v.name}</td>
                          <td>
                            <Button
                              variant="success"
                              className="m-1"
                              onClick={() =>
                                this.setModalShow(true, "update", v.id_category)
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
                                  this.handleDelete(v.id_category);
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
                  Add Category
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Formik
                  initialValues={this.initialValues()}
                  validationSchema={categoryFormSchema}
                  onSubmit={(values, actions) => {
                    this.setState((prevState) => ({
                      ...prevState,
                      form: {
                        ...prevState.form,
                        hs_code: values.hs_code,
                        name: values.name,
                      },
                    }));

                    setTimeout(() => {
                      actions.setSubmitting(false);
                      // actions.resetForm();
                      this.handleAddCategory();
                    }, 900);
                  }}
                >
                  {(props) => (
                    <Form onSubmit={props.handleSubmit}>
                      <FormBootstrap.Group controlId="hs_code">
                        <FormBootstrap.Label>HS Code</FormBootstrap.Label>
                        <Field
                          type="number"
                          name="hs_code"
                          placeholder="Enter HS Code"
                          className={`form-control ${
                            props.errors.hs_code ? `is-invalid` : ``
                          }`}
                          value={props.hs_code}
                        />
                        <ErrorMessage
                          component="div"
                          name="hs_code"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
                      <FormBootstrap.Group controlId="name">
                        <FormBootstrap.Label>Name</FormBootstrap.Label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="Enter name category"
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
                  Update Category
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Formik
                  initialValues={this.state.form}
                  enableReinitialize
                  validationSchema={categoryFormSchema}
                  onSubmit={(values, actions) => {
                    this.setState((prevState) => ({
                      ...prevState,
                      form: {
                        ...prevState.form,
                        hs_code: values.hs_code,
                        name: values.name,
                      },
                    }));
                    setTimeout(() => {
                      actions.setSubmitting(false);
                      // actions.resetForm();
                      this.handleUpdateCategory();
                    }, 900);
                  }}
                >
                  {(props) => (
                    <Form onSubmit={props.handleSubmit}>
                      <FormBootstrap.Group controlId="hs_code">
                        <FormBootstrap.Label>HS Code</FormBootstrap.Label>
                        <Field
                          type="number"
                          name="hs_code"
                          placeholder="Enter HS Code"
                          className={`form-control ${
                            props.errors.hs_code ? `is-invalid` : ``
                          }`}
                          value={props.values.hs_code}
                        />
                        <ErrorMessage
                          component="div"
                          name="hs_code"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
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

export default connect(mapStateToProps)(Category);
