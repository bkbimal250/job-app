// This file contains the AuthContext and AuthProvider components
// which manage the authentication state of the application.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';

const PrivateRoute = () => {
  const { token, role } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // If we have values, we're done checking
    if (token !== undefined && role !== undefined) {
      setIsCheckingAuth(false);
    }
  }, [token, role]);

  if (isCheckingAuth) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!token || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;