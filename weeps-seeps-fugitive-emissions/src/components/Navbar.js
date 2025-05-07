import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Offcanvas,
  Form,
  FormControl,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import "./Navbar.css";
import { useToast } from "../contexts/ToastContext";
import LoginModal from "../components/LoginModal";

const AppNavbar = () => {
  // ─────────────────────────────────────
  // Context & Routing
  // ─────────────────────────────────────
  const { user, isAdmin } = useAuth(); // Current authenticated user & role info
  const navigate = useNavigate();
  const { showToast } = useToast();   // Toast message handler

  // ─────────────────────────────────────
  // Component State
  // ─────────────────────────────────────
  const [showOffcanvas, setShowOffcanvas] = useState(false);  // Offcanvas side menu visibility
  const [isHovered, setIsHovered] = useState(false);          // Navbar hover styling
  const [searchTerm, setSearchTerm] = useState("");           // Search input value
  const [showLogin, setShowLogin] = useState(false);          // Login modal visibility

  // ─────────────────────────────────────
  // Event Handlers
  // ─────────────────────────────────────
  const handleShow = () => setShowOffcanvas(true);   // Show side menu
  const handleClose = () => setShowOffcanvas(false); // Hide side menu
  const handleMouseEnter = () => setIsHovered(true); // Activate hover background
  const handleMouseLeave = () => setIsHovered(false);// Remove hover background

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search term:", searchTerm); // Placeholder for search logic
  };

  const handleLogout = () => {
    // Prompts user before logging out and redirects to home
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          showToast(
            "Thank you for using the Weeps, Seeps and Fugitive Emissions Monitoring Tool.",
            "success",
            <>
              <span className="material-icons success-icon me-3">thumb_up</span>
              Logout Successful
            </>
          );
          navigate("/"); // Redirect to home
        })
        .catch((error) => {
          console.error("Logout error:", error);
          showToast("Logout failed. Please try again.", "danger", "Logout Error");
        });
    }
  };

  return (
    <Navbar
      expand={false}
      className={"bg-custom"}
      data-bs-theme={"dark"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Container fluid>
        {/* 
          ─────────────────────────────────────
          NAVBAR MAIN ROW (Burger | Brand | User Tools)
          ─────────────────────────────────────
        */}
        <div className="d-flex flex-column-reverse flex-md-row align-items-center justify-content-between w-100 py-2 px-1">

          {/* Left: Burger Menu Button (collapsible offcanvas) */}
          <div className="mb-2">
            <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} />
          </div>

          {/* Center: Application Title/Brand */}
          <div className="text-center flex-grow-1 my-2">
            <Navbar.Brand as={Link} to="/">
              Weeps, Seeps & Fugitive Emissions
            </Navbar.Brand>
          </div>

          {/* Right: Search bar and user icon or login icon */}
          <div className="d-flex align-items-center gap-3 input-transition">
            {user ? (
              <>
                {/* 
                  ─────────────
                  Search Input
                  ─────────────
                */}
                <Form className="d-flex" onSubmit={handleSearch}>
                  <InputGroup>
                    <FormControl
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`input-transition ${isHovered ? "search-hovered" : "search-default"}`}
                    />
                    <InputGroup.Text
                      style={{ cursor: "pointer" }}
                      onClick={handleSearch}
                      className={`input-transition ${isHovered ? "search-hovered" : "search-default"}`}
                    >
                      <span className="material-icons search-icon">search</span>
                    </InputGroup.Text>
                  </InputGroup>
                </Form>

                {/* 
                  ─────────────
                  User Account Icon Dropdown (with profile and logout)
                  ─────────────
                */}
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="div"
                    className="d-flex bg-transparent border-0 p-0"
                    id="user-dropdown"
                    style={{
                      cursor: "pointer",
                      color: "white",
                      fontSize: "1.5rem",
                    }}
                  >
                    <span className="material-icons user-icon">account_circle</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu variant="dark">
                    <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                {/* 
                  ─────────────
                  Login Icon (when no user is logged in)
                  ─────────────
                */}
                <div
                  style={{
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "white",
                  }}
                  onClick={() => setShowLogin(true)}
                >
                  <span className="material-icons login-icon">login</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 
          ─────────────────────────────────────
          OFFCANVAS SIDE MENU (Burger menu content)
          ─────────────────────────────────────
        */}
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

      {/* 
        ─────────────────────────────────────
        LOGIN MODAL (Shown if no user is logged in and login icon clicked)
        ─────────────────────────────────────
      */}
      <LoginModal
        show={showLogin}
        onHide={() => setShowLogin(false)}
      />
    </Navbar>
  );
};

export default AppNavbar;
