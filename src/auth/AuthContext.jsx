

import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    // Only restore session if role is admin
    if (savedToken && savedRole === 'admin') {
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);

  const login = (token, role) => {
    if (role === 'admin') {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      setToken(token);
      setRole(role);
    } else {
      // Block login for non-admins (optional)
      console.warn("Only admins can log in");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
