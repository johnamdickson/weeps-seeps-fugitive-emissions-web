import React from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const AdminPage = () => {
  const { isAdmin, isSuperuser, loading } = useAuth();

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
        <h2>Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      <Row xs={1} md={2} className="g-4">
        {/* Admin actions */}
        {isAdmin && (
          <>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Add New Emission</Card.Title>
                  <Card.Text>Open a form to log a new emission event.</Card.Text>
                  <Button variant="primary">Add Emission</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Close Emission</Card.Title>
                  <Card.Text>Mark an existing emission as resolved.</Card.Text>
                  <Button variant="danger">Close Emission</Button>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {/* Superuser-only actions */}
        {isSuperuser && (
          <>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Create New User</Card.Title>
                  <Card.Text>Register a new user and assign roles.</Card.Text>
                  <Button variant="success">Create User</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Edit User</Card.Title>
                  <Card.Text>Edit details and roles of existing users.</Card.Text>
                  <Button variant="warning">Edit User</Button>
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
