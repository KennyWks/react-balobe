import React, {Component} from 'react';
// import {getData, postData} from '../../helpers/CRUD';
// import {Link, Redirect} from 'react-router-dom'
import {Container, Row, Col, Nav, NavDropdown, Navbar} from 'react-bootstrap'
import jwtDecode from 'jwt-decode'
import {Cookies} from 'react-cookie'

const cookie = new Cookies();

class Admin  extends Component{

      constructor(props){
        super(props)
        this.state = {
            isLogin :false,
        }
    }

    updateLogin = status => {
      this.setState({
        isLogin:true
      })
    }
  
    handleLogout = () =>{
      this.updateLogin(false);
      cookie.remove('accessToken')
    }

    componentDidMount(props){
        const accessToken = cookie.get('accessToken');

        if(accessToken === undefined){
        
          this.props.history.push('/loginWarn')
        
        } else {
        
          const token = jwtDecode(accessToken);
        
            if(token.role_id !== 2){
                this.props.history.push('/loginWarn')
            } else {
              this.updateLogin(true);
            }
        }
      }

    render (){
        return (

          <div>
            <Row>
              <Col >
                  <div>
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                      <Nav className="mr-auto">
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                        <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                      </Nav>
                      <Nav>
                        <Nav.Link href="#deets">More deets</Nav.Link>
                        <Nav.Link eventKey={2} href="#memes">
                          Dank memes
                        </Nav.Link>
                      </Nav>
                    </Navbar.Collapse>
                  </Navbar>
                </div>
              </Col>
            </Row>
          </div>

        )
      }  
}

export default Admin