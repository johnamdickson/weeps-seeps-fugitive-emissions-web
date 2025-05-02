// src/pages/Home.js
import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import LoginModal from "../components/LoginModal";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  

  return (
    <Container className="text-center mt-5">
      <h1>Welcome to Weeps, Seeps & Fugitive Emissons</h1>
      <p>Please log in to continue</p>
      <Button variant="primary" onClick={() => setShowLogin(true)}>
        Login
      </Button>

      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
    </Container>
  );
};

export default Home;
