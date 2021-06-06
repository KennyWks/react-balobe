import React, { Component } from "react";
import { getData, patchData } from "../../helpers/CRUD";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import Spinner from "../../component/Spinner";
import Alert from "../../component/Alert";

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
      load: false,
      onSubmit: false,
      message: "",
      alert: "",
      image: "",
      pathFile: "",
    };
  }

  componentDidUpdate() {
    document.title = `My Profil - Balobe`;
  }

  setModalChangeImageShow = (bool) => {
    this.setState((prevState) => ({
      ...prevState,
      setLgShow: bool,
      lgChangeImageShow: bool,
    }));
  };

  getUser = async () => {
    this.setState((prevState) => ({
      ...prevState,
      load: true,
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
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      load: false,
    }));
  };

  componentDidMount() {
    this.getUser();
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
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
          message: "Data is updated",
          alert: "success",
        }));
      }
      this.getUser();
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: false,
    }));
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
        `/profile/updateImageProfileBuyer`,
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
    this.setModalChangeImageShow(false);
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
                {this.state.message && this.state.alert && (
                  <Alert variant={this.state.alert} info={this.state.message} />
                )}

                {this.state.load && (
                  <div className="text-center my-2">
                    <Spinner class="text-center my-3" />
                  </div>
                )}

                {Object.keys(dataUser).length > 0 && !this.state.load && (
                  <div>
                    <div className="text-center">
                      <img
                        // src={`${url}/${dataUser.picture.replace(
                        //   "/",
                        //   "%2F"
                        // )}?alt=media`}
                        src={`${url}/${
                          process.env.REACT_APP_ENVIROMENT === "production"
                            ? `${dataUser.picture.replace(
                                "/",
                                "%2F"
                              )}?alt=media`
                            : dataUser.picture
                        }`}
                        alt="user"
                        width="100px"
                        style={{
                          borderRadius: "3px",
                        }}
                      />

                      <div>Hello! Take a look your profile below.</div>
                    </div>

                    <Form onSubmit={this.handleSubmit}>
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
                      <Button
                        className="mx-1"
                        variant="success"
                        type="button"
                        onClick={() => this.setModalChangeImageShow(true)}
                      >
                        Edit Photo
                      </Button>
                    </Form>
                  </div>
                )}
              </Card.Body>
            </Col>
          </Row>
        </Container>

        <Modal
          size="lg"
          show={this.state.lgChangeImageShow}
          onHide={() => this.setModalChangeImageShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
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
                  alt="update data"
                />
              </Form.Group>
              <Button type="submit" className="btn btn-primary">
                {!this.state.onSubmit && <span>Upload</span>}
                {this.state.onSubmit && <Spinner class="text-center my-0" />}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default Profil;
