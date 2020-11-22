import React, {Component} from 'react';
import {getData} from '../../helpers/CRUD';
import {Container, Row, Col, Card, Media, Spinner} from 'react-bootstrap'
import {BsStarFill} from 'react-icons/bs';
import user from '../../assets/img/user.JPG'

class Review extends Component {

    constructor(props){
        super(props)
        this.state = {
            dataTransaction:{
                data:[]
            },
            load:false,
            message:'',
            alert:''
        }
    }

    getTransaction = async () => {
        this.setState(prevState => ({
            ...prevState,
            load:true
        }))
        try {
           const response = await getData(`/carts`); 
            this.setState(prevState => ({
                ...prevState,
                dataTransaction:response.data
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
        this.getTransaction();
    }

    star = (rating) => {
        let star = [];
        for (let i = 0; i < rating; i++) { 
            star.push(<BsStarFill/>); 
        }
        return star
    }
    
    render() {
        const {dataTransaction} = this.state;
        return (
            <div>
                <Container>
                    <Row>
                        <Col md={6}>
                            {
                            this.state.load && 
                                    <div className="text-center my-2">
                                        <Spinner animation="border" variant="primary" />
                                    </div>
                            }
                            <Card.Body>
                               {dataTransaction.data.length > 0 && dataTransaction.data.map((v) => (
                                <ul className="list-unstyled">
                                    <Media as="li">
                                        <img
                                        width={64}
                                        height={64}
                                        className="mr-3 rounded-circle"
                                        src={user}
                                        alt="Generic placeholder"
                                        />
                                        <Media.Body>
                                        <h5 style={{color:"yellow"}}>{this.star(v.rating)}</h5>
                                        <p>{v.review}</p>
                                        </Media.Body>
                                    </Media>
                                </ul>
                            ))}
                            </Card.Body>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Review
  