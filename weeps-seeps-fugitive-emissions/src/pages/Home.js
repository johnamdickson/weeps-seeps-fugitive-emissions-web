import React, { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import LoginModal from "../components/LoginModal";
import { getAuth, onAuthStateChanged, getIdTokenResult, signOut } from "firebase/auth";
import { useToast } from "../contexts/ToastContext";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const { showToast } = useToast();

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

        user.getIdToken(true)
          .then(() => getIdTokenResult(user))
          .then((idTokenResult) => {
            const claims = idTokenResult.claims;
            console.log("Claims:", claims);

            setIsAdmin(!!claims.admin);
            setIsSuperuser(!!claims.superuser);

            setMessage(claims.admin ? 'You are an admin!' : 'You are not an admin.');
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
        setIsSuperuser(false);
        setMessage('No user logged in.');
        setUserDetails(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        showToast("Thank you for using the Weeps, Seeps and Fugitive Emissions Monitoring Tool.", "success", "Logout Successful");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        showToast("Logout failed. Please try again.", "danger");
      });
  };

  return (
    <Container className="text-center mt-5 text-white">
      <h1>Welcome to Weeps, Seeps & Fugitive Emissions</h1>
      <p>{userDetails ? "You're logged in!" : "Please log in to continue"}</p>

      {!userDetails && (
        <Button variant="primary" onClick={() => setShowLogin(true)}>
          Login
        </Button>
      )}

      {userDetails && (
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      )}

      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />

      <div className="mt-3">
        {loading ? (
          <p>Checking admin status...</p>
        ) : (
          <>
            <p>{message}</p>
            {isAdmin && <p className="text-info">Admin privileges detected.</p>}
            {isSuperuser && <p className="text-warning">Superuser privileges detected.</p>}
          </>
        )}
      </div>

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
