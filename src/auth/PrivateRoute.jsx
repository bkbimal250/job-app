import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const PrivateRoute = () => {
  const { token, role } = useContext(AuthContext);


  if (!token || role !== 'admin') {
    return <Navigate to="/login" />;
  }
  

  return <Outlet />; // ✅ This will render child routes
};

export default PrivateRoute;
