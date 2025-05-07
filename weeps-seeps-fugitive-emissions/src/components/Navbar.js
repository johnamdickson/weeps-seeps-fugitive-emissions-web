import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Offcanvas,
  Form,
  FormControl,
  InputGroup,
  Dropdown,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import "./Navbar.css";
import { useToast } from "../contexts/ToastContext";
import LoginModal from "../components/LoginModal";
import ProfileModal from "../components/ProfileModal";
import placeholderImage from "../assets/avatar.jpg";
import useAutoLogout from "../hooks/useAutoLogout";
import SessionWarningToast from "../components/SessionWarningToast";

const AppNavbar = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showToast, hideToast } = useToast();

  const [showProfile, setShowProfile] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const { showWarning, stayLoggedIn, countdown } = useAutoLogout();

  useEffect(() => {
    if (showWarning && countdown === 0) {
      hideToast(); // Dismiss toast when countdown hits zero
    }
  }, [showWarning, countdown, hideToast]);

  const handleShow = () => setShowOffcanvas(true);
  const handleClose = () => setShowOffcanvas(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search term:", searchTerm);
  };

  const handleLogout = () => {
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
      className="bg-custom"
      data-bs-theme="dark"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Container fluid>
        <div className="d-flex flex-column-reverse flex-md-row align-items-center justify-content-between w-100 py-2 px-1">
          {/* Burger Menu */}
          <div className="mb-2">
            <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} />
          </div>

          {/* Brand */}
          <div className="text-center flex-grow-1 my-2">
            <Navbar.Brand as={Link} to="/">
              Weeps, Seeps & Fugitive Emissions
            </Navbar.Brand>
          </div>

          {/* Search & User */}
          <div className="d-flex align-items-center gap-3 input-transition">
            {user ? (
              <>
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

                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="div"
                    className="d-flex bg-transparent border-0 p-0"
                    id="user-dropdown"
                    style={{ cursor: "pointer" }}
                  >
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="avatar-tooltip">Open Profile</Tooltip>}
                    >
                      <img
                        src={!avatarError && user.photoURL ? user.photoURL : placeholderImage}
                        onError={() => setAvatarError(true)}
                        alt="avatar"
                        className="navbar-avatar"
                      />
                    </OverlayTrigger>
                  </Dropdown.Toggle>
                  <Dropdown.Menu variant="dark">
                    <Dropdown.Header className="text-white">
                      {user.displayName && (
                        <>
                          <strong>{user.displayName}</strong>{" "}
                          <span className={`badge rounded-pill ${isAdmin ? "bg-info" : "bg-secondary"}`}>
                            {isAdmin ? "Admin" : "User"}
                          </span>
                        </>
                      )}
                      <br />
                      <small>{user.email}</small>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => setShowProfile(true)}>Profile</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <div
                style={{ fontSize: "1.5rem", cursor: "pointer", color: "white" }}
                onClick={() => setShowLogin(true)}
              >
                <span className="material-icons login-icon">login</span>
              </div>
            )}
          </div>
        </div>

        {/* Offcanvas Navigation */}
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
              <Nav.Link as={Link} to="/" onClick={handleClose}>Home</Nav.Link>
              {isAdmin && (
                <Nav.Link as={Link} to="/admin" onClick={handleClose}>Admin</Nav.Link>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>

      {/* Modals */}
      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
      <ProfileModal show={showProfile} onHide={() => setShowProfile(false)} />

      {/* 🔔 Session Timeout Warning Toast */}
      {showWarning && countdown > 0 && (
        <SessionWarningToast
          countdown={countdown}
          onStayLoggedIn={stayLoggedIn}
        />
      )}
    </Navbar>
  );
};

export default AppNavbar;
