// import { Navigate, Outlet } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from './AuthContext';

// const PrivateRoute = () => {
//   const { token, role } = useContext(AuthContext);

//   // Check if the user is authenticated and has the correct role
//   if (!token || role !== 'admin') {
//     return <Navigate to="/login" />;
//   }

//   // Render child routes if the user is authorized
//   return <Outlet />;
// };

// export default PrivateRoute;



// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from './AuthContext';
// import { CircularProgress, Box } from '@mui/material'; // or your preferred loading component

// const PrivateRoute = () => {
//   const { token, role, isLoading } = useAuth();

//   // Show loading indicator while checking auth state
//   if (isLoading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // Check if the user is authenticated and has admin role
//   if (!token || role !== 'admin') {
//     // You can add state to remember where they came from
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   // Render child routes if authorized
//   return <Outlet />;
// };

// export default PrivateRoute;










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