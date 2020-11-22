import React from 'react';
import {Link, useLocation} from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import {Nav, Form, FormControl, Button, Navbar} from 'react-bootstrap'
import {Cookies} from 'react-cookie';
import {AiOutlineShoppingCart} from 'react-icons/ai';

const cookie = new Cookies();

const CheckLogin = () => {
    const accessToken = cookie.get('accessToken');
    if(accessToken){
       const token = jwtDecode(accessToken);
       let url;
       if(token.role_id === 2) {
           url = '/admin'
        } else {
            url = '/user'
       }
       return (
            <div>
                <Navbar>
                    <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                Hallo! <Link to={url} style={{textDecoration: "none"}}>{token.username}</Link>
                            </Navbar.Text>
                            <Navbar.Text className="mx-2">
                              <Link to={`/user`} style={{textDecoration: "none"}}>
                                  <AiOutlineShoppingCart/><sup>2</sup>
                              </Link>
                            </Navbar.Text>
                        </Navbar.Collapse>
                </Navbar>
             </div>
        )
    } else {
        return (
            <div>
              <Nav className="navbar-nav">
                <Link className="nav-link" to={`/signup`}>Sign Up</Link>
                <Link className="nav-link" to={`/login`}>Sign In</Link>
               </Nav>
            </div>
        )         
    }
}

const Header = () => {
    let path = useLocation().pathname;
    if (path === '/login' || path === '/loginWarn' || path === '/signup' || path === '/forgotPass' || path === '/admin') return null;

    return (
        <div>                           
        <Nav bg="light" variant="light" fixed="top">
            <Nav.Item>
                <Nav.Link className="text-muted" href="#apps">Download apps</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link className="text-muted" href="#help">Help</Nav.Link>
            </Nav.Item>
        </Nav>

        <Navbar bg="light" variant="light" fixed="top">
            <Nav className="mr-auto">
            <Navbar.Brand href="#home" className="text-primary">Balobe</Navbar.Brand>
                <Nav.Link href={`/`} >Home</Nav.Link>
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#pricing">Pricing</Nav.Link>
                <Form method="get" action={`/`} inline>
                    <FormControl type="text" placeholder="Search" name="q" className="mr-sm-2" />
                    <Button type="submit" variant="outline-primary">Search</Button>
                </Form>
            </Nav>
            <CheckLogin/>
        </Navbar>
        <br />
        <br />
    </div>
    );
};
  
export default Header