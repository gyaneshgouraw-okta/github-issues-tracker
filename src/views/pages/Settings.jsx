import { useContext, useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import { AuthContext } from '../../context/AuthContext';

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

/**
 * Settings page component
 */
function Settings() {
  const { user, token, authenticate, logout } = useContext(AuthContext);
  const [newToken, setNewToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
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