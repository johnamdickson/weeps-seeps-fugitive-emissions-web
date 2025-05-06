import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminPage = () => {
  const { isAdmin, isSuperuser, loading } = useAuth();
  const [showRedirectAlert, setShowRedirectAlert] = useState(false); // State for redirect alert
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is not admin or superuser and data is loaded
    if (!loading && !isAdmin && !isSuperuser) {
      setShowRedirectAlert(true); // Show redirect alert if no permissions
      setTimeout(() => {
        navigate("/"); // Redirect to home page after 6 seconds
      }, 6000);
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

  console.log('isAdmin:', isAdmin);  // Debugging
  console.log('isSuperuser:', isSuperuser);  // Debugging
  console.log('loading:', loading);  // Debugging

  if (!isAdmin && !isSuperuser) {
    return (
      <Container className="text-center mt-5">
        {showRedirectAlert && (
          <Alert variant="warning" dismissible>
            <Alert.Heading>Permission Denied</Alert.Heading>
            <p>You do not have the necessary permissions.</p>
            <p> Redirecting    <Spinner animation="grow" size="sm" />
            </p>
          </Alert>
        )}
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      <Row xs={1} md={2} className="g-4 p-3 justify-content-md-center">
        {/* Admin actions */}
        {isAdmin && (
          <>
            <Col sm={12} md={6} lg={5} className="g-2 m-3">
              <Card >
                <Card.Body>
                  <Card.Title>Add New Emission</Card.Title>
                  <Card.Text>Open a form to log a new emission event.</Card.Text>
                  <Button variant="primary" className="btn-admin">Add Emission <span class="material-icons m-2">add_circle</span></Button>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={6} lg={5} className="g-2 m-3">
              <Card>
                <Card.Body>
                  <Card.Title>Close Emission</Card.Title>
                  <Card.Text>Mark an existing emission as resolved.</Card.Text>
                  <Button variant="danger" className="btn-admin">Close Emission <span class="material-icons m-2">cancel</span></Button>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {/* Superuser-only actions */}
        {isSuperuser && (
          <>
            <Col sm={12} md={6} lg={5} className="g-2 m-3">
              <Card>
                <Card.Body>
                  <Card.Title>Create New User </Card.Title>
                  <Card.Text>Register a new user and assign roles.</Card.Text>
                  <Button variant="success" className="btn-admin">Create User </Button>
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
