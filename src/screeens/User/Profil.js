import React, { Component } from "react";
import { getData, patchData } from "../../helpers/CRUD";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form as FormBootstrap,
  Modal,
} from "react-bootstrap";
import Spinner from "../../component/Spinner";
import Alert from "../../component/Alert";
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

class Profil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        fullname: "",
        gender: "",
        picture: "",
        address: "",
        email: "",
        phone: "",
      },
      dataUser: {},
      onLoad: false,
      onSubmit: false,
      message: "",
      alert: "",
      image: "",
      pathFile: "",
    };
  }

  componentDidMount() {
    document.title = `My Profil - Balobe`;
    this.getUser();
  }

  setModalChangeImageShow = (bool) => {
    this.setState((prevState) => ({
      ...prevState,
      setLgShow: bool,
      lgChangeImageShow: bool,
      pathFile: "",
      image: "",
    }));
  };

  getUser = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await getData(
        `/profile/user/${this.props.match.params.id}`
      );
      this.setState((prevState) => ({
        ...prevState,
        dataUser: response.data.data,
        form: {
          fullname: response.data.data.fullname,
          gender: response.data.data.gender,
          picture: response.data.data.picture,
          address: response.data.data.address,
          email: response.data.data.email,
          phone: response.data.data.phone,
        },
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

  handleSubmitChangeProfil = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await patchData(
        `/profile/updateProfileBuyer`,
        this.state.form
      );
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          form: {
            ...prevState.form,
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
      this.getUser();
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
          `/profile/updateImageProfileBuyer`,
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
      this.setModalChangeImageShow(false);
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
    const { dataUser } = this.state;
    const url =
      process.env.REACT_APP_ENVIROMENT === "production"
        ? process.env.REACT_APP_URL_IMAGES_PRODUCTION
        : process.env.REACT_APP_URL_IMAGES_DEVELOPMENT;
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <Card.Body>
                {this.state.onLoad && (
                  <div className="text-center my-2">
                    <Spinner class="text-center my-3" />
                  </div>
                )}

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

                {Object.keys(dataUser).length > 0 && !this.state.onLoad && (
                  <div>
                    <div className="text-center">
                      <div>Hello! Take a look your profile below.</div>
                    </div>

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
                            <FormBootstrap.Label>Full Name</FormBootstrap.Label>
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
                            <FormBootstrap.Label>Address</FormBootstrap.Label>
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
                          <div className="m-3">
                            <img
                              // src={`${url}/${dataUser.picture.replace(
                              //   "/",
                              //   "%2F"
                              // )}?alt=media`}
                              src={`${url}/${
                                process.env.REACT_APP_ENVIROMENT ===
                                "production"
                                  ? `${dataUser.picture.replace(
                                      "/",
                                      "%2F"
                                    )}?alt=media`
                                  : dataUser.picture
                              }`}
                              alt="user profile images"
                              width="100px"
                              style={{
                                borderRadius: "3px",
                              }}
                            />
                          </div>
                          <Button variant="primary" type="submit">
                            {this.state.onSubmit && (
                              <Spinner class="text-center my-0" />
                            )}
                            {!this.state.onSubmit && <span> Edit Data</span>}
                          </Button>
                          <Button
                            className="mx-1"
                            variant="success"
                            type="button"
                            onClick={() => this.setModalChangeImageShow(true)}
                          >
                            Edit Photo
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                )}
              </Card.Body>
            </Col>
          </Row>
        </Container>

        <Modal
          show={this.state.lgChangeImageShow}
          onHide={() => this.setModalChangeImageShow(false)}
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
            <FormBootstrap onSubmit={this.handleSubmitChangeImage}>
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
                {this.state.onSubmit && <Spinner class="text-center my-0" />}
              </Button>
            </FormBootstrap>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default Profil;
