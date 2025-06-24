import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Alert from '../components/Alert';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f6f8fa;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 480px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  color: #24292e;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const HelpText = styled.p`
  font-size: 0.875rem;
  color: #586069;
  margin-top: 0.5rem;
`;

const LinkText = styled.a`
  color: #0366d6;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

/**
 * Login page component
 */
function Login() {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, error, authenticate, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await authenticate(token);
      navigate('/');
    } catch (err) {
      // Error state is handled by the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LogoContainer>
          <Logo>
            <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            GitHub Issue Tracker
          </Logo>
        </LogoContainer>
        
        <Card>
          <Card.Body>
            {error && (
              <Alert 
                variant="error" 
                title="Authentication failed"
                message={error}
                dismissible
                onDismiss={clearError}
              />
            )}
            
            <FormGroup>
              <Input
                id="token"
                label="GitHub Personal Access Token"
                type="password"
                placeholder="Enter your GitHub token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
              <HelpText>
                You need a GitHub token with <strong>repo</strong> scope to access private repositories.{' '}
                <LinkText 
                  href="https://github.com/settings/tokens/new?scopes=repo&description=GitHub%20Issue%20Tracker" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Create a new token
                </LinkText>
              </HelpText>
            </FormGroup>
            
            <Button 
              type="submit" 
              fullWidth
              disabled={isSubmitting || !token.trim()}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in with GitHub Token'}
            </Button>
          </Card.Body>
        </Card>
      </LoginForm>
    </LoginContainer>
  );
}

export default Login;