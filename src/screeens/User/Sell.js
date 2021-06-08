import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form as FormBootstrap,
} from "react-bootstrap";
import { getData, postData, patchData, deleteData } from "../../helpers/CRUD";
import Spinner from "../../component/Spinner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const itemFormSchema = Yup.object().shape({
  id_category: Yup.string().required("Category is required!"),
  name: Yup.string().required("Name is required!"),
  price: Yup.string().required("Price is required!"),
  quantity: Yup.string().required("Quantity is required!"),
  weight: Yup.string().required("Weight is required!"),
  description: Yup.string().required("Description is required!"),
});

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
      onLoad: false,
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
      formUpdate: {
        id_category: "",
        name: "",
        price: "",
        quantity: "",
        weight: "",
        description: "",
      },
      image: "",
      pathFile: "",
    };
  }

  componentDidMount() {
    this.getItemPelapak();
    document.title = `Sell the Item - Balobe`;
  }

  getItemPelapak = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
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
      if (!error.response) {
        alert("Server error! please try again.");
      } else {
        if (error.response.status === 500) {
          alert("Something error! please try again.");
        } else {
          alert(`${error.response.data.data.msg}`);
        }
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      onLoad: false,
    }));
  };

  handleShowAdd = async () => {
    try {
      const responseCategory = await getData(`/category`);
      this.setState((prevState) => ({
        ...prevState,
        listCategory: responseCategory.data.data,
      }));
      this.setState((prevState) => ({
        ...prevState,
        showAdd: true,
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
  };

  handleCloseAdd = () => {
    this.setState((prevState) => ({
      ...prevState,
      showAdd: false,
    }));
  };

  handleImageChangeCreate = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      if (
        imageFile.type === "image/jpeg" ||
        imageFile.type === "image/jpg" ||
        imageFile.type === "image/png"
      ) {
        if (imageFile.size < 500000) {
          this.setState((prevState) => ({
            ...prevState,
            formAdd: {
              ...prevState.formAdd,
              image: imageFile,
            },
            pathFile: URL.createObjectURL(imageFile),
          }));
        } else {
          this.setState((prevState) => ({
            ...prevState,
            formAdd: {
              ...prevState.formAdd,
              image: "",
            },
            pathFile: "",
          }));
          alert("Images is too large!");
        }
      } else {
        this.setState((prevState) => ({
          ...prevState,
          formAdd: {
            ...prevState.formAdd,
            image: "",
          },
          pathFile: "",
        }));
        alert("File not a images!");
      }
    }
  };

  handleSubmitAddItem = async () => {
    if (this.state.formAdd.image !== "") {
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
        if (response.status === 201) {
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
            pathFile: "",
          }));
          alert(`${response.data.data.msg}`);
        }
      } catch (error) {
        if (!error.response) {
          alert("Server error! please try again.");
        } else {
          if (error.response.status === 500) {
            alert("Something error! please try again.");
          } else {
            alert(`${error.response.data.data.msg}`);
          }
        }
      }
      this.setState((prevState) => ({
        ...prevState,
        onSubmit: false,
      }));
      this.handleCloseAdd();
      this.getItemPelapak();
    } else {
      alert("Please select a file");
    }
  };

  handleShowEdit = async (e) => {
    const idItem = e.target.id;
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const responseItem = await getData(`/item/${idItem}`);
      // console.log(responseItem);
      this.setState((prevState) => ({
        ...prevState,
        id_item: responseItem.data.data.id_item,
        formUpdate: {
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

      this.setState((prevState) => ({
        ...prevState,
        showEdit: true,
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

  handleCloseEdit = () => {
    this.setState((prevState) => ({
      ...prevState,
      showEdit: false,
    }));
  };

  handleSubmitUpdateItem = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: true,
    }));
    try {
      const response = await patchData(
        `/item/${this.state.id_item}`,
        this.state.formUpdate
      );
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
      if (response.status === 200) {
        alert(`${response.data.data.msg}`);
      }
    } catch (error) {
      if (!error.response) {
        alert("Server error! please try again.");
      } else {
        if (error.response.status === 500) {
          alert("Something error! please try again.");
        } else {
          alert(`${error.response.data.data.msg}`);
        }
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      onSubmit: false,
    }));
    this.handleCloseEdit();
    this.getItemPelapak();
  };

  handleShowEditImage = async (e) => {
    const idItem = e.target.id;
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const responseItem = await getData(`/item/${idItem}`);
      // console.log(responseItem);
      this.setState((prevState) => ({
        ...prevState,
        id_item: responseItem.data.data.id_item,
      }));
      this.setState((prevState) => ({
        ...prevState,
        showEditLogo: true,
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

  handleCloseEditImage = () => {
    this.setState((prevState) => ({
      ...prevState,
      showEditLogo: false,
    }));
  };

  handleChangeImageUpdate = (e) => {
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

  handleSubmitChangeImage = async (e) => {
    e.preventDefault();
    if (this.state.image !== "") {
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
        if (response.status === 201) {
          this.setState((prevState) => ({
            ...prevState,
            image: "",
            pathFile: "",
          }));
          alert(`${response.data.data.msg}`);
        }
      } catch (error) {
        if (!error.response) {
          alert("Server error! please try again.");
        } else {
          if (error.response.status === 500) {
            alert("Something error! please try again.");
          } else {
            alert(`${error.response.data.data.msg}`);
          }
        }
      }
      this.setState((prevState) => ({
        ...prevState,
        onSubmit: false,
      }));
      this.handleCloseEditImage();
      this.getItemPelapak();
    } else {
      alert("Please select a file");
    }
  };

  handleDelete = async (id_item) => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await deleteData(`/item/${id_item}`);
      // console.log(response);
      if (response.status === 200) {
        alert(`${response.data.data.msg}`);
      }
    } catch (error) {
      if (!error.response) {
        alert("Server error! please try again.");
      } else {
        if (error.response.status === 500) {
          alert("Something error! please try again.");
        } else {
          alert(`${error.response.data.data.msg}`);
        }
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      onLoad: false,
    }));
    this.getItemPelapak();
  };

  initialValues() {
    return {
      id_category: "",
      name: "",
      price: "",
      quantity: "",
      weight: "",
      description: "",
    };
  }

  render() {
    const { listItem, onLoad, onSubmit, listCategory } = this.state;
    const url =
      process.env.REACT_APP_ENVIROMENT === "production"
        ? process.env.REACT_APP_URL_IMAGES_PRODUCTION
        : process.env.REACT_APP_URL_IMAGES_DEVELOPMENT;
    return (
      <Container className="mt-4">
        {onLoad && <Spinner class="text-center my-3" />}

        {/* Begin main component create item */}
        {!onLoad && (
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
              <Modal.Header closeButton>
                <Modal.Title>Add Item</Modal.Title>
              </Modal.Header>
              <Formik
                initialValues={this.initialValues()}
                validationSchema={itemFormSchema}
                onSubmit={(values, actions) => {
                  this.setState((prevState) => ({
                    ...prevState,
                    formAdd: {
                      ...prevState.formAdd,
                      id_category: values.id_category,
                      name: values.name,
                      price: values.price,
                      quantity: values.quantity,
                      weight: values.weight,
                      description: values.description,
                    },
                  }));

                  setTimeout(() => {
                    actions.setSubmitting(false);
                    // actions.resetForm();
                    this.handleSubmitAddItem();
                  }, 900);
                }}
              >
                {(props) => (
                  <Modal.Body>
                    <Form onSubmit={props.handleSubmit}>
                      <FormBootstrap.Group controlId="category">
                        <FormBootstrap.Label>Category</FormBootstrap.Label>
                        <Field
                          name="id_category"
                          component="select"
                          placeholder="Select Category"
                          className={`form-control ${
                            props.errors.id_category ? `is-invalid` : ``
                          }`}
                          value={props.id_category}
                        >
                          <option value="" defaultValue>
                            Select Category
                          </option>
                          {listCategory.length > 0 &&
                            listCategory.map((v, i) => (
                              <option value={v.id_category} key={i}>
                                {v.name}
                              </option>
                            ))}
                        </Field>
                        <ErrorMessage
                          component="div"
                          name="id_category"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
                      <FormBootstrap.Group controlId="name">
                        <FormBootstrap.Label>Name</FormBootstrap.Label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="Enter item name"
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
                      <FormBootstrap.Group controlId="price">
                        <FormBootstrap.Label>Price</FormBootstrap.Label>
                        <Field
                          type="number"
                          name="price"
                          placeholder="Enter price"
                          value={props.price}
                          className={`form-control ${
                            props.errors.price ? `is-invalid` : ``
                          }`}
                        />
                        <ErrorMessage
                          component="div"
                          name="price"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
                      <FormBootstrap.Group controlId="quantity">
                        <FormBootstrap.Label>Quantity</FormBootstrap.Label>
                        <Field
                          type="number"
                          name="quantity"
                          placeholder="Enter quantity"
                          value={props.quantity}
                          className={`form-control ${
                            props.errors.quantity ? `is-invalid` : ``
                          }`}
                        />
                        <ErrorMessage
                          component="div"
                          name="quantity"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
                      <FormBootstrap.Group controlId="weight">
                        <FormBootstrap.Label>Weight</FormBootstrap.Label>
                        <Field
                          type="number"
                          name="weight"
                          placeholder="Enter weight"
                          value={props.weight}
                          className={`form-control ${
                            props.errors.weight ? `is-invalid` : ``
                          }`}
                        />
                        <ErrorMessage
                          component="div"
                          name="weight"
                          className="invalid-feedback"
                        />
                      </FormBootstrap.Group>
                      <FormBootstrap.Group controlId="description">
                        <FormBootstrap.Label>Description</FormBootstrap.Label>
                        <Field
                          as="textarea"
                          rows={3}
                          name="description"
                          value={props.description}
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
                      <FormBootstrap.Group controlId="image">
                        <FormBootstrap.File
                          id="image"
                          label="Image (.jpg or .png)"
                          name="image"
                          onChange={this.handleImageChangeCreate}
                        />
                        <img
                          src={this.state.pathFile}
                          alt="file upload item"
                          style={{
                            marginTop: "10px",
                            width: "100px",
                            height: "100px",
                          }}
                        />
                      </FormBootstrap.Group>
                      <Button type="submit" className="btn btn-primary">
                        {onSubmit && <Spinner class="text-center my-0" />}
                        {!onSubmit && <span>Save</span>}
                      </Button>
                    </Form>
                  </Modal.Body>
                )}
              </Formik>
            </Modal>
          </div>
        )}
        {/* End main component create item */}

        {/* Begin main component */}
        <Row className="justify-content-center">
          {listItem.length > 0 &&
            listItem.map((v, i) => (
              <Col md={8} key={i}>
                <div className="card mb-3" style={{ maxWidth: "740px" }}>
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <img
                        // src={`${url}/${v.image.replace("/", "%2F")}?alt=media`}
                        src={`${url}/${
                          process.env.REACT_APP_ENVIROMENT === "production"
                            ? `${v.image.replace("/", "%2F")}?alt=media`
                            : v.image
                        }`}
                        className="card-img"
                        alt="your product"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{v.name}</h5>
                        <div className="card-text">
                          <small className="text-muted">
                            <div>IDR {v.price}</div>
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
                          Edit Image
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
        {/* End main component */}

        {/* Begin main component update item */}
        <Modal
          show={this.state.showEdit}
          onHide={this.handleCloseEdit}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={this.state.formUpdate}
              enableReinitialize
              validationSchema={itemFormSchema}
              onSubmit={(values, actions) => {
                this.setState((prevState) => ({
                  ...prevState,
                  formUpdate: {
                    ...prevState.formUpdate,
                    id_category: values.id_category,
                    name: values.name,
                    price: values.price,
                    quantity: values.quantity,
                    weight: values.weight,
                    description: values.description,
                  },
                }));

                setTimeout(() => {
                  actions.setSubmitting(false);
                  // actions.resetForm();
                  this.handleSubmitUpdateItem();
                }, 900);
              }}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit}>
                  <FormBootstrap.Group controlId="category">
                    <FormBootstrap.Label>Category</FormBootstrap.Label>
                    <Field
                      name="id_category"
                      component="select"
                      placeholder="Select Category"
                      className={`form-control ${
                        props.errors.id_category ? `is-invalid` : ``
                      }`}
                      value={props.values.id_category}
                    >
                      {listCategory.length > 0 &&
                        listCategory.map((v, i) => (
                          <option value={v.id_category} key={i}>
                            {v.name}
                          </option>
                        ))}
                    </Field>

                    <ErrorMessage
                      component="div"
                      name="id_category"
                      className="invalid-feedback"
                    />
                  </FormBootstrap.Group>
                  <FormBootstrap.Group controlId="name">
                    <FormBootstrap.Label>Name</FormBootstrap.Label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter item name"
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
                  <FormBootstrap.Group controlId="price">
                    <FormBootstrap.Label>Price</FormBootstrap.Label>
                    <Field
                      type="number"
                      name="price"
                      placeholder="Enter price"
                      value={props.values.price}
                      className={`form-control ${
                        props.errors.price ? `is-invalid` : ``
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="price"
                      className="invalid-feedback"
                    />
                  </FormBootstrap.Group>
                  <FormBootstrap.Group controlId="quantity">
                    <FormBootstrap.Label>Quantity</FormBootstrap.Label>
                    <Field
                      type="number"
                      name="quantity"
                      placeholder="Enter quantity"
                      value={props.values.quantity}
                      className={`form-control ${
                        props.errors.quantity ? `is-invalid` : ``
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="quantity"
                      className="invalid-feedback"
                    />
                  </FormBootstrap.Group>
                  <FormBootstrap.Group controlId="weight">
                    <FormBootstrap.Label>Weight</FormBootstrap.Label>
                    <Field
                      type="number"
                      name="weight"
                      placeholder="Enter weight"
                      value={props.values.weight}
                      className={`form-control ${
                        props.errors.weight ? `is-invalid` : ``
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="weight"
                      className="invalid-feedback"
                    />
                  </FormBootstrap.Group>
                  <FormBootstrap.Group controlId="description">
                    <FormBootstrap.Label>Description</FormBootstrap.Label>
                    <Field
                      as="textarea"
                      rows={3}
                      name="description"
                      value={props.values.description}
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
                  <Button type="submit" className="btn btn-primary">
                    {onSubmit && <Spinner class="text-center my-0" />}
                    {!onSubmit && <span>Save</span>}
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
        {/* End main component update item */}

        {/* Begin main component update images */}
        <Modal
          show={this.state.showEditLogo}
          onHide={this.handleCloseEditImage}
          animation={false}
        >
          <FormBootstrap onSubmit={this.handleSubmitChangeImage}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Item Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormBootstrap.File
                id="item"
                label="Image (.jpg or .png)"
                name="image"
                onChange={this.handleChangeImageUpdate}
              />
              <img
                src={this.state.pathFile}
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
          </FormBootstrap>
        </Modal>
        {/* End main component update item */}
      </Container>
    );
  }
}

export default Sell;
