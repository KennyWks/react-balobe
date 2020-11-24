import React from "react";
import { Nav, Navbar } from "react-bootstrap";
const NavTop = () => {
  return (
    <div>
      <Navbar bg="light">
        <Nav.Item>
          <Nav.Link className="text-bold pl-0" href="#apps">
            Download apps
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="text-bold" href="#help">
            Help
          </Nav.Link>
        </Nav.Item>
      </Navbar>
    </div>
  );
};

export default NavTop;
