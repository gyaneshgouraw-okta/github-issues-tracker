import { useState, useCallback, useEffect } from 'react';
import githubService from '../services/github-service';

/**
 * Authentication ViewModel (using React's built-in state management)
 * @returns {Object} Auth state and methods
 */
export function useAuthViewModel() {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('github-token') || null,
    user: JSON.parse(localStorage.getItem('github-user') || 'null'),
    isAuthenticated: Boolean(localStorage.getItem('github-token')),
    isLoading: false,
    error: null,
  });

  // Initialize GitHub service if token exists
  useEffect(() => {
    if (authState.token) {
      githubService.initialize(authState.token);
    }
  }, []);

  /**
   * Set the GitHub token and authenticate the user
   * @param {string} token - GitHub personal access token
   * @returns {Promise<Object>} - User information if authentication succeeds
   */
  const authenticate = useCallback(async (token) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Initialize the GitHub service
      githubService.initialize(token);
      
      // Validate the token
      const user = await githubService.validateToken();
      
      // Update state and localStorage
      const newState = {
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      
      setAuthState(newState);
      localStorage.setItem('github-token', token);
      localStorage.setItem('github-user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      const newState = {
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || "Authentication failed",
      };
      
      setAuthState(newState);
      localStorage.removeItem('github-token');
      localStorage.removeItem('github-user');
      
      throw error;
    }
  }, []);
  
  /**
   * Log out user by clearing authentication state
   */
  const logout = useCallback(() => {
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
    
    localStorage.removeItem('github-token');
    localStorage.removeItem('github-user');
  }, []);
  
  /**
   * Clear any authentication errors
   */
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    authenticate,
    logout,
    clearError,
  };
}

export default useAuthViewModel;