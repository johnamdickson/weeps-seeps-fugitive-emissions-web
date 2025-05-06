import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser, isAdmin, isSuperuser, loading } = useAuth();

  if (loading) return <p>Checking authentication...</p>;

  return (
    <div>
      <p>Welcome {currentUser?.displayName || 'User'}</p>
      {isAdmin && <p>You have admin access.</p>}
      {isSuperuser && <p>You have superuser access.</p>}
    </div>
  );
};

export default Dashboard;
