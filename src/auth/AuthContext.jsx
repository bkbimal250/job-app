

import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    isLoading: true // Add loading state
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedRole = localStorage.getItem('role');
      // Simulate an API call to check if the token is valid
      // In a real application, you would verify the token with your backend
      if (savedToken && savedRole === 'admin') {
        setAuthState({
          token: savedToken,
          role: savedRole,
          isLoading: false
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = (token, role) => {
    if (role === 'admin') {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      setAuthState({
        token,
        role,
        isLoading: false
      });
      return true;
    } else {
      console.warn("Only admins can log in");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthState({
      token: null,
      role: null,
      isLoading: false
    });
  };

  const isAuthenticated = authState.role === 'admin' && authState.token !== null;

  return (
    <AuthContext.Provider value={{
      token: authState.token,
      role: authState.role,
      isAuthenticated,
      isLoading: authState.isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);