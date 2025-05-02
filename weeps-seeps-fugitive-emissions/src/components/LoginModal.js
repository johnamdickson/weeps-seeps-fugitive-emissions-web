import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase'; // Make sure this is the correct import for your Firebase config

const LoginModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Login successful:", user);
      // Optionally log additional details, such as the user's UID or email
      console.log("User ID:", user.uid);
      console.log("User Email:", user.email);

      handleClose();  // Close the modal on successful login
    } catch (err) {
      setError(err.message);  // Store the error message for UI display
      console.error("❌ Login failed:", err.code, err.message);  // Log detailed error information
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">Login</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
