import React, { useState, useEffect, useMemo } from "react";
import { Collapse, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { auth, functions, storage } from "../firebase/firebase";
import "./EditUser.css";
import { useAuth } from "../contexts/AuthContext";
import EditUserModal from "../components/EditUserModal";



const EditUser = () => {
  const { loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [expandedUid, setExpandedUid] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortField, setSortField] = useState("lastLogin");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const user = auth.currentUser;
      if (!user) return;
  
      try {
        const token = await user.getIdToken();
  
        const response = await fetch(
          "https://listusers-118529299623.us-central1.run.app",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
  
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error.message);
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
    try {
      let photoURL = updatedUser.photoURL || null;
  
      if (updatedUser.profileImage) {
        // Upload image to Firebase Storage
        const fileRef = ref(storage, `profilePictures/${updatedUser.uid}`);
        await uploadBytes(fileRef, updatedUser.profileImage);
        photoURL = await getDownloadURL(fileRef);
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
            photoURL,
          }),
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Unknown error");
      }
  
      console.log("User updated successfully:", result);
      setShowModal(false); // Close modal on success
      // Optionally: refresh user list or show toast
    } catch (error) {
      console.error("Failed to update user:", error.message);
      // Optionally: show toast/alert here
    }
  };
  
  

  const handleDelete = async (uid) => {
    console.log("Deleting user...", uid);
    // TODO: Call deleteUser Firebase function
  };

  return (
    <div className="container mt-4 text-light">
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

      <div className="user-table-body">
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
                    <td>
                      {user.displayName || user.email || "Unnamed User"}
                      {isExpanded ? " ▲" : " ▼"}
                    </td>
                    <td>{formatDate(user.lastSignInTime)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="p-0">
                      <Collapse in={isExpanded}>
                        <div className="p-3 bg-secondary border-top">
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
