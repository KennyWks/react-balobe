import React, {Component} from 'react';
import logoKail from '../../assets/img/logo-kail.JPG'
import {Link} from 'react-router-dom'
import {Container, Row, Col, Image} from 'react-bootstrap';

class LoginWarn extends Component{
    render(){
        return (
            <div>
                <Container className="mt-4">
                    <Row>
                        <Col md={2}></Col>
                        <Col md={8}>
                        <div className="text-center">
                            <Link to={`/`}>
                                <Image src={logoKail} alt="Balobe" rounded style={{
                                    width:'20%',
                                height:'auto'
                                }} />
                            </Link>
                        </div>  
                        <h5 className="text-center my-4">Please <Link to={'/login'}>login</Link> or <Link to={'/signup'}>register</Link> some account before access this page</h5>
                        </Col>
                        <Col md={2}></Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default LoginWarn;