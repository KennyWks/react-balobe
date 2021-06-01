import React, { Component } from "react";
import { NavDropdown } from "react-bootstrap";

class Dropdown extends Component {
  render() {
    const { title, dropdown } = this.props;
    return (
      <div>
        <NavDropdown title={title} id="nav-dropdown">
          {dropdown.length > 0 &&
            dropdown.map((v, i) => (
              <NavDropdown.Item eventKey="4.1" key={i}>
                {v.name}
              </NavDropdown.Item>
            ))}
        </NavDropdown>
      </div>
    );
  }
}

export default Dropdown;
