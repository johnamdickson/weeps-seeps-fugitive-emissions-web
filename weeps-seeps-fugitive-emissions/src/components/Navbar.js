import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './Navbar.css';


const AppNavbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  // Handle hover events and log to the console
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Navbar
       expand={false}
      className={`${isHovered ? "navbar-dark bg-custom" : "navbar-light"}`}// Apply background change on hover
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // style={{ transition: "background-color 0.3s ease, color 0.3s ease" }} // Add transition
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
          className={`navbar-brand ${isHovered ? "text-white" : "text-dark"}`} // Change text color on hover
          style={{ transition: "color 0.3s ease" }} // Add transition for text color
        >
          Weeps, Seeps & Fugitive Emissions
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          onClick={handleShow}
          className={`custom-toggler ${isHovered ? "toggler-dark" : "toggler-white"}`} // Change icon color on hover
        />
        <Navbar.Offcanvas
          show={showOffcanvas}
          onHide={handleClose}
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          className="bg-dark text-light" 
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link as={Link} to="/" onClick={handleClose}>
                Home
              </Nav.Link>
              {isAdmin && (
                <Nav.Link as={Link} to="/admin" onClick={handleClose}>
                  Admin
                </Nav.Link>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
