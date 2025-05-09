// contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, getIdTokenResult } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await getIdTokenResult(user, true); // force refresh
        setUser(user);
        console.log(user)
        setClaims(tokenResult.claims);
      } else {
        setUser(null);
        setClaims({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isAdmin: !!claims.admin,
    isSuperuser: !!claims.superuser,
    isViewer: !!claims.viewer,
    isOperator: !!claims.operator,
    authTime: claims?.auth_time ? new Date(claims.auth_time * 1000) : null,
    loading,
    claims,
  };
  

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
