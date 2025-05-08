// components/SessionInfoBar.js
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import "./SessionInfoBar.css";

const SessionInfoBar = () => {
  const { user, authTime } = useAuth();

  if (!user || !authTime) return null;

  const loginTimeFormatted = authTime.toLocaleTimeString();

  return (
    <div className="session-info-bar">
      Logged in as <strong>{user.displayName || user.email}</strong> at {loginTimeFormatted}
    </div>
  );
};

export default SessionInfoBar;
