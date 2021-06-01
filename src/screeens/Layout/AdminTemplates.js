import React from "react";
import ActionType from "../../redux/reducer/globalActionType";
import { useDispatch } from "react-redux";
import { Row, Col, Nav, Navbar, Button } from "react-bootstrap";
import { Link, useLocation, useHistory } from "react-router-dom";
import "../../assets/js/script.js";

const Header = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  let path = useLocation().pathname;
  return (
    <Row>
      <Col>
        <div>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="#home">Balobe Admin</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Link
                  to={`/admin/article`}
                  id="article"
                  className={
                    path === "/admin/article" ? "nav-link active" : "nav-link"
                  }
                  data-rb-event-key="#article"
                >
                  Article
                </Link>{" "}
                <Link
                  to={`/admin/category`}
                  id="category"
                  className={
                    path === "/admin/category" ? "nav-link active" : "nav-link"
                  }
                  data-rb-event-key="#category"
                >
                  Category
                </Link>{" "}
                <Link
                  to={`/admin/role`}
                  id="role"
                  className={
                    path === "/admin/role" ? "nav-link active" : "nav-link"
                  }
                  data-rb-event-key="#role"
                >
                  Role
                </Link>{" "}
                <Link
                  to={`/admin/customers`}
                  id="customers"
                  className={
                    path === "/admin/customers" ? "nav-link active" : "nav-link"
                  }
                  data-rb-event-key="#customers"
                >
                  Customers
                </Link>{" "}
                <Link
                  to={`/admin/pelapak`}
                  id="pelapak"
                  className={
                    path === "/admin/pelapak" ? "nav-link active" : "nav-link"
                  }
                  data-rb-event-key="#pelapak"
                >
                  Pelapak
                </Link>{" "}
                <Link
                  to={`/admin/`}
                  id="home"
                  className={path === "/admin" ? "nav-link active" : "nav-link"}
                  data-rb-event-key="#profil"
                >
                  Profil
                </Link>{" "}
                {/* <NavDropdown title="Profil" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">
                      Edit Account
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      Edit Image
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                      Show Profil
                    </NavDropdown.Item>
                  </NavDropdown> */}
              </Nav>
              <Nav>
                <Nav.Link href="#">
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure to logout from this session?"
                        )
                      ) {
                        dispatch({ type: ActionType.IS_LOGOUT });
                        history.push("/signin");
                      }
                    }}
                  >
                    Logout
                  </Button>
                </Nav.Link>
                {/* <Nav.Link eventKey={2} href="#">
                      Logout
                    </Nav.Link> */}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </Col>
    </Row>
  );
};

export default Header;
