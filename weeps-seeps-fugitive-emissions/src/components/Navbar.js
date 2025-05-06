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

const AppNavbar = () => {
  const { user, isAdmin } = useAuth();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search term:", searchTerm);
  };
  const { showToast } = useToast();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          showToast("Thank you for using the Weeps, Seeps and Fugitive Emissions Monitoring Tool.", "success", <><span className="material-icons success-icon me-3">thumb_up</span> Logout Successful</>);
          navigate("/");
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
      className={`${isHovered ? "navbar-dark bg-custom" : "navbar-dark"}`}
      data-bs-theme={isHovered ? "light" : "dark"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Container fluid>
        <div className="d-flex flex-column-reverse flex-md-row align-items-center justify-content-between w-100 py-2 px-1">
          {/* Left: Burger Menu */}
          <div className="mb-2">
            <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} />
          </div>

          {/* Center: Brand */}
          <div className="text-center flex-grow-1 my-2">
            <Navbar.Brand as={Link} to="/">
              Weeps, Seeps & Fugitive Emissions
            </Navbar.Brand>
          </div>

          {/* Right: Search + User Icon */}
          <div className="d-flex align-items-center gap-3 input-transition">
            {user && (
              <>
                <Form className="d-flex" onSubmit={handleSearch}>
                  <InputGroup>
                    <FormControl
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-transition"
                    />
                    <InputGroup.Text
                      style={{ cursor: "pointer" }}
                      onClick={handleSearch}
                      className="input-transition"
                    >
                      <span className="material-icons search-icon">search</span>
                    </InputGroup.Text>
                  </InputGroup>
                </Form>

                {/* User Icon Dropdown without arrow */}
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="div"
                    className="d-flex bg-transparent border-0 p-0"
                    id="user-dropdown"
                    style={{ cursor: "pointer", color: "white", fontSize: "1.5rem" }}
                  >
                    <span className="material-icons">account_circle</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu variant="dark">
                    <Dropdown.Item as={Link} to="/profile">
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      Log out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </div>
        </div>

        {/* Offcanvas Menu */}
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
