import { useState, useEffect } from 'react';
import { authService } from '../services/index.js';

/**
 * Custom hook for authentication state management
*/
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is authenticated
        if (authService.isAuthenticated()) {
          const userData = authService.getCurrentUser();
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            
            // Validate token in background
            const isValid = await authService.validateToken();
            if (!isValid) {
              handleLogout();
            }
          } else {
            handleLogout();
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    authService.setUserData(userData);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    updateUser,
  };
};
