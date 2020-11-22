import React, {Component} from 'react';
import {getData, patchData} from '../../helpers/CRUD';
import {Container, Row, Col, Card, Button, Form, Spinner} from 'react-bootstrap'

class Profil extends Component {

    constructor(props){
        super(props)
        this.state = {
            form:{
                fullname:'',
                gender:'',
                address:'',
                email:'',
                phone:''
            },
            dataUser:{},
            load:false,
            message:'',
            alert:''
        }
    }

    getUser = async () => {
        this.setState(prevState => ({
            ...prevState,
            load:true
        }))
        try {
           const response = await getData(`/profile/user/${this.props.match.params.id}`); 
            this.setState(prevState => ({
                ...prevState,
                form:{
                    fullname: response.data.data.fullname,
                    gender:response.data.data.gender,
                    address:response.data.data.address,
                    email:response.data.data.email,
                    phone:response.data.data.phone
                }
            }))
        } catch (error) {
            console.log(error)
        }
        this.setState(prevState => ({
            ...prevState,
            load:false
        }))
    }
    
    componentDidMount(){
        this.getUser();
    }

    handleSubmit = async e => {
        e.preventDefault();
        this.setState(prevState =>({
            ...prevState,
            load:true
        }))
        try {
            const response = await patchData(`/profile/updateProfileBuyer`, this.state.form); 
            console.log(response);
            if(response.status === 200){
                this.setState(prevState =>({
                    ...prevState,
                    form:{
                        fullname:'',
                        gender:'',
                        address:'',
                        email:'',
                        phone:''
                    },
                    message:"Data is update",
                    alert:'danger'
                }))
            }
            this.getUser();
        } catch (error) {
            console.log(error)
        }
        this.setState(prevState =>({
            ...prevState,
            load:false,
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
    
    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col md={6}>
                            <Card.Body>
                            {
                                this.state.load && 
                                <div className="text-center my-2">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            }
                                <Form onSubmit={this.handleSubmit}>
                                <Form.Group controlId="name">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control type="text" name="fullname" placeholder="Enter Full Name" value={this.state.form.fullname} onChange={this.handleInput} />
                                </Form.Group>
                                <Form.Group controlId="gender">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Control as="select" name="gender" value={this.state.form.gender} onChange={this.handleInput}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="email">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control type="number" name="phone" placeholder="Enter your phone number" value={this.state.form.phone} onChange={this.handleInput} />
                                </Form.Group>
                                <Form.Group controlId="email">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" name="email" placeholder="Enter your email" value={this.state.form.email} onChange={this.handleInput} />
                                </Form.Group>
                                <Form.Group controlId="address">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control as="textarea" name="address" rows={3} value={this.state.form.address} onChange={this.handleInput} />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Edit
                                </Button>
                                </Form>
                            </Card.Body>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }

}

export default Profil
  