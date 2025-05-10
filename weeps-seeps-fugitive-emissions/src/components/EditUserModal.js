import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Image,
  Alert,
} from "react-bootstrap";
import './Modal.css';

const defaultRoles = ["superuser", "admin", "operator", "viewer"];

const EditUserModal = ({ show, onHide, user, onSave, onDelete, disableDelete }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setRoles({ ...user.customClaims });
      setPreviewUrl(null); // Reset preview when modal opens
    }
  }, [user]);

  const toggleRole = (role) => {
    setRoles((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    const updatedData = {
      uid: user.uid,
      displayName,
      email,
      roles,
      profileImage,
    };
    onSave(updatedData);
    onHide();
  };

  const confirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      onDelete(user.uid);
      onHide();
    }
  };

  const displayImage =
  previewUrl ||
  user?.profilePhoto || // safe access
  user?.photoURL || // safe access
  "https://via.placeholder.com/150";


  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Display Name</Form.Label>
                <Form.Control
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Roles</Form.Label>
                <div>
                  {defaultRoles.map((role) => (
                    <Form.Check
                      key={role}
                      type="checkbox"
                      label={role}
                      checked={!!roles[role]}
                      onChange={() => toggleRole(role)}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>

            <Col md={4} className="text-center">
              <Image
                src={displayImage}
                rounded
                fluid
                alt="Profile Preview"
                className="mb-3 edit-img"
              />
              <Form.Group controlId="profileImage">
                <Form.Label>Profile Photo</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Alert variant="primary" className="mt-3">
                <div><strong>UID:</strong> {user?.uid}</div>
                <div><strong>Last Login:</strong> {user?.lastSignInTime || "Never"}</div>
              </Alert>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={confirmDelete}
          disabled={disableDelete}
          title={disableDelete ? "Cannot delete a superuser" : "Delete this user"}
        >
          Delete User
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;
