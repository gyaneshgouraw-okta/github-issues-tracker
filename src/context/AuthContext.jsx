import { createContext, useMemo } from 'react';
import useAuthViewModel from '../viewmodels/AuthViewModel';

/**
 * Context for authentication state and functions
 * @type {React.Context}
 */
export const AuthContext = createContext({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  authenticate: () => {},
  logout: () => {},
  clearError: () => {},
});

/**
 * Provider component for authentication context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  // Use the authentication ViewModel
  const authViewModel = useAuthViewModel();
  
  // Memoize the context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({
    ...authViewModel,
  }), [
    authViewModel.token,
    authViewModel.user,
    authViewModel.isAuthenticated,
    authViewModel.isLoading,
    authViewModel.error,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;