import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { MdPlace } from "react-icons/md";
import { getData, postData, patchData } from "../../../helpers/CRUD";
import Spinner from "../../../component/Spinner";
import { Link } from "react-router-dom";

class Seler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: "",
      data: {},
      city: [],
      lgRegisterShow: false,
      lgUpdateShow: false,
      lgChangeLogoShow: false,
      setLgShow: false,
      form: {
        name: "",
        logo: "default.png",
        description: "",
        city: "",
        address: "",
      },
      message: "",
      image: "",
    };
    this.onLogoChange = this.onLogoChange.bind(this);
  }

  componentDidMount() {
    document.title = `My transaction (Sell) - Balobe`;
    this.getDetailPelapak();
  }

  getDetailPelapak = async () => {
    this.setState((prevState) => ({
      ...prevState,
      load: true,
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
          data: response.data.data,
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
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      load: false,
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

  handleSubmitAdd = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      load: true,
    }));
    try {
      const response = await postData(`/pelapak`, this.state.form);
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
          message: "Your data is registered",
        }));
      }
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      load: false,
    }));
    this.setModalRegisterShow(false);
    this.getDetailPelapak();
  };

  handleSubmitUpdate = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      load: true,
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
          message: "Your data is updated",
        }));
      }
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      load: false,
    }));
    this.setModalUpdateShow(false);
    this.getDetailPelapak();
  };

  handleSubmitChangeLogo = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      load: true,
    }));
    try {
      const response = await patchData(
        `/pelapak/updateImage`,
        this.state.image
      );
      // console.log(response);
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          image: "",
          message: "Your logo is update",
        }));
      }
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      load: false,
    }));
    this.setModalChangeLogoShow(false);
    this.getDetailPelapak();
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

  onLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let logoFile = e.target.files[0];

      let formData = new FormData();
      formData.append("image", logoFile);

      this.setState((prevState) => ({
        ...prevState,
        image: formData,
        form: {
          logo: URL.createObjectURL(logoFile),
        },
      }));
    }
  };

  setCityofUser = (city) => {
    const dataCity = this.state.city.filter(function (v) {
      return v.city_id === `${city}`;
    });
    return dataCity[0].city_name;
  };

  render() {
    const { data, city } = this.state;
    return (
      <div>
        {this.state.load && <Spinner class="text-center my-3" />}
        {!Object.keys(data).length > 0 && this.state.load === false && (
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
                  Pelapak Register
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={this.handleSubmitAdd}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Your store name"
                      value={this.state.form.name}
                      onChange={this.handleInput}
                    />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlTextarea2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={this.state.form.description}
                      rows={3}
                      onChange={this.handleInput}
                    />
                  </Form.Group>
                  <Form.Group controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      as="select"
                      name="city"
                      onChange={this.handleInput}
                    >
                      <option defaultValue>Select your store city</option>
                      {city.map((v, i) => (
                        <option key={i} value={v.city_id}>
                          {v.city_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput4">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="Your address"
                      onChange={this.handleInput}
                    />
                  </Form.Group>
                  <Button type="submit" className="btn btn-primary">
                    Register Now{" "}
                    {this.state.load && <Spinner class="text-center my-3" />}
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        )}

        {Object.keys(data).length > 0 && (
          <div>
            <Container>
              <Row className="mt-2">
                <Col>
                  <div className="card mb-3">
                    <div className="row no-gutters">
                      <div className="col-md-4">
                        <img
                          src={`https://firebasestorage.googleapis.com/v0/b/balobe-d2a28.appspot.com/o/${data.logo.replace(
                            "/",
                            "%2F"
                          )}?alt=media`}
                          className="card-img"
                          alt="your product"
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title">{data.name}</h5>
                          <p className="card-text">
                            <MdPlace />
                            &nbsp;
                            <span className="text-muted">
                              {this.setCityofUser(data.city)} | {data.address}
                            </span>
                          </p>
                          <p className="card-text">{data.description}</p>
                          <Link
                            className="btn btn-primary"
                            to={`/sell/${data.id_pelapak}`}
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
                            to={`/transaction/sell/${data.id_pelapak}`}
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
                  Edit Profil
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={this.handleSubmitUpdate}>
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="name"
                      value={this.state.form.name}
                      onChange={this.handleInput}
                    />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      placeholder="description"
                      value={this.state.form.description}
                      rows={3}
                      onChange={this.handleInput}
                    />
                  </Form.Group>
                  <Form.Group controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      as="select"
                      name="city"
                      value={this.state.form.city}
                      onChange={this.handleInput}
                    >
                      {city.map((v, i) => (
                        <option key={i} value={v.city_id}>
                          {v.city_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="Your address"
                      value={this.state.form.address}
                      onChange={this.handleInput}
                    />
                  </Form.Group>
                  <Button type="submit" className="btn btn-primary">
                    {!this.state.load && <span>Edit</span>}{" "}
                    {this.state.load && <Spinner class="text-center my-0" />}
                  </Button>
                </Form>
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
                  Edit Logo
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={this.handleSubmitChangeLogo}>
                  <Form.Group controlId="logo">
                    <Form.File
                      id="logo"
                      label="Image (.jpg or .png)"
                      name="image"
                      onChange={this.onLogoChange}
                    />
                    <img
                      src={this.state.form.logo}
                      alt="logo"
                      style={{
                        width: "100px",
                        height: "100px",
                      }}
                    />
                  </Form.Group>
                  <Button type="submit" className="btn btn-primary">
                    {this.state.load && <Spinner class="text-center my-3" />}
                    {!this.state.load && <span>Upload logo</span>}
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        )}
      </div>
    );
  }
}

export default Seler;
