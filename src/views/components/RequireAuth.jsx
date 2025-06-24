import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Loading from './Loading';

/**
 * Component wrapper that requires authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const location = useLocation();
  
  // Show loading spinner while authentication state is being initialized
  if (isLoading) {
    return <Loading message="Checking authentication..." />;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Render children if authenticated
  return children;
}

export default RequireAuth;