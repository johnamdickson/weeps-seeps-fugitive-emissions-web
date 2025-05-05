import React, { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import LoginModal from "../components/LoginModal";
import { getAuth, onAuthStateChanged, getIdTokenResult } from "firebase/auth";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(true);
        setUserDetails({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });

        getIdTokenResult(user)
          .then((idTokenResult) => {
            if (idTokenResult.claims.admin) {
              setIsAdmin(true);
              setMessage('You are an admin!');
            } else {
              setIsAdmin(false);
              setMessage('You are not an admin.');
            }
          })
          .catch((error) => {
            console.error('Error fetching ID token result:', error);
            setMessage('Error checking admin status.');
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setIsAdmin(false);
        setMessage('No user logged in.');
        setUserDetails(null);
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return (
    <Container className="text-center mt-5">
      <h1>Welcome to Weeps, Seeps & Fugitive Emissions</h1>
      <p>Please log in to continue</p>
      
      {/* Login Button */}
      <Button variant="primary" onClick={() => setShowLogin(true)}>
        Login
      </Button>

      {/* Login Modal */}
      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />

      {/* Admin Status Message */}
      <div className="mt-3">
        {loading ? (
          <p>Checking admin status...</p>
        ) : (
          <p>{message}</p>
        )}
      </div>

      {/* User Details */}
      {userDetails && (
        <div className="mt-3">
          <h5>User Details:</h5>
          <p><strong>UID:</strong> {userDetails.uid}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Display Name:</strong> {userDetails.displayName || 'N/A'}</p>
        </div>
      )}
    </Container>
  );
};

export default Home;
