import React, { useState, useEffect, useMemo } from "react";
import { Collapse, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "../firebase/firebase"; // ✅ import from shared instance
import "./EditUser.css";

const EditUser = () => {
  const [users, setUsers] = useState([]);
  const [expandedUid, setExpandedUid] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortField, setSortField] = useState("lastLogin");
  const [sortDirection, setSortDirection] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.warn("User not signed in. Cannot fetch users.");
        return;
      }

      try {
        await user.getIdToken(true); // Force token refresh

        const listUsers = httpsCallable(functions, "listUsers");
        const result = await listUsers();
        setUsers(result.data.users);
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
            <option value="admin">Admin</option>
            <option value="superuser">Superuser</option>
            <option value="viewer">Viewer</option>
            <option value="operator">Operator</option>
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
                            onClick={() => navigate(`/admin/edit-user/${user.uid}`)}
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
    </div>
  );
};

export default EditUser;
