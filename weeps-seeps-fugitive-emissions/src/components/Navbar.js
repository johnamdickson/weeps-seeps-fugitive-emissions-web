import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Offcanvas, Form, FormControl, Button, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './Navbar.css';

const AppNavbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search term:", searchTerm);
    // Add search logic here
  };

  return (
<Navbar
  expand={false}
  className={`${isHovered ? "navbar-dark bg-custom" : "navbar-light"}`}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>  <Container fluid >
  <div className="d-flex flex-column flex-md-row align-items-center justify-content-between w-100 py-2 px-1">

    {/* Left: Burger Menu */}
    <div className="mb-2 mb-sm-1">
      <Navbar.Toggle
        aria-controls="offcanvasNavbar"
        onClick={handleShow}
        className={`custom-toggler ${isHovered ? "toggler-dark" : "toggler-white"}`}
      />
    </div>

    {/* Center: Brand */}
    <div className="text-center flex-grow-1 mb-2 mb-sm-1">
    <Navbar.Brand
  as={Link}
  to="/"
  className={`navbar-brand ${isHovered ? "text-white" : "text-dark"}`}
>
  Weeps, Seeps & Fugitive Emissions
</Navbar.Brand>
    </div>

    {/* Right: Search + User Icon */}
    <div className="d-flex align-items-center gap-3">
      <Form className="d-flex" onSubmit={handleSearch}>
        <InputGroup>
          <FormControl
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputGroup.Text style={{ cursor: "pointer" }} onClick={handleSearch}>
            <span className="material-icons search-icon">search</span>
          </InputGroup.Text>
        </InputGroup>
      </Form>
      <div
        className={`user-icon ${isHovered ? "text-white" : "text-dark"} d-flex`}
        style={{ fontSize: "1.4rem", cursor: "pointer" }}
      >
        <span className="material-icons">account_circle</span>
      </div>
    </div>

  </div>

  <Navbar.Offcanvas
          show={showOffcanvas}
          onHide={handleClose}
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
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
