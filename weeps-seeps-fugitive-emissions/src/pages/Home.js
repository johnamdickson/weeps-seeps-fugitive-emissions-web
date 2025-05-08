import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './Home.css'; // Update your CSS file name accordingly

const HomePage = () => {
  return (
    <div className="home-page">
        <Container fluid className="text-white d-inline-flex mt-5 me-lg-5 p-4 justify-content-end">
          <Row className="justify-content-end">    
            <Col className="me-lg-5" lg="9" sm="12">
            <Container fluid>
            <Row className="justify-content-end me-lg-5">    
            <Col className="content-box me-lg-5 mx-auto" lg="6" sm="10">
             <h1 className="display-5 fw-bold">Welcome to the<br />Emissions Monitoring Tool</h1>
          <p className="lead">
            Your one stop shop to manage all aspects of fugitive emissions monitoring on your facility. 
            Select from one of the options below to continue.
          </p>
          <div className="button-group mt-4">
            <Button variant="danger" className="me-3">Join Now</Button>
            <Button variant="light">Log In</Button>
          </div>
          </Col> 
          </Row>
          </Container>
          </Col> 
          </Row>

        </Container>
      </div>
  );
};

export default HomePage;
