import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert
} from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminPage = () => {
  const { isAdmin, isSuperuser, loading } = useAuth();
  const [showRedirectAlert, setShowRedirectAlert] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin && !isSuperuser) {
      setShowRedirectAlert(true);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const next = prev + (100 / 60); // 60 steps for 6s
          return next >= 100 ? 100 : next;
        });
      }, 100);

      const redirectTimeout = setTimeout(() => {
        clearInterval(progressInterval);
        navigate("/");
      }, 6000);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(redirectTimeout);
      };
    }
  }, [isAdmin, isSuperuser, loading, navigate]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Loading access rights...</p>
      </div>
    );
  }

  if (!isAdmin && !isSuperuser) {
    return (
      <Container className="text-center mt-5">
        {showRedirectAlert && (
          <Alert variant="warning" dismissible className="w-50 mx-auto">
            <Alert.Heading>Permission Denied</Alert.Heading>
            <p>You do not have the necessary permissions to access this part of the site.</p>
            <div
              className="progress mt-3 w-50 mx-auto"
              style={{
                height: '10px',
                backgroundColor: '#f8d7da',
                borderRadius: '5px',
                overflow: 'hidden'
              }}
            >
              <div
                className="progress-bar bg-warning"
                role="progressbar"
                style={{
                  width: `${progress}%`,
                  transition: 'width 80ms linear'
                }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="mt-2" style={{ fontSize: '0.9rem' }}>
              Redirecting to home...
            </p>
            <Spinner animation="grow"/>
          </Alert>
        )}
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      <Row xs={1} md={2} className="g-4 p-3 justify-content-md-center">
        {isAdmin && (
          <>
            <Col sm={12} md={6} lg={5} className="g-2 m-3">
              <Card>
                <Card.Body>
                  <Card.Title>Add New Emission</Card.Title>
                  <Card.Text>Open a form to log a new emission event.</Card.Text>
                  <Button variant="primary" className="btn-admin">
                    Add Emission <span className="material-icons m-2">add_circle</span>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={6} lg={5} className="g-2 m-3">
              <Card>
                <Card.Body>
                  <Card.Title>Close Emission</Card.Title>
                  <Card.Text>Mark an existing emission as resolved.</Card.Text>
                  <Button variant="danger" className="btn-admin">
                    Close Emission <span className="material-icons m-2">cancel</span>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {isSuperuser && (
          <>
            <Col sm={12} md={6} lg={5} className="g-2 m-3">
              <Card>
                <Card.Body>
                  <Card.Title>Create New User</Card.Title>
                  <Card.Text>Register a new user and assign roles.</Card.Text>
                  <Button variant="success" className="btn-admin">Create User</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={6} lg={5} className="g-2 m-3">
              <Card>
                <Card.Body>
                  <Card.Title>Edit User</Card.Title>
                  <Card.Text>Edit details and roles of existing users.</Card.Text>
                  <Button variant="warning" className="btn-admin">Edit User</Button>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
};

export default AdminPage;
