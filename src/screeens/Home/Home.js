import React, {Component} from 'react';
import {getData} from '../../helpers/CRUD';
import {Link} from 'react-router-dom'
import {Container, Row, Col, Card, CardDeck, Spinner} from 'react-bootstrap'
import {BsStarFill} from 'react-icons/bs';
import bodyProduct from "../../assets/css/styleCustom.module.css";

class Home extends Component{

    constructor(props){
        super(props)
        this.state = {
            listProduct:{
                data:[],
                metadata : {},
                q:{},
                load:true,
            }
        }
    }
  
    getProduct = async () => {
        this.setState(prevState => ({
            ...prevState,
            load:true
        }))
        try {
           const response = await getData(`/item${!this.props.location.search ? '' : this.props.location.search}`); 
            // console.log(response);
            this.setState(prevState => ({
                ...prevState,
                listProduct:response.data
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
        this.getProduct();
    }

    star = (rating) => {
        let star = [];
        for (let i = 0; i < rating; i++) { 
            star.push(<BsStarFill/>); 
        }
        return star
    }

    render(){
        const {listProduct, load} = this.state;
        return(
            <div>
                 {
                    load && (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                   )
                }
                <Container>
                    <Row>
                        {listProduct.data.length > 0 && listProduct.data.map((v, i) =>(
                            
                        <Col sm={3}>
                            <CardDeck>
                                <Card style={{
                                        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                    }} className="my-3">
                                    <Link to={`item/${v.id_item}`} style={{
                                        textDecoration: "none"
                                    }}>
                                        <Card.Img variant="top" src={`https://firebasestorage.googleapis.com/v0/b/balobe-d2a28.appspot.com/o/${v.image.replace("/", "%2F")}?alt=media`} />
                                        <Card.Body className={bodyProduct.productBody}>
                                            <Card.Title>{v.name}</Card.Title> 
                                            <Row>
                                                <Col md={6}>
                                                    <small className="text-bold">Rp {v.price}</small>
                                                </Col>
                                                <Col className="text-right" md={6}>
                                                    <small className="text-bold">{v.rating === null ? "Not Rating" : <div style={{color:"yellow"}}>{this.star(v.rating)}</div>}</small>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Link>
                                </Card>
                            </CardDeck>
                        </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Home