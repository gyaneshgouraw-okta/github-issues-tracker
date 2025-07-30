import { useState, useContext, useActionState, startTransition, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Github, Shield, Sparkles, ExternalLink } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import theme from '../../styles/theme';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Alert from '../components/Alert';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  padding: 1rem;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #0d0d0d 50%, #262626 75%, #000000 100%);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
`;

const LoginForm = styled(motion.form)`
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  position: relative;
  z-index: 1;
  overflow-y: auto;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  
  @media (max-height: 600px) {
    margin-bottom: 1rem;
  }
`;

const Logo = styled.div`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  font-family: ${theme.typography.fontFamily.sans.join(', ')};
  letter-spacing: -0.02em;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  
  svg {
    margin-right: 1rem;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));
  }
`;

const FaviconLogo = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 1rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));
  transition: all 0.3s ease;
  
  &:hover {
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.4));
    transform: scale(1.05);
  }
`;

const FooterContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #333333;
  
  @media (max-height: 600px) {
    margin-top: 1rem;
    padding-top: 1rem;
  }
`;

const GitHubRepoLink = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #b3b3b3;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid #333333;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.1) 50%, 
      transparent 100%
    );
    transition: left 0.5s ease;
  }
  
  &:hover {
    color: #ffffff;
    border-color: #555555;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    
    &::before {
      left: 100%;
    }
    
    svg {
      transform: scale(1.1);
    }
  }
  
  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
  }
`;

const FormGroup = styled(motion.div)`
  margin-bottom: 1.5rem;
  
  @media (max-height: 600px) {
    margin-bottom: 1rem;
  }
`;

const HelpText = styled.p`
  font-size: 0.875rem;
  color: #b3b3b3;
  margin-top: 1rem;
  line-height: 1.6;
  font-family: ${theme.typography.fontFamily.sans.join(', ')};
  
  strong {
    color: #ffffff;
    font-weight: 600;
  }
`;

const LinkText = styled.a`
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: #ffffff;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #ffffff;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
    
    &::after {
      width: 100%;
    }
  }
`;

const StyledCard = styled(Card)`
  background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
  border: 1px solid #333333;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 8px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      #ffffff 20%, 
      #ffffff 80%, 
      transparent 100%
    );
    opacity: 0.8;
  }
  
  &:hover {
    transform: translateY(-2px);
    border-color: #555555;
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.6),
      0 12px 24px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
`;

const SecurityBadge = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 1px solid #444444;
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: 2rem;
  font-size: 0.875rem;
  color: #ffffff;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.1) 50%, 
      transparent 100%
    );
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: #ffffff;
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.3));
  }
`;

// Authentication action for useActionState - React 19 compliant
async function authenticateAction(prevState, formData) {
  const token = formData.get('token');
  
  if (!token?.trim()) {
    return {
      success: false,
      error: 'Please enter a valid GitHub token',
      token: '',
      shouldAuthenticate: false
    };
  }
  
  try {
    // Return success state with token for authentication
    return {
      success: true,
      error: null,
      token: token,
      shouldAuthenticate: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Authentication failed',
      token: token,
      shouldAuthenticate: false
    };
  }
}

/**
 * Login page component
 */
function Login() {
  const [token, setToken] = useState('');
  const { isAuthenticated, error, authenticate, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // React 19: useActionState for form handling
  const [authState, authAction, isPending] = useActionState(authenticateAction, {
    success: false,
    error: null,
    token: '',
    shouldAuthenticate: false
  });
  
  // Handle authentication when action succeeds
  useEffect(() => {
    if (authState.shouldAuthenticate && authState.token) {
      startTransition(async () => {
        try {
          await authenticate(authState.token);
          navigate('/');
        } catch (err) {
          // Error handled by AuthContext
          console.error('Authentication failed:', err);
        }
      });
    }
  }, [authState.shouldAuthenticate, authState.token, authenticate, navigate]);
  
  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <LoginContainer>
      <LoginForm 
        action={authAction}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <LogoContainer variants={itemVariants}>
          <Logo>
            <FaviconLogo src="/favicon.svg" alt="GitHub Issue Tracker" />
            GitHub Issue Tracker
          </Logo>
        </LogoContainer>
        
        <motion.div variants={cardVariants}>
          <StyledCard>
            <Card.Body>
              <SecurityBadge 
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <Shield size={16} />
                <span>Your token is encrypted and stored securely</span>
                <Sparkles size={14} />
              </SecurityBadge>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert 
                    variant="error" 
                    title="Authentication failed"
                    message={error}
                    dismissible
                    onDismiss={clearError}
                  />
                </motion.div>
              )}
              
              <FormGroup variants={itemVariants}>
                <Input
                  id="token"
                  name="token"
                  label="GitHub Personal Access Token"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  autoFocus
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
              
              {/* React 19: Show action state error */}
              {authState.error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert 
                    variant="error" 
                    title="Validation Error"
                    message={authState.error}
                  />
                </motion.div>
              )}
              
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  variant="primary"
                  fullWidth
                  disabled={isPending || !token.trim()}
                >
                  {isPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ display: 'inline-block', marginRight: '0.5rem' }}
                      >
                        ⟳
                      </motion.div>
                      Signing in...
                    </>
                  ) : (
                    'Sign in with GitHub Token'
                  )}
                </Button>
              </motion.div>
            </Card.Body>
          </StyledCard>
        </motion.div>
        
        <FooterContainer variants={itemVariants}>
          <GitHubRepoLink
            href="https://github.com/gyaneshgouraw-okta/github-issues-tracker"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github size={16} />
            View on GitHub
            <ExternalLink size={14} />
          </GitHubRepoLink>
        </FooterContainer>
      </LoginForm>
    </LoginContainer>
  );
}

export default Login;