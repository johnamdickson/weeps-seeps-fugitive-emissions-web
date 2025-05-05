// src/pages/Admin.js
import React from "react";
import { Container } from "react-bootstrap";

const Admin = () => {
  return (
    <Container className="mt-5">
      <h2>Admin Panel</h2>
      <p>Welcome, administrator. This section is restricted to admin users only.</p>
    </Container>
  );
};

export default Admin;
