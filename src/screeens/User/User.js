import React, {Component} from 'react';
import {Container, Row, Col, Card, Image, Tabs} from 'react-bootstrap'
import jwtDecode from 'jwt-decode'
import {Cookies} from 'react-cookie'
import ColoredLine from '../../component/ColoredLine'
import Buyer from '../../component/Buyer'
import Seler from '../../component/Seler'
import logoKail from '../../assets/img/logo-kail.JPG'

const cookie = new Cookies();

class User  extends Component{

    constructor(props){
        super(props)
        this.state = {
            isLogin :false,
            user : {
              username: ''
            }
        }
    }

    updateLogin = (status,token) => {
      this.setState({
        isLogin:true,
        user : {
          username : token.username
        }
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
        
            if(token.role_id === 3 || token.role_id === 4){
              this.updateLogin(true,token);
            } else {
              this.props.history.push('/loginWarn')
            }
        }
      }

    render (){
        return (
          <div>
            <Container>
                <ColoredLine margin="40px" color="#F8F9FA" />
                <Card className="mb-2">
                  <Card.Body>
                  <Row>
                    <Col className="text-center">
                      <Image style={{
                        width:"90px",
                        height:"70px"
                    }} src={logoKail} roundedCircle />
                    </Col>
                  </Row>
                      <h4 className="text-center mt-4">Hallo {this.state.user.username}!</h4>
                  </Card.Body>
                </Card>
                <Row>
                    <Col>
                     <Tabs justify defaultActiveKey="Buyer" transition={false} id="noanim-tab-example">
                
                        <Tabs eventKey="Buyer" title="Buyer">
                          <Buyer />
                        </Tabs >

                        <Tabs  eventKey="Seler" title="Seler">
                          <Seler />
                        </Tabs >
                         
                      </Tabs>
                    </Col>
                </Row>
            </Container>
          </div>
        )
    } 
}



export default User