import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import { Cookies } from "react-cookie";
import { AiOutlineShoppingCart, AiOutlineSearch } from "react-icons/ai";
import jwtDecode from "jwt-decode";
import NavTop from "../../component/NavTop";
import NavDropdownMenu from "../../component/Dropdown";
import "../../assets/css/styleNav.css";

const cookie = new Cookies();

const CheckLogin = () => {
  const accessToken = cookie.get("accessToken");
  if (accessToken) {
    const token = jwtDecode(accessToken);
    let url;
    if (token.role_id === 2) {
      url = "/admin";
    } else {
      url = "/user";
    }
    return (
      <div>
        <Nav>
          <Link to={url} className="nav-link">
            Hai {token.username}
          </Link>
          <Link to={`/user`}>
            <AiOutlineShoppingCart />
            <sup>2</sup>
          </Link>
        </Nav>
      </div>
    );
  } else {
    return (
      <div>
        <Nav>
          <Link className="nav-link" to={`/signup`}>
            Singup
          </Link>
          <Link className="nav-link" to={`/signin`}>
            Signin
          </Link>
        </Nav>
      </div>
    );
  }
};

const Header = () => {
  let path = useLocation().pathname;
  if (
    path === "/signin" ||
    path === "/loginWarn" ||
    path === "/signup" ||
    path === "/forgotPass" ||
    path === "/admin"
  )
    return null;

  return (
    <div className="mb-2">
      <NavTop />
      <Navbar
        collapseOnSelect
        expand="lg"
        style={{
          backgroundColor: "#FFF",
          border: "1px",
          borderStyle: "solid",
          borderColor: "#CACDD7",
        }}
      >
        <Navbar.Brand href={"/"}>Balobe</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdownMenu className="mx-2" title="Category" />
            <NavDropdownMenu className="mx-2" title="Product" />
            <form method="get" className="mx-2 inline" action={`/`}>
              <div className="input-group mb-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  name="q"
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <button
                    type="submit"
                    className="btn btn-outline-primary"
                    type="submit"
                  >
                    <AiOutlineSearch />
                  </button>
                </div>
              </div>
            </form>
          </Nav>
          <CheckLogin />
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
