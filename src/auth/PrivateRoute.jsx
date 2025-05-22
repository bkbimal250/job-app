import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';

const PrivateRoute = () => {
  const { token, role, isLoading, isAuthenticated, user } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // console.log('PrivateRoute: Auth state check', {
    //   token: token ? 'exists' : 'null',
    //   role,
    //   isLoading,
    //   isAuthenticated,
    //   user: user ? 'exists' : 'null'
    // });

    // Wait for the AuthContext to finish loading
    if (!isLoading) {
      setIsCheckingAuth(false);
      console.log('PrivateRoute: Auth checking complete');
    }
  }, [token, role, isLoading, isAuthenticated, user]);

  // Show loading while AuthContext is initializing or while we're checking
  if (isLoading || isCheckingAuth) {
    console.log('PrivateRoute: Still loading...');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // Check if user is authenticated and has admin role
  const hasValidToken = token && token.trim() !== '';
  const isAdmin = role === 'admin';
  
  console.log('PrivateRoute: Final auth check', {
    hasValidToken,
    isAdmin,
    shouldRedirect: !hasValidToken || !isAdmin
  });

  if (!hasValidToken || !isAdmin) {
    console.log('PrivateRoute: Redirecting to login - insufficient permissions');
    return <Navigate to="/login" replace />;
  }

  console.log('PrivateRoute: Access granted for admin user');
  return <Outlet />;
};

export default PrivateRoute;