// components/LoadingOverlay.js
import React from "react";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "./LoadingOverlay.css";

const LoadingOverlay = () => {
  const { loading } = useAuth();

  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <Spinner animation="border" variant="light" />
        <p className="mt-3 text-white fs-5">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
