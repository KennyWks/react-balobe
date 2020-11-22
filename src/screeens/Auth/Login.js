import React, {Component} from 'react';
import {postData} from '../../helpers/CRUD'
import {Cookies} from 'react-cookie'
// import jwtDecode from 'jwt-decode'
import logoKail from '../../assets/img/logo-kail.JPG'
import {Link} from 'react-router-dom'
import {Container, Row, Col, Image, Form, Button, Spinner, Alert} from 'react-bootstrap';

const cookie = new Cookies();

class Login extends Component{

    constructor(props){
        super(props)
        this.state = {
            form :{
                username:'',
                password:''
            },
            onSubmit:false,
            message:'',
            alert:'',
            isLogin:false
        }
    }

    
    handleSubmit = async e => {
        e.preventDefault();
        this.setState(prevState =>({
            ...prevState,
            onSubmit:true,
            alert:''
        }))
        try {
            const response = await postData(`/auth/login`, this.state.form); 
            // console.log(response);
            if(response.status === 200){
                // const token = jwtDecode(response.data.data.accesToken);
                cookie.set('accessToken', response.data.data.accesToken, {
                    path:'/',
                    expires: ''
                })
                this.setState(prevState =>({
                    ...prevState,
                    form:{
                        username:'',
                        password:''
                    },
                    isLogin:true
                }))
            } else{
                this.setState(prevState =>({
                    ...prevState,
                    message:"Login is failed",
                    alert:'danger'
                }))
            }
        } catch (error) {
            console.log(error)
        }
        this.setState(prevState =>({
            ...prevState,
            onSubmit:false,
        }))
    }

    handleInput = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevState => ({
                ...prevState,
                form:{
                    ...prevState.form,
                    [name] : value
                }
            })
        )
    }
    
    render(){
        return (
            <div>
                <Container className="mt-5">
                    <Row>
                        <Col md={4}></Col>
                        <Col md={4}>
                        <div className="text-center">
                            <Link to={`/`}>
                                <Image src={logoKail} alt="Balobe" rounded style={{
                                width:'33%',
                                height:'auto'
                                }} />
                            </Link>
                        </div>
                            
                        <h6 className="text-center mt-5 mb-2">Please log in to your account</h6>
                        <h6 className="text-left mt-5 mb-3">Do not have account? <Link to ={'/signup'}>Register here!</Link></h6>
                        
                            {
                                this.state.onSubmit && 
                                <div className="text-center my-5">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            }

                            {
                                this.state.alert === 'danger' &&
                                <div className="d-inline">
                                    <Alert variant={this.state.alert} className="text-center">{this.state.message}</Alert>
                                </div>
                            }

                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" name="username" placeholder="Your Username" value={this.state.form.username} onChange={this.handleInput} />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlInput2">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" placeholder="Your Password" value={this.state.form.password} onChange={this.handleInput} />
                                </Form.Group>
                                <Form.Group as={Row} controlId="formHorizontalCheck">
                                    <Col sm={6}>
                                        <Form.Check label="Remember me" />
                                    </Col>
                                    <Col sm={6} style={{
                                        textAlign:'right'
                                    }}>
                                        <Link to={`/forgotPass`}>Forgot password?</Link>
                                    </Col>
                                </Form.Group>
                                <Button type="submit" className="btn btn-primary">Submit</Button>
                            </Form>
                            
                        </Col>
                        <Col md={4}></Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Login;