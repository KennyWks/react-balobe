import React, {Component} from 'react';
import {getData} from '../../helpers/CRUD';
import {Link} from 'react-router-dom'
import styleCustom from "../../assets/css/styleCustom.module.css";
import {Modal, Button } from 'react-bootstrap';

class Category extends Component{

    constructor(props){
        super(props)
        this.state = {
            detailCategory :{},
            memuat:true
        }
    }
  
    getCategory = async () => {
        this.setState(prevState => ({
            ...prevState,
            memuat:true
        }))
        try {
            const response = await getData(`/category/${this.props.match.params.id}`);  
            if(response){
                this.setState(prevState => ({
                    ...prevState,
                    detailCategory:response.data.data
                }))
            }
        } catch (error) {
            console.log(error)
        }
        this.setState(prevState => ({
            ...prevState,
            memuat:false
        }))
    }

    componentDidMount(){
        this.getCategory();
    }

    render(){
        const {detailCategory, memuat} = this.state
        return(
            <div>
                <Link className="btn btn-primary" to='/'>Back</Link>
                {
                    memuat && (
                        <div className="memuat">
                            <h4 style={{
                                color:'red',
                                textAlign:"center"
                            }}>Loading</h4>
                        </div>
                    )
                }

                {
                    !memuat && (
                        <div className={styleCustom.data}>
                            {
                                Object.keys(detailCategory).length > 0 && (
                                <h3>{detailCategory.hs_code} {detailCategory.name}</h3>
                                )
                            }

                            {!(Object.keys(detailCategory).length > 0) && (<p>Data tidak ditemukan</p>)}
                        </div>
                    )
                }   

            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Modal body text goes here.</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary">Close</Button>
                    <Button variant="primary">Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>    
            </div>
        )
    }
}

export default Category