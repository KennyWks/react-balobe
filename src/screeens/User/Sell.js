import React, { Component } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { getData, postData, patchData, deleteData } from "../../helpers/CRUD";
import Spinner from "../../component/Spinner";

class Sell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItem: {
        data: [],
        metadata: {},
      },
      listCategory: {
        data: [],
        metadata: {},
      },
      load: true,
      onSubmit: false,
      showAdd: false,
      showEdit: false,
      id_item: "",
      formAdd: {
        id_pelapak: props.match.params.id,
        id_category: "",
        name: "",
        price: "",
        quantity: "",
        weight: "",
        description: "",
        image: "",
      },
      form: {
        id_category: "",
        name: "",
        price: "",
        quantity: "",
        weight: "",
        description: "",
      },
      image: "",
      formImage: {
        url: "",
      },
    };
  }

  componentDidUpdate() {
    document.title = `Sell the Item - Balobe`;
  }

  getItemPelapak = async () => {
    this.setState((prevState) => ({
      ...prevState,
      load: true,
    }));
    try {
      const response = await getData(
        `/item/pelapak/${this.props.match.params.id}`
      );
      // console.log(response);
      this.setState((prevState) => ({
        ...prevState,
        listItem: response.data.data,
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
    this.getItemPelapak();
  }

  handleShowEdit = async (e) => {
    const id = e.target.id;
    this.setState((prevState) => ({
      ...prevState,
      load: true,
    }));
    try {
      const responseItem = await getData(`/item/${id}`);
      // console.log(responseItem);
      this.setState((prevState) => ({
        ...prevState,
        id_item: responseItem.data.data.id_item,
        form: {
          id_category: responseItem.data.data.id_category,
          name: responseItem.data.data.name_product,
          price: responseItem.data.data.price,
          quantity: responseItem.data.data.quantity,
          weight: responseItem.data.data.weight,
          description: responseItem.data.data.description,
        },
      }));

      const responseCategory = await getData(`/category`);
      this.setState((prevState) => ({
        ...prevState,
        listCategory: responseCategory.data.data,
      }));
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      load: false,
    }));
    this.setState((prevState) => ({
      ...prevState,
      showEdit: true,
    }));
  };

  handleCloseEdit = () => {
    this.setState((prevState) => ({
      ...prevState,
      showEdit: false,
    }));
  };

  handleInputUpdateItem = (e) => {
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

  handleSubmitUpdateItem = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
    }));
    try {
      await patchData(`/item/${this.state.id_item}`, this.state.form);
      // console.log(response);
      this.setState((prevState) => ({
        ...prevState,
        id_item: "",
        form: {
          id_category: "",
          name: "",
          price: "",
          quantity: "",
          weight: "",
          description: "",
        },
      }));
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: false,
    }));
    this.handleCloseEdit();
    this.getItemPelapak();
  };

  handleShowEditImage = async (e) => {
    const id = e.target.id;
    this.setState((prevState) => ({
      ...prevState,
      load: true,
    }));
    try {
      const responseItem = await getData(`/item/${id}`);
      // console.log(responseItem);
      this.setState((prevState) => ({
        ...prevState,
        id_item: responseItem.data.data.id_item,
      }));
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      load: false,
    }));
    this.setState((prevState) => ({
      ...prevState,
      showEditLogo: true,
    }));
  };

  handleCloseEditImage = () => {
    this.setState((prevState) => ({
      ...prevState,
      showEditLogo: false,
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
        formImage: {
          url: URL.createObjectURL(imageFile),
        },
      }));
    }
  };

  handleSubmitChangeImage = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
    }));
    try {
      const response = await patchData(
        `/item/updateItemImage/${this.state.id_item}`,
        this.state.image
      );
      // console.log(response);
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          image: "",
          formImage: {
            url: "",
          },
          message: "Your image is updated",
        }));
      }
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: false,
    }));
    this.handleCloseEditImage();
    this.getItemPelapak();
  };

  handleShowAdd = async () => {
    const responseCategory = await getData(`/category`);
    this.setState((prevState) => ({
      ...prevState,
      listCategory: responseCategory.data.data,
    }));

    this.setState((prevState) => ({
      ...prevState,
      showAdd: true,
    }));
  };

  handleCloseAdd = () => {
    this.setState((prevState) => ({
      ...prevState,
      showAdd: false,
    }));
  };

  handleInputAddItem = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState((prevState) => ({
      ...prevState,
      formAdd: {
        ...prevState.formAdd,
        [name]: value,
      },
    }));
  };

  onImageAddIn = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      this.setState((prevState) => ({
        ...prevState,
        formAdd: {
          ...prevState.formAdd,
          image: imageFile,
        },
        formImage: {
          url: URL.createObjectURL(imageFile),
        },
      }));
    }
  };

  handleSubmitAddItem = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
    }));

    let data = new FormData();
    data.set("id_pelapak", this.state.formAdd.id_pelapak);
    data.set("id_category", this.state.formAdd.id_category);
    data.set("name", this.state.formAdd.name);
    data.set("price", this.state.formAdd.price);
    data.set("quantity", this.state.formAdd.quantity);
    data.set("weight", this.state.formAdd.weight);
    data.set("description", this.state.formAdd.description);
    data.append("image", this.state.formAdd.image);

    try {
      const response = await postData(`/item`, data);
      // console.log(response);
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          formAdd: {
            id_pelapak: "",
            id_category: "",
            name: "",
            price: "",
            quantity: "",
            weight: "",
            description: "",
            image: "",
          },
          formImage: {
            url: "",
          },
          message: "Your item is added",
        }));
      }
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: false,
    }));
    this.handleCloseAdd();
    this.getItemPelapak();
  };

  handleDelete = async (id_item) => {
    this.setState((prevState) => ({
      ...prevState,
      load: true,
    }));
    try {
      await deleteData(`/item/${id_item}`);
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
    this.setState((prevState) => ({
      ...prevState,
      load: false,
    }));
    this.getItemPelapak();
  };

  render() {
    const { listItem, load, onSubmit, listCategory } = this.state;
    return (
      <Container className="mt-4">
        {load && <Spinner class="text-center my-3" />}

        {!load && (
          <div>
            <div className="text-center h4">
              Your item data
              <br />
              <Button
                variant="link"
                style={{ textDecoration: "none" }}
                onClick={this.handleShowAdd}
              >
                Add a item now!
              </Button>
            </div>
            <Modal
              show={this.state.showAdd}
              onHide={this.handleCloseAdd}
              animation={false}
            >
              <Form onSubmit={this.handleSubmitAddItem}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      as="select"
                      name="id_category"
                      value={this.state.formAdd.id_category}
                      onChange={this.handleInputAddItem}
                    >
                      <option value="" defaultValue>
                        Pilih Category
                      </option>
                      {listCategory.length > 0 &&
                        listCategory.map((v) => (
                          <option value={v.id_category}>{v.name}</option>
                        ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter name"
                      value={this.state.formAdd.name}
                      onChange={this.handleInputAddItem}
                    />
                  </Form.Group>
                  <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      placeholder="Enter price"
                      value={this.state.formAdd.price}
                      onChange={this.handleInputAddItem}
                    />
                  </Form.Group>
                  <Form.Group controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      placeholder="Enter quantity"
                      value={this.state.formAdd.quantity}
                      onChange={this.handleInputAddItem}
                    />
                  </Form.Group>
                  <Form.Group controlId="weight">
                    <Form.Label>Weight</Form.Label>
                    <Form.Control
                      type="number"
                      name="weight"
                      placeholder="Enter weight"
                      value={this.state.formAdd.weight}
                      onChange={this.handleInputAddItem}
                    />
                  </Form.Group>
                  <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={this.state.formAdd.description}
                      onChange={this.handleInputAddItem}
                    />
                  </Form.Group>
                  <Form.Group controlId="image">
                    <Form.File
                      id="image"
                      label="Image (.jpg or .png)"
                      name="image"
                      onChange={this.onImageAddIn}
                    />
                    <img
                      src={this.state.formImage.url}
                      alt="item"
                      style={{
                        marginTop: "10px",
                        width: "100px",
                        height: "100px",
                      }}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button type="submit" className="btn btn-primary">
                    {onSubmit && <Spinner class="text-center my-0" />}
                    {!onSubmit && <span>Save</span>}
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </div>
        )}

        <Row className="justify-content-center">
          {listItem.length > 0 &&
            listItem.map((v, i) => (
              <Col md={8} key={i}>
                <div className="card mb-3" style={{ maxWidth: "740px" }}>
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <img
                        src={`https://firebasestorage.googleapis.com/v0/b/balobe-d2a28.appspot.com/o/${v.image.replace(
                          "/",
                          "%2F"
                        )}?alt=media`}
                        className="card-img"
                        alt="your product"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{v.name}</h5>
                        <div className="card-text">
                          <small className="text-muted">
                            <div>Rp. {v.price}</div>
                            <div>Stok {v.quantity}</div>
                            <div>Berat {v.weight} Kg</div>
                          </small>
                        </div>
                        <p className="card-text">{v.description}</p>
                        <Button
                          className="mr-1"
                          variant="success"
                          id={v.id_item}
                          onClick={this.handleShowEdit}
                        >
                          Edit
                        </Button>
                        <Button
                          className="mr-1"
                          variant="success"
                          id={v.id_item}
                          onClick={this.handleShowEditImage}
                        >
                          Edit Logo
                        </Button>
                        <Button
                          variant="danger"
                          id={v.id_item}
                          onClick={(e) => {
                            const id_item = e.target.id;
                            if (
                              window.confirm(
                                "Are you sure to remove this data?"
                              )
                            ) {
                              this.handleDelete(id_item);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
        </Row>
        <Modal
          show={this.state.showEdit}
          onHide={this.handleCloseEdit}
          animation={false}
        >
          <Form onSubmit={this.handleSubmitUpdateItem}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  name="id_category"
                  value={this.state.form.id_category}
                  onChange={this.handleInputUpdateItem}
                >
                  {listCategory.length > 0 &&
                    listCategory.map((v, i) => (
                      <option key={i} value={v.id_category}>
                        {v.name}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={this.state.form.name}
                  onChange={this.handleInputUpdateItem}
                />
              </Form.Group>
              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={this.state.form.price}
                  onChange={this.handleInputUpdateItem}
                />
              </Form.Group>
              <Form.Group controlId="quantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity"
                  value={this.state.form.quantity}
                  onChange={this.handleInputUpdateItem}
                />
              </Form.Group>
              <Form.Group controlId="weight">
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="number"
                  name="weight"
                  placeholder="Enter weight"
                  value={this.state.form.weight}
                  onChange={this.handleInputUpdateItem}
                />
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={this.state.form.description}
                  onChange={this.handleInputUpdateItem}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" className="btn btn-primary">
                {onSubmit && <Spinner class="text-center my-0" />}
                {!onSubmit && <span>Save</span>}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <Modal
          show={this.state.showEditLogo}
          onHide={this.handleCloseEditImage}
          animation={false}
        >
          <Form onSubmit={this.handleSubmitChangeImage}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Logo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.File
                id="item"
                label="Image (.jpg or .png)"
                name="image"
                onChange={this.onImageChange}
              />
              <img
                src={this.state.formImage.url}
                alt="logo"
                style={{
                  marginTop: "10px",
                  width: "100px",
                  height: "100px",
                }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" className="btn btn-primary">
                {onSubmit && <Spinner class="text-center my-0" />}
                {!onSubmit && <span>Upload</span>}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    );
  }
}

export default Sell;
