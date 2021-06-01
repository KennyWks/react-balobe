import React, { Component } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import Header from "../Layout/AdminTemplates";
import { Footer } from "../Layout/Templates";
import { connect } from "react-redux";
import Spinner from "../../component/Spinner";
import { getData, patchData } from "../../helpers/CRUD";

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
      console.log(error);
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

  handleSubmitChangeProfil = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
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
          message: "Data is updated",
          alert: "success",
        }));
      }
    } catch (error) {
      console.log(error);
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
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
    }));
    try {
      const response = await patchData(
        `/profile/updateImageProfileAdmin`,
        this.state.image
      );
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          image: "",
          message: "Your photo is change",
          alert: "success",
        }));
      }
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: false,
    }));
    this.handleCloseModalUpdatePicture();
    this.getUser();
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

  onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];

      let formData = new FormData();
      formData.append("image", imageFile);

      this.setState((prevState) => ({
        ...prevState,
        image: formData,
        pathFile: URL.createObjectURL(imageFile),
      }));
    }
  };

  render() {
    const { detailUser, onLoad } = this.state;
    return (
      <div>
        <Header />
        <Container className="mt-3">
          {onLoad && <Spinner class="text-center my-3" />}

          {!onLoad && Object.keys(detailUser).length > 0 && (
            <div>
              <h3>Welcome {detailUser.fullname}!</h3>
              <div className="card mb-3" style={{ maxWidth: "540px" }}>
                <Row className="no-gutters">
                  <Col md={4}>
                    <img
                      src={`https://firebasestorage.googleapis.com/v0/b/balobe-d2a28.appspot.com/o/${detailUser.picture.replace(
                        "/",
                        "%2F"
                      )}?alt=media`}
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
                          <Form onSubmit={this.handleSubmitChangeProfil}>
                            <Form.Group controlId="name">
                              <Form.Label>Full Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="fullname"
                                placeholder="Enter Full Name"
                                value={this.state.form.fullname}
                                onChange={this.handleInput}
                              />
                            </Form.Group>
                            <Form.Group controlId="gender">
                              <Form.Label>Gender</Form.Label>
                              <Form.Control
                                as="select"
                                name="gender"
                                value={this.state.form.gender}
                                onChange={this.handleInput}
                              >
                                <option>Male</option>
                                <option>Female</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="email">
                              <Form.Label>Phone Number</Form.Label>
                              <Form.Control
                                type="number"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={this.state.form.phone}
                                onChange={this.handleInput}
                              />
                            </Form.Group>
                            <Form.Group controlId="email">
                              <Form.Label>Email address</Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={this.state.form.email}
                                onChange={this.handleInput}
                              />
                            </Form.Group>
                            <Form.Group controlId="address">
                              <Form.Label>Address</Form.Label>
                              <Form.Control
                                as="textarea"
                                name="address"
                                rows={3}
                                value={this.state.form.address}
                                onChange={this.handleInput}
                              />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                              {this.state.onSubmit && (
                                <Spinner class="text-center my-0" />
                              )}
                              {!this.state.onSubmit && <span> Edit Data</span>}
                            </Button>
                          </Form>{" "}
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
                            Edit Your Photo
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form onSubmit={this.handleSubmitChangeImage}>
                            <Form.Group controlId="exampleForm.ControlInput1">
                              <Form.File
                                id="exampleFormControlFile1"
                                label="Photo file"
                                name="image"
                                onChange={this.onImageChange}
                              />
                              <img
                                width={64}
                                height={64}
                                className="mt-2"
                                src={this.state.pathFile}
                                alt="path file"
                              />
                            </Form.Group>
                            <Button type="submit" className="btn btn-primary">
                              {!this.state.onSubmit && <span>Upload</span>}
                              {this.state.onSubmit && (
                                <Spinner class="text-center my-0" />
                              )}
                            </Button>
                          </Form>
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
