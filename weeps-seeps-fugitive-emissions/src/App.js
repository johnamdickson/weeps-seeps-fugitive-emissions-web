import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import LoginModal from './components/LoginModal';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Container className="p-3">
      <h1>Welcome</h1>
      <Button onClick={() => setShowLogin(true)}>Log In</Button>
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
    </Container>
  );
}

export default App;
