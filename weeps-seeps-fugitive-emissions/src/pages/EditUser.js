import React, { useState, useEffect, useMemo } from "react";
import { Collapse, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth, functions } from "../firebase/firebase";
import EditUserModal from "../components/EditUserModal";
import { useProfilePhoto } from "../hooks/useProfilePhoto";
import "./EditUser.css";

const EditUser = () => {
  const [users, setUsers] = useState([]);
  const [expandedUid, setExpandedUid] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortField, setSortField] = useState("lastLogin");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const navigate = useNavigate();
  const { photoURL, fetchPhotoURL, uploadPhoto } = useProfilePhoto();

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const response = await fetch("https://listusers-118529299623.us-central1.run.app", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        const updatedUsers = await Promise.all(
          data.users.map(async (u) => {
            try {
              const url = await fetchPhotoURL(u.uid);
              return { ...u, profilePhoto: url };
            } catch {
              return { ...u, profilePhoto: null };
            }
          })
        );

        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        (user.displayName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());

      if (selectedRole === "all") return matchesSearch;

      const roles = Object.entries(user.customClaims || {})
        .filter(([_, value]) => value)
        .map(([role]) => role);

      return matchesSearch && roles.includes(selectedRole);
    });
  }, [users, searchTerm, selectedRole]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let aVal, bVal;
      if (sortField === "name") {
        aVal = (a.displayName || a.email || "").toLowerCase();
        bVal = (b.displayName || b.email || "").toLowerCase();
      } else {
        aVal = a.lastSignInTime ? new Date(a.lastSignInTime).getTime() : 0;
        bVal = b.lastSignInTime ? new Date(b.lastSignInTime).getTime() : 0;
      }
      return aVal < bVal ? (sortDirection === "asc" ? -1 : 1) : aVal > bVal ? (sortDirection === "asc" ? 1 : -1) : 0;
    });
  }, [filteredUsers, sortField, sortDirection]);

  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleString() : "Never");

  const handleModalClose = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleSave = async (updatedUser) => {
    let finalPhotoURL = photoURL;
    try {
      if (updatedUser.profileImage) {
        try {
          finalPhotoURL = await uploadPhoto(updatedUser.uid, updatedUser.profileImage);
        } catch (err) {
          console.error("Failed to upload image:", err.message);
          return;
        }
      }

      const response = await fetch(
        "https://us-central1-weeps-seeps-fugitive-emissions.cloudfunctions.net/updateUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: updatedUser.uid,
            displayName: updatedUser.displayName,
            email: updatedUser.email,
            roles: updatedUser.roles,
            photoURL: finalPhotoURL,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unknown error");
      }

      console.log("User updated successfully:", result);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to update user:", error.message);
    }
  };

  const handleDelete = async (uid) => {
    console.log("Deleting user...", uid);
    // TODO: Implement delete function
  };

  if (usersLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center loading-container">
        <Spinner animation="border" variant="light" role="status" />
        <div className="loading-text">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="container edit-users-container col-lg-6 col-md-8">
      <h2>Edit Users</h2>

      <Row className="mb-3">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="superuser">Superuser</option>
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="viewer">Viewer</option>
          </Form.Select>
        </Col>
      </Row>

      <div className="user-table-body">
      <table className="user-table-header table table-dark table-bordered table-hover mb-0">
        <colgroup>
          <col style={{ width: "auto" }} />
          <col style={{ width: "250px" }} />
        </colgroup>
        <thead>
          <tr>
            <th onClick={() => toggleSort("name")} className="no-border-right">
              User {sortField === "name" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => toggleSort("lastLogin")} className="no-border-left">
              Last Login {sortField === "lastLogin" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
      </table>
        <table className="table table-dark table-bordered table-hover mb-0">
        <colgroup>
            <col style={{ width: "auto" }} />
            <col style={{ width: "250px" }} />
          </colgroup>
          <tbody>
            {sortedUsers.map((user) => {
              const isExpanded = expandedUid === user.uid;
              const roles = Object.entries(user.customClaims || {})
                .filter(([_, value]) => value)
                .map(([role]) => role)
                .join(", ") || "None";

              return (
                <React.Fragment key={user.uid}>
                  <tr
                    onClick={() => setExpandedUid((prev) => (prev === user.uid ? null : user.uid))}
                    style={{ cursor: "pointer" }}
                  >
<td className="d-flex align-items-center gap-2">
  {user.profilePhoto && (
    <img
      src={user.profilePhoto}
      alt="Profile"
      className="profile-thumb"
    />
  )}
  <span className="h5">{user.displayName || user.email || "Unnamed User"} </span>
  <span className="ms-auto h6">{isExpanded ? "▲" : "▼"}</span>
</td>                    <td>{formatDate(user.lastSignInTime)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="p-0">
                      <Collapse in={isExpanded}>
                        <div className="bg-secondary border-top user-details-flex user-detail-row">
                          <div className="user-details-left">
                            <p><strong>Email:</strong> {user.email || "N/A"}</p>
                            <p><strong>UID:</strong> {user.uid}</p>
                            <p><strong>Roles:</strong> {roles}</p>
                            <p><strong>Last Login:</strong> {formatDate(user.lastSignInTime)}</p>
                            <Button
                              variant="primary"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowModal(true);
                              }}
                            >
                              Edit User
                            </Button>
                          </div>
                          {user.profilePhoto && (
                            <img
                              src={user.profilePhoto}
                              alt="Profile"
                              className="user-profile-photo"
                            />
                          )}
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <EditUserModal
        show={showModal}
        onHide={handleModalClose}
        user={selectedUser}
        onSave={handleSave}
        onDelete={handleDelete}
        disableDelete={!!selectedUser?.customClaims?.superuser}
      />
    </div>
  );
};

export default EditUser;
