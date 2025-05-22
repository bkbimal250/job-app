import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    user: null,
    isLoading: true,
  });

  // Helper function to load data from localStorage safely
  const loadAuthData = () => {
    console.log('Loading auth data from localStorage...');
    
    try {
      const savedToken = localStorage.getItem('token');
      const savedRole = localStorage.getItem('role');
      const savedUser = localStorage.getItem('user');
      
      // console.log('Raw localStorage data:', {
      //   token: savedToken,
      //   role: savedRole,
      //   user: savedUser
      // });

      let parsedUser = null;
      if (savedUser) {
        try {
          parsedUser = JSON.parse(savedUser);
        
        } catch (e) {
          console.warn('Corrupted user data in localStorage, removing...', e);
          localStorage.removeItem('user');
        }
      }

      return { savedToken, savedRole, parsedUser };
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return { savedToken: null, savedRole: null, parsedUser: null };
    }
  };

  // Save auth data to localStorage
  const saveAuthData = (token, role, user) => {
    try {
      
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Auth data saved successfully');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Clear auth data from localStorage
  const clearAuthData = () => {
    try {
      console.log('Clearing auth data from localStorage...');
      
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      
      console.log('Auth data cleared successfully');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    console.log('AuthProvider: Initializing auth state...');
    
    const { savedToken, savedRole, parsedUser } = loadAuthData();

    // Check if we have valid auth data
    if (savedToken && savedRole) {
      console.log('Found existing auth data:', {
        token: savedToken,
        role: savedRole,
        user: parsedUser
      });
      
      setAuthState({
        token: savedToken,
        role: savedRole,
        user: parsedUser,
        isLoading: false,
      });
    } else {
      console.log('No valid auth data found, setting unauthenticated state');
      
      setAuthState({
        token: null,
        role: null,
        user: null,
        isLoading: false,
      });
    }
  }, []);

  // Login: Save token, role, and user data
  const login = (token, role, user) => {
    // Validate input parameters
    if (!token) {
      console.error('Login failed: Token is required');
      return { success: false, error: 'Token is required' };
    }

    if (!role) {
      console.error('Login failed: Role is required');
      return { success: false, error: 'Role is required' };
    }

    // Optional: Remove admin-only restriction or modify as needed
    if (role !== 'admin') {
      console.warn('Login failed: Only admin users are allowed');
      return { success: false, error: 'Only admin users are allowed' };
    }

    try {
      // Save to localStorage
      saveAuthData(token, role, user);

      // Update state
      const newAuthState = {
        token,
        role,
        user,
        isLoading: false,
      };

      setAuthState(newAuthState);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Failed to save login data' };
    }
  };

  // Logout: Clear all auth-related data
  const logout = () => {
    console.log('Logout initiated...');
    
    try {
      // Clear localStorage
      clearAuthData();

      // Reset state
      const newAuthState = {
        token: null,
        role: null,
        user: null,
        isLoading: false,
      };

      setAuthState(newAuthState);
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Update user data while keeping token and role
  const updateUser = (userData) => {

    // console.log('Updating user data:', userData);
    
    try {
      const updatedAuthState = {
        ...authState,
        user: userData,
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setAuthState(updatedAuthState);
      
      // console.log('User data updated successfully:', userData);

    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = Boolean(authState.token && authState.role);
  
  // Check if user is admin
  const isAdmin = authState.role === 'admin';

  // Debug: Log current auth state whenever it changes
  useEffect(() => {



    // console.log('Auth state updated:', authState);
    // console.log('Is authenticated:', isAuthenticated);
    // console.log('Is admin:', isAdmin);




  }, [authState, isAuthenticated, isAdmin]);

  const contextValue = {
    // State
    token: authState.token,
    role: authState.role,
    user: authState.user,
    isLoading: authState.isLoading,
    
    // Computed values
    isAuthenticated,
    isAdmin,
    
    // Methods
    login,
    logout,
    updateUser,
    
    // Debug helper
    getAuthState: () => authState,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Additional helper hooks
export const useAuthUser = () => {
  const { user } = useAuth();
  return user;
};

export const useAuthToken = () => {
  const { token } = useAuth();
  return token;
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};