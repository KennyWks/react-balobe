import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form as FormBootstrap,
} from "react-bootstrap";
import { MdPlace } from "react-icons/md";
import { getData, postData, patchData } from "../../../helpers/CRUD";
import Spinner from "../../../component/Spinner";
import Alert from "../../../component/Alert";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const selerFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!"),
  description: Yup.string().required("Description is required!"),
  city: Yup.string().required("City is required!"),
  address: Yup.string().required("Address is required!"),
});

class Seler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPelapak: {},
      city: [],
      lgRegisterShow: false,
      lgUpdateShow: false,
      lgChangeLogoShow: false,
      setLgShow: false,
      form: {
        name: "",
        logo: "img-logo/default.jpg",
        description: "",
        city: "",
        address: "",
      },
      onLoad: false,
      message: "",
      alert: "",
      image: "",
    };
    // this.handleLogoChange = this.handleLogoChange.bind(this);
  }

  componentDidMount() {
    document.title = `My transaction (Sell) - Balobe`;
    this.getDetailPelapak();
  }

  getDetailPelapak = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const cityDesti = await getData(`/api/rajaongkir/city`);
      this.setState((prevState) => ({
        ...prevState,
        city: cityDesti.data.data.rajaongkir.results,
      }));
      const response = await getData(`/pelapak/profile`);
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          dataPelapak: response.data.data,
          form: {
            name: response.data.data.name,
            logo: response.data.data.logo,
            description: response.data.data.description,
            city: response.data.data.city,
            address: response.data.data.address,
          },
        }));
      }
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

  setModalRegisterShow = (bool) => {
    this.setState((prevState) => ({
      ...prevState,
      setLgShow: bool,
      lgRegisterShow: bool,
    }));
  };

  setModalUpdateShow = (bool) => {
    this.setState((prevState) => ({
      ...prevState,
      setLgShow: bool,
      lgUpdateShow: bool,
    }));
  };

  setModalChangeLogoShow = (bool) => {
    this.setState((prevState) => ({
      ...prevState,
      setLgShow: bool,
      lgChangeLogoShow: bool,
    }));
  };

  handleSubmitAdd = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await postData(`/pelapak`, this.state.form);
      // console.log(response);
      if (response.status === 201) {
        this.setState((prevState) => ({
          ...prevState,
          form: {
            name: "",
            logo: "",
            description: "",
            city: "",
            address: "",
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
      onLoad: false,
    }));
    this.setModalRegisterShow(false);
    this.getDetailPelapak();
  };

  handleSubmitUpdate = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
      message: "",
      alert: "",
    }));
    try {
      const response = await patchData(`/pelapak`, this.state.form);
      // console.log(response);
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          form: {
            name: "",
            logo: "",
            description: "",
            city: "",
            address: "",
          },
          message: response.data.data.msg,
          alert: "success",
        }));
      }
    } catch (error) {
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
    this.setState((prevState) => ({
      ...prevState,
      onLoad: false,
    }));
    this.setModalUpdateShow(false);
    this.getDetailPelapak();
  };

  handleSubmitChangeLogo = async (e) => {
    e.preventDefault();
    if (this.state.image !== "") {
      this.setState((prevState) => ({
        ...prevState,
        onLoad: true,
        message: "",
        alert: "",
      }));
      try {
        const response = await patchData(
          `/pelapak/updateImage`,
          this.state.image
        );
        // console.log(response);
        if (response.status === 201) {
          this.setState((prevState) => ({
            ...prevState,
            image: "",
            message: response.data.data.msg,
            alert: "success",
          }));
        }
      } catch (error) {
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
      this.setState((prevState) => ({
        ...prevState,
        onLoad: false,
      }));
      this.setModalChangeLogoShow(false);
      this.getDetailPelapak();
    } else {
      alert("Please select a file");
    }
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

  handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let logoFile = e.target.files[0];

      if (
        logoFile.type === "image/jpeg" ||
        logoFile.type === "image/jpg" ||
        logoFile.type === "image/png"
      ) {
        if (logoFile.size < 500000) {
          let formData = new FormData();
          formData.append("image", logoFile);

          this.setState((prevState) => ({
            ...prevState,
            image: formData,
            form: {
              ...prevState.form,
              logo: URL.createObjectURL(logoFile),
            },
          }));
        } else {
          this.setState((prevState) => ({
            ...prevState,
            image: "",
            form: {
              ...prevState.form,
              logo: "",
            },
          }));
          alert("Images is too large!");
        }
      } else {
        this.setState((prevState) => ({
          ...prevState,
          image: "",
          form: {
            ...prevState.form,
            logo: "",
          },
        }));
        alert("File not a images!");
      }
    }
  };

  setCityofUser = (city) => {
    const dataCity = this.state.city.filter(function (v) {
      return v.city_id === `${city}`;
    });
    return dataCity[0].city_name;
  };

  initialValues() {
    return {
      name: "",
      description: "",
      city: "",
      address: "",
    };
  }

  render() {
    const { dataPelapak, city } = this.state;
    const url =
      process.env.REACT_APP_ENVIROMENT === "production"
        ? process.env.REACT_APP_URL_IMAGES_PRODUCTION
        : process.env.REACT_APP_URL_IMAGES_DEVELOPMENT;
    return (
      <div>
        {this.state.onLoad && <Spinner class="text-center my-3" />}

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

        {!Object.keys(dataPelapak).length > 0 && this.state.onLoad === false && (
          <div>
            <Container>
              <Row>
                <Col>
                  <Card.Body>
                    <Card.Title>Come and trade with balobe!</Card.Title>
                    <Card.Text>Trade in balobe is simple.</Card.Text>
                    <Button onClick={() => this.setModalRegisterShow(true)}>
                      Trade Now
                    </Button>
                  </Card.Body>
                </Col>
              </Row>
            </Container>

            <Modal
              size="lg"
              show={this.state.lgRegisterShow}
              onHide={() => this.setModalRegisterShow(false)}
              aria-labelledby="example-modal-sizes-title-lg"
              animation={false}
            >
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                  Shop Register
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Formik
                  initialValues={this.initialValues()}
                  validationSchema={selerFormSchema}
                  onSubmit={(values, actions) => {
                    this.setState((prevState) => ({
                      ...prevState,
                      form: {
                        ...prevState.form,
                        name: values.name,
                        description: values.description,
                        city: values.city,
                        address: values.address,
                      },
                    }));

                    setTimeout(() => {
                      actions.setSubmitting(false);
                      // actions.resetForm();
                      this.handleSubmitAdd();
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
                          placeholder="Your shop name"
                          value={props.name}
                          className={`form-control ${
                            props.errors.name ? `is-invalid` : ``
                          }`}
                        />
                        <ErrorMessage
                          component="div"
                          name="name"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
                      <FormBootstrap.Group controlId="description">
                        <FormBootstrap.Label>Description</FormBootstrap.Label>
                        <Field
                          as="textarea"
                          name="description"
                          value={props.description}
                          rows={3}
                          className={`form-control ${
                            props.errors.description ? `is-invalid` : ``
                          }`}
                        />
                        <ErrorMessage
                          component="div"
                          name="description"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
                      <FormBootstrap.Group controlId="city">
                        <FormBootstrap.Label>City</FormBootstrap.Label>

                        <Field
                          name="city"
                          component="select"
                          placeholder="Select City"
                          className={`form-control ${
                            props.errors.city ? `is-invalid` : ``
                          }`}
                        >
                          <option defaultValue>Select your shop city</option>
                          {city.map((v, i) => (
                            <option key={i} value={v.city_id}>
                              {v.city_name}
                            </option>
                          ))}
                        </Field>

                        <ErrorMessage
                          component="div"
                          name="city"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
                      <FormBootstrap.Group controlId="address">
                        <FormBootstrap.Label>Address</FormBootstrap.Label>
                        <Field
                          type="text"
                          name="address"
                          placeholder="Your address"
                          value={props.address}
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
                      <Button type="submit" className="btn btn-primary">
                        Register Now{" "}
                        {this.state.onLoad && (
                          <Spinner class="text-center my-3" />
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>
          </div>
        )}

        {Object.keys(dataPelapak).length > 0 && (
          <div>
            <Container>
              <Row className="mt-2">
                <Col>
                  <div className="card mb-3">
                    <div className="row no-gutters">
                      <div className="col-md-4">
                        <img
                          // src={`${url}/${dataPelapak.logo.replace(
                          //   "/",
                          //   "%2F"
                          // )}?alt=media`}
                          src={`${url}/${
                            process.env.REACT_APP_ENVIROMENT === "production"
                              ? `${dataPelapak.logo.replace(
                                  "/",
                                  "%2F"
                                )}?alt=media`
                              : dataPelapak.logo
                          }`}
                          className="card-img"
                          alt="your product"
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title">{dataPelapak.name}</h5>
                          <p className="card-text">
                            <MdPlace />
                            &nbsp;
                            <span className="text-muted">
                              {this.setCityofUser(dataPelapak.city)} |{" "}
                              {dataPelapak.address}
                            </span>
                          </p>
                          <p className="card-text">{dataPelapak.description}</p>
                          <Link
                            className="btn btn-primary"
                            to={`/sell/${dataPelapak.id_pelapak}`}
                          >
                            My Item
                          </Link>
                          <Button
                            className="d-inline mx-2"
                            onClick={() => this.setModalUpdateShow(true)}
                          >
                            Edit Profil
                          </Button>
                          <Button
                            className="d-inline mx-2"
                            onClick={() => this.setModalChangeLogoShow(true)}
                          >
                            Edit Logo
                          </Button>
                          <Link
                            className="btn btn-primary d-inline"
                            to={`/transaction/sell/${dataPelapak.id_pelapak}`}
                          >
                            Transaction
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>

            <Modal
              size="lg"
              show={this.state.lgUpdateShow}
              onHide={() => this.setModalUpdateShow(false)}
              aria-labelledby="example-modal-sizes-title-lg"
              animation={false}
            >
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                  Edit Shop Profil
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Formik
                  initialValues={this.state.form}
                  enableReinitialize
                  validationSchema={selerFormSchema}
                  onSubmit={(values, actions) => {
                    this.setState((prevState) => ({
                      ...prevState,
                      form: {
                        ...prevState.form,
                        name: values.name,
                        description: values.description,
                        city: values.city,
                        address: values.address,
                      },
                    }));

                    setTimeout(() => {
                      actions.setSubmitting(false);
                      // actions.resetForm();
                      this.handleSubmitUpdate();
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
                          placeholder="name"
                          value={props.values.name}
                          className={`form-control ${
                            props.errors.name ? `is-invalid` : ``
                          }`}
                        />
                        <ErrorMessage
                          component="div"
                          name="name"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
                      <FormBootstrap.Group controlId="description">
                        <FormBootstrap.Label>Description</FormBootstrap.Label>
                        <Field
                          as="textarea"
                          name="description"
                          placeholder="description"
                          value={props.values.description}
                          rows={3}
                          className={`form-control ${
                            props.errors.description ? `is-invalid` : ``
                          }`}
                        />
                        <ErrorMessage
                          component="div"
                          name="description"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
                      <FormBootstrap.Group controlId="city">
                        <FormBootstrap.Label>City</FormBootstrap.Label>

                        <Field
                          name="city"
                          component="select"
                          placeholder="Select City"
                          value={props.values.city}
                          className={`form-control ${
                            props.errors.city ? `is-invalid` : ``
                          }`}
                        >
                          {city.map((v, i) => (
                            <option key={i} value={v.city_id}>
                              {v.city_name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          component="div"
                          name="city"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
                      <FormBootstrap.Group controlId="address">
                        <FormBootstrap.Label>Address</FormBootstrap.Label>
                        <Field
                          type="text"
                          name="address"
                          placeholder="Your address"
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
                      <Button type="submit" className="btn btn-primary">
                        {!this.state.onLoad && <span>Edit</span>}{" "}
                        {this.state.onLoad && (
                          <Spinner class="text-center my-0" />
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>

            <Modal
              size="lg"
              show={this.state.lgChangeLogoShow}
              onHide={() => this.setModalChangeLogoShow(false)}
              aria-labelledby="example-modal-sizes-title-lg"
              animation={false}
            >
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                  Edit Shop Logo
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <FormBootstrap onSubmit={this.handleSubmitChangeLogo}>
                  <FormBootstrap.Group controlId="logo">
                    <FormBootstrap.File
                      id="logo"
                      label="Image items"
                      name="image"
                      onChange={this.handleLogoChange}
                    />
                    <img
                      src={this.state.form.logo}
                      alt="logo upload preview"
                      style={{
                        width: "100px",
                        height: "100px",
                      }}
                    />
                  </FormBootstrap.Group>
                  <Button type="submit" className="btn btn-primary">
                    {this.state.onLoad && <Spinner class="text-center my-3" />}
                    {!this.state.onLoad && <span>Upload logo</span>}
                  </Button>
                </FormBootstrap>
              </Modal.Body>
            </Modal>
          </div>
        )}
      </div>
    );
  }
}

export default Seler;
