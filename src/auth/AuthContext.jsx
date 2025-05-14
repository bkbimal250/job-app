// import { createContext, useContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(null);
//   const [role, setRole] = useState(null);

//   // Use useEffect to read from localStorage on component mount (page refresh)
//   useEffect(() => {
//     const savedToken = localStorage.getItem('token');
//     const savedRole = localStorage.getItem('role');

//     // If token and role are present in localStorage, restore session
//     if (savedToken && savedRole === 'admin') {
//       setToken(savedToken);
//       setRole(savedRole);
//     }
//   }, []);

//   const login = (token, role) => {
//     if (role === 'admin') {
//       localStorage.setItem('token', token);
//       localStorage.setItem('role', role);
//       setToken(token);
//       setRole(role);
//     } else {
//       // Block login for non-admins (optional)
//       console.warn("Only admins can log in");
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     setToken(null);
//     setRole(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, role, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


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

      // Optional: Add token validation here (call your backend to verify token)
      // if (savedToken) {
      //   const isValid = await validateToken(savedToken);
      //   if (!isValid) {
      //     localStorage.removeItem('token');
      //     localStorage.removeItem('role');
      //   }
      // }

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