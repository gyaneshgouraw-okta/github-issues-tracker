import { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import { AuthContext } from '../../context/AuthContext';
import githubService from '../../services/github-service';
import { Clock, Shield, AlertTriangle, CheckCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #586069;
  margin-top: 0;
`;

const ProfileCard = styled(Card)`
  margin-bottom: 1.5rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
`;

const UserDetails = styled.div`
  color: #586069;
  font-size: 0.875rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const TokenSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DangerZone = styled(Card)`
  border-color: #fdb8c0;
  
  ${Card.Header} {
    background-color: #ffeef0;
    border-bottom-color: #fdb8c0;
  }
`;

const TokenStatusCard = styled(Card)`
  margin-bottom: 1.5rem;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${props => {
    if (props.variant === 'success') return 'rgba(16, 185, 129, 0.1)';
    if (props.variant === 'warning') return 'rgba(245, 158, 11, 0.1)';
    if (props.variant === 'error') return 'rgba(239, 68, 68, 0.1)';
    return 'rgba(148, 163, 184, 0.1)';
  }};
  border: 1px solid ${props => {
    if (props.variant === 'success') return 'rgba(16, 185, 129, 0.2)';
    if (props.variant === 'warning') return 'rgba(245, 158, 11, 0.2)';
    if (props.variant === 'error') return 'rgba(239, 68, 68, 0.2)';
    return 'rgba(148, 163, 184, 0.2)';
  }};
  border-radius: 8px;
  font-size: 0.875rem;
`;

const StatusIcon = styled.div`
  color: ${props => {
    if (props.variant === 'success') return '#10b981';
    if (props.variant === 'warning') return '#f59e0b';
    if (props.variant === 'error') return '#ef4444';
    return '#64748b';
  }};
  display: flex;
  align-items: center;
`;

const StatusText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const StatusLabel = styled.span`
  font-weight: 500;
  color: #374151;
`;

const StatusValue = styled.span`
  color: #6b7280;
  font-size: 0.8125rem;
`;

const ScopesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const ScopeTag = styled.span`
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(99, 102, 241, 0.2);
`;

const RefreshButton = styled(Button)`
  margin-left: auto;
`;

/**
 * Settings page component
 */
function Settings() {
  const { user, token, authenticate, logout } = useContext(AuthContext);
  const [newToken, setNewToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loadingTokenInfo, setLoadingTokenInfo] = useState(false);
  const [tokenInfoError, setTokenInfoError] = useState(null);
  
  // Handle token update
  const handleUpdateToken = async (e) => {
    e.preventDefault();
    
    if (!newToken.trim()) {
      return;
    }
    
    try {
      await authenticate(newToken);
      setNewToken('');
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      // Error handling is managed by the AuthContext
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
  };
  
  // Fetch token information
  const fetchTokenInfo = async () => {
    if (!token) return;
    
    try {
      setLoadingTokenInfo(true);
      setTokenInfoError(null);
      const info = await githubService.getTokenInfo();
      setTokenInfo(info);
    } catch (error) {
      setTokenInfoError(error.message);
    } finally {
      setLoadingTokenInfo(false);
    }
  };
  
  // Load token info on component mount
  useEffect(() => {
    if (token) {
      fetchTokenInfo();
    }
  }, [token]);
  
  // Format time remaining until rate limit reset
  const formatTimeUntilReset = (resetDate) => {
    const now = new Date();
    const diff = resetDate - now;
    
    if (diff <= 0) return 'Reset now';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };
  
  // Get rate limit status variant
  const getRateLimitVariant = (remaining, limit) => {
    const percentage = (remaining / limit) * 100;
    if (percentage > 50) return 'success';
    if (percentage > 20) return 'warning';
    return 'error';
  };
  
  return (
    <Layout>
      <Container>
        <Header>
          <Title>Settings</Title>
          <Subtitle>Manage your account and application preferences</Subtitle>
        </Header>
        
        {user && (
          <ProfileCard>
            <Card.Body>
              <ProfileHeader>
                <Avatar src={user.avatar_url} alt={user.login} />
                <UserInfo>
                  <Username>{user.login}</Username>
                  <UserDetails>
                    GitHub Profile: <a href={user.html_url} target="_blank" rel="noopener noreferrer">{user.html_url}</a>
                  </UserDetails>
                </UserInfo>
              </ProfileHeader>
            </Card.Body>
          </ProfileCard>
        )}
        
        {token && (
          <TokenStatusCard>
            <Card.Header>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <SectionTitle>Token Status</SectionTitle>
                <RefreshButton
                  variant="secondary"
                  size="sm"
                  onClick={fetchTokenInfo}
                  disabled={loadingTokenInfo}
                >
                  <RefreshCw size={14} style={{ marginRight: '0.25rem' }} />
                  {loadingTokenInfo ? 'Refreshing...' : 'Refresh'}
                </RefreshButton>
              </div>
            </Card.Header>
            <Card.Body>
              {tokenInfoError && (
                <Alert
                  variant="error"
                  title="Failed to load token information"
                  description={tokenInfoError}
                  style={{ marginBottom: '1rem' }}
                />
              )}
              
              {tokenInfo && (
                <>
                  <StatusGrid>
                    <StatusItem variant="success">
                      <StatusIcon variant="success">
                        <CheckCircle size={16} />
                      </StatusIcon>
                      <StatusText>
                        <StatusLabel>Token Status</StatusLabel>
                        <StatusValue>Active & Valid</StatusValue>
                      </StatusText>
                    </StatusItem>
                    
                    <StatusItem>
                      <StatusIcon>
                        <Shield size={16} />
                      </StatusIcon>
                      <StatusText>
                        <StatusLabel>Token Type</StatusLabel>
                        <StatusValue>Personal Access Token</StatusValue>
                      </StatusText>
                    </StatusItem>
                    
                    <StatusItem variant={getRateLimitVariant(tokenInfo.rateLimit.remaining, tokenInfo.rateLimit.limit)}>
                      <StatusIcon variant={getRateLimitVariant(tokenInfo.rateLimit.remaining, tokenInfo.rateLimit.limit)}>
                        <Clock size={16} />
                      </StatusIcon>
                      <StatusText>
                        <StatusLabel>Rate Limit</StatusLabel>
                        <StatusValue>
                          {tokenInfo.rateLimit.remaining.toLocaleString()} / {tokenInfo.rateLimit.limit.toLocaleString()} remaining
                        </StatusValue>
                      </StatusText>
                    </StatusItem>
                    
                    <StatusItem>
                      <StatusIcon>
                        <RefreshCw size={16} />
                      </StatusIcon>
                      <StatusText>
                        <StatusLabel>Rate Limit Reset</StatusLabel>
                        <StatusValue>
                          {formatTimeUntilReset(tokenInfo.rateLimit.reset)}
                        </StatusValue>
                      </StatusText>
                    </StatusItem>
                  </StatusGrid>
                  
                  {tokenInfo.expiresAt && (
                    <StatusItem 
                      variant={new Date(tokenInfo.expiresAt) - new Date() < 7 * 24 * 60 * 60 * 1000 ? 'warning' : 'success'}
                      style={{ marginBottom: '1rem' }}
                    >
                      <StatusIcon variant={new Date(tokenInfo.expiresAt) - new Date() < 7 * 24 * 60 * 60 * 1000 ? 'warning' : 'success'}>
                        <AlertTriangle size={16} />
                      </StatusIcon>
                      <StatusText>
                        <StatusLabel>Token Expires</StatusLabel>
                        <StatusValue>
                          {new Date(tokenInfo.expiresAt).toLocaleDateString()} at {new Date(tokenInfo.expiresAt).toLocaleTimeString()}
                        </StatusValue>
                      </StatusText>
                    </StatusItem>
                  )}
                  
                  {!tokenInfo.expiresAt && (
                    <Alert
                      variant="info"
                      title="Token Expiration"
                      description="GitHub doesn't expose token expiration dates via API. If your token has an expiration date, please check your GitHub settings to view it."
                      style={{ marginBottom: '1rem' }}
                    />
                  )}
                  
                  {tokenInfo.scopes && tokenInfo.scopes.length > 0 && (
                    <div>
                      <StatusLabel style={{ display: 'block', marginBottom: '0.5rem' }}>Token Scopes:</StatusLabel>
                      <ScopesList>
                        {tokenInfo.scopes.map((scope, index) => (
                          <ScopeTag key={index}>{scope}</ScopeTag>
                        ))}
                      </ScopesList>
                    </div>
                  )}
                  
                  <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                    Last checked: {tokenInfo.lastChecked.toLocaleString()}
                  </div>
                </>
              )}
            </Card.Body>
          </TokenStatusCard>
        )}
        
        <Card>
          <Card.Header>
            <SectionTitle>API Configuration</SectionTitle>
          </Card.Header>
          <Card.Body>
            {saveSuccess && (
              <Alert
                variant="success"
                title="Token updated successfully"
                dismissible
                onDismiss={() => setSaveSuccess(false)}
              />
            )}
            
            <FormGroup>
              <Input
                id="current-token"
                label="Current GitHub Token"
                type={showToken ? 'text' : 'password'}
                value={token ? token.substring(0, 8) + '...' : ''}
                disabled
              />
            </FormGroup>
            
            <form onSubmit={handleUpdateToken}>
              <FormGroup>
                <Input
                  id="new-token"
                  label="New GitHub Token"
                  type={showToken ? 'text' : 'password'}
                  placeholder="Enter new token to update"
                  value={newToken}
                  onChange={(e) => setNewToken(e.target.value)}
                />
              </FormGroup>
              
              <TokenSection>
                <Button 
                  type="submit" 
                  disabled={!newToken.trim()}
                >
                  Update Token
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? 'Hide Token' : 'Show Token'}
                </Button>
              </TokenSection>
            </form>
          </Card.Body>
        </Card>
        
        <div style={{ marginTop: '2rem' }}>
          <DangerZone>
            <Card.Header>
              <SectionTitle>Danger Zone</SectionTitle>
            </Card.Header>
            <Card.Body>
              <p>These actions cannot be undone. Please be careful.</p>
              <Button variant="danger" onClick={handleLogout}>
                Sign Out
              </Button>
            </Card.Body>
          </DangerZone>
        </div>
      </Container>
    </Layout>
  );
}

export default Settings;