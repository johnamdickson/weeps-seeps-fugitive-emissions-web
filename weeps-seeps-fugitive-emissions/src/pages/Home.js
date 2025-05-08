import React, { useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './Home.css'; // Update your CSS file name accordingly
import LoginModal from '../components/LoginModal';

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="home-page">
        <Container fluid className="text-white d-inline-flex mt-5 p-4 justify-content-end">
          <Row className="justify-content-end">    
            <Col className="me-lg-5 pt-5 pe-4" lg="9" md="12">
            <Container fluid>
            <Row className="justify-content-end me-lg-5">    
            <Col className="content-box me-lg-5 mx-auto" lg="7" sm="10">
             <h1 className="display-5 fw-bold p-3">Welcome to the<br />Emissions Monitoring Tool</h1>
          <p className="lead p-3">
            Your one stop shop to manage all aspects of fugitive emissions monitoring on your facility. 
            Select from one of the options below to continue.
          </p>
          <div className="button-group mt-1">
            <Row className='justify-content-around'>
              <Col lg="5" md="10">
              <Button variant="danger" className="w-100 mt-2">Join Now</Button>
              </Col >
                            <Col lg="5" md="10">
              <Button variant="light" className="w-100 mt-2" onClick={() => setShowLogin(true)}>Log In</Button>
              </Col>
            </Row>
                       
          </div>
          </Col> 
          </Row>
          </Container>
          </Col> 
          </Row>

        </Container>
        <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
      </div>
  );
};

export default HomePage;
