import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase'; // Make sure this is the correct import for your Firebase config
import './LoginModal.css';
import { useToast } from "../contexts/ToastContext";

const LoginModal = ({ show, onHide }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { showToast } = useToast();   // Toast message handler

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
        showToast(
        "Welcome to the Weeps, Seeps and Fugitive Emissions Monitoring Tool.",
        "success",
        <>
          <span className="material-icons toast-icon me-3">thumb_up</span>
          Login Successful
        </>
      );
      const user = userCredential.user;
      console.log("✅ Login successful:", user);
      // Optionally log additional details, such as the user's UID or email
      console.log("User ID:", user.uid);
      console.log("User Email:", user.email);

      onHide();  // Close the modal on successful login
    } catch (err) {
      setError(err.message); 
      showToast(
        `There was a problem logging you in:  ${err.message}`,
        "danger",
        <>
          <span className="material-icons success-icon me-3">thumb_down</span>
          Login Error
        </>
      ) // Store the error message for UI display
      console.error("❌ Login failed:", err.code, err.message);  // Log detailed error information
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered animation="true" className="login-modal">
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-white fs-6">{error}</p>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3 fs-5">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3 fs-5">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="btn-login">
            <span class="material-icons login-modal-icon">login</span>
            Login
            </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
