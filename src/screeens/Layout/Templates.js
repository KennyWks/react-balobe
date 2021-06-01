import React, { Component } from "react";
import { Cookies } from "react-cookie";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getData } from "../../helpers/CRUD";
import FormSearch from "../../component/FormSearch";
import ActionType from "../../redux/reducer/globalActionType";
import NavTop from "../../component/NavTop";
import ColoredLine from "../../component/ColoredLine";
import Dropdown from "../../component/Dropdown";
import ImageLogo from "../../component/Image";
import Basket from "../../assets/img/basket.jpg";
import "../../assets/css/styleNav.css";

const cookie = new Cookies();

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: {
        data: [],
        metadata: {},
      },
      carts: {
        data: [],
        metadata: {},
      },
    };
  }

  componentDidMount() {
    if (this.props.isLogin) {
      const accessToken = cookie.get("accessToken");
      if (accessToken === undefined) {
        this.props.handleLogout();
      } else {
        this.getCarts();
      }
    }
    this.getCategory();
  }

  getCarts = async () => {
    try {
      const responseCarts = await getData(`/carts`);
      // console.log(responseCarts);
      if (responseCarts.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          carts: responseCarts.data,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  getCategory = async () => {
    try {
      const responseCategory = await getData(`/category`);
      // console.log(responseCategory);
      if (responseCategory.status === 200) {
        this.setState((prevState) => ({
          ...prevState,
          category: responseCategory.data,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div className="mb-2">
        <NavTop />
        <Navbar collapseOnSelect expand="lg" className="navbar-all-style">
          <Navbar.Brand>
            <Link to={`/`} style={{ textDecoration: "none" }}>
              <ImageLogo height="auto" width="30px" />
              &nbsp;&nbsp;Balobe
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-2">
              <Dropdown title="Category" dropdown={this.state.category.data} />
              <Dropdown
                title="Product"
                dropdown={[
                  {
                    id_product: 5,
                    name: "Hasil Tangkap",
                  },
                  {
                    id_product: 5,
                    name: "Hasil Budidaya",
                  },
                  {
                    id_product: 5,
                    name: "Lain-lain",
                  },
                ]}
              />
            </Nav>
            <Nav className="w-100">
              <FormSearch path={`/`} />
            </Nav>
            <CheckLogin
              numCarts={this.state.carts.data.length}
              isLogin={this.props.isLogin}
              role_id={this.props.role_id}
              username={this.props.username}
            />
          </Navbar.Collapse>
        </Navbar>
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

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogout: () => dispatch({ type: ActionType.IS_LOGOUT }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

const CheckLogin = (props) => {
  if (props.isLogin) {
    return (
      <Nav className="my-1">
        <Link
          to={props.role_id === 2 ? "/admin" : "/user"}
          className="nav-link"
        >
          {props.username}
        </Link>
        <Link to={`/carts`}>
          <div className="basket-cont">
            <img src={Basket} alt="Basket" width="30" className="mx-1 mt-1" />
            <h6 className="badge badge-danger basket-notify">
              {props.numCarts}
            </h6>
          </div>
        </Link>
      </Nav>
    );
  } else {
    return (
      <Nav>
        <Link className="nav-link" to={`/signup`}>
          Singup
        </Link>
        <Link className="nav-link" to={`/signin`}>
          Signin
        </Link>
      </Nav>
    );
  }
};

export const Footer = () => {
  return (
    <div>
      <ColoredLine color="#F8F9FA" />
      <div
        bg="light"
        variant="light"
        className="my-3"
        style={{ textAlign: "center" }}
      >
        &copy; All right reserved <Link to={`/`}>Balobe</Link> 2020
      </div>
    </div>
  );
};
