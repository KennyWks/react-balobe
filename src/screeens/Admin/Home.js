import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form as FormBootstrap,
} from "react-bootstrap";
import Header from "../Layout/AdminTemplates";
import { Footer } from "../Layout/Templates";
import { connect } from "react-redux";
import Spinner from "../../component/Spinner";
import Alert from "../../component/Alert";
import { getData, patchData } from "../../helpers/CRUD";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const updateProfilFormSchema = Yup.object().shape({
  fullname: Yup.string().required("Fullname is required!"),
  gender: Yup.string().required("Gender is required!"),
  phone: Yup.string()
    .required("Phone is required!")
    .min(11, "Phone must be 11 characters at minimum!")
    .max(12, "Phone must be 12 characters at maximum!"),
  email: Yup.string()
    .required("Email is required!")
    .email("Invalid email address!"),
  address: Yup.string().required("Address is required!"),
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: props.isLogin,
      data: {
        id_user: props.id_user,
        username: props.username,
        role_id: props.role_id,
      },
      detailUser: {},
      form: {
        fullname: "",
        gender: "",
        address: "",
        email: "",
        phone: "",
      },
      image: "",
      pathFile: "",
      onLoad: false,
      onSubmit: false,
      message: "",
      alert: "",
      showModalProfil: false,
      showModalPicture: false,
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
        this.getUser();
      }
    }
  }

  getUser = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await getData(
        `/profile/user/${this.state.data.id_user}`
      );
      this.setState((prevState) => ({
        ...prevState,
        detailUser: response.data.data,
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

  handleShowModalUpdateProfil = () => {
    const { detailUser } = this.state;
    this.setState((prevState) => ({
      ...prevState,
      showModalProfil: true,
      form: {
        fullname: detailUser.fullname,
        gender: detailUser.gender,
        address: detailUser.address,
        email: detailUser.email,
        phone: detailUser.phone,
      },
    }));
  };

  handleCloseModalUpdateProfil = () =>
    this.setState((prevState) => ({
      ...prevState,
      showModalProfil: false,
    }));

  handleShowModalUpdatePicture = () => {
    this.setState((prevState) => ({
      ...prevState,
      showModalPicture: true,
    }));
  };

  handleCloseModalUpdatePicture = () =>
    this.setState((prevState) => ({
      ...prevState,
      showModalPicture: false,
    }));

  handleSubmitChangeProfil = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await patchData(
        `/profile/updateProfileAdmin`,
        this.state.form
      );
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          form: {
            fullname: "",
            gender: "",
            address: "",
            email: "",
            phone: "",
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
    this.handleCloseModalUpdateProfil();
    this.getUser();
  };

  handleSubmitChangeImage = async (e) => {
    e.preventDefault();
    if (this.state.image !== "") {
      this.setState((prevState) => ({
        ...prevState,
        onSubmit: true,
        message: "",
        alert: "",
      }));
      try {
        const response = await patchData(
          `/profile/updateImageProfileAdmin`,
          this.state.image
        );
        if (response.status === 201) {
          this.setState((prevState) => ({
            ...prevState,
            image: "",
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
          }
        }
      }
      this.setState((prevState) => ({
        ...prevState,
        onSubmit: false,
      }));
      this.handleCloseModalUpdatePicture();
      this.getUser();
    } else {
      alert("Please select a file");
    }
  };

  handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      if (
        imageFile.type === "image/jpeg" ||
        imageFile.type === "image/jpg" ||
        imageFile.type === "image/png"
      ) {
        if (imageFile.size < 500000) {
          let formData = new FormData();
          formData.append("image", imageFile);

          this.setState((prevState) => ({
            ...prevState,
            image: formData,
            pathFile: URL.createObjectURL(imageFile),
          }));
        } else {
          this.setState((prevState) => ({
            ...prevState,
            image: "",
            pathFile: "",
          }));
          alert("Images is too large!");
        }
      } else {
        this.setState((prevState) => ({
          ...prevState,
          image: "",
          pathFile: "",
        }));
        alert("File not a images!");
      }
    }
  };

  render() {
    const { detailUser, onLoad } = this.state;
    const url =
      process.env.REACT_APP_ENVIROMENT === "production"
        ? process.env.REACT_APP_URL_IMAGES_PRODUCTION
        : process.env.REACT_APP_URL_IMAGES_DEVELOPMENT;
    return (
      <div>
        <Header />
        <Container className="mt-3">
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
          {!onLoad && Object.keys(detailUser).length > 0 && (
            <div>
              <h3>Welcome {detailUser.fullname}!</h3>
              <div className="card mb-3" style={{ maxWidth: "540px" }}>
                <Row className="no-gutters">
                  <Col md={4}>
                    <img
                      // src={`${url}/${detailUser.picture.replace(
                      //   "/",
                      //   "%2F"
                      // )}?alt=media`}
                      src={`${url}/${
                        process.env.REACT_APP_ENVIROMENT === "production"
                          ? `${detailUser.picture.replace(
                              "/",
                              "%2F"
                            )}?alt=media`
                          : detailUser.picture
                      }`}
                      className="card-img"
                      alt="gambar profil pengguna"
                    />
                  </Col>
                  <Col md={8}>
                    <div className="card-body">
                      <h5 className="card-title">{detailUser.fullname}</h5>
                      <div className="card-text">{detailUser.phone}</div>
                      <div className="card-text">{detailUser.email}</div>
                      <div className="card-text">{detailUser.address}</div>
                      <p className="card-text">
                        <small className="text-muted">
                          Dibuat tanggal {detailUser.created_at}
                        </small>
                      </p>
                      <Button
                        className="btn btn-success inline"
                        onClick={this.handleShowModalUpdateProfil}
                      >
                        Update Profil
                      </Button>

                      <Button
                        className="btn btn-success inline m-2"
                        onClick={this.handleShowModalUpdatePicture}
                      >
                        Update Picture
                      </Button>

                      <Modal
                        show={this.state.showModalProfil}
                        onHide={this.handleCloseModalUpdateProfil}
                        animation={false}
                        size="md"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Update Profil</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Formik
                            initialValues={this.state.form}
                            enableReinitialize
                            validationSchema={updateProfilFormSchema}
                            onSubmit={(values, actions) => {
                              this.setState((prevState) => ({
                                ...prevState,
                                form: {
                                  ...prevState.form,
                                  fullname: values.fullname,
                                  gender: values.gender,
                                  phone: values.phone,
                                  email: values.email,
                                  address: values.address,
                                },
                              }));

                              setTimeout(() => {
                                actions.setSubmitting(false);
                                // actions.resetForm();
                                this.handleSubmitChangeProfil();
                              }, 900);
                            }}
                          >
                            {(props) => (
                              <Form onSubmit={props.handleSubmit}>
                                <FormBootstrap.Group controlId="fullname">
                                  <FormBootstrap.Label>
                                    Full Name
                                  </FormBootstrap.Label>
                                  <Field
                                    type="text"
                                    name="fullname"
                                    placeholder="Enter Full Name"
                                    value={props.values.fullname}
                                    className={`form-control ${
                                      props.errors.fullname ? `is-invalid` : ``
                                    }`}
                                  />
                                  <ErrorMessage
                                    component="div"
                                    name="fullname"
                                    className="invalid-feedback"
                                  />
                                </FormBootstrap.Group>

                                <FormBootstrap.Group controlId="gender">
                                  <Field
                                    name="gender"
                                    component="select"
                                    placeholder="Select Gender"
                                    className="form-control"
                                  >
                                    <option
                                      defaultValue={
                                        props.values.gender === "Male"
                                          ? "true"
                                          : "false"
                                      }
                                      value="Male"
                                    >
                                      Male
                                    </option>
                                    <option
                                      defaultValue={
                                        props.values.gender === "Female"
                                          ? "true"
                                          : "false"
                                      }
                                      value="Female"
                                    >
                                      Female
                                    </option>
                                  </Field>

                                  <ErrorMessage
                                    component="div"
                                    name="gender"
                                    className="invalid-feedback"
                                  />
                                </FormBootstrap.Group>

                                <FormBootstrap.Group controlId="phone">
                                  <FormBootstrap.Label>
                                    Phone Number
                                  </FormBootstrap.Label>
                                  <Field
                                    type="text"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={props.values.phone}
                                    className={`form-control ${
                                      props.errors.phone ? `is-invalid` : ``
                                    }`}
                                  />
                                  <ErrorMessage
                                    component="div"
                                    name="phone"
                                    className="invalid-feedback"
                                  />
                                </FormBootstrap.Group>
                                <FormBootstrap.Group controlId="email">
                                  <FormBootstrap.Label>
                                    Email address
                                  </FormBootstrap.Label>
                                  <Field
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={props.values.email}
                                    className={`form-control ${
                                      props.errors.email ? `is-invalid` : ``
                                    }`}
                                  />
                                  <ErrorMessage
                                    component="div"
                                    name="email"
                                    className="invalid-feedback"
                                  />
                                </FormBootstrap.Group>
                                <FormBootstrap.Group controlId="address">
                                  <FormBootstrap.Label>
                                    Address
                                  </FormBootstrap.Label>
                                  <Field
                                    as="textarea"
                                    name="address"
                                    rows={3}
                                    value={props.values.address}
                                    className={`form-control ${
                                      props.errors.address ? `is-invalid` : ``
                                    }`}
                                  />
                                  <ErrorMessage
                                    component="div"
                                    name="address"
                                    className="invalid-feedback"
                                  />
                                </FormBootstrap.Group>
                                <Button variant="primary" type="submit">
                                  {this.state.onSubmit && (
                                    <Spinner class="text-center my-0" />
                                  )}
                                  {!this.state.onSubmit && (
                                    <span> Edit Data</span>
                                  )}
                                </Button>
                              </Form>
                            )}
                          </Formik>
                        </Modal.Body>
                      </Modal>

                      <Modal
                        show={this.state.showModalPicture}
                        onHide={this.handleCloseModalUpdatePicture}
                        aria-labelledby="example-modal-sizes-title-lg"
                        size="md"
                        animation={false}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="example-modal-sizes-title-lg">
                            Edit Images Profile
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <FormBootstrap
                            onSubmit={this.handleSubmitChangeImage}
                          >
                            <FormBootstrap.Group controlId="image">
                              <FormBootstrap.File
                                id="image"
                                label="Images file"
                                name="image"
                                onChange={this.handleImageChange}
                              />
                              <img
                                width={64}
                                height={64}
                                className="mt-2"
                                src={this.state.pathFile}
                                alt="images upload preview"
                              />
                            </FormBootstrap.Group>
                            <Button type="submit" className="btn btn-primary">
                              {!this.state.onSubmit && <span>Upload</span>}
                              {this.state.onSubmit && (
                                <Spinner class="text-center my-0" />
                              )}
                            </Button>
                          </FormBootstrap>
                        </Modal.Body>
                      </Modal>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}
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

export default connect(mapStateToProps)(Home);
