import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SuperuserRoute = ({ children }) => {
  const { loading, isSuperuser } = useAuth();

  if (loading) return null;

  if (!isSuperuser) {
    sessionStorage.setItem("redirectToast", "superuser-denied");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default SuperuserRoute;
