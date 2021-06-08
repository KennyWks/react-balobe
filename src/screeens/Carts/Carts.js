import React, { Component } from "react";
import { Container, Row, Col, Media, Button, Form } from "react-bootstrap";
import { getData, postData, patchData, deleteData } from "../../helpers/CRUD";
import Spinner from "../../component/Spinner";
import Alert from "../../component/Alert";

class Carts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCarts: {
        data: [],
        meta: {},
      },
      order: {
        total_item: 0,
        total_price: 0,
      },
      cartsOrder: {
        id_pelapak: 0,
        list_item: 0,
        total_item: 0,
        courier: 0,
        total_price: 0,
      },
      cartsChecked: null,
      arrayId: null,
      checked: false,
      onLoad: false,
      message: "",
      alert: "",
    };
  }

  componentDidMount() {
    document.title = `Carts - Balobe`;
    this.getCarts();
  }

  getCarts = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const responseCarts = await getData(`/carts`);
      if (responseCarts.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          listCarts: responseCarts.data.data,
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
      onLoad: false,
    }));
  };

  reduceOrder = async (e) => {
    const dataTotalItem = e.target.dataset["total_item"];
    const dataPrice = e.target.dataset["price"];

    const total_item = parseInt(dataTotalItem) - 1;

    if (total_item > 0) {
      this.setState((prevState) => ({
        ...prevState,
        order: {
          ...prevState.order,
          total_item: total_item,
          total_price: total_item * parseInt(dataPrice),
        },
      }));
      const idCart = parseInt(e.target.dataset["id_carts"]);
      await this.updateCarts(idCart);
    } else {
      alert("Your order can't be zero");
    }
  };

  addOrder = async (e) => {
    const dataTotalItem = e.target.dataset["total_item"];
    const dataPrice = e.target.dataset["price"];

    const dataQuantity = e.target.dataset["quantity"];

    const total_item = parseInt(dataTotalItem) + 1;

    if (total_item < parseInt(dataQuantity)) {
      this.setState((prevState) => ({
        ...prevState,
        order: {
          ...prevState.order,
          total_item: total_item,
          total_price: total_item * parseInt(dataPrice),
        },
      }));
      const idCart = parseInt(e.target.dataset["id_carts"]);
      await this.updateCarts(idCart);
    } else {
      alert("Your order can't greater quantity");
    }
  };

  updateCarts = async (id_carts) => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await patchData(
        `/carts/update/${id_carts}`,
        this.state.order
      );
      console.log(response);
      this.setState((prevState) => ({
        ...prevState,
        message: response.data.data.msg,
        alert: "success",
      }));
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
    this.getCarts();
  };

  onToggle = async () => {
    const checkedArr = [];
    const arrayId = [];
    const checkeds = document.querySelectorAll(".form-check-input");
    for (let i = 0; i < checkeds.length; i++) {
      if (checkeds[i].checked) {
        checkedArr.push(JSON.parse(JSON.stringify(checkeds[i].dataset)));
        arrayId.push(checkeds[i].id);
      }
    }
    await this.setStateCartsChecked(checkedArr, arrayId);
  };

  setCartsCheckedAll = async () => {
    const checkAll = document.querySelector(".checkAll");
    const checkeds = document.querySelectorAll(".form-check-input");

    const checkedArr = [];
    const arrayId = [];

    if (checkAll.checked) {
      for (let i = 0; i < checkeds.length; i++) {
        checkeds[i].checked = true;
        checkedArr.push(JSON.parse(JSON.stringify(checkeds[i].dataset)));
        arrayId.push(checkeds[i].id);
      }
    } else {
      for (let i = 0; i < checkeds.length; i++) {
        checkeds[i].checked = false;
      }
    }
    await this.setStateCartsChecked(checkedArr, arrayId);
  };

  setStateCartsChecked = (checkedArr, arrayId) => {
    this.setState({ cartsChecked: checkedArr });
    this.setState({ arrayId: arrayId });
  };

  handleSubmitCartsChecked = async () => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const responseTransaction = await postData(
        `/transaction`,
        this.state.cartsChecked
      );
      const responseCheckout = await patchData(
        `/carts/checkout/checked`,
        this.state.arrayId
      );
      await this.setStateCartsChecked(null, null);
      this.setState((prevState) => ({
        ...prevState,
        message: responseCheckout.data.data.msg,
        alert: "success",
      }));
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
      onLoad: true,
    }));
    this.getCarts();
  };

  checkOutCarts = async (e) => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));

    const id_pelapak = e.target.dataset["id_pelapak"];
    const list_item = e.target.dataset["list_item"];
    const total_item = e.target.dataset["total_item"];
    const courier = e.target.dataset["courier"];
    const total_price = e.target.dataset["total_price"];
    const id_carts = e.target.dataset["id_carts"];

    await this.setCheckOutCarts(
      id_pelapak,
      list_item,
      total_item,
      courier,
      total_price
    );

    try {
      const response = await postData(
        `/carts/checkout/${id_carts}`,
        this.state.cartsOrder
      );
      if (response.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          cartsOrder: {
            ...prevState.cartsOrder,
            list_item: 0,
            total_item: 0,
            total_price: 0,
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
    this.getCarts();
  };

  setCheckOutCarts = (
    id_pelapak,
    list_item,
    total_item,
    courier,
    total_price
  ) => {
    this.setState((prevState) => ({
      ...prevState,
      cartsOrder: {
        ...prevState.cartsOrder,
        id_pelapak: id_pelapak,
        list_item: list_item,
        total_item: total_item,
        courier: courier,
        total_price: total_price,
      },
    }));
  };

  removeCart = async (id_carts) => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response = await deleteData(`/carts/${id_carts}`);
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
      onLoad: true,
    }));
    this.getCarts();
  };

  render() {
    const { listCarts, onLoad } = this.state;
    const url =
      process.env.REACT_APP_ENVIROMENT === "production"
        ? process.env.REACT_APP_URL_IMAGES_PRODUCTION
        : process.env.REACT_APP_URL_IMAGES_DEVELOPMENT;
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h3>Your carts list</h3>
        </div>

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

        {!listCarts.length > 0 && !onLoad && (
          <div className="text-center">Your Carts Empty</div>
        )}

        {!onLoad && listCarts.length > 0 && (
          <div>
            <div className="p-2">
              <input
                className="checkAll"
                type="checkbox"
                onChange={this.setCartsCheckedAll}
                style={{ transform: "scale(1.5)" }}
              />
              &nbsp;
              <label>Check All</label>
            </div>

            {listCarts.length > 0 &&
              listCarts.map((v, i) => (
                <Row className="justify-content-center mx-1" key={i}>
                  <Col
                    key={i}
                    style={{
                      padding: 0,
                    }}
                  >
                    <div
                      className="h4 p-3 mb-1 mt-2"
                      style={{ backgroundColor: "#F7F7F7" }}
                    >
                      {v.name_pelapak}
                    </div>
                    <ul
                      className="list-unstyled mb-0"
                      style={{ position: "relative" }}
                    >
                      <Media as="li">
                        <Media.Body>
                          <Row className="mt-1 p-2">
                            <Col>
                              <div className="my-2">{v.name_item}</div>
                              <div>
                                <div className="h5 mb-4">
                                  IDR {v.price} &nbsp; Stock {v.quantity}
                                </div>
                              </div>

                              <Button
                                data-id_carts={v.id}
                                data-total_item={v.total_item}
                                data-price={v.price}
                                variant="primary"
                                onClick={this.reduceOrder}
                              >
                                -
                              </Button>
                              <span className="mx-2">{v.total_item}</span>
                              <Button
                                data-id_carts={v.id}
                                data-total_item={v.total_item}
                                data-price={v.price}
                                data-quantity={v.quantity}
                                variant="primary"
                                onClick={this.addOrder}
                              >
                                +
                              </Button>
                            </Col>
                            <Col>
                              <div className="text-right">
                                <img
                                  width="auto"
                                  height="100px"
                                  className="mr-2 rounded"
                                  // src={`${url}/${v.image.replace(
                                  //   "/",
                                  //   "%2F"
                                  // )}?alt=media`}
                                  src={`${url}/${
                                    process.env.REACT_APP_ENVIROMENT ===
                                    "production"
                                      ? `${v.image.replace(
                                          "/",
                                          "%2F"
                                        )}?alt=media`
                                      : v.image
                                  }`}
                                  alt={v.name_item}
                                />
                              </div>
                            </Col>
                          </Row>
                          <div
                            style={{
                              overflow: "auto",
                              backgroundColor: "#F7F7F7",
                            }}
                          >
                            <div
                              style={{
                                float: "left",
                              }}
                            >
                              {["checkbox"].map((type) => (
                                <div
                                  key={`default-${type}`}
                                  className="mb-0 px-4 py-4"
                                  style={{ transform: "scale(1.5)" }}
                                >
                                  <Form.Check
                                    type={type}
                                    id={v.id}
                                    data-id_pelapak={v.id_pelapak}
                                    data-list_item={v.id_item}
                                    data-total_item={v.total_item}
                                    data-courier={v.courier}
                                    data-total_price={v.total_price}
                                    onChange={this.onToggle}
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="p-3 mb-0" style={{ float: "left" }}>
                              <h5>
                                Subtotal{" "}
                                <b>
                                  IDR{" "}
                                  {parseInt(v.total_price) +
                                    parseInt(v.courier)}{" "}
                                </b>
                                (Total price & Courier)
                              </h5>
                              <div>
                                <b>IDR {v.total_price}</b> |{" "}
                                <small>Cost of price</small>
                              </div>
                              <div>
                                <b>IDR {v.courier}</b> |{" "}
                                <small>Cost of courier</small>
                              </div>
                            </div>
                          </div>

                          <Button
                            style={{
                              position: "absolute",
                              right: "40px",
                              top: "160px",
                            }}
                            variant="success"
                            onClick={this.checkOutCarts}
                            data-id_carts={v.id}
                            data-id_pelapak={v.id_pelapak}
                            data-list_item={v.id_item}
                            data-total_item={v.total_item}
                            data-total_price={v.total_price}
                            data-courier={v.courier}
                          >
                            Pay
                          </Button>
                          <Button
                            style={{
                              position: "absolute",
                              right: "110px",
                              top: "160px",
                            }}
                            variant="danger"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure to remove this data?"
                                )
                              ) {
                                this.removeCart(v.id);
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        </Media.Body>
                      </Media>
                    </ul>
                  </Col>
                </Row>
              ))}
            <Row className="m-2">
              <Col>
                <Button
                  variant="success"
                  onClick={this.handleSubmitCartsChecked}
                >
                  Pay Checked
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    );
  }
}

export default Carts;
